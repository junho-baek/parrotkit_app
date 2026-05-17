package analysis

import "fmt"

type PromptInput struct {
	ExtractJSON  string
	Goal         string
	MetadataJSON string
	Niche        string
	ReferenceURL string
	Transcript   string
}

func BuildPrompt(input PromptInput) string {
	return fmt.Sprintf(`You are ParrotKit's reference-video analyst.

Return JSON only. Return schemaVersion "parrotkit.reference_analysis_response.v1".
The embedded breakdown must use schema_version "parrotkit.reference_breakdown.v1".

Reference URL:
%s

Niche:
%s

Goal:
%s

Metadata JSON:
%s

Transcript:
%s

Visual extract JSON:
%s

Rules:
1. Analyze the whole short-form reference, then create a compact shooting board.
2. Do not repeat hook analysis on every cut. Hook is video-level unless the first cut is specifically the opening hook.
3. Every cutBoard item must be shootable and must include executionTitle, referenceObservation, referenceUsage, myTakeRelationship, lineToSay, shotGuide, and successCriteria.
4. Do not expose provider, model, prompt, confidence, or debug labels in the cut board.
5. If transcript or visual evidence is missing, return partial_ready with missingArtifacts only if at least one usable cutBoard item remains.
6. If no usable board can be created from real evidence, return failed with no breakdown, recipe, or cutBoard.
7. Never invent creator, title, duration, or product facts. Use null for unknown metadata fields.
8. Keep visible copy concise. Do not use AI-sounding labels like "AI analysis", "model confidence", or "proof point" in the execution board.
`, input.ReferenceURL, input.Niche, input.Goal, input.MetadataJSON, input.Transcript, input.ExtractJSON)
}
