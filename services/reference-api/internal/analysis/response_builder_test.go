package analysis

import (
	"strings"
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
				LineToSay:         "Your coaching plan compounds reps without burning out.",
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
	sourceRecipe := response.Recipe.Variants["sourceFaithful"]
	goalRecipe := response.Recipe.Variants["goalAdapted"]
	if sourceRecipe.Scenes[0].LineToSay != "20 then 40 then 80, it does not end." {
		t.Fatalf("sourceFaithful line = %q", sourceRecipe.Scenes[0].LineToSay)
	}
	if goalRecipe.Scenes[0].LineToSay != "Your coaching plan compounds reps without burning out." {
		t.Fatalf("goalAdapted line = %q", goalRecipe.Scenes[0].LineToSay)
	}
	if response.Recipe.Scenes[0].LineToSay != sourceRecipe.Scenes[0].LineToSay {
		t.Fatalf("top-level recipe should be sourceFaithful: %#v", response.Recipe.Scenes[0])
	}
	sourceBoard := response.CutBoard.Variants["sourceFaithful"].Items[0]
	goalBoard := response.CutBoard.Variants["goalAdapted"].Items[0]
	if sourceBoard.LineToSay == nil || *sourceBoard.LineToSay != "20 then 40 then 80, it does not end." {
		t.Fatalf("sourceFaithful board line = %#v", sourceBoard.LineToSay)
	}
	if goalBoard.LineToSay == nil || *goalBoard.LineToSay != "Your coaching plan compounds reps without burning out." {
		t.Fatalf("goalAdapted board line = %#v", goalBoard.LineToSay)
	}
	if sourceBoard.ProjectionCutID != goalBoard.ProjectionCutID {
		t.Fatalf("variant switch should keep projection cut id: source=%s goal=%s", sourceBoard.ProjectionCutID, goalBoard.ProjectionCutID)
	}
	if sourceBoard.ReferenceMediaRef != goalBoard.ReferenceMediaRef {
		t.Fatalf("variant switch should keep source reference span: source=%#v goal=%#v", sourceBoard.ReferenceMediaRef, goalBoard.ReferenceMediaRef)
	}
	if !strings.Contains(sourceBoard.ReferenceUsage, "{hook_context}") {
		t.Fatalf("sourceFaithful usage should preserve placeholder braces: %q", sourceBoard.ReferenceUsage)
	}
}

func TestBuildReferenceAnalysisResponseSourceFaithfulCutsKeepTranscriptSignalsAndSpans(t *testing.T) {
	response := BuildReferenceAnalysisResponse(ReferenceAnalysisBuildInput{
		Draft: RecipeDraft{
			Title:              "Escalation board",
			OneLineDescription: "Keep the escalation structure.",
			Scenes: []RecipeDraftScene{
				{
					Title:             "Goal hook",
					LineToSay:         "Start with a plan that compounds without burnout.",
					ShootingGuideline: "Face camera with the program result.",
				},
				{
					Title:             "Goal contrast",
					LineToSay:         "Show the switch from random effort to a repeatable system.",
					ShootingGuideline: "Cut between the old and new workflow.",
				},
				{
					Title:             "Goal close",
					LineToSay:         "Invite viewers to try the first step today.",
					ShootingGuideline: "End with the checklist on screen.",
				},
			},
		},
		Extract: superdata.ExtractResult{Raw: map[string]any{"ok": true}},
		Request: Request{
			Goal:         "sell a coaching plan",
			Niche:        "fitness",
			ReferenceURL: "https://youtube.com/shorts/ySDpL4wUX7Y",
		},
		RequestID: "req_source_quality",
		Transcript: []superdata.TranscriptSegment{
			{ID: "seg-1", StartMs: 1200, EndMs: 3100, Text: "20 then 40 then 80, it does not end."},
			{ID: "seg-2", StartMs: 3100, EndMs: 6200, Text: "The point is not more reps, it is the contrast."},
			{ID: "seg-3", StartMs: 6200, EndMs: 9100, Text: "You repeat the same move until the viewer gets it."},
		},
	})

	sourceItems := response.CutBoard.Variants["sourceFaithful"].Items
	expectedLines := []string{
		"20 then 40 then 80, it does not end.",
		"The point is not more reps, it is the contrast.",
		"You repeat the same move until the viewer gets it.",
	}
	expectedStarts := []int{1200, 3100, 6200}
	expectedEnds := []int{3100, 6200, 9100}
	if len(sourceItems) != len(expectedLines) {
		t.Fatalf("sourceFaithful items = %#v", sourceItems)
	}
	for index, item := range sourceItems {
		if item.LineToSay == nil || !strings.Contains(*item.LineToSay, expectedLines[index]) {
			t.Fatalf("sourceFaithful item %d line = %#v", index, item.LineToSay)
		}
		if item.ReferenceMediaRef.StartMs != expectedStarts[index] || item.ReferenceMediaRef.EndMs != expectedEnds[index] {
			t.Fatalf("sourceFaithful item %d reference span = %#v", index, item.ReferenceMediaRef)
		}
		if !strings.Contains(item.ReferenceUsage, "{") || !strings.Contains(item.ReferenceUsage, "}") {
			t.Fatalf("sourceFaithful item %d lost placeholder template: %q", index, item.ReferenceUsage)
		}
	}
	if response.Breakdown.Cuts[0]["source_transcript_ids"].([]string)[0] != "seg-1" {
		t.Fatalf("breakdown cut transcript ids = %#v", response.Breakdown.Cuts)
	}
	if sourceTemplate, ok := response.Breakdown.Cuts[0]["source_template"].(string); !ok || !strings.Contains(sourceTemplate, "{hook_context}") {
		t.Fatalf("breakdown source template = %#v", response.Breakdown.Cuts[0]["source_template"])
	}
}

func TestBuildReferenceAnalysisResponseBreakdownTranscriptIsRealTranscript(t *testing.T) {
	response := BuildReferenceAnalysisResponse(ReferenceAnalysisBuildInput{
		Draft: RecipeDraft{
			Title:              "Adapted coaching board",
			OneLineDescription: "Adapt the reference to a coaching offer.",
			Scenes: []RecipeDraftScene{{
				Title:             "Adapted hook",
				LineToSay:         "Adopt the conversational coaching hook and promise a repeatable routine.",
				ShootingGuideline: "Face camera and explain the adapted angle.",
			}},
		},
		Extract: superdata.ExtractResult{Raw: map[string]any{"ok": true}},
		Request: Request{
			Goal:         "sell a coaching plan",
			Niche:        "fitness",
			ReferenceURL: "https://youtube.com/shorts/ySDpL4wUX7Y",
		},
		RequestID: "req_breakdown_transcript",
		Transcript: []superdata.TranscriptSegment{{
			ID:      "seg-1",
			StartMs: 1200,
			EndMs:   3100,
			Text:    "20 then 40 then 80, it does not end.",
		}},
	})

	clean, ok := response.Breakdown.Transcript["clean"].(string)
	if !ok || !strings.Contains(clean, "20 then 40 then 80") {
		t.Fatalf("breakdown transcript clean = %#v", response.Breakdown.Transcript["clean"])
	}
	if strings.Contains(clean, "Adopt the conversational") {
		t.Fatalf("breakdown transcript leaked analysis prose: %q", clean)
	}
	originalTranscript, ok := response.Breakdown.OriginalAnalysis["transcript"].(string)
	if !ok || !strings.Contains(originalTranscript, "20 then 40 then 80") {
		t.Fatalf("original analysis transcript = %#v", response.Breakdown.OriginalAnalysis["transcript"])
	}
}

func TestBuildReferenceAnalysisResponseBreakdownInformationArchitecture(t *testing.T) {
	response := BuildReferenceAnalysisResponse(ReferenceAnalysisBuildInput{
		Draft: RecipeDraft{
			Title:              "Escalation board",
			OneLineDescription: "Keep the escalation structure.",
			Scenes: []RecipeDraftScene{
				{
					Title:             "Goal hook",
					LineToSay:         "Start with a plan that compounds without burnout.",
					ShootingGuideline: "Face camera with the program result.",
				},
				{
					Title:             "Goal contrast",
					LineToSay:         "Show the switch from random effort to a repeatable system.",
					ShootingGuideline: "Cut between the old and new workflow.",
				},
			},
		},
		Extract: superdata.ExtractResult{Raw: map[string]any{"ok": true}},
		Request: Request{
			Goal:         "sell a coaching plan",
			Niche:        "fitness",
			ReferenceURL: "https://youtube.com/shorts/ySDpL4wUX7Y",
		},
		RequestID: "req_breakdown_ia",
		Transcript: []superdata.TranscriptSegment{
			{ID: "seg-1", StartMs: 1200, EndMs: 3100, Text: "20 then 40 then 80, it does not end."},
			{ID: "seg-2", StartMs: 3100, EndMs: 6200, Text: "The point is not more reps, it is the contrast."},
		},
	})

	breakdown := response.Breakdown
	if len(breakdown.OriginalAnalysis) == 0 || len(breakdown.ExtractedStructure) == 0 || len(breakdown.ApplyToYourContent) == 0 {
		t.Fatalf("missing IA fields: original=%#v extracted=%#v apply=%#v", breakdown.OriginalAnalysis, breakdown.ExtractedStructure, breakdown.ApplyToYourContent)
	}
	for name, section := range map[string]map[string]any{
		"hook":                  breakdown.Hook,
		"storytelling_format":   breakdown.StorytellingFormat,
		"visual_layout":         breakdown.VisualLayout,
		"original_analysis":     breakdown.OriginalAnalysis,
		"extracted_structure":   breakdown.ExtractedStructure,
		"apply_to_your_content": breakdown.ApplyToYourContent,
	} {
		if len(section) == 0 {
			t.Fatalf("breakdown section %s is empty", name)
		}
	}

	extractedSkeletonID, ok := breakdown.ExtractedStructure["source_skeleton_id"].(string)
	if !ok || extractedSkeletonID == "" {
		t.Fatalf("extracted source skeleton id = %#v", breakdown.ExtractedStructure["source_skeleton_id"])
	}
	applySkeletonID, ok := breakdown.ApplyToYourContent["source_skeleton_id"].(string)
	if !ok || applySkeletonID != extractedSkeletonID {
		t.Fatalf("mapping skeleton mismatch: extracted=%#v apply=%#v", extractedSkeletonID, breakdown.ApplyToYourContent["source_skeleton_id"])
	}
	sourceMapping := breakdown.ExtractedStructure["sourceFaithful_mapping"].([]map[string]any)
	goalMapping := breakdown.ApplyToYourContent["goalAdapted_mapping"].([]map[string]any)
	if len(sourceMapping) != 2 || len(goalMapping) != 2 {
		t.Fatalf("variant mappings = source:%#v goal:%#v", sourceMapping, goalMapping)
	}
	if sourceMapping[0]["cut_id"] != goalMapping[0]["cut_id"] {
		t.Fatalf("mapping cut ids differ: source=%#v goal=%#v", sourceMapping[0], goalMapping[0])
	}
	if template, ok := sourceMapping[0]["source_template"].(string); !ok || !strings.Contains(template, "{hook_context}") {
		t.Fatalf("source template lost placeholder braces: %#v", sourceMapping[0]["source_template"])
	}
	if line, ok := sourceMapping[0]["line_to_say"].(string); !ok || !strings.Contains(line, "20 then 40 then 80") {
		t.Fatalf("source mapping line lost transcript structure: %#v", sourceMapping[0]["line_to_say"])
	}
	if span := sourceMapping[0]["source_span"].(map[string]any); span["start_ms"] != 1200 || span["end_ms"] != 3100 {
		t.Fatalf("source mapping span = %#v", sourceMapping[0]["source_span"])
	}
}
