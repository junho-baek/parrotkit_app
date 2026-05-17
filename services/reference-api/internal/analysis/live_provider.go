package analysis

import (
	"context"
	"encoding/json"
	"strings"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/contracts"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/providers/superdata"
)

type SuperDataClient interface {
	Extract(ctx context.Context, sourceURL string, schema map[string]any, prompt string) (superdata.ExtractResult, error)
	FetchMetadata(ctx context.Context, sourceURL string) (superdata.Metadata, error)
	FetchTranscript(ctx context.Context, sourceURL string) ([]superdata.TranscriptSegment, error)
}

type ReplicateClient interface {
	RunModel(ctx context.Context, model string, input map[string]any) (string, error)
}

type LiveProvider struct {
	Model     string
	Replicate ReplicateClient
	SuperData SuperDataClient
}

func (p LiveProvider) AnalyzeReference(ctx context.Context, req Request) (contracts.ReferenceAnalysisResponse, error) {
	metadata, metadataErr := p.SuperData.FetchMetadata(ctx, req.ReferenceURL)
	transcript, transcriptErr := p.SuperData.FetchTranscript(ctx, req.ReferenceURL)
	extract, extractErr := p.SuperData.Extract(ctx, req.ReferenceURL, referenceAnalysisSchema(), "Extract ParrotKit cut evidence with time ranges.")

	prompt := BuildPrompt(PromptInput{
		ExtractJSON:  mustJSON(extract.Raw),
		Goal:         req.Goal,
		MetadataJSON: mustJSON(metadata),
		Niche:        req.Niche,
		ReferenceURL: req.ReferenceURL,
		Transcript:   mustJSON(transcript),
	})

	modelText, err := p.Replicate.RunModel(ctx, p.Model, map[string]any{
		"max_output_tokens": 5000,
		"prompt":            prompt,
		"temperature":       0.2,
	})
	if err != nil {
		return Failed(req.ReferenceURL, "model_failed", "This link could not be analyzed. Try another public short-form link.", true, contracts.RecoveryRetry), nil
	}

	var response contracts.ReferenceAnalysisResponse
	if err := json.Unmarshal([]byte(extractJSONObject(modelText)), &response); err != nil {
		return Failed(req.ReferenceURL, "model_invalid_output", "This link could not be analyzed. Try another public short-form link.", true, contracts.RecoveryRetry), nil
	}
	ensureBaseFields(&response, req.ReferenceURL)
	if response.Generation.ProviderPipeline == nil || len(response.Generation.ProviderPipeline) == 0 {
		response.Generation.ProviderPipeline = []string{"superdata.metadata", "superdata.transcript", "superdata.extract", "replicate.model"}
	}
	if response.Generation.MissingArtifacts == nil {
		response.Generation.MissingArtifacts = []string{}
	}
	if metadataErr != nil {
		response.Generation.MissingArtifacts = appendMissing(response.Generation.MissingArtifacts, "metadata")
	}
	if transcriptErr != nil || len(transcript) == 0 {
		response.Generation.MissingArtifacts = appendMissing(response.Generation.MissingArtifacts, "transcript")
	}
	if extractErr != nil || len(extract.Raw) == 0 {
		response.Generation.MissingArtifacts = appendMissing(response.Generation.MissingArtifacts, "visual_extract")
	}
	if response.Status == contracts.StatusReady && len(response.Generation.MissingArtifacts) > 0 {
		response.Status = contracts.StatusPartialReady
	}
	if response.ReferenceMedia != nil {
		hydrateReferenceMedia(response.ReferenceMedia, metadata, req.ReferenceURL)
	}
	if err := response.Validate(); err != nil {
		return Failed(req.ReferenceURL, "model_invalid_output", "This link could not be analyzed. Try another public short-form link.", true, contracts.RecoveryRetry), nil
	}
	return response, nil
}

func hydrateReferenceMedia(media *contracts.ReferenceMedia, metadata superdata.Metadata, sourceURL string) {
	if media.SourceURL == "" {
		media.SourceURL = sourceURL
	}
	if media.Platform == "" {
		media.Platform = metadata.Platform
	}
	if media.Title == nil {
		media.Title = metadata.Title
	}
	if media.CreatorHandle == nil {
		media.CreatorHandle = metadata.AuthorHandle
	}
	if media.DurationSeconds == nil {
		media.DurationSeconds = metadata.DurationSeconds
	}
	if media.ThumbnailURL == nil {
		media.ThumbnailURL = metadata.ThumbnailURL
	}
}

func appendMissing(values []string, value string) []string {
	for _, existing := range values {
		if existing == value {
			return values
		}
	}
	return append(values, value)
}

func mustJSON(value any) string {
	bytes, err := json.Marshal(value)
	if err != nil {
		return "{}"
	}
	return string(bytes)
}

func extractJSONObject(text string) string {
	trimmed := strings.TrimSpace(text)
	if strings.HasPrefix(trimmed, "{") && strings.HasSuffix(trimmed, "}") {
		return trimmed
	}
	start := strings.Index(trimmed, "{")
	end := strings.LastIndex(trimmed, "}")
	if start >= 0 && end > start {
		return trimmed[start : end+1]
	}
	return trimmed
}

func referenceAnalysisSchema() map[string]any {
	return map[string]any{
		"properties": map[string]any{
			"schemaVersion": map[string]any{"const": contracts.SchemaVersion},
		},
		"required": []string{"schemaVersion", "status", "referenceMedia", "breakdown", "recipe", "cutBoard", "generation"},
		"type":     "object",
	}
}
