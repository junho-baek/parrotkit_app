package analysis

import (
	"context"
	"testing"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/contracts"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/providers/superdata"
)

type fakeSuperData struct{}

func (fakeSuperData) FetchMetadata(ctx context.Context, sourceURL string) (superdata.Metadata, error) {
	title := "Creator reference"
	return superdata.Metadata{Platform: "tiktok", Title: &title}, nil
}

func (fakeSuperData) FetchTranscript(ctx context.Context, sourceURL string) ([]superdata.TranscriptSegment, error) {
	return []superdata.TranscriptSegment{{EndMs: 3000, ID: "seg-1", StartMs: 0, Text: "Here is the result."}}, nil
}

func (fakeSuperData) Extract(ctx context.Context, sourceURL string, schema map[string]any, prompt string) (superdata.ExtractResult, error) {
	return superdata.ExtractResult{Raw: map[string]any{"cuts": []any{map[string]any{"time_range": "0:00-0:03"}}}}, nil
}

type fakeReplicate struct{}

func (fakeReplicate) RunModel(ctx context.Context, model string, input map[string]any) (string, error) {
	return `{
		"schemaVersion":"parrotkit.reference_analysis_response.v1",
		"status":"ready",
		"requestId":"req_model",
		"generatedAt":"2026-05-18T00:00:00Z",
		"referenceUrl":"https://example.com/ref",
		"referenceMedia":{"sourceUrl":"https://example.com/ref","platform":"tiktok","title":"Creator reference","creatorHandle":null,"durationSeconds":null,"thumbnailUrl":null,"language":"en"},
		"breakdown":{"schema_version":"parrotkit.reference_breakdown.v1","reference":{"source_url":"https://example.com/ref"},"summary":{"one_liner":"Reference"},"transcript":{"clean":"Here is the result."},"idea_analysis":{"topic":"beauty"},"hook":{"category":"authority"},"storytelling_format":{"category":"review"},"visual_layout":{"category":"talking_head"},"proof_structure":{"proof_points":["result"]},"cuts":[{"id":"cut-1"}],"shooting_projection":{"board_title":"Board"},"vault_candidates":{"idea":{"title":"Idea"}},"confidence":{"overall":0.8}},
		"recipe":{"title":"Creator reference","oneLineDescription":"Shoot this.","totalDurationSec":3,"scenes":[{"index":1,"title":"Show the result","durationSec":3,"lineToSay":"Here is the result.","shootingGuideline":"Open on the finished result.","requiredChecklist":["Result is visible"],"projectionCutId":"cut-1"}]},
		"cutBoard":{"boardTitle":"Board","estimatedDurationSeconds":3,"items":[{"projectionCutId":"cut-1","orderIndex":0,"executionTitle":"Show the result","durationSeconds":3,"referenceMediaRef":{"mediaAssetId":"media-1","startMs":0,"endMs":3000},"referenceObservation":"Opens on the result.","referenceUsage":"Use result-first framing.","myTakeRelationship":"Film your result first.","lineToSay":"Here is the result.","shotGuide":"Open on the finished result.","sourceCutIds":["cut-1"],"successCriteria":["Result is visible"]}]},
		"generation":{"providerPipeline":["superdata.metadata","superdata.transcript","superdata.extract","replicate.model"],"model":"google/gemini-2.5-flash","fallbackUsed":false,"missingArtifacts":[]}
	}`, nil
}

func TestLiveProviderReturnsValidatedReadyResponse(t *testing.T) {
	provider := LiveProvider{
		Model:     "google/gemini-2.5-flash",
		Replicate: fakeReplicate{},
		SuperData: fakeSuperData{},
	}

	response, err := provider.AnalyzeReference(context.Background(), Request{
		Goal:         "conversion",
		Niche:        "beauty",
		ReferenceURL: "https://example.com/ref",
	})
	if err != nil {
		t.Fatalf("AnalyzeReference() error = %v", err)
	}
	if response.Status != contracts.StatusReady {
		t.Fatalf("status = %s", response.Status)
	}
	if err := response.Validate(); err != nil {
		t.Fatalf("Validate() error = %v", err)
	}
}
