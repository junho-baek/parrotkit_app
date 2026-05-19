package analysis

import (
	"context"
	"errors"
	"slices"
	"strings"
	"testing"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/contracts"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/providers/superdata"
)

func validDraftJSON() string {
	return `{
		"title":"Creator reference board",
		"oneLineDescription":"Open with the visible result, then explain the proof.",
		"scenes":[
			{
				"title":"Show the result",
				"durationSec":4,
				"lineToSay":"Here is the result after one week.",
				"shootingGuideline":"Start on the finished look in bright natural light.",
				"referenceObservation":"The reference opens with the final result before context.",
				"referenceUsage":"Use the same result-first framing.",
				"myTakeRelationship":"Replace the creator result with your product outcome.",
				"successCriteria":["Result visible in the first second","Product outcome is specific"]
			},
			{
				"title":"Explain the proof",
				"durationSec":6,
				"lineToSay":"I tracked the routine so you can copy the steps.",
				"shootingGuideline":"Cut to a close-up of the product and routine notes.",
				"referenceObservation":"The reference supports the result with a concrete process.",
				"referenceUsage":"Borrow the proof beat without copying the claim.",
				"myTakeRelationship":"Tie the proof to the user's own product context.",
				"successCriteria":["Proof is concrete","Claim stays believable"]
			}
		]
	}`
}

func TestParseRecipeDraftAcceptsPlainFencedAndWrappedJSON(t *testing.T) {
	cases := map[string]string{
		"plain":   validDraftJSON(),
		"fenced":  "```json\n" + validDraftJSON() + "\n```",
		"wrapped": `{"analysis":` + validDraftJSON() + `}`,
	}

	for name, input := range cases {
		t.Run(name, func(t *testing.T) {
			draft, err := ParseRecipeDraft(input)
			if err != nil {
				t.Fatalf("ParseRecipeDraft() error = %v", err)
			}
			if draft.Title != "Creator reference board" || len(draft.Scenes) != 2 {
				t.Fatalf("draft = %#v", draft)
			}
		})
	}
}

func TestParseRecipeDraftRejectsTruncatedJSON(t *testing.T) {
	_, err := ParseRecipeDraft(`{"title":"Broken","scenes":[{"title":"Scene"}`)
	if err == nil {
		t.Fatalf("ParseRecipeDraft() expected error")
	}
	var outputErr ModelOutputError
	if !errors.As(err, &outputErr) {
		t.Fatalf("error type = %T, %v", err, err)
	}
	if outputErr.Code != "model_invalid_output" || !strings.Contains(outputErr.Reason, "truncated") {
		t.Fatalf("output error = %#v", outputErr)
	}
}

func TestBuildReferenceAnalysisResponseFromDraftIsDeterministic(t *testing.T) {
	title := "Creator reference"
	thumb := "https://cdn.example/thumb.jpg"
	duration := 10
	metadata := superdata.Metadata{
		DurationSeconds: &duration,
		Platform:        "youtube",
		ThumbnailURL:    &thumb,
		Title:           &title,
	}
	transcript := []superdata.TranscriptSegment{
		{ID: "seg-1", StartMs: 0, EndMs: 4000, Text: "Here is the result after one week."},
		{ID: "seg-2", StartMs: 4000, EndMs: 10000, Text: "I tracked the routine so you can copy the steps."},
	}
	draft, err := ParseRecipeDraft(validDraftJSON())
	if err != nil {
		t.Fatalf("ParseRecipeDraft() error = %v", err)
	}

	response := BuildReferenceAnalysisResponse(ReferenceAnalysisBuildInput{
		Draft:         draft,
		Extract:       superdata.ExtractResult{Raw: map[string]any{"visual_summary": "talking head with result"}},
		Metadata:      metadata,
		ModelName:     "google/gemini-2.5-flash",
		ModelProvider: "replicate",
		Request: Request{
			Goal:         "conversion",
			LanguageHint: "en",
			Niche:        "beauty",
			ReferenceURL: "https://example.com/ref",
		},
		Transcript: transcript,
	})

	if response.Status != contracts.StatusReady {
		t.Fatalf("status = %s", response.Status)
	}
	if err := response.Validate(); err != nil {
		t.Fatalf("Validate() error = %v", err)
	}
	if response.ReferenceMedia == nil || response.ReferenceMedia.SourceURL != "https://example.com/ref" || response.ReferenceMedia.ThumbnailURL == nil || *response.ReferenceMedia.ThumbnailURL != thumb {
		t.Fatalf("referenceMedia = %#v", response.ReferenceMedia)
	}
	if response.Breakdown == nil || len(response.Breakdown.Cuts) != 2 || response.Breakdown.Cuts[0]["id"] != "cut-1" || response.Breakdown.Cuts[1]["scene_index"] != 2 {
		t.Fatalf("breakdown cuts = %#v", response.Breakdown)
	}
	if len(response.Recipe.Scenes) != 2 || response.Recipe.Scenes[0].Index != 1 || response.Recipe.Scenes[0].ProjectionCutID != "cut-1" || response.Recipe.TotalDurationSec != 10 {
		t.Fatalf("recipe = %#v", response.Recipe)
	}
	if len(response.CutBoard.Items) != 2 {
		t.Fatalf("cutBoard = %#v", response.CutBoard)
	}
	first := response.CutBoard.Items[0]
	second := response.CutBoard.Items[1]
	if first.ProjectionCutID != "cut-1" || first.ReferenceMediaRef.StartMs != 0 || first.ReferenceMediaRef.EndMs != 4000 || first.ReferenceMediaRef.ThumbnailURI == nil || *first.ReferenceMediaRef.ThumbnailURI != thumb {
		t.Fatalf("first cut = %#v", first)
	}
	if second.ProjectionCutID != "cut-2" || second.ReferenceMediaRef.StartMs != 4000 || second.ReferenceMediaRef.EndMs != 10000 {
		t.Fatalf("second cut = %#v", second)
	}
	if len(response.Generation.MissingArtifacts) != 0 {
		t.Fatalf("missingArtifacts = %#v", response.Generation.MissingArtifacts)
	}
	if got := strings.Join(response.Generation.ProviderPipeline, ","); got != "superdata.metadata,superdata.transcript,superdata.extract,replicate.model" {
		t.Fatalf("providerPipeline = %s", got)
	}
}

type fakeDraftModelProvider struct {
	gotRequest ModelRequest
	result     ModelResult
}

func (f *fakeDraftModelProvider) GenerateJSON(ctx context.Context, req ModelRequest) (ModelResult, error) {
	f.gotRequest = req
	return f.result, nil
}

type transcriptFirstSuperData struct{}

func (transcriptFirstSuperData) FetchMetadata(ctx context.Context, sourceURL string) (superdata.Metadata, error) {
	title := "Creator reference"
	thumb := "https://cdn.example/thumb.jpg"
	return superdata.Metadata{Platform: "youtube", ThumbnailURL: &thumb, Title: &title}, nil
}

func (transcriptFirstSuperData) FetchTranscript(ctx context.Context, sourceURL string) ([]superdata.TranscriptSegment, error) {
	return []superdata.TranscriptSegment{{EndMs: 4000, ID: "seg-1", StartMs: 0, Text: "Here is the result after one week."}}, nil
}

func (transcriptFirstSuperData) Extract(ctx context.Context, sourceURL string, schema map[string]any, prompt string) (superdata.ExtractResult, error) {
	return superdata.ExtractResult{}, errors.New("extract failed")
}

func TestLiveProviderReturnsPartialReadyWhenExtractFailsButTranscriptAndDraftSucceed(t *testing.T) {
	model := &fakeDraftModelProvider{result: ModelResult{
		ModelName:    "google/gemini-2.5-flash",
		ProviderName: "replicate",
		Text:         validDraftJSON(),
	}}
	provider := LiveProvider{
		Model:         "google/gemini-2.5-flash",
		ModelProvider: model,
		SuperData:     transcriptFirstSuperData{},
	}

	response, err := provider.AnalyzeReference(context.Background(), Request{
		Goal:           "conversion",
		LanguageHint:   "en",
		Niche:          "beauty",
		ProductContext: map[string]string{"product": "serum"},
		ReferenceURL:   "https://example.com/ref",
	})
	if err != nil {
		t.Fatalf("AnalyzeReference() error = %v", err)
	}
	if response.Status != contracts.StatusPartialReady {
		t.Fatalf("status = %s", response.Status)
	}
	if !slices.Contains(response.Generation.MissingArtifacts, "visual_extract") {
		t.Fatalf("missingArtifacts = %#v", response.Generation.MissingArtifacts)
	}
	if response.Recipe == nil || len(response.Recipe.Scenes) == 0 {
		t.Fatalf("recipe = %#v", response.Recipe)
	}
	if response.CutBoard == nil || len(response.CutBoard.Items) == 0 {
		t.Fatalf("cutBoard = %#v", response.CutBoard)
	}
	if err := response.Validate(); err != nil {
		t.Fatalf("Validate() error = %v", err)
	}
	if !strings.Contains(model.gotRequest.Prompt, "serum") || !strings.Contains(model.gotRequest.Prompt, "Language hint:\nen") {
		t.Fatalf("prompt did not include request context: %s", model.gotRequest.Prompt)
	}
}
