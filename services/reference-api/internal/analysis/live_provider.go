package analysis

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"sort"
	"strings"
	"time"

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
	Model         string
	ModelProvider ModelProvider
	Replicate     ReplicateClient
	SuperData     SuperDataClient
}

func (p LiveProvider) AnalyzeReference(ctx context.Context, req Request) (contracts.ReferenceAnalysisResponse, error) {
	requestID := newRequestID()
	var trace []contracts.ProviderTraceEvent

	start := time.Now()
	metadata, metadataErr := p.SuperData.FetchMetadata(ctx, req.ReferenceURL)
	trace = append(trace, metadataTrace(requestID, start, metadata, metadataErr))

	start = time.Now()
	transcript, transcriptErr := p.SuperData.FetchTranscript(ctx, req.ReferenceURL)
	trace = append(trace, transcriptTrace(requestID, start, transcript, transcriptErr))

	start = time.Now()
	extractCtx, cancelExtract := context.WithTimeout(ctx, 12*time.Second)
	extract, extractErr := p.SuperData.Extract(extractCtx, req.ReferenceURL, referenceAnalysisSchema(), "Extract ParrotKit cut evidence with time ranges.")
	cancelExtract()
	trace = append(trace, extractTrace(requestID, start, extract, extractErr))

	missingArtifacts := []string{}
	if metadataErr != nil {
		missingArtifacts = appendMissing(missingArtifacts, "metadata")
	}
	if transcriptErr != nil || len(transcript) == 0 {
		failed := Failed(req.ReferenceURL, "transcript_unavailable", "This link could not be analyzed because no transcript was available.", true, contracts.RecoveryRetry)
		failed.RequestID = requestID
		failed.Generation.MissingArtifacts = appendMissing(failed.Generation.MissingArtifacts, "transcript")
		failed.Generation.ProviderTrace = trace
		return failed, nil
	}
	if extractErr != nil || len(extract.Raw) == 0 {
		missingArtifacts = appendMissing(missingArtifacts, "visual_extract")
	}

	prompt := BuildPrompt(PromptInput{
		ExtractJSON:    mustJSON(extract.Raw),
		Goal:           req.Goal,
		LanguageHint:   req.LanguageHint,
		MetadataJSON:   mustJSON(metadata),
		Niche:          req.Niche,
		ProductContext: mustJSON(req.ProductContext),
		ReferenceURL:   req.ReferenceURL,
		Transcript:     mustJSON(transcript),
	})

	modelProvider := p.effectiveModelProvider()
	if modelProvider == nil {
		failed := Failed(req.ReferenceURL, "model_unavailable", "Reference analysis is not available right now.", true, contracts.RecoveryTryLater)
		failed.RequestID = requestID
		failed.Generation.ProviderTrace = trace
		return failed, nil
	}

	start = time.Now()
	modelResult, err := modelProvider.GenerateJSON(ctx, ModelRequest{
		MaxOutputTokens: 5000,
		Prompt:          prompt,
		Temperature:     0.2,
	})
	trace = append(trace, modelTrace(requestID, start, modelResult, err))
	if err != nil {
		failed := Failed(req.ReferenceURL, "model_failed", "This link could not be analyzed. Try another public short-form link.", true, contracts.RecoveryRetry)
		failed.RequestID = requestID
		failed.Generation.ProviderTrace = trace
		return failed, nil
	}

	start = time.Now()
	draft, err := ParseRecipeDraft(modelResult.Text)
	trace = append(trace, parseTrace(requestID, start, err))
	if err != nil {
		failed := Failed(req.ReferenceURL, "model_invalid_output", "This link could not be analyzed. Try another public short-form link.", true, contracts.RecoveryRetry)
		failed.RequestID = requestID
		failed.Generation.ProviderTrace = trace
		return failed, nil
	}

	response := BuildReferenceAnalysisResponse(ReferenceAnalysisBuildInput{
		Draft:            draft,
		Extract:          extract,
		Metadata:         metadata,
		MissingArtifacts: missingArtifacts,
		ModelName:        fallbackString(modelResult.ModelName, p.Model),
		ModelProvider:    modelResult.ProviderName,
		ProviderTrace:    trace,
		Request:          req,
		RequestID:        requestID,
		Transcript:       transcript,
	})
	if err := response.Validate(); err != nil {
		failed := Failed(req.ReferenceURL, "model_invalid_output", "This link could not be analyzed. Try another public short-form link.", true, contracts.RecoveryRetry)
		failed.RequestID = requestID
		failed.Generation.ProviderTrace = append(trace, validationTrace(requestID, err))
		return failed, nil
	}
	return response, nil
}

func (p LiveProvider) effectiveModelProvider() ModelProvider {
	if p.ModelProvider != nil {
		return p.ModelProvider
	}
	if p.Replicate != nil {
		return ReplicateModelProvider{Client: p.Replicate, ModelName: p.Model}
	}
	return nil
}

func appendMissing(values []string, value string) []string {
	value = strings.TrimSpace(value)
	if value == "" {
		return values
	}
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

func referenceAnalysisSchema() map[string]any {
	return map[string]any{
		"properties": map[string]any{
			"cuts": map[string]any{
				"items": map[string]any{
					"properties": map[string]any{
						"description": map[string]any{"type": "string"},
						"endMs":       map[string]any{"type": "number"},
						"startMs":     map[string]any{"type": "number"},
					},
					"type": "object",
				},
				"type": "array",
			},
			"visualSummary": map[string]any{"type": "string"},
		},
		"type": "object",
	}
}

func metadataTrace(requestID string, start time.Time, metadata superdata.Metadata, err error) contracts.ProviderTraceEvent {
	event := traceEvent(requestID, "superdata.metadata", start, err)
	event.MetadataFields = metadataPresentFields(metadata)
	return event
}

func transcriptTrace(requestID string, start time.Time, transcript []superdata.TranscriptSegment, err error) contracts.ProviderTraceEvent {
	event := traceEvent(requestID, "superdata.transcript", start, err)
	_, charCount := transcriptSummary(transcript)
	event.TranscriptSegmentCount = len(transcript)
	event.TranscriptCharCount = charCount
	return event
}

func extractTrace(requestID string, start time.Time, extract superdata.ExtractResult, err error) contracts.ProviderTraceEvent {
	event := traceEvent(requestID, "superdata.extract", start, err)
	if err != nil {
		event.ExtractStatus = "failed"
		return event
	}
	if len(extract.Raw) == 0 {
		event.ExtractStatus = "empty"
		return event
	}
	if status, ok := extract.Raw["status"].(string); ok && status != "" {
		event.ExtractStatus = status
	} else {
		event.ExtractStatus = "completed"
	}
	return event
}

func modelTrace(requestID string, start time.Time, result ModelResult, err error) contracts.ProviderTraceEvent {
	event := traceEvent(requestID, "model.generate", start, err)
	event.ModelName = result.ModelName
	event.ModelProvider = result.ProviderName
	event.ModelOutputBytes = len([]byte(result.Text))
	event.ModelOutputShape = modelOutputShapePreview(result.Text)
	return event
}

func parseTrace(requestID string, start time.Time, err error) contracts.ProviderTraceEvent {
	event := traceEvent(requestID, "model.parse", start, err)
	var outputErr ModelOutputError
	if errors.As(err, &outputErr) {
		event.ParseErrorReason = outputErr.Reason
	}
	return event
}

func validationTrace(requestID string, err error) contracts.ProviderTraceEvent {
	event := traceEvent(requestID, "response.validate", time.Now(), err)
	event.DurationMs = 0
	return event
}

func traceEvent(requestID string, stage string, start time.Time, err error) contracts.ProviderTraceEvent {
	event := contracts.ProviderTraceEvent{
		DurationMs: time.Since(start).Milliseconds(),
		RequestID:  requestID,
		Stage:      stage,
		Status:     "success",
	}
	if err != nil {
		event.Status = "failure"
		event.ErrorCode = errorCode(err)
		event.ErrorMessage = summarizeError(err)
	}
	return event
}

func metadataPresentFields(metadata superdata.Metadata) []string {
	fields := []string{}
	if metadata.AuthorHandle != nil {
		fields = append(fields, "authorHandle")
	}
	if metadata.DurationSeconds != nil {
		fields = append(fields, "durationSeconds")
	}
	if metadata.Platform != "" {
		fields = append(fields, "platform")
	}
	if metadata.ThumbnailURL != nil {
		fields = append(fields, "thumbnailUrl")
	}
	if metadata.Title != nil {
		fields = append(fields, "title")
	}
	sort.Strings(fields)
	return fields
}

func errorCode(err error) string {
	var outputErr ModelOutputError
	if errors.As(err, &outputErr) {
		return outputErr.Code
	}
	return "provider_error"
}

func summarizeError(err error) string {
	if err == nil {
		return ""
	}
	text := strings.TrimSpace(err.Error())
	if text == "" {
		return ""
	}
	if len(text) > 160 {
		text = text[:160]
	}
	return fmt.Sprintf("%s", text)
}
