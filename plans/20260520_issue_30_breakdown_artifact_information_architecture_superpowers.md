# Issue 30 Breakdown Artifact Information Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish GitHub issue #30 only by making the Breakdown artifact carry transcript-first information architecture and same-skeleton sourceFaithful/goalAdapted mappings.

**Architecture:** Keep the already-grounded #29 board/variant implementation intact. Add explicit Breakdown contract fields for Original Analysis, Extracted Structure, and Apply to Your Content, build them deterministically from transcript segments plus the existing sourceFaithful/goalAdapted cut projections, and add focused contract tests that prove transcript text is real source text and extracted templates preserve `{placeholder}` braces.

**Tech Stack:** Go reference API, `contracts.ReferenceAnalysisResponse`, `superdata.TranscriptSegment` fixtures, focused Go tests, `git diff --check`.

---

## 배경

- GitHub issue #30 covers only Breakdown artifact information architecture.
- Current `HEAD` is `308e549 feat: ground reference recipe variants`.
- The existing implementation already returns sourceFaithful and goalAdapted variants and maps sourceFaithful cuts to transcript timestamps.
- Audit gap: `Breakdown` has `transcript`, `hook`, `storytelling_format`, and `visual_layout`, but it does not expose explicit `original_analysis`, `extracted_structure`, or `apply_to_your_content` contract fields.
- Audit gap: variant traceability exists in board variants, but the Breakdown artifact does not yet make sourceFaithful and goalAdapted mappings traceable from the same source skeleton.
- User instruction overrides normal repo commit/push rules: Hermes will verify, commit, comment, and close. Do not stage, commit, or push.

## 목표

- `breakdown.transcript.clean` contains actual transcript text or excerpts, never goal/adaptation analysis prose.
- `breakdown.original_analysis`, `breakdown.extracted_structure`, and `breakdown.apply_to_your_content` are present and non-empty.
- Existing `breakdown.hook`, `breakdown.storytelling_format`, and `breakdown.visual_layout` remain present.
- Extracted Structure preserves `{placeholder}` templates.
- Breakdown-level sourceFaithful and goalAdapted mappings share one `source_skeleton_id`.
- Each sourceFaithful mapping preserves the transcript rhetorical beat, source-specific phrase/number/repetition/contrast, transcript segment id, and concrete timestamp span.

## 범위

- In scope: Go contract fields, response builder Breakdown construction, focused Go tests, plan/context documentation.
- Out of scope: sibling issues #31-#33, broad UI freshness, live smoke, deployed QA, Notion upload, staging, commit, push, issue close.

## 변경 파일

- Modify: `services/reference-api/internal/contracts/reference_analysis.go`
- Modify: `services/reference-api/internal/contracts/reference_analysis_test.go`
- Modify: `services/reference-api/internal/analysis/response_builder.go`
- Modify: `services/reference-api/internal/analysis/response_builder_test.go`
- Create/update at completion: `context/context_20260520_issue_30_breakdown_artifact_information_architecture.md`

## 테스트

- `cd services/reference-api && go test ./internal/analysis -run 'TestBuildReferenceAnalysisResponseBreakdown' -count=1`
- `cd services/reference-api && go test ./internal/contracts -run 'TestReadyRequiresBreakdownInformationArchitecture|TestReadyFixtureIncludesTwoRecipeVariants' -count=1`
- `cd services/reference-api && go test ./...`
- `git diff --check`

## 롤백

- Revert this plan, the issue #30 context file, and the focused Go edits in `services/reference-api/internal/...`.
- No database, env, frontend rendering, deployment, or persistent data changes are part of this plan.

## 리스크

- `go test ./...` may hit sandbox loopback bind failures in provider tests, as recorded by issue #29. If that occurs, record the focused passing packages and the sandbox blocker.
- Existing unrelated untracked QA outputs must be preserved.
- Contract validation should be stricter for new ready/partial_ready artifacts without breaking failed/fallback responses.

---

### Task 1: Add Failing Contract Tests for Breakdown IA

**Files:**
- Modify: `services/reference-api/internal/analysis/response_builder_test.go`
- Modify: `services/reference-api/internal/contracts/reference_analysis_test.go`

- [x] **Step 1: Add a response-builder test proving Transcript is real transcript text**

Add `TestBuildReferenceAnalysisResponseBreakdownTranscriptIsRealTranscript` to `services/reference-api/internal/analysis/response_builder_test.go`:

```go
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
```

- [x] **Step 2: Add a response-builder test proving required IA fields and same-skeleton mappings**

Add `TestBuildReferenceAnalysisResponseBreakdownInformationArchitecture` to `services/reference-api/internal/analysis/response_builder_test.go`:

```go
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
```

- [x] **Step 3: Add a contract validation test**

Add `TestReadyRequiresBreakdownInformationArchitecture` to `services/reference-api/internal/contracts/reference_analysis_test.go`:

```go
func TestReadyRequiresBreakdownInformationArchitecture(t *testing.T) {
	response := ReadyFixture()
	if err := response.Validate(); err != nil {
		t.Fatalf("ready fixture Validate() error = %v", err)
	}

	response.Breakdown.OriginalAnalysis = nil
	if err := response.Validate(); err == nil {
		t.Fatalf("ready response without original_analysis should fail validation")
	}
}
```

- [x] **Step 4: Run focused tests and confirm failure before implementation**

Run:

```bash
cd services/reference-api && go test ./internal/analysis -run 'TestBuildReferenceAnalysisResponseBreakdown' -count=1
cd services/reference-api && go test ./internal/contracts -run 'TestReadyRequiresBreakdownInformationArchitecture|TestReadyFixtureIncludesTwoRecipeVariants' -count=1
```

Expected: FAIL because `Breakdown` does not yet have `OriginalAnalysis`, `ExtractedStructure`, or `ApplyToYourContent`.

### Task 2: Add Breakdown IA Contract Fields

**Files:**
- Modify: `services/reference-api/internal/contracts/reference_analysis.go`
- Modify: `services/reference-api/internal/contracts/reference_analysis_test.go`

- [x] **Step 1: Extend the Breakdown struct**

Add fields to `type Breakdown` after `IdeaAnalysis`:

```go
OriginalAnalysis   map[string]any   `json:"original_analysis"`
ExtractedStructure map[string]any   `json:"extracted_structure"`
ApplyToYourContent map[string]any   `json:"apply_to_your_content"`
```

- [x] **Step 2: Strengthen ready/partial Breakdown validation**

Replace `hasBreakdown` with:

```go
func hasBreakdown(breakdown *Breakdown) bool {
	return breakdown != nil &&
		breakdown.SchemaVersion == BreakdownSchemaVersion &&
		len(breakdown.Cuts) > 0 &&
		hasTextMapValue(breakdown.Transcript, "clean") &&
		len(breakdown.OriginalAnalysis) > 0 &&
		len(breakdown.ExtractedStructure) > 0 &&
		len(breakdown.ApplyToYourContent) > 0 &&
		len(breakdown.Hook) > 0 &&
		len(breakdown.StorytellingFormat) > 0 &&
		len(breakdown.VisualLayout) > 0
}

func hasTextMapValue(values map[string]any, key string) bool {
	value, ok := values[key].(string)
	return ok && strings.TrimSpace(value) != ""
}
```

Add `strings` to imports in `reference_analysis.go`:

```go
import (
	"errors"
	"strings"
	"time"
)
```

- [x] **Step 3: Update ReadyFixture with IA fields**

In `ReadyFixture`, add:

```go
OriginalAnalysis: map[string]any{
	"transcript":              "Transcript",
	"original_hook":           "Say this",
	"storytelling_structure":  []string{"Say this"},
	"visual_layout":           "Reference opens on the finished result.",
	"source_specific_signals": []string{"Say this"},
	"why_source_works":        "The reference opens with a direct line.",
},
ExtractedStructure: map[string]any{
	"source_skeleton_id": "source-skeleton-1",
	"templates": []map[string]any{{
		"cut_id":          "cut-1",
		"source_template": "Say this -> {hook_context}",
	}},
	"sourceFaithful_mapping": []map[string]any{{
		"cut_id":          "cut-1",
		"line_to_say":     "Say this",
		"source_template": "Say this -> {hook_context}",
		"source_span":     map[string]any{"start_ms": 0, "end_ms": 5000, "transcript_ids": []string{"tr-1"}},
	}},
},
ApplyToYourContent: map[string]any{
	"source_skeleton_id": "source-skeleton-1",
	"target_goal":        "conversion",
	"target_niche":       "beauty",
	"what_is_preserved":  []string{"source beat order", "timestamp lineage", "source-specific phrase"},
	"what_changes":       []string{"niche copy", "shooting instruction"},
	"goalAdapted_mapping": []map[string]any{{
		"cut_id":          "cut-1",
		"line_to_say":     "Say this for your goal",
		"source_template": "Say this -> {hook_context}",
		"source_span":     map[string]any{"start_ms": 0, "end_ms": 5000, "transcript_ids": []string{"tr-1"}},
	}},
},
```

- [x] **Step 4: Run focused contract tests**

Run:

```bash
cd services/reference-api && go test ./internal/contracts -run 'TestReadyRequiresBreakdownInformationArchitecture|TestReadyFixtureIncludesTwoRecipeVariants' -count=1
```

Expected: PASS after Task 2.

### Task 3: Build IA Fields from Transcript and Variant Projections

**Files:**
- Modify: `services/reference-api/internal/analysis/response_builder.go`

- [x] **Step 1: Pass recipe and cutBoard into `buildBreakdown`**

Change the call in `BuildReferenceAnalysisResponse`:

```go
breakdown := buildBreakdown(draft, input, cuts, recipe, cutBoard)
```

Change the function signature:

```go
func buildBreakdown(draft RecipeDraft, input ReferenceAnalysisBuildInput, cuts []map[string]any, recipe *contracts.Recipe, cutBoard *contracts.CutBoard) *contracts.Breakdown {
```

- [x] **Step 2: Add IA fields to the Breakdown literal**

Inside `buildBreakdown`, after `IdeaAnalysis`, add:

```go
OriginalAnalysis:   buildOriginalAnalysis(draft, input, cuts, transcriptText, visualExtractPresent),
ExtractedStructure: buildExtractedStructure(cuts, cutBoard),
ApplyToYourContent: buildApplyToYourContent(input, cuts, cutBoard),
```

Also update `Hook` so the original hook is transcript-first:

```go
Hook: map[string]any{
	"category":             "transcript_first",
	"line":                 firstTranscriptLine(input.Transcript),
	"original_hook":        firstTranscriptLine(input.Transcript),
	"sourceFaithful_hook":  firstVariantLine(recipe, "sourceFaithful"),
	"goalAdapted_hook":     firstVariantLine(recipe, "goalAdapted"),
	"source_skeleton_id":   sourceSkeletonID,
},
```

- [x] **Step 3: Add helper functions for original analysis and mappings**

Add these helpers below `buildBreakdown`:

```go
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
		"source_skeleton_id":      sourceSkeletonID,
		"templates":               sourceTemplates(cuts),
		"sourceFaithful_mapping":  variantMapping("sourceFaithful", cuts, cutBoard),
	}
}

func buildApplyToYourContent(input ReferenceAnalysisBuildInput, cuts []map[string]any, cutBoard *contracts.CutBoard) map[string]any {
	return map[string]any{
		"source_skeleton_id":    sourceSkeletonID,
		"target_goal":           input.Request.Goal,
		"target_niche":          input.Request.Niche,
		"what_is_preserved":     []string{"source beat order", "timestamp lineage", "source-specific phrase, number, repetition, or contrast"},
		"what_changes":          []string{"niche copy", "shooting instruction", "viewer-facing call to action"},
		"goalAdapted_mapping":   variantMapping("goalAdapted", cuts, cutBoard),
	}
}
```

- [x] **Step 4: Add helper functions for source skeleton data**

Add these helpers below the Task 3 Step 3 helpers:

```go
func sourceTemplates(cuts []map[string]any) []map[string]any {
	templates := make([]map[string]any, 0, len(cuts))
	for _, cut := range cuts {
		templates = append(templates, map[string]any{
			"cut_id":                cut["id"],
			"source_template":       cut["source_template"],
			"source_transcript_text": cut["source_transcript_text"],
			"source_transcript_ids":  cut["source_transcript_ids"],
			"start_ms":              cut["start_ms"],
			"end_ms":                cut["end_ms"],
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
			"cut_id":                  item.ProjectionCutID,
			"line_to_say":             derefString(item.LineToSay),
			"reference_observation":   item.ReferenceObservation,
			"reference_usage":         item.ReferenceUsage,
			"my_take_relationship":    item.MyTakeRelationship,
			"source_template":         cut["source_template"],
			"source_transcript_text":  cut["source_transcript_text"],
			"source_specific_signal":  sourceSnippet(fmt.Sprint(cut["source_transcript_text"])),
			"source_span": map[string]any{
				"start_ms":       cut["start_ms"],
				"end_ms":         cut["end_ms"],
				"transcript_ids":  cut["source_transcript_ids"],
			},
		})
	}
	return mappings
}
```

- [x] **Step 5: Add small utility helpers**

Add these helpers below `variantMapping`:

```go
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
```

- [x] **Step 6: Run focused response-builder tests**

Run:

```bash
cd services/reference-api && go test ./internal/analysis -run 'TestBuildReferenceAnalysisResponseBreakdown' -count=1
```

Expected: PASS after Task 3.

### Task 4: Final Verification and Context

**Files:**
- Create: `context/context_20260520_issue_30_breakdown_artifact_information_architecture.md`

- [x] **Step 1: Run all required Go verification**

Run:

```bash
cd services/reference-api && go test ./...
```

Expected: PASS, unless sandbox loopback restrictions block provider tests. If blocked, record exact failing package and error.

- [x] **Step 2: Run diff whitespace verification**

Run from repo root:

```bash
git diff --check
```

Expected: PASS.

- [x] **Step 3: Write context summary**

Create `context/context_20260520_issue_30_breakdown_artifact_information_architecture.md` with:

```markdown
# 2026-05-20 Issue 30 Breakdown Artifact Information Architecture

## Scope

- GitHub issue #30 only.
- No sibling issue work, no live smoke, no commit, no push.

## Result

- Breakdown Transcript is built from clean transcript segments and tested against analysis-prose leakage.
- Breakdown now includes Original Analysis, Extracted Structure, Apply to Your Content, Hook, Storytelling Structure, and Visual Layout contract fields.
- Extracted Structure preserves `{placeholder}` templates.
- SourceFaithful and goalAdapted mappings share the same source skeleton id and source timestamp/transcript spans.

## Verification

- TODO: record focused response-builder test result.
- TODO: record focused contract test result.
- TODO: record `cd services/reference-api && go test ./...` result.
- TODO: record `git diff --check` result.

## Notes

- Existing unrelated untracked QA outputs were preserved.
- No staging, commit, push, GitHub comment, or issue close was performed.
```

Then replace each `TODO` verification line with actual PASS/BLOCKED text from this run.

- [x] **Step 4: Check final git status**

Run:

```bash
git status --short
```

Expected: only issue #30 files plus pre-existing unrelated untracked files are shown. Do not stage, commit, or push.

- [x] **Step 5: Prepare final AC checklist**

Report a PASS/PARTIAL/FAIL checklist for #30 acceptance criteria:

```markdown
- PASS/PARTIAL/FAIL: Breakdown Transcript contains actual clean transcript or excerpts, not analysis prose.
- PASS/PARTIAL/FAIL: Breakdown includes Original Analysis, Extracted Structure, Apply to Your Content, Hook, Storytelling Structure, and Visual Layout sections or equivalent contract fields.
- PASS/PARTIAL/FAIL: SourceFaithful and goalAdapted mappings are traceable from the same source skeleton.
- PASS/PARTIAL/FAIL: Every sourceFaithful cut preserves original transcript rhetorical structure.
- PASS/PARTIAL/FAIL: Every sourceFaithful cut retains at least one source-specific phrase, number, repetition, or contrast as template or mapped phrase.
- PASS/PARTIAL/FAIL: Every sourceFaithful cut links to a concrete source timestamp/transcript span.
```

Do not stage, commit, push, close the issue, or comment on GitHub.

## 결과

- 구현 완료: Breakdown artifact now includes `original_analysis`, `extracted_structure`, and `apply_to_your_content` alongside existing Transcript, Hook, Storytelling Structure, and Visual Layout fields.
- 검증 완료: focused response-builder and contract tests passed; non-provider Go packages passed; `git diff --check` passed.
- 제한 사항: `go test ./...` is blocked in this sandbox for provider packages that use `httptest.NewServer` because loopback bind is not permitted.
- 연결 context: `context/context_20260520_issue_30_breakdown_artifact_information_architecture.md`
