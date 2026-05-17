package analysis

import (
	"strings"
	"testing"
)

func TestBuildPromptRequiresStrictSchemaAndNoDebugLabels(t *testing.T) {
	prompt := BuildPrompt(PromptInput{
		ExtractJSON:  `{"cuts":[{"time_range":"0:00-0:05"}]}`,
		Goal:         "conversion",
		MetadataJSON: `{"title":"Reference"}`,
		Niche:        "beauty",
		ReferenceURL: "https://example.com/video",
		Transcript:   "A useful line.",
	})

	required := []string{
		"parrotkit.reference_analysis_response.v1",
		"parrotkit.reference_breakdown.v1",
		"Return JSON only",
		"Do not repeat hook analysis on every cut",
		"Do not expose provider, model, prompt, confidence, or debug labels in the cut board",
	}
	for _, text := range required {
		if !strings.Contains(prompt, text) {
			t.Fatalf("prompt missing %q", text)
		}
	}
}
