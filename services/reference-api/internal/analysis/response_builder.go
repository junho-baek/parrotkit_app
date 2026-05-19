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
	breakdown := buildBreakdown(draft, input, cuts, recipe, cutBoard)
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
	sourceScenes := make([]contracts.RecipeScene, 0, len(draft.Scenes))
	goalScenes := make([]contracts.RecipeScene, 0, len(draft.Scenes))
	sourceItems := make([]contracts.CutBoardItem, 0, len(draft.Scenes))
	goalItems := make([]contracts.CutBoardItem, 0, len(draft.Scenes))
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
		transcriptText := transcriptLine(transcript, index)
		goalLine := fallbackString(draftScene.LineToSay, transcriptText)
		sourceLine := sourceFaithfulLine(draftScene, transcriptText, index)
		goalGuide := fallbackString(draftScene.ShootingGuideline, "Film this beat clearly and keep the action easy to repeat.")
		sourceGuide := sourceFaithfulShootingGuideline(draftScene, transcriptText)
		successCriteria := draftScene.SuccessCriteria
		if len(successCriteria) == 0 {
			successCriteria = []string{"The beat is clear and repeatable."}
		}

		goalScene := contracts.RecipeScene{
			DurationSec:       durationSec,
			Index:             index + 1,
			LineToSay:         goalLine,
			ProjectionCutID:   cutID,
			RequiredChecklist: successCriteria,
			ShootingGuideline: goalGuide,
			Title:             sceneTitle,
		}
		sourceScene := goalScene
		sourceScene.LineToSay = sourceLine
		sourceScene.ShootingGuideline = sourceGuide
		goalScenes = append(goalScenes, goalScene)
		sourceScenes = append(sourceScenes, sourceScene)

		goalLineCopy := goalLine
		goalShotGuide := goalGuide
		goalItem := contracts.CutBoardItem{
			DurationSeconds:      durationSec,
			ExecutionTitle:       sceneTitle,
			LineToSay:            &goalLineCopy,
			MyTakeRelationship:   fallbackString(draftScene.MyTakeRelationship, "Adapt this reference beat to your own offer and audience."),
			OrderIndex:           index,
			ProjectionCutID:      cutID,
			ReferenceMediaRef:    contracts.ReferenceMediaRef{MediaAssetID: mediaAssetID, StartMs: startMs, EndMs: endMs, ThumbnailURI: media.ThumbnailURL},
			ReferenceObservation: fallbackString(draftScene.ReferenceObservation, "The reference uses this beat to keep the viewer moving."),
			ReferenceUsage:       fallbackString(draftScene.ReferenceUsage, "Use the same structural role without copying the creator's exact content."),
			ShotGuide:            &goalShotGuide,
			SourceCutIDs:         []string{cutID},
			SuccessCriteria:      successCriteria,
		}
		sourceLineCopy := sourceLine
		sourceShotGuide := sourceGuide
		sourceItem := goalItem
		sourceItem.LineToSay = &sourceLineCopy
		sourceItem.MyTakeRelationship = sourceFaithfulMyTakeRelationship(draftScene, transcriptText, index)
		sourceItem.ReferenceObservation = sourceFaithfulReferenceObservation(draftScene, transcriptText)
		sourceItem.ReferenceUsage = sourceFaithfulReferenceUsage(draftScene, transcriptText, index)
		sourceItem.ShotGuide = &sourceShotGuide
		goalItems = append(goalItems, goalItem)
		sourceItems = append(sourceItems, sourceItem)
		cuts = append(cuts, map[string]any{
			"duration_sec":           durationSec,
			"id":                     cutID,
			"scene_index":            index + 1,
			"source_transcript_ids":  transcriptIDsForScene(transcript, index),
			"source_template":        sourceFaithfulTemplate(transcriptText, index),
			"source_transcript_text": transcriptText,
			"start_ms":               startMs,
			"end_ms":                 endMs,
			"title":                  sceneTitle,
		})
	}

	boardTitle := fallbackString(draft.Title, "Reference shooting board")
	recipe := &contracts.Recipe{
		OneLineDescription: draft.OneLineDescription,
		Scenes:             sourceScenes,
		Title:              boardTitle,
		TotalDurationSec:   totalDurationSec,
	}
	cutBoard := &contracts.CutBoard{
		BoardTitle:               boardTitle,
		EstimatedDurationSeconds: totalDurationSec,
		Items:                    sourceItems,
	}
	attachRecipeVariants(recipe, cutBoard, goalScenes, goalItems)
	return recipe, cutBoard, cuts
}

func attachRecipeVariants(recipe *contracts.Recipe, cutBoard *contracts.CutBoard, goalScenes []contracts.RecipeScene, goalItems []contracts.CutBoardItem) {
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
				Scenes:             copyRecipeScenes(goalScenes),
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
				Items:                    copyCutBoardItems(goalItems),
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

func sourceFaithfulLine(draftScene RecipeDraftScene, transcriptText string, index int) string {
	transcriptText = strings.TrimSpace(transcriptText)
	if transcriptText != "" {
		return transcriptText
	}
	if hasPlaceholder(draftScene.LineToSay) {
		return draftScene.LineToSay
	}
	return fallbackString(draftScene.LineToSay, sourcePlaceholder(index))
}

func sourceFaithfulShootingGuideline(draftScene RecipeDraftScene, transcriptText string) string {
	if hasPlaceholder(draftScene.ShootingGuideline) {
		return draftScene.ShootingGuideline
	}
	if strings.TrimSpace(transcriptText) != "" {
		return fmt.Sprintf("Match the source beat around %q before changing the replaceable detail.", sourceSnippet(transcriptText))
	}
	return fallbackString(draftScene.ShootingGuideline, "Film the source beat clearly and keep the action easy to repeat.")
}

func sourceFaithfulReferenceObservation(draftScene RecipeDraftScene, transcriptText string) string {
	if strings.TrimSpace(transcriptText) != "" {
		return fmt.Sprintf("The source beat says %q.", sourceSnippet(transcriptText))
	}
	return fallbackString(draftScene.ReferenceObservation, "The source uses this beat to keep the viewer moving.")
}

func sourceFaithfulReferenceUsage(draftScene RecipeDraftScene, transcriptText string, index int) string {
	if hasPlaceholder(draftScene.ReferenceUsage) {
		return draftScene.ReferenceUsage
	}
	placeholder := sourcePlaceholder(index)
	if strings.TrimSpace(transcriptText) != "" {
		return fmt.Sprintf("Keep %q in this beat and replace only %s.", sourceSnippet(transcriptText), placeholder)
	}
	return fmt.Sprintf("Keep the same beat and replace only %s.", placeholder)
}

func sourceFaithfulMyTakeRelationship(draftScene RecipeDraftScene, transcriptText string, index int) string {
	if hasPlaceholder(draftScene.MyTakeRelationship) {
		return draftScene.MyTakeRelationship
	}
	placeholder := sourcePlaceholder(index)
	if strings.TrimSpace(transcriptText) != "" {
		return fmt.Sprintf("Map %s onto your context after the source line stays recognizable.", placeholder)
	}
	return fallbackString(draftScene.MyTakeRelationship, fmt.Sprintf("Map %s onto your own offer and audience.", placeholder))
}

func sourceFaithfulTemplate(transcriptText string, index int) string {
	placeholder := sourcePlaceholder(index)
	if strings.TrimSpace(transcriptText) == "" {
		return placeholder
	}
	return fmt.Sprintf("%s -> %s", sourceSnippet(transcriptText), placeholder)
}

func sourcePlaceholder(index int) string {
	switch index {
	case 0:
		return "{hook_context}"
	case 1:
		return "{proof_detail}"
	case 2:
		return "{viewer_action}"
	default:
		return fmt.Sprintf("{cut_%d_detail}", index+1)
	}
}

func hasPlaceholder(text string) bool {
	return strings.Contains(text, "{") && strings.Contains(text, "}")
}

func sourceSnippet(text string) string {
	trimmed := strings.TrimSpace(text)
	runes := []rune(trimmed)
	if len(runes) <= 96 {
		return trimmed
	}
	return string(runes[:96]) + "..."
}

func buildBreakdown(draft RecipeDraft, input ReferenceAnalysisBuildInput, cuts []map[string]any, recipe *contracts.Recipe, cutBoard *contracts.CutBoard) *contracts.Breakdown {
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
		OriginalAnalysis:   buildOriginalAnalysis(draft, input, cuts, transcriptText, visualExtractPresent),
		ExtractedStructure: buildExtractedStructure(cuts, cutBoard),
		ApplyToYourContent: buildApplyToYourContent(input, cuts, cutBoard),
		Hook: map[string]any{
			"category":            "transcript_first",
			"line":                firstTranscriptLine(input.Transcript),
			"original_hook":       firstTranscriptLine(input.Transcript),
			"sourceFaithful_hook": firstVariantLine(recipe, "sourceFaithful"),
			"goalAdapted_hook":    firstVariantLine(recipe, "goalAdapted"),
			"source_skeleton_id":  sourceSkeletonID,
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

const sourceSkeletonID = "source-skeleton-1"

func buildOriginalAnalysis(draft RecipeDraft, input ReferenceAnalysisBuildInput, cuts []map[string]any, transcriptText string, visualExtractPresent bool) map[string]any {
	return map[string]any{
		"transcript":              transcriptText,
		"original_hook":           firstTranscriptLine(input.Transcript),
		"storytelling_structure":  sourceBeatOrder(cuts),
		"visual_layout":           visualLayoutSummary(visualExtractPresent),
		"source_specific_signals": sourceSpecificSignals(input.Transcript),
		"why_source_works":        sourceWhyItWorks(input.Transcript, draft),
	}
}

func buildExtractedStructure(cuts []map[string]any, cutBoard *contracts.CutBoard) map[string]any {
	return map[string]any{
		"source_skeleton_id":     sourceSkeletonID,
		"templates":              sourceTemplates(cuts),
		"sourceFaithful_mapping": variantMapping("sourceFaithful", cuts, cutBoard),
	}
}

func buildApplyToYourContent(input ReferenceAnalysisBuildInput, cuts []map[string]any, cutBoard *contracts.CutBoard) map[string]any {
	return map[string]any{
		"source_skeleton_id":  sourceSkeletonID,
		"target_goal":         input.Request.Goal,
		"target_niche":        input.Request.Niche,
		"what_is_preserved":   []string{"source beat order", "timestamp lineage", "source-specific phrase, number, repetition, or contrast"},
		"what_changes":        []string{"niche copy", "shooting instruction", "viewer-facing call to action"},
		"goalAdapted_mapping": variantMapping("goalAdapted", cuts, cutBoard),
	}
}

func sourceTemplates(cuts []map[string]any) []map[string]any {
	templates := make([]map[string]any, 0, len(cuts))
	for _, cut := range cuts {
		templates = append(templates, map[string]any{
			"cut_id":                 cut["id"],
			"source_template":        cut["source_template"],
			"source_transcript_text": cut["source_transcript_text"],
			"source_transcript_ids":  cut["source_transcript_ids"],
			"start_ms":               cut["start_ms"],
			"end_ms":                 cut["end_ms"],
		})
	}
	return templates
}

func variantMapping(variantID string, cuts []map[string]any, cutBoard *contracts.CutBoard) []map[string]any {
	items := variantItems(variantID, cutBoard)
	mappings := make([]map[string]any, 0, len(items))
	for index, item := range items {
		cut := cutForMapping(index, item.ProjectionCutID, cuts)
		mappings = append(mappings, map[string]any{
			"cut_id":                 item.ProjectionCutID,
			"line_to_say":            derefString(item.LineToSay),
			"reference_observation":  item.ReferenceObservation,
			"reference_usage":        item.ReferenceUsage,
			"my_take_relationship":   item.MyTakeRelationship,
			"source_template":        cut["source_template"],
			"source_transcript_text": cut["source_transcript_text"],
			"source_specific_signal": sourceSnippet(fmt.Sprint(cut["source_transcript_text"])),
			"source_span": map[string]any{
				"start_ms":       cut["start_ms"],
				"end_ms":         cut["end_ms"],
				"transcript_ids": cut["source_transcript_ids"],
			},
		})
	}
	return mappings
}

func variantItems(variantID string, cutBoard *contracts.CutBoard) []contracts.CutBoardItem {
	if cutBoard == nil {
		return nil
	}
	if variant, ok := cutBoard.Variants[variantID]; ok && len(variant.Items) > 0 {
		return variant.Items
	}
	return cutBoard.Items
}

func cutForMapping(index int, projectionCutID string, cuts []map[string]any) map[string]any {
	for _, cut := range cuts {
		if fmt.Sprint(cut["id"]) == projectionCutID {
			return cut
		}
	}
	if index >= 0 && index < len(cuts) {
		return cuts[index]
	}
	return map[string]any{}
}

func sourceBeatOrder(cuts []map[string]any) []string {
	beats := make([]string, 0, len(cuts))
	for _, cut := range cuts {
		template := strings.TrimSpace(fmt.Sprint(cut["source_template"]))
		title := strings.TrimSpace(fmt.Sprint(cut["title"]))
		if template != "" && template != "<nil>" {
			beats = append(beats, template)
			continue
		}
		if title != "" && title != "<nil>" {
			beats = append(beats, title)
		}
	}
	return beats
}

func firstTranscriptLine(transcript []superdata.TranscriptSegment) string {
	for _, segment := range transcript {
		text := strings.TrimSpace(segment.Text)
		if text != "" {
			return text
		}
	}
	return ""
}

func firstVariantLine(recipe *contracts.Recipe, variantID string) string {
	if recipe == nil {
		return ""
	}
	if variant, ok := recipe.Variants[variantID]; ok && len(variant.Scenes) > 0 {
		return variant.Scenes[0].LineToSay
	}
	if len(recipe.Scenes) > 0 {
		return recipe.Scenes[0].LineToSay
	}
	return ""
}

func sourceSpecificSignals(transcript []superdata.TranscriptSegment) []string {
	signals := make([]string, 0, len(transcript))
	for _, segment := range transcript {
		text := strings.TrimSpace(segment.Text)
		if text != "" {
			signals = append(signals, sourceSnippet(text))
		}
	}
	return signals
}

func sourceWhyItWorks(transcript []superdata.TranscriptSegment, draft RecipeDraft) string {
	first := firstTranscriptLine(transcript)
	if first != "" {
		return fmt.Sprintf("The source works by making the first beat concrete: %q.", sourceSnippet(first))
	}
	return fallbackString(draft.OneLineDescription, "The source works by ordering each beat into a reusable short-form structure.")
}

func visualLayoutSummary(extractPresent bool) string {
	if extractPresent {
		return "Visual layout is available as optional enrichment and remains linked to the transcript cut order."
	}
	return "Visual layout is inferred from transcript beat order because optional visual extraction is unavailable."
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
