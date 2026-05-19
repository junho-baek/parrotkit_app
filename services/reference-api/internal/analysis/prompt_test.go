package analysis

import (
	"strings"
	"testing"
)

func TestBuildPromptRequestsSmallDraftAndCarriesContext(t *testing.T) {
	prompt := BuildPrompt(PromptInput{
		ExtractJSON:    `{"cuts":[{"time_range":"0:00-0:05"}]}`,
		Goal:           "conversion",
		LanguageHint:   "en",
		MetadataJSON:   `{"title":"Reference"}`,
		Niche:          "beauty",
		ProductContext: `{"product":"serum"}`,
		ReferenceURL:   "https://example.com/video",
		Transcript:     "A useful line.",
	})

	required := []string{
		"Return JSON only",
		"small recipe draft",
		"Language hint:",
		"Product context JSON:",
		"goal-adapted",
		"backend builds sourceFaithful templates",
		`"title"`,
		`"scenes"`,
	}
	for _, text := range required {
		if !strings.Contains(prompt, text) {
			t.Fatalf("prompt missing %q", text)
		}
	}
	forbidden := []string{
		"parrotkit.reference_analysis_response.v1",
		"parrotkit.reference_breakdown.v1",
	}
	for _, text := range forbidden {
		if strings.Contains(prompt, text) {
			t.Fatalf("prompt should not ask model for canonical response schema %q", text)
		}
	}
}
