package analysis

import (
	"context"
	"errors"
	"testing"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/contracts"
)

type fakeProviders struct {
	err      error
	response contracts.ReferenceAnalysisResponse
}

func (f fakeProviders) AnalyzeReference(ctx context.Context, req Request) (contracts.ReferenceAnalysisResponse, error) {
	if f.err != nil {
		return contracts.ReferenceAnalysisResponse{}, f.err
	}
	return f.response, nil
}

func TestAnalyzeReady(t *testing.T) {
	pipeline := NewPipeline(fakeProviders{response: contracts.ReadyFixture()})
	response, err := pipeline.Analyze(context.Background(), Request{
		Goal:         "conversion",
		Niche:        "beauty",
		ReferenceURL: "https://example.com/video",
	})
	if err != nil {
		t.Fatalf("Analyze() error = %v", err)
	}
	if response.Status != contracts.StatusReady {
		t.Fatalf("status = %s", response.Status)
	}
}

func TestAnalyzeProviderFailureFailsSafely(t *testing.T) {
	pipeline := NewPipeline(fakeProviders{err: errors.New("provider_auth")})
	response, err := pipeline.Analyze(context.Background(), Request{ReferenceURL: "https://example.com/video"})
	if err != nil {
		t.Fatalf("Analyze() error = %v", err)
	}
	if response.Status != contracts.StatusFailed || response.CutBoard != nil {
		t.Fatalf("response should fail without board: %#v", response)
	}
}

func TestAnalyzeRejectsInvalidProviderArtifact(t *testing.T) {
	invalid := contracts.ReadyFixture()
	invalid.CutBoard.Items = nil
	pipeline := NewPipeline(fakeProviders{response: invalid})
	response, err := pipeline.Analyze(context.Background(), Request{ReferenceURL: "https://example.com/video"})
	if err != nil {
		t.Fatalf("Analyze() error = %v", err)
	}
	if response.Status != contracts.StatusFailed || response.Error == nil {
		t.Fatalf("invalid artifact should be user-safe failed response: %#v", response)
	}
}
