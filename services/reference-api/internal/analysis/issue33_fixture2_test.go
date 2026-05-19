package analysis

import (
	"strings"
	"testing"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/contracts"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/providers/superdata"
)

func TestIssue33Fixture2TimestampMappingAndVariants(t *testing.T) {
	title := "Three-drop serum reference"
	response := BuildReferenceAnalysisResponse(ReferenceAnalysisBuildInput{
		Draft: RecipeDraft{
			Title:              "Three-drop serum board",
			OneLineDescription: "Turn the source repetition into a skincare offer.",
			Scenes: []RecipeDraftScene{
				{
					Title:             "Repeat the amount",
					DurationSec:       2,
					LineToSay:         "Use the three-drop rhythm to show how little serum is needed.",
					ShootingGuideline: "Hold the product close and count the drops on camera.",
					SuccessCriteria:   []string{"Three-drop amount is visible."},
				},
				{
					Title:             "Show the wait",
					DurationSec:       3,
					LineToSay:         "Give the formula ten seconds before judging the glow.",
					ShootingGuideline: "Use a timer gesture and show the texture settling.",
					SuccessCriteria:   []string{"Ten-second wait is clear."},
				},
				{
					Title:             "Reduce the amount",
					DurationSec:       4,
					LineToSay:         "Cut the amount in half if your skin still feels sticky.",
					ShootingGuideline: "End with a half-drop comparison on the fingertip.",
					SuccessCriteria:   []string{"Half-amount adjustment is shown."},
				},
			},
		},
		Extract: superdata.ExtractResult{Raw: map[string]any{
			"cuts": []any{
				map[string]any{"startMs": 1400, "endMs": 4200},
				map[string]any{"startMs": 9000, "endMs": 13200},
				map[string]any{"startMs": 21000, "endMs": 24600},
			},
			"visualSummary": "Creator demonstrates serum amount, wait time, and adjustment.",
		}},
		GeneratedAt: "2026-05-20T06:00:00Z",
		Metadata: superdata.Metadata{
			Platform: "youtube",
			Title:    &title,
		},
		ModelName:     "fixture-model",
		ModelProvider: "fixture",
		Request: Request{
			Goal:         "sell a skincare serum",
			LanguageHint: "en",
			Niche:        "beauty",
			ReferenceURL: "https://youtube.com/shorts/fixture-2",
		},
		RequestID: "req_issue33_fixture2",
		Transcript: []superdata.TranscriptSegment{
			{ID: "seg-fixture2-1", StartMs: 1400, EndMs: 4200, Text: "Three drops first, three drops again, then press."},
			{ID: "seg-fixture2-2", StartMs: 9000, EndMs: 13200, Text: "Wait ten seconds, not one, so the glow settles."},
			{ID: "seg-fixture2-3", StartMs: 21000, EndMs: 24600, Text: "If it still feels sticky, cut the amount in half."},
		},
	})

	if response.Status != contracts.StatusReady {
		t.Fatalf("status = %s", response.Status)
	}
	if err := response.Validate(); err != nil {
		t.Fatalf("Validate() error = %v", err)
	}
	if response.Recipe.DefaultVariant != "sourceFaithful" {
		t.Fatalf("recipe default variant = %q", response.Recipe.DefaultVariant)
	}
	if response.CutBoard.DefaultVariant != "sourceFaithful" {
		t.Fatalf("cutBoard default variant = %q", response.CutBoard.DefaultVariant)
	}

	sourceRecipe := response.Recipe.Variants["sourceFaithful"]
	goalRecipe := response.Recipe.Variants["goalAdapted"]
	sourceBoard := response.CutBoard.Variants["sourceFaithful"]
	goalBoard := response.CutBoard.Variants["goalAdapted"]
	if len(sourceRecipe.Scenes) != 3 || len(goalRecipe.Scenes) != 3 || len(sourceBoard.Items) != 3 || len(goalBoard.Items) != 3 {
		t.Fatalf("variant sizes sourceRecipe=%d goalRecipe=%d sourceBoard=%d goalBoard=%d", len(sourceRecipe.Scenes), len(goalRecipe.Scenes), len(sourceBoard.Items), len(goalBoard.Items))
	}

	expectedLines := []string{
		"Three drops first, three drops again, then press.",
		"Wait ten seconds, not one, so the glow settles.",
		"If it still feels sticky, cut the amount in half.",
	}
	expectedStarts := []int{1400, 9000, 21000}
	expectedEnds := []int{4200, 13200, 24600}
	for index := range expectedLines {
		if sourceRecipe.Scenes[index].LineToSay != expectedLines[index] {
			t.Fatalf("sourceFaithful scene %d line = %q", index, sourceRecipe.Scenes[index].LineToSay)
		}
		if sourceBoard.Items[index].LineToSay == nil || *sourceBoard.Items[index].LineToSay != expectedLines[index] {
			t.Fatalf("sourceFaithful board %d line = %#v", index, sourceBoard.Items[index].LineToSay)
		}
		if sourceBoard.Items[index].ProjectionCutID != goalBoard.Items[index].ProjectionCutID {
			t.Fatalf("projection cut id mismatch at %d: source=%s goal=%s", index, sourceBoard.Items[index].ProjectionCutID, goalBoard.Items[index].ProjectionCutID)
		}
		if sourceBoard.Items[index].ReferenceMediaRef != goalBoard.Items[index].ReferenceMediaRef {
			t.Fatalf("variant source span mismatch at %d: source=%#v goal=%#v", index, sourceBoard.Items[index].ReferenceMediaRef, goalBoard.Items[index].ReferenceMediaRef)
		}
		ref := sourceBoard.Items[index].ReferenceMediaRef
		if ref.StartMs != expectedStarts[index] || ref.EndMs != expectedEnds[index] {
			t.Fatalf("sourceFaithful board %d timestamp = %#v", index, ref)
		}
		if ref.StartMs == index*1000 || ref.EndMs == index*1000+sourceBoard.Items[index].DurationSeconds*1000 {
			t.Fatalf("sourceFaithful board %d used generated duration accumulation: %#v", index, ref)
		}
	}

	clean, ok := response.Breakdown.Transcript["clean"].(string)
	if !ok || !strings.Contains(clean, "Three drops first") || !strings.Contains(clean, "cut the amount in half") {
		t.Fatalf("breakdown transcript clean = %#v", response.Breakdown.Transcript["clean"])
	}
	sourceMapping := response.Breakdown.ExtractedStructure["sourceFaithful_mapping"].([]map[string]any)
	goalMapping := response.Breakdown.ApplyToYourContent["goalAdapted_mapping"].([]map[string]any)
	if len(sourceMapping) != 3 || len(goalMapping) != 3 {
		t.Fatalf("mapping sizes source=%d goal=%d", len(sourceMapping), len(goalMapping))
	}
	for index := range sourceMapping {
		if sourceMapping[index]["cut_id"] != goalMapping[index]["cut_id"] {
			t.Fatalf("mapping cut id mismatch at %d: source=%#v goal=%#v", index, sourceMapping[index], goalMapping[index])
		}
		if !strings.Contains(sourceMapping[index]["line_to_say"].(string), expectedLines[index]) {
			t.Fatalf("source mapping %d line = %#v", index, sourceMapping[index]["line_to_say"])
		}
		span := sourceMapping[index]["source_span"].(map[string]any)
		if span["start_ms"] != expectedStarts[index] || span["end_ms"] != expectedEnds[index] {
			t.Fatalf("source mapping %d span = %#v", index, span)
		}
	}
}
