package analysis

import (
	"context"
	"time"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/contracts"
)

type Request struct {
	Goal           string
	IDempotencyKey string
	Niche          string
	ReferenceURL   string
}

type Providers interface {
	AnalyzeReference(ctx context.Context, req Request) (contracts.ReferenceAnalysisResponse, error)
}

type Pipeline struct {
	providers Providers
}

func NewPipeline(providers Providers) Pipeline {
	return Pipeline{providers: providers}
}

func (p Pipeline) Analyze(ctx context.Context, req Request) (contracts.ReferenceAnalysisResponse, error) {
	if req.ReferenceURL == "" {
		return Failed(req.ReferenceURL, "invalid_request", "Paste a valid public reference link.", false, contracts.RecoveryChangeLink), nil
	}
	if p.providers == nil {
		return Failed(req.ReferenceURL, "analysis_unavailable", "Reference analysis is not available right now.", true, contracts.RecoveryTryLater), nil
	}

	response, err := p.providers.AnalyzeReference(ctx, req)
	if err != nil {
		return Failed(req.ReferenceURL, "analysis_failed", "This link could not be analyzed. Try another public short-form link.", true, contracts.RecoveryRetry), nil
	}
	ensureBaseFields(&response, req.ReferenceURL)
	if response.Generation.MissingArtifacts == nil {
		response.Generation.MissingArtifacts = []string{}
	}
	if response.Generation.ProviderPipeline == nil {
		response.Generation.ProviderPipeline = []string{}
	}
	if err := response.Validate(); err != nil {
		return Failed(req.ReferenceURL, "model_invalid_output", "This link could not be analyzed. Try another public short-form link.", true, contracts.RecoveryRetry), nil
	}
	return response, nil
}

func ensureBaseFields(response *contracts.ReferenceAnalysisResponse, referenceURL string) {
	if response.SchemaVersion == "" {
		response.SchemaVersion = contracts.SchemaVersion
	}
	if response.RequestID == "" {
		response.RequestID = "req_" + time.Now().UTC().Format("20060102150405")
	}
	if response.GeneratedAt == "" {
		response.GeneratedAt = time.Now().UTC().Format(time.RFC3339)
	}
	if response.ReferenceURL == "" {
		response.ReferenceURL = referenceURL
	}
}

func Failed(referenceURL string, code string, message string, retryable bool, recovery contracts.RecoveryAction) contracts.ReferenceAnalysisResponse {
	return contracts.ReferenceAnalysisResponse{
		Error: &contracts.AnalysisError{
			Code:           code,
			RecoveryAction: recovery,
			Retryable:      retryable,
			UserMessage:    message,
		},
		GeneratedAt:   time.Now().UTC().Format(time.RFC3339),
		ReferenceURL:  referenceURL,
		RequestID:     "req_" + time.Now().UTC().Format("20060102150405"),
		SchemaVersion: contracts.SchemaVersion,
		Status:        contracts.StatusFailed,
		Generation: contracts.Generation{
			FallbackUsed:     false,
			MissingArtifacts: []string{},
			Model:            nil,
			ProviderPipeline: []string{},
		},
	}
}
