package analysis

import "fmt"

type PromptInput struct {
	ExtractJSON    string
	Goal           string
	LanguageHint   string
	MetadataJSON   string
	Niche          string
	ProductContext string
	ReferenceURL   string
	Transcript     string
}

func BuildPrompt(input PromptInput) string {
	return fmt.Sprintf(`You are ParrotKit's reference-video analyst.

Return JSON only. Return a small recipe draft only, not the API response contract.

Required JSON shape:
{
  "title": "string",
  "oneLineDescription": "string",
  "scenes": [
    {
      "title": "string",
      "durationSec": 5,
      "lineToSay": "string",
      "shootingGuideline": "string",
      "referenceObservation": "string",
      "referenceUsage": "string",
      "myTakeRelationship": "string",
      "successCriteria": ["string"]
    }
  ]
}

Reference URL:
%s

Niche:
%s

Goal:
%s

Language hint:
%s

Product context JSON:
%s

Metadata JSON:
%s

Transcript:
%s

Visual extract JSON:
%s

Rules:
1. Use the transcript as the primary evidence.
2. Use visual extract only as optional enrichment when present.
3. Create one to six shootable scenes.
4. Keep scene copy concise and usable by a creator.
5. Do not return schemaVersion, status, referenceMedia, breakdown, recipe, cutBoard, generation, markdown, comments, or debug labels.
6. Never invent creator, title, duration, or product facts.
7. Write lineToSay as natural complete goal-adapted copy for the requested niche and goal.
8. Do not use placeholder braces in goal-adapted lineToSay; the backend builds sourceFaithful templates from transcript spans.
`, input.ReferenceURL, input.Niche, input.Goal, input.LanguageHint, input.ProductContext, input.MetadataJSON, input.Transcript, input.ExtractJSON)
}
