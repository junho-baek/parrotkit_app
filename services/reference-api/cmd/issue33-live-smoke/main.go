package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/analysis"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/config"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/contracts"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/providers/replicate"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/providers/superdata"
)

const defaultReferenceURL = "https://youtube.com/shorts/ySDpL4wUX7Y?si=mSIY3VG1KRWiLaaH"

type smokeSummary struct {
	Checks               []checkResult    `json:"checks"`
	CutCount             int              `json:"cutCount"`
	DefaultBoardVariant  string           `json:"defaultBoardVariant,omitempty"`
	DefaultRecipeVariant string           `json:"defaultRecipeVariant,omitempty"`
	Error                *redactedError   `json:"error,omitempty"`
	GeneratedAt          string           `json:"generatedAt,omitempty"`
	Issue                string           `json:"issue"`
	MissingArtifacts     []string         `json:"missingArtifacts,omitempty"`
	ReferenceURL         string           `json:"referenceUrl"`
	RequestID            string           `json:"requestId,omitempty"`
	ResponseStatus       contracts.Status `json:"responseStatus,omitempty"`
	RanAt                string           `json:"ranAt"`
	StatusClassification string           `json:"statusClassification"`
	TimestampRanges      []timestampRange `json:"timestampRanges,omitempty"`
	Title                string           `json:"title,omitempty"`
	TranscriptPresent    bool             `json:"transcriptPresent"`
	VariantNames         []string         `json:"variantNames,omitempty"`
}

type checkResult struct {
	Detail string `json:"detail,omitempty"`
	Name   string `json:"name"`
	Pass   bool   `json:"pass"`
}

type timestampRange struct {
	CutID   string `json:"cutId"`
	EndMs   int    `json:"endMs"`
	StartMs int    `json:"startMs"`
}

type redactedError struct {
	Code           string `json:"code,omitempty"`
	RecoveryAction string `json:"recoveryAction,omitempty"`
	Retryable      bool   `json:"retryable"`
	UserMessage    string `json:"userMessage,omitempty"`
}

func main() {
	outputPath := flag.String("output", "", "Path to write redacted smoke summary JSON.")
	referenceURL := flag.String("reference-url", defaultReferenceURL, "Public reference URL to analyze.")
	goal := flag.String("goal", "ad", "Reference analysis goal.")
	niche := flag.String("niche", "beauty", "Reference analysis niche.")
	languageHint := flag.String("language", "en", "Reference analysis language hint.")
	flag.Parse()

	summary, exitCode := run(*referenceURL, *goal, *niche, *languageHint)
	if err := writeSummary(*outputPath, summary); err != nil {
		fmt.Fprintf(os.Stderr, "write smoke summary: %v\n", err)
		os.Exit(1)
	}

	encoded, err := json.MarshalIndent(summary, "", "  ")
	if err != nil {
		fmt.Fprintf(os.Stderr, "encode smoke summary: %v\n", err)
		os.Exit(1)
	}
	fmt.Println(string(encoded))
	os.Exit(exitCode)
}

func run(referenceURL string, goal string, niche string, languageHint string) (smokeSummary, int) {
	ranAt := time.Now().UTC().Format(time.RFC3339)
	cfg, err := config.Load()
	if err != nil {
		return smokeSummary{
			Checks: []checkResult{{
				Detail: "Configuration was incomplete. The wrapper should classify missing env before this command runs.",
				Name:   "config_load",
				Pass:   false,
			}},
			Error: &redactedError{
				Code:        "config_load_failed",
				Retryable:   false,
				UserMessage: err.Error(),
			},
			Issue:                "33",
			ReferenceURL:         referenceURL,
			RanAt:                ranAt,
			StatusClassification: "failed",
		}, 2
	}

	superDataClient := superdata.NewClient(superdata.Config{
		APIKey:  cfg.SuperDataAPIKey,
		BaseURL: cfg.SuperDataAPI,
	})
	replicateClient := replicate.NewClient(replicate.Config{
		APIToken: cfg.ReplicateAPIToken,
		BaseURL:  cfg.ReplicateAPI,
	})
	modelProvider, err := analysis.NewModelProvider(analysis.ModelProviderConfig{
		ModelName:       cfg.ReferenceModelName,
		ProviderName:    cfg.ReferenceModelProvider,
		ReplicateClient: replicateClient,
	})
	if err != nil {
		return smokeSummary{
			Checks: []checkResult{{
				Detail: "Model provider could not be constructed from non-secret config names.",
				Name:   "model_provider",
				Pass:   false,
			}},
			Error: &redactedError{
				Code:        "model_provider_config",
				Retryable:   false,
				UserMessage: err.Error(),
			},
			Issue:                "33",
			ReferenceURL:         referenceURL,
			RanAt:                ranAt,
			StatusClassification: "failed",
		}, 2
	}

	pipeline := analysis.NewPipeline(analysis.LiveProvider{
		Model:         cfg.ReferenceModelName,
		ModelProvider: modelProvider,
		Replicate:     replicateClient,
		SuperData:     superDataClient,
	})
	ctx, cancel := context.WithTimeout(context.Background(), cfg.RequestTimeout)
	defer cancel()
	response, err := pipeline.Analyze(ctx, analysis.Request{
		Goal:         goal,
		LanguageHint: languageHint,
		Niche:        niche,
		ReferenceURL: referenceURL,
	})
	if err != nil {
		return smokeSummary{
			Checks: []checkResult{{
				Detail: "Pipeline returned an unexpected Go error before producing a contract response.",
				Name:   "pipeline_response",
				Pass:   false,
			}},
			Error: &redactedError{
				Code:        "pipeline_error",
				Retryable:   true,
				UserMessage: "The live smoke command did not produce a reference analysis response.",
			},
			Issue:                "33",
			ReferenceURL:         referenceURL,
			RanAt:                ranAt,
			StatusClassification: "failed",
		}, 2
	}

	summary := summarizeResponse(ranAt, referenceURL, response)
	if summary.StatusClassification == "ready" || summary.StatusClassification == "partial_ready" {
		return summary, 0
	}
	return summary, 2
}

func summarizeResponse(ranAt string, referenceURL string, response contracts.ReferenceAnalysisResponse) smokeSummary {
	checks := collectChecks(response)
	classification := classify(response, checks)
	summary := smokeSummary{
		Checks:               checks,
		CutCount:             cutCount(response),
		DefaultBoardVariant:  defaultBoardVariant(response),
		DefaultRecipeVariant: defaultRecipeVariant(response),
		GeneratedAt:          response.GeneratedAt,
		Issue:                "33",
		MissingArtifacts:     response.Generation.MissingArtifacts,
		ReferenceURL:         referenceURL,
		RequestID:            response.RequestID,
		ResponseStatus:       response.Status,
		RanAt:                ranAt,
		StatusClassification: classification,
		TimestampRanges:      timestampRanges(response),
		Title:                responseTitle(response),
		TranscriptPresent:    transcriptPresent(response),
		VariantNames:         variantNames(response),
	}
	if response.Error != nil {
		summary.Error = &redactedError{
			Code:           response.Error.Code,
			RecoveryAction: string(response.Error.RecoveryAction),
			Retryable:      response.Error.Retryable,
			UserMessage:    response.Error.UserMessage,
		}
	}
	return summary
}

func collectChecks(response contracts.ReferenceAnalysisResponse) []checkResult {
	checks := []checkResult{{
		Name: "contract_validate",
		Pass: response.Validate() == nil,
	}}
	if err := response.Validate(); err != nil {
		checks[0].Detail = err.Error()
		return checks
	}
	if response.Status != contracts.StatusReady && response.Status != contracts.StatusPartialReady {
		return checks
	}

	checks = append(checks,
		checkResult{
			Detail: defaultRecipeVariant(response),
			Name:   "recipe_default_sourceFaithful",
			Pass:   defaultRecipeVariant(response) == "sourceFaithful",
		},
		checkResult{
			Detail: defaultBoardVariant(response),
			Name:   "board_default_sourceFaithful",
			Pass:   defaultBoardVariant(response) == "sourceFaithful",
		},
		checkResult{
			Detail: strings.Join(variantNames(response), ","),
			Name:   "sourceFaithful_and_goalAdapted_variants",
			Pass:   hasRecipeVariant(response, "sourceFaithful") && hasRecipeVariant(response, "goalAdapted") && hasBoardVariant(response, "sourceFaithful") && hasBoardVariant(response, "goalAdapted"),
		},
		checkResult{
			Detail: fmt.Sprintf("%d cuts", cutCount(response)),
			Name:   "compact_cut_board_present",
			Pass:   cutCount(response) > 0,
		},
		checkResult{
			Name: "breakdown_transcript_present",
			Pass: transcriptPresent(response),
		},
		checkResult{
			Name: "timestamp_ranges_present",
			Pass: timestampRangesPresent(response),
		},
		checkResult{
			Name: "variant_cut_ids_and_spans_match",
			Pass: variantCutIDsAndSpansMatch(response),
		},
	)
	return checks
}

func classify(response contracts.ReferenceAnalysisResponse, checks []checkResult) string {
	if response.Status == contracts.StatusFailed && response.Error != nil && response.Error.Code == "model_invalid_output" {
		return "model_invalid_output"
	}
	for _, check := range checks {
		if !check.Pass {
			if response.Status == contracts.StatusReady || response.Status == contracts.StatusPartialReady {
				return "model_invalid_output"
			}
			return "failed"
		}
	}
	switch response.Status {
	case contracts.StatusReady:
		return "ready"
	case contracts.StatusPartialReady:
		return "partial_ready"
	default:
		return "failed"
	}
}

func writeSummary(outputPath string, summary smokeSummary) error {
	if strings.TrimSpace(outputPath) == "" {
		return nil
	}
	if err := os.MkdirAll(filepath.Dir(outputPath), 0o755); err != nil {
		return err
	}
	bytes, err := json.MarshalIndent(summary, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(outputPath, append(bytes, '\n'), 0o644)
}

func defaultRecipeVariant(response contracts.ReferenceAnalysisResponse) string {
	if response.Recipe == nil {
		return ""
	}
	return response.Recipe.DefaultVariant
}

func defaultBoardVariant(response contracts.ReferenceAnalysisResponse) string {
	if response.CutBoard == nil {
		return ""
	}
	return response.CutBoard.DefaultVariant
}

func hasRecipeVariant(response contracts.ReferenceAnalysisResponse, name string) bool {
	return response.Recipe != nil && len(response.Recipe.Variants[name].Scenes) > 0
}

func hasBoardVariant(response contracts.ReferenceAnalysisResponse, name string) bool {
	return response.CutBoard != nil && len(response.CutBoard.Variants[name].Items) > 0
}

func cutCount(response contracts.ReferenceAnalysisResponse) int {
	if response.CutBoard == nil {
		return 0
	}
	return len(response.CutBoard.Items)
}

func transcriptPresent(response contracts.ReferenceAnalysisResponse) bool {
	if response.Breakdown == nil {
		return false
	}
	clean, ok := response.Breakdown.Transcript["clean"].(string)
	return ok && strings.TrimSpace(clean) != ""
}

func timestampRanges(response contracts.ReferenceAnalysisResponse) []timestampRange {
	if response.CutBoard == nil {
		return nil
	}
	ranges := make([]timestampRange, 0, len(response.CutBoard.Items))
	for _, item := range response.CutBoard.Items {
		ranges = append(ranges, timestampRange{
			CutID:   item.ProjectionCutID,
			EndMs:   item.ReferenceMediaRef.EndMs,
			StartMs: item.ReferenceMediaRef.StartMs,
		})
	}
	return ranges
}

func timestampRangesPresent(response contracts.ReferenceAnalysisResponse) bool {
	if response.CutBoard == nil || len(response.CutBoard.Items) == 0 {
		return false
	}
	for _, item := range response.CutBoard.Items {
		if item.ReferenceMediaRef.EndMs <= item.ReferenceMediaRef.StartMs {
			return false
		}
	}
	return true
}

func variantCutIDsAndSpansMatch(response contracts.ReferenceAnalysisResponse) bool {
	if response.CutBoard == nil {
		return false
	}
	source := response.CutBoard.Variants["sourceFaithful"].Items
	goal := response.CutBoard.Variants["goalAdapted"].Items
	if len(source) == 0 || len(source) != len(goal) {
		return false
	}
	for index := range source {
		if source[index].ProjectionCutID != goal[index].ProjectionCutID {
			return false
		}
		if source[index].ReferenceMediaRef != goal[index].ReferenceMediaRef {
			return false
		}
	}
	return true
}

func responseTitle(response contracts.ReferenceAnalysisResponse) string {
	if response.Recipe != nil && strings.TrimSpace(response.Recipe.Title) != "" {
		return response.Recipe.Title
	}
	if response.ReferenceMedia != nil && response.ReferenceMedia.Title != nil {
		return strings.TrimSpace(*response.ReferenceMedia.Title)
	}
	return ""
}

func variantNames(response contracts.ReferenceAnalysisResponse) []string {
	names := map[string]bool{}
	if response.Recipe != nil {
		for name := range response.Recipe.Variants {
			names["recipe:"+name] = true
		}
	}
	if response.CutBoard != nil {
		for name := range response.CutBoard.Variants {
			names["board:"+name] = true
		}
	}
	result := make([]string, 0, len(names))
	for name := range names {
		result = append(result, name)
	}
	sort.Strings(result)
	return result
}
