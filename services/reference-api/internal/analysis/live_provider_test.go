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
	return validDraftJSON(), nil
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
