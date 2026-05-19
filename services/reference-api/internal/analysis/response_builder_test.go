package analysis

import (
	"testing"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/contracts"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/providers/superdata"
)

func TestDeriveResponseStatusReadyWhenRecipeAndBoardUsable(t *testing.T) {
	status := deriveResponseStatus(usableStatusRecipe(), usableStatusCutBoard(), nil)
	if status != contracts.StatusReady {
		t.Fatalf("status = %s", status)
	}
}

func TestDeriveResponseStatusPartialReadyWhenOnlyVisualExtractMissing(t *testing.T) {
	status := deriveResponseStatus(usableStatusRecipe(), usableStatusCutBoard(), []string{"visual_extract"})
	if status != contracts.StatusPartialReady {
		t.Fatalf("status = %s", status)
	}
}

func TestDeriveResponseStatusPartialReadyWhenRequiredArtifactMissing(t *testing.T) {
	status := deriveResponseStatus(usableStatusRecipe(), usableStatusCutBoard(), []string{"transcript"})
	if status != contracts.StatusPartialReady {
		t.Fatalf("status = %s", status)
	}
}

func TestDeriveResponseStatusFailedWhenBoardIsNotUsable(t *testing.T) {
	status := deriveResponseStatus(usableStatusRecipe(), &contracts.CutBoard{}, []string{"visual_extract"})
	if status != contracts.StatusFailed {
		t.Fatalf("status = %s", status)
	}
}

func TestBuildRecipeAndBoardUsesTranscriptTimeRangesBeforeGeneratedDurations(t *testing.T) {
	thumb := "https://cdn.example/thumb.jpg"
	media := &contracts.ReferenceMedia{ThumbnailURL: &thumb}
	draft := RecipeDraft{
		Title: "Reference board",
		Scenes: []RecipeDraftScene{
			{Title: "First beat", DurationSec: 2},
			{Title: "Second beat", DurationSec: 8},
		},
	}
	transcript := []superdata.TranscriptSegment{
		{ID: "seg-1", StartMs: 11000, EndMs: 17000, Text: "First transcript beat."},
		{ID: "seg-2", StartMs: 23000, EndMs: 31000, Text: "Second transcript beat."},
	}

	_, board, cuts := buildRecipeAndBoard(draft, media, transcript, "media-1")

	if len(board.Items) != 2 {
		t.Fatalf("items = %#v", board.Items)
	}
	firstRef := board.Items[0].ReferenceMediaRef
	if firstRef.StartMs != 11000 || firstRef.EndMs != 17000 {
		t.Fatalf("first reference range = %#v", firstRef)
	}
	secondRef := board.Items[1].ReferenceMediaRef
	if secondRef.StartMs != 23000 || secondRef.EndMs != 31000 {
		t.Fatalf("second reference range = %#v", secondRef)
	}
	if firstRef.StartMs == 0 || firstRef.EndMs == 2000 || secondRef.StartMs == 2000 || secondRef.EndMs == 10000 {
		t.Fatalf("reference ranges used generated duration accumulation: first=%#v second=%#v", firstRef, secondRef)
	}
	if cuts[0]["start_ms"] != 11000 || cuts[0]["end_ms"] != 17000 || cuts[1]["start_ms"] != 23000 || cuts[1]["end_ms"] != 31000 {
		t.Fatalf("breakdown cut ranges = %#v", cuts)
	}
}

func usableStatusRecipe() *contracts.Recipe {
	return &contracts.Recipe{
		Title: "Reference board",
		Scenes: []contracts.RecipeScene{{
			Index:           1,
			ProjectionCutID: "cut-1",
			Title:           "Hook",
		}},
	}
}

func usableStatusCutBoard() *contracts.CutBoard {
	return &contracts.CutBoard{
		Items: []contracts.CutBoardItem{{
			ProjectionCutID: "cut-1",
		}},
	}
}

func TestBuildReferenceAnalysisResponseReturnsTwoVariants(t *testing.T) {
	response := BuildReferenceAnalysisResponse(ReferenceAnalysisBuildInput{
		Draft: RecipeDraft{
			Title:              "20 40 80 board",
			OneLineDescription: "Preserve the reference rhythm.",
			Scenes: []RecipeDraftScene{{
				Title:             "20 hook",
				LineToSay:         "20 reps is only the start",
				ShootingGuideline: "Face camera and hold the count.",
			}},
		},
		Extract: superdata.ExtractResult{Raw: map[string]any{"ok": true}},
		Request: Request{
			Goal:         "sell a coaching plan",
			Niche:        "fitness",
			ReferenceURL: "https://youtube.com/shorts/ySDpL4wUX7Y",
		},
		RequestID: "req_variants",
		Transcript: []superdata.TranscriptSegment{{
			ID:      "seg-1",
			StartMs: 0,
			EndMs:   1800,
			Text:    "20 then 40 then 80, it does not end.",
		}},
	})

	if response.Recipe.DefaultVariant != "sourceFaithful" {
		t.Fatalf("recipe default variant = %q", response.Recipe.DefaultVariant)
	}
	if response.CutBoard.DefaultVariant != "sourceFaithful" {
		t.Fatalf("cutBoard default variant = %q", response.CutBoard.DefaultVariant)
	}
	for _, name := range []string{"sourceFaithful", "goalAdapted"} {
		if variant := response.Recipe.Variants[name]; len(variant.Scenes) != 1 {
			t.Fatalf("recipe variant %q scenes = %d", name, len(variant.Scenes))
		}
		if variant := response.CutBoard.Variants[name]; len(variant.Items) != 1 {
			t.Fatalf("cutBoard variant %q items = %d", name, len(variant.Items))
		}
	}
}
