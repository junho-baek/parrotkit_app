package analysis

import (
	"context"
	"testing"
)

type capturingReplicateClient struct {
	input map[string]any
	model string
}

func (c *capturingReplicateClient) RunModel(ctx context.Context, model string, input map[string]any) (string, error) {
	c.model = model
	c.input = input
	return validDraftJSON(), nil
}

func TestReplicateModelProviderGeneratesSmallDraftRequest(t *testing.T) {
	client := &capturingReplicateClient{}
	provider := ReplicateModelProvider{Client: client, ModelName: "google/gemini-2.5-flash"}

	result, err := provider.GenerateJSON(context.Background(), ModelRequest{
		MaxOutputTokens: 1800,
		Prompt:          "Return a small draft.",
		Temperature:     0.2,
	})
	if err != nil {
		t.Fatalf("GenerateJSON() error = %v", err)
	}
	if result.ProviderName != "replicate" || result.ModelName != "google/gemini-2.5-flash" || result.Text == "" {
		t.Fatalf("result = %#v", result)
	}
	if client.model != "google/gemini-2.5-flash" {
		t.Fatalf("model = %q", client.model)
	}
	if client.input["prompt"] != "Return a small draft." || client.input["max_output_tokens"] != 1800 || client.input["temperature"] != 0.2 {
		t.Fatalf("input = %#v", client.input)
	}
}

func TestNewModelProviderScaffoldIsExplicit(t *testing.T) {
	if _, err := NewModelProvider(ModelProviderConfig{ProviderName: "replicate", ReplicateClient: &capturingReplicateClient{}, ModelName: "google/gemini-2.5-flash"}); err != nil {
		t.Fatalf("replicate provider error = %v", err)
	}

	for _, name := range []string{"openai", "gemini", "anthropic"} {
		provider, err := NewModelProvider(ModelProviderConfig{ProviderName: name, ModelName: "test-model"})
		if err != nil {
			t.Fatalf("%s scaffold error = %v", name, err)
		}
		if _, err := provider.GenerateJSON(context.Background(), ModelRequest{Prompt: "draft"}); err == nil {
			t.Fatalf("%s scaffold should fail explicitly until configured", name)
		}
	}
}
