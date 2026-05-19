package analysis

import (
	"context"
	"fmt"
	"strings"
)

type ModelRequest struct {
	MaxOutputTokens int
	Prompt          string
	Temperature     float64
}

type ModelResult struct {
	ModelName    string
	ProviderName string
	Text         string
}

type ModelProvider interface {
	GenerateJSON(ctx context.Context, req ModelRequest) (ModelResult, error)
}

type ModelProviderConfig struct {
	ModelName       string
	ProviderName    string
	ReplicateClient ReplicateClient
}

type ReplicateModelProvider struct {
	Client    ReplicateClient
	ModelName string
}

func (p ReplicateModelProvider) GenerateJSON(ctx context.Context, req ModelRequest) (ModelResult, error) {
	if p.Client == nil {
		return ModelResult{}, fmt.Errorf("replicate client is required")
	}
	maxOutputTokens := req.MaxOutputTokens
	if maxOutputTokens <= 0 {
		maxOutputTokens = 5000
	}
	temperature := req.Temperature
	if temperature == 0 {
		temperature = 0.2
	}
	text, err := p.Client.RunModel(ctx, p.ModelName, map[string]any{
		"max_output_tokens": maxOutputTokens,
		"prompt":            req.Prompt,
		"temperature":       temperature,
	})
	if err != nil {
		return ModelResult{}, err
	}
	return ModelResult{ModelName: p.ModelName, ProviderName: "replicate", Text: text}, nil
}

type unsupportedModelProvider struct {
	modelName    string
	providerName string
}

func (p unsupportedModelProvider) GenerateJSON(ctx context.Context, req ModelRequest) (ModelResult, error) {
	return ModelResult{}, fmt.Errorf("model provider %q is scaffolded but not configured", p.providerName)
}

func NewModelProvider(cfg ModelProviderConfig) (ModelProvider, error) {
	providerName := strings.ToLower(strings.TrimSpace(cfg.ProviderName))
	if providerName == "" {
		providerName = "replicate"
	}
	switch providerName {
	case "replicate":
		return ReplicateModelProvider{Client: cfg.ReplicateClient, ModelName: cfg.ModelName}, nil
	case "openai", "gemini", "anthropic":
		return unsupportedModelProvider{modelName: cfg.ModelName, providerName: providerName}, nil
	default:
		return nil, fmt.Errorf("unknown model provider %q", cfg.ProviderName)
	}
}
