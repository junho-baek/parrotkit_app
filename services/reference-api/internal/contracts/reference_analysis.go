package contracts

import (
	"errors"
	"time"
)

const SchemaVersion = "parrotkit.reference_analysis_response.v1"
const BreakdownSchemaVersion = "parrotkit.reference_breakdown.v1"

type Status string

const (
	StatusReady        Status = "ready"
	StatusPartialReady Status = "partial_ready"
	StatusFallback     Status = "fallback"
	StatusFailed       Status = "failed"
)

type RecoveryAction string

const (
	RecoveryRetry      RecoveryAction = "retry"
	RecoveryChangeLink RecoveryAction = "change_link"
	RecoveryTryLater   RecoveryAction = "try_later"
	RecoveryUseManual  RecoveryAction = "use_manual"
)

type ReferenceAnalysisRequest struct {
	ClientSchemaVersion string            `json:"clientSchemaVersion,omitempty"`
	Goal                string            `json:"goal,omitempty"`
	IDempotencyKey      string            `json:"idempotencyKey,omitempty"`
	LanguageHint        string            `json:"languageHint,omitempty"`
	Niche               string            `json:"niche,omitempty"`
	ProductContext      map[string]string `json:"productContext,omitempty"`
	ReferenceURL        string            `json:"referenceUrl"`
}

type ReferenceAnalysisResponse struct {
	Breakdown          *Breakdown      `json:"breakdown"`
	CutBoard           *CutBoard       `json:"cutBoard"`
	Error              *AnalysisError  `json:"error,omitempty"`
	GeneratedAt        string          `json:"generatedAt"`
	Generation         Generation      `json:"generation"`
	LegacyRecipeResult any             `json:"legacyRecipeResult,omitempty"`
	Recipe             *Recipe         `json:"recipe"`
	ReferenceMedia     *ReferenceMedia `json:"referenceMedia"`
	ReferenceURL       string          `json:"referenceUrl"`
	RequestID          string          `json:"requestId"`
	SchemaVersion      string          `json:"schemaVersion"`
	Status             Status          `json:"status"`
}

type ReferenceMedia struct {
	CreatorHandle   *string `json:"creatorHandle"`
	DurationSeconds *int    `json:"durationSeconds"`
	Language        *string `json:"language"`
	MediaAssetID    string  `json:"mediaAssetId,omitempty"`
	Platform        string  `json:"platform"`
	SourceURL       string  `json:"sourceUrl"`
	ThumbnailURL    *string `json:"thumbnailUrl"`
	Title           *string `json:"title"`
}

type Generation struct {
	FallbackReason   *string              `json:"fallbackReason,omitempty"`
	FallbackUsed     bool                 `json:"fallbackUsed"`
	MissingArtifacts []string             `json:"missingArtifacts"`
	Model            *string              `json:"model"`
	ProviderPipeline []string             `json:"providerPipeline"`
	ProviderTrace    []ProviderTraceEvent `json:"providerTrace,omitempty"`
}

type ProviderTraceEvent struct {
	DurationMs             int64    `json:"durationMs"`
	ErrorCode              string   `json:"errorCode,omitempty"`
	ErrorMessage           string   `json:"errorMessage,omitempty"`
	ExtractStatus          string   `json:"extractStatus,omitempty"`
	MetadataFields         []string `json:"metadataFields,omitempty"`
	ModelName              string   `json:"modelName,omitempty"`
	ModelOutputBytes       int      `json:"modelOutputBytes,omitempty"`
	ModelOutputShape       string   `json:"modelOutputShape,omitempty"`
	ModelProvider          string   `json:"modelProvider,omitempty"`
	ParseErrorReason       string   `json:"parseErrorReason,omitempty"`
	RequestID              string   `json:"requestId"`
	Stage                  string   `json:"stage"`
	Status                 string   `json:"status"`
	TranscriptCharCount    int      `json:"transcriptCharCount,omitempty"`
	TranscriptSegmentCount int      `json:"transcriptSegmentCount,omitempty"`
}

type AnalysisError struct {
	Code           string         `json:"code"`
	RecoveryAction RecoveryAction `json:"recoveryAction"`
	Retryable      bool           `json:"retryable"`
	UserMessage    string         `json:"userMessage"`
}

type Breakdown struct {
	SchemaVersion      string           `json:"schema_version"`
	Reference          map[string]any   `json:"reference"`
	Summary            map[string]any   `json:"summary"`
	Transcript         map[string]any   `json:"transcript"`
	IdeaAnalysis       map[string]any   `json:"idea_analysis"`
	Hook               map[string]any   `json:"hook"`
	StorytellingFormat map[string]any   `json:"storytelling_format"`
	VisualLayout       map[string]any   `json:"visual_layout"`
	ProofStructure     map[string]any   `json:"proof_structure"`
	Cuts               []map[string]any `json:"cuts"`
	ShootingProjection map[string]any   `json:"shooting_projection"`
	VaultCandidates    map[string]any   `json:"vault_candidates"`
	Confidence         map[string]any   `json:"confidence"`
}

type Recipe struct {
	DefaultVariant     string                   `json:"defaultVariant,omitempty"`
	OneLineDescription string                   `json:"oneLineDescription"`
	Scenes             []RecipeScene            `json:"scenes"`
	Title              string                   `json:"title"`
	TotalDurationSec   int                      `json:"totalDurationSec"`
	Variants           map[string]RecipeVariant `json:"variants,omitempty"`
}

type RecipeVariant struct {
	Label              string        `json:"label"`
	OneLineDescription string        `json:"oneLineDescription"`
	Scenes             []RecipeScene `json:"scenes"`
	Title              string        `json:"title"`
	TotalDurationSec   int           `json:"totalDurationSec"`
}

type RecipeScene struct {
	DurationSec       int      `json:"durationSec"`
	Index             int      `json:"index"`
	LineToSay         string   `json:"lineToSay"`
	ProjectionCutID   string   `json:"projectionCutId"`
	RequiredChecklist []string `json:"requiredChecklist"`
	ShootingGuideline string   `json:"shootingGuideline"`
	Title             string   `json:"title"`
}

type CutBoard struct {
	DefaultVariant           string                     `json:"defaultVariant,omitempty"`
	BoardTitle               string                     `json:"boardTitle"`
	EstimatedDurationSeconds int                        `json:"estimatedDurationSeconds"`
	Items                    []CutBoardItem             `json:"items"`
	Variants                 map[string]CutBoardVariant `json:"variants,omitempty"`
}

type CutBoardVariant struct {
	BoardTitle               string         `json:"boardTitle"`
	EstimatedDurationSeconds int            `json:"estimatedDurationSeconds"`
	Items                    []CutBoardItem `json:"items"`
	Label                    string         `json:"label"`
}

type CutBoardItem struct {
	DurationSeconds      int               `json:"durationSeconds"`
	ExecutionTitle       string            `json:"executionTitle"`
	LineToSay            *string           `json:"lineToSay"`
	MyTakeRelationship   string            `json:"myTakeRelationship"`
	OrderIndex           int               `json:"orderIndex"`
	ProjectionCutID      string            `json:"projectionCutId"`
	ReferenceMediaRef    ReferenceMediaRef `json:"referenceMediaRef"`
	ReferenceObservation string            `json:"referenceObservation"`
	ReferenceUsage       string            `json:"referenceUsage"`
	ShotGuide            *string           `json:"shotGuide"`
	SourceCutIDs         []string          `json:"sourceCutIds"`
	SuccessCriteria      []string          `json:"successCriteria"`
}

type ReferenceMediaRef struct {
	EndMs        int     `json:"endMs"`
	MediaAssetID string  `json:"mediaAssetId"`
	StartMs      int     `json:"startMs"`
	ThumbnailURI *string `json:"thumbnailUri"`
}

func (r ReferenceAnalysisResponse) Validate() error {
	if r.SchemaVersion != SchemaVersion {
		return errors.New("invalid schemaVersion")
	}
	if r.RequestID == "" || r.ReferenceURL == "" || r.GeneratedAt == "" {
		return errors.New("missing base response fields")
	}
	if r.Generation.MissingArtifacts == nil || r.Generation.ProviderPipeline == nil {
		return errors.New("generation arrays must be present")
	}

	switch r.Status {
	case StatusReady:
		if r.Generation.FallbackUsed || r.ReferenceMedia == nil || !hasBreakdown(r.Breakdown) || !hasRecipe(r.Recipe) || !hasUsableBoard(r.CutBoard) {
			return errors.New("ready requires real media, breakdown, recipe, and usable cutBoard")
		}
	case StatusPartialReady:
		if r.Generation.FallbackUsed || r.ReferenceMedia == nil || !hasBreakdown(r.Breakdown) || !hasRecipe(r.Recipe) || !hasUsableBoard(r.CutBoard) || len(r.Generation.MissingArtifacts) == 0 {
			return errors.New("partial_ready requires real partial artifact, missingArtifacts, and usable cutBoard")
		}
	case StatusFallback:
		if !r.Generation.FallbackUsed || r.Breakdown != nil || r.CutBoard != nil {
			return errors.New("fallback must not contain fake analyzed artifacts")
		}
		if r.Error == nil {
			return errors.New("fallback requires user-safe error")
		}
	case StatusFailed:
		if r.Breakdown != nil || r.Recipe != nil || r.CutBoard != nil || r.Error == nil {
			return errors.New("failed must not contain board artifacts and must include error")
		}
	default:
		return errors.New("unknown status")
	}
	return nil
}

func hasBreakdown(breakdown *Breakdown) bool {
	return breakdown != nil && breakdown.SchemaVersion == BreakdownSchemaVersion && len(breakdown.Cuts) > 0
}

func hasRecipe(recipe *Recipe) bool {
	return recipe != nil && recipe.Title != "" && len(recipe.Scenes) > 0
}

func hasUsableBoard(board *CutBoard) bool {
	return board != nil && len(board.Items) > 0
}

func ReadyFixture() ReferenceAnalysisResponse {
	model := "google/gemini-2.5-flash"
	title := "Reference title"
	line := "Say this"
	now := time.Date(2026, 5, 18, 0, 0, 0, 0, time.UTC).Format(time.RFC3339)
	return ReferenceAnalysisResponse{
		SchemaVersion: SchemaVersion,
		Status:        StatusReady,
		RequestID:     "req_test",
		GeneratedAt:   now,
		ReferenceURL:  "https://example.com/video",
		ReferenceMedia: &ReferenceMedia{
			Platform:  "unknown",
			SourceURL: "https://example.com/video",
			Title:     &title,
		},
		Breakdown: &Breakdown{
			SchemaVersion:      BreakdownSchemaVersion,
			Reference:          map[string]any{"source_url": "https://example.com/video"},
			Summary:            map[string]any{"one_liner": "A useful reference."},
			Transcript:         map[string]any{"clean": "Transcript"},
			IdeaAnalysis:       map[string]any{"topic": "Beauty"},
			Hook:               map[string]any{"category": "authority"},
			StorytellingFormat: map[string]any{"category": "review"},
			VisualLayout:       map[string]any{"category": "talking_head"},
			ProofStructure:     map[string]any{"proof_points": []string{"proof"}},
			Cuts:               []map[string]any{{"id": "cut-1"}},
			ShootingProjection: map[string]any{"board_title": "Board"},
			VaultCandidates:    map[string]any{"idea": map[string]any{"title": "Idea"}},
			Confidence:         map[string]any{"overall": 0.8},
		},
		Recipe: &Recipe{
			DefaultVariant:     "sourceFaithful",
			Title:              "Recipe",
			OneLineDescription: "Shoot this.",
			TotalDurationSec:   5,
			Scenes: []RecipeScene{{
				DurationSec:       5,
				Index:             1,
				LineToSay:         "Say this",
				ProjectionCutID:   "cut-1",
				RequiredChecklist: []string{"Visible result"},
				ShootingGuideline: "Film the result.",
				Title:             "Show the result",
			}},
			Variants: map[string]RecipeVariant{
				"sourceFaithful": {
					Label:              "Original style",
					OneLineDescription: "Shoot this.",
					Scenes: []RecipeScene{{
						DurationSec:       5,
						Index:             1,
						LineToSay:         "Say this",
						ProjectionCutID:   "cut-1",
						RequiredChecklist: []string{"Visible result"},
						ShootingGuideline: "Film the result.",
						Title:             "Show the result",
					}},
					Title:            "Recipe",
					TotalDurationSec: 5,
				},
				"goalAdapted": {
					Label:              "Adapted",
					OneLineDescription: "Shoot this for your goal.",
					Scenes: []RecipeScene{{
						DurationSec:       5,
						Index:             1,
						LineToSay:         "Say this for your goal",
						ProjectionCutID:   "cut-1",
						RequiredChecklist: []string{"Visible result"},
						ShootingGuideline: "Film the result for your offer.",
						Title:             "Show your result",
					}},
					Title:            "Recipe",
					TotalDurationSec: 5,
				},
			},
		},
		CutBoard: &CutBoard{
			DefaultVariant:           "sourceFaithful",
			BoardTitle:               "Board",
			EstimatedDurationSeconds: 5,
			Items: []CutBoardItem{{
				DurationSeconds:      5,
				ExecutionTitle:       "Show the result",
				LineToSay:            &line,
				MyTakeRelationship:   "Use this as your opening take.",
				OrderIndex:           0,
				ProjectionCutID:      "cut-1",
				ReferenceMediaRef:    ReferenceMediaRef{MediaAssetID: "media-1", StartMs: 0, EndMs: 5000},
				ReferenceObservation: "Reference opens on the finished result.",
				ReferenceUsage:       "Mirror the result-first framing.",
				ShotGuide:            &line,
				SourceCutIDs:         []string{"source-cut-1"},
				SuccessCriteria:      []string{"Result visible immediately"},
			}},
			Variants: map[string]CutBoardVariant{
				"sourceFaithful": {
					BoardTitle:               "Board",
					EstimatedDurationSeconds: 5,
					Items: []CutBoardItem{{
						DurationSeconds:      5,
						ExecutionTitle:       "Show the result",
						LineToSay:            &line,
						MyTakeRelationship:   "Use this as your opening take.",
						OrderIndex:           0,
						ProjectionCutID:      "cut-1",
						ReferenceMediaRef:    ReferenceMediaRef{MediaAssetID: "media-1", StartMs: 0, EndMs: 5000},
						ReferenceObservation: "Reference opens on the finished result.",
						ReferenceUsage:       "Mirror the result-first framing.",
						ShotGuide:            &line,
						SourceCutIDs:         []string{"source-cut-1"},
						SuccessCriteria:      []string{"Result visible immediately"},
					}},
					Label: "Original style",
				},
				"goalAdapted": {
					BoardTitle:               "Board",
					EstimatedDurationSeconds: 5,
					Items: []CutBoardItem{{
						DurationSeconds:      5,
						ExecutionTitle:       "Show your result",
						LineToSay:            &line,
						MyTakeRelationship:   "Use this opening take for your goal.",
						OrderIndex:           0,
						ProjectionCutID:      "cut-1",
						ReferenceMediaRef:    ReferenceMediaRef{MediaAssetID: "media-1", StartMs: 0, EndMs: 5000},
						ReferenceObservation: "Reference opens on the finished result.",
						ReferenceUsage:       "Keep the result-first framing while changing the niche copy.",
						ShotGuide:            &line,
						SourceCutIDs:         []string{"source-cut-1"},
						SuccessCriteria:      []string{"Result visible immediately"},
					}},
					Label: "Adapted",
				},
			},
		},
		Generation: Generation{
			FallbackUsed:     false,
			MissingArtifacts: []string{},
			Model:            &model,
			ProviderPipeline: []string{"superdata.metadata", "superdata.transcript", "superdata.extract", "replicate.model"},
		},
	}
}
