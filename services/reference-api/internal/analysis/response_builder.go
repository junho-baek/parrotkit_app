package analysis

import (
	"fmt"
	"strings"
	"time"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/contracts"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/providers/superdata"
)

type ReferenceAnalysisBuildInput struct {
	Draft            RecipeDraft
	Extract          superdata.ExtractResult
	GeneratedAt      string
	Metadata         superdata.Metadata
	MissingArtifacts []string
	ModelName        string
	ModelProvider    string
	ProviderTrace    []contracts.ProviderTraceEvent
	Request          Request
	RequestID        string
	Transcript       []superdata.TranscriptSegment
}

func BuildReferenceAnalysisResponse(input ReferenceAnalysisBuildInput) contracts.ReferenceAnalysisResponse {
	requestID := strings.TrimSpace(input.RequestID)
	if requestID == "" {
		requestID = newRequestID()
	}
	generatedAt := strings.TrimSpace(input.GeneratedAt)
	if generatedAt == "" {
		generatedAt = time.Now().UTC().Format(time.RFC3339)
	}
	modelProvider := strings.TrimSpace(input.ModelProvider)
	if modelProvider == "" {
		modelProvider = "replicate"
	}

	draft := input.Draft
	normalizeDraft(&draft)
	applyDraftDefaults(&draft, input)

	missingArtifacts := uniqueStrings(input.MissingArtifacts)
	if len(input.Transcript) == 0 {
		missingArtifacts = appendMissing(missingArtifacts, "transcript")
	}
	if len(input.Extract.Raw) == 0 {
		missingArtifacts = appendMissing(missingArtifacts, "visual_extract")
	}

	mediaAssetID := "media-1"
	referenceMedia := buildReferenceMedia(input.Metadata, input.Request, mediaAssetID)
	recipe, cutBoard, cuts := buildRecipeAndBoard(draft, referenceMedia, input.Transcript, mediaAssetID)
	breakdown := buildBreakdown(draft, input, cuts)
	modelName := strings.TrimSpace(input.ModelName)
	return contracts.ReferenceAnalysisResponse{
		Breakdown:      breakdown,
		CutBoard:       cutBoard,
		GeneratedAt:    generatedAt,
		Recipe:         recipe,
		ReferenceMedia: referenceMedia,
		ReferenceURL:   input.Request.ReferenceURL,
		RequestID:      requestID,
		SchemaVersion:  contracts.SchemaVersion,
		Status:         deriveResponseStatus(recipe, cutBoard, missingArtifacts),
		Generation: contracts.Generation{
			FallbackUsed:     false,
			MissingArtifacts: missingArtifacts,
			Model:            optionalStringPointer(modelName),
			ProviderPipeline: []string{"superdata.metadata", "superdata.transcript", "superdata.extract", modelProvider + ".model"},
			ProviderTrace:    input.ProviderTrace,
		},
	}
}

func deriveResponseStatus(recipe *contracts.Recipe, cutBoard *contracts.CutBoard, missingArtifacts []string) contracts.Status {
	if recipe == nil || len(recipe.Scenes) == 0 || cutBoard == nil || len(cutBoard.Items) == 0 {
		return contracts.StatusFailed
	}
	if len(missingArtifacts) > 0 {
		return contracts.StatusPartialReady
	}
	return contracts.StatusReady
}

func buildReferenceMedia(metadata superdata.Metadata, req Request, mediaAssetID string) *contracts.ReferenceMedia {
	platform := metadata.Platform
	if platform == "" {
		platform = "unknown"
	}
	return &contracts.ReferenceMedia{
		CreatorHandle:   metadata.AuthorHandle,
		DurationSeconds: metadata.DurationSeconds,
		Language:        optionalStringPointer(req.LanguageHint),
		MediaAssetID:    mediaAssetID,
		Platform:        platform,
		SourceURL:       req.ReferenceURL,
		ThumbnailURL:    metadata.ThumbnailURL,
		Title:           metadata.Title,
	}
}

func buildRecipeAndBoard(draft RecipeDraft, media *contracts.ReferenceMedia, transcript []superdata.TranscriptSegment, mediaAssetID string) (*contracts.Recipe, *contracts.CutBoard, []map[string]any) {
	scenes := make([]contracts.RecipeScene, 0, len(draft.Scenes))
	items := make([]contracts.CutBoardItem, 0, len(draft.Scenes))
	cuts := make([]map[string]any, 0, len(draft.Scenes))
	totalDurationSec := 0

	for index, draftScene := range draft.Scenes {
		durationSec := normalizedDurationSec(draftScene.DurationSec, len(draft.Scenes))
		fallbackStartMs := totalDurationSec * 1000
		fallbackEndMs := fallbackStartMs + durationSec*1000
		startMs, endMs := sourceTimeRangeForScene(transcript, index, fallbackStartMs, fallbackEndMs)
		totalDurationSec += durationSec

		cutID := fmt.Sprintf("cut-%d", index+1)
		sceneTitle := fallbackString(draftScene.Title, fmt.Sprintf("Scene %d", index+1))
		line := fallbackString(draftScene.LineToSay, transcriptLine(transcript, index))
		shootingGuideline := fallbackString(draftScene.ShootingGuideline, "Film this beat clearly and keep the action easy to repeat.")
		successCriteria := draftScene.SuccessCriteria
		if len(successCriteria) == 0 {
			successCriteria = []string{"The beat is clear and repeatable."}
		}

		scenes = append(scenes, contracts.RecipeScene{
			DurationSec:       durationSec,
			Index:             index + 1,
			LineToSay:         line,
			ProjectionCutID:   cutID,
			RequiredChecklist: successCriteria,
			ShootingGuideline: shootingGuideline,
			Title:             sceneTitle,
		})

		lineCopy := line
		shotGuide := shootingGuideline
		item := contracts.CutBoardItem{
			DurationSeconds:      durationSec,
			ExecutionTitle:       sceneTitle,
			LineToSay:            &lineCopy,
			MyTakeRelationship:   fallbackString(draftScene.MyTakeRelationship, "Adapt this reference beat to your own offer and audience."),
			OrderIndex:           index,
			ProjectionCutID:      cutID,
			ReferenceMediaRef:    contracts.ReferenceMediaRef{MediaAssetID: mediaAssetID, StartMs: startMs, EndMs: endMs, ThumbnailURI: media.ThumbnailURL},
			ReferenceObservation: fallbackString(draftScene.ReferenceObservation, "The reference uses this beat to keep the viewer moving."),
			ReferenceUsage:       fallbackString(draftScene.ReferenceUsage, "Use the same structural role without copying the creator's exact content."),
			ShotGuide:            &shotGuide,
			SourceCutIDs:         []string{cutID},
			SuccessCriteria:      successCriteria,
		}
		items = append(items, item)
		cuts = append(cuts, map[string]any{
			"duration_sec":          durationSec,
			"id":                    cutID,
			"scene_index":           index + 1,
			"source_transcript_ids": transcriptIDsForScene(transcript, index),
			"start_ms":              startMs,
			"end_ms":                endMs,
			"title":                 sceneTitle,
		})
	}

	boardTitle := fallbackString(draft.Title, "Reference shooting board")
	recipe := &contracts.Recipe{
		OneLineDescription: draft.OneLineDescription,
		Scenes:             scenes,
		Title:              boardTitle,
		TotalDurationSec:   totalDurationSec,
	}
	cutBoard := &contracts.CutBoard{
		BoardTitle:               boardTitle,
		EstimatedDurationSeconds: totalDurationSec,
		Items:                    items,
	}
	attachRecipeVariants(recipe, cutBoard)
	return recipe, cutBoard, cuts
}

func attachRecipeVariants(recipe *contracts.Recipe, cutBoard *contracts.CutBoard) {
	if recipe != nil {
		recipe.DefaultVariant = "sourceFaithful"
		recipe.Variants = map[string]contracts.RecipeVariant{
			"sourceFaithful": {
				Label:              "Original style",
				OneLineDescription: recipe.OneLineDescription,
				Scenes:             copyRecipeScenes(recipe.Scenes),
				Title:              recipe.Title,
				TotalDurationSec:   recipe.TotalDurationSec,
			},
			"goalAdapted": {
				Label:              "Adapted",
				OneLineDescription: recipe.OneLineDescription,
				Scenes:             copyRecipeScenes(recipe.Scenes),
				Title:              recipe.Title,
				TotalDurationSec:   recipe.TotalDurationSec,
			},
		}
	}
	if cutBoard != nil {
		cutBoard.DefaultVariant = "sourceFaithful"
		cutBoard.Variants = map[string]contracts.CutBoardVariant{
			"sourceFaithful": {
				BoardTitle:               cutBoard.BoardTitle,
				EstimatedDurationSeconds: cutBoard.EstimatedDurationSeconds,
				Items:                    copyCutBoardItems(cutBoard.Items),
				Label:                    "Original style",
			},
			"goalAdapted": {
				BoardTitle:               cutBoard.BoardTitle,
				EstimatedDurationSeconds: cutBoard.EstimatedDurationSeconds,
				Items:                    copyCutBoardItems(cutBoard.Items),
				Label:                    "Adapted",
			},
		}
	}
}

func copyRecipeScenes(scenes []contracts.RecipeScene) []contracts.RecipeScene {
	if scenes == nil {
		return nil
	}
	copyScenes := make([]contracts.RecipeScene, len(scenes))
	copy(copyScenes, scenes)
	return copyScenes
}

func copyCutBoardItems(items []contracts.CutBoardItem) []contracts.CutBoardItem {
	if items == nil {
		return nil
	}
	copyItems := make([]contracts.CutBoardItem, len(items))
	copy(copyItems, items)
	return copyItems
}

func buildBreakdown(draft RecipeDraft, input ReferenceAnalysisBuildInput, cuts []map[string]any) *contracts.Breakdown {
	transcriptText, transcriptChars := transcriptSummary(input.Transcript)
	visualExtractPresent := len(input.Extract.Raw) > 0
	return &contracts.Breakdown{
		SchemaVersion: contracts.BreakdownSchemaVersion,
		Reference: map[string]any{
			"platform":   fallbackString(input.Metadata.Platform, "unknown"),
			"source_url": input.Request.ReferenceURL,
			"title":      derefString(input.Metadata.Title),
		},
		Summary: map[string]any{
			"one_liner": fallbackString(draft.OneLineDescription, "A transcript-derived shooting recipe."),
			"title":     draft.Title,
		},
		Transcript: map[string]any{
			"clean":                 transcriptText,
			"segment_count":         len(input.Transcript),
			"total_character_count": transcriptChars,
		},
		IdeaAnalysis: map[string]any{
			"goal":  input.Request.Goal,
			"topic": input.Request.Niche,
		},
		Hook: map[string]any{
			"category": "transcript_first",
			"line":     firstSceneLine(draft),
		},
		StorytellingFormat: map[string]any{
			"category": "scene_sequence",
		},
		VisualLayout: map[string]any{
			"category":               visualLayoutCategory(visualExtractPresent),
			"visual_extract_present": visualExtractPresent,
		},
		ProofStructure: map[string]any{
			"proof_points": proofPoints(draft),
		},
		Cuts: cuts,
		ShootingProjection: map[string]any{
			"board_title": draft.Title,
		},
		VaultCandidates: map[string]any{
			"idea": map[string]any{"title": draft.Title},
		},
		Confidence: map[string]any{
			"overall":                confidenceScore(visualExtractPresent),
			"transcript_based":       true,
			"visual_extract_present": visualExtractPresent,
		},
	}
}

func applyDraftDefaults(draft *RecipeDraft, input ReferenceAnalysisBuildInput) {
	if draft.Title == "" {
		draft.Title = fallbackString(derefString(input.Metadata.Title), "Reference shooting board")
	}
	if draft.OneLineDescription == "" {
		draft.OneLineDescription = "Turn the reference transcript into a short, shootable board."
	}
}

func normalizedDurationSec(durationSec int, sceneCount int) int {
	if durationSec > 0 {
		return durationSec
	}
	if sceneCount <= 1 {
		return 5
	}
	return 4
}

func sourceTimeRangeForScene(transcript []superdata.TranscriptSegment, index int, fallbackStartMs int, fallbackEndMs int) (int, int) {
	if index >= 0 && index < len(transcript) {
		segment := transcript[index]
		if segment.EndMs > segment.StartMs {
			return segment.StartMs, segment.EndMs
		}
	}
	return fallbackStartMs, fallbackEndMs
}

func transcriptLine(transcript []superdata.TranscriptSegment, index int) string {
	if len(transcript) == 0 {
		return ""
	}
	if index >= 0 && index < len(transcript) {
		return strings.TrimSpace(transcript[index].Text)
	}
	return strings.TrimSpace(transcript[len(transcript)-1].Text)
}

func transcriptIDsForScene(transcript []superdata.TranscriptSegment, index int) []string {
	if len(transcript) == 0 {
		return []string{}
	}
	if index >= 0 && index < len(transcript) && transcript[index].ID != "" {
		return []string{transcript[index].ID}
	}
	for _, segment := range transcript {
		if segment.ID != "" {
			return []string{segment.ID}
		}
	}
	return []string{}
}

func transcriptSummary(transcript []superdata.TranscriptSegment) (string, int) {
	parts := make([]string, 0, len(transcript))
	totalChars := 0
	for _, segment := range transcript {
		text := strings.TrimSpace(segment.Text)
		if text == "" {
			continue
		}
		totalChars += len(text)
		parts = append(parts, text)
	}
	return strings.Join(parts, " "), totalChars
}

func proofPoints(draft RecipeDraft) []string {
	for _, scene := range draft.Scenes {
		if len(scene.SuccessCriteria) > 0 {
			return scene.SuccessCriteria
		}
	}
	return []string{"The reference beat is supported by transcript evidence."}
}

func firstSceneLine(draft RecipeDraft) string {
	if len(draft.Scenes) == 0 {
		return ""
	}
	return draft.Scenes[0].LineToSay
}

func visualLayoutCategory(extractPresent bool) string {
	if extractPresent {
		return "visual_extract"
	}
	return "transcript_only"
}

func confidenceScore(extractPresent bool) float64 {
	if extractPresent {
		return 0.82
	}
	return 0.68
}

func fallbackString(value string, fallback string) string {
	if strings.TrimSpace(value) != "" {
		return strings.TrimSpace(value)
	}
	return fallback
}

func derefString(value *string) string {
	if value == nil {
		return ""
	}
	return strings.TrimSpace(*value)
}

func optionalStringPointer(value string) *string {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return nil
	}
	return &trimmed
}

func uniqueStrings(values []string) []string {
	result := make([]string, 0, len(values))
	for _, value := range values {
		result = appendMissing(result, value)
	}
	return result
}
