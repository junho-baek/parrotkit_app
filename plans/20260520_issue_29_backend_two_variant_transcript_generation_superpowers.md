# Issue 29 Backend Two-Variant Transcript Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish GitHub issue #29 only by making the Go reference API return a deterministic sourceFaithful default projection and a selectable goalAdapted projection, both grounded in transcript spans.

**Architecture:** The model remains responsible only for a small goal-oriented draft. Go assembles the canonical `ReferenceAnalysisResponse`, derives sourceFaithful fields from transcript segments, stores goalAdapted fields from the draft as the alternate variant, and keeps provider trace details internal to the Go struct rather than serialized API JSON.

**Tech Stack:** Go reference API, standard library JSON tests, existing `contracts.ReferenceAnalysisResponse` contract, existing `superdata.TranscriptSegment` fixtures.

---

## 배경

- GitHub issue #29 requires only backend two-variant transcript-grounded generation.
- Current `a2a2dae` already adds `sourceFaithful` and `goalAdapted` variant keys plus `sourceFaithful` defaults.
- Audit gap: `attachRecipeVariants` currently copies the same recipe and cut board into both variants, so goalAdapted is not a separately selectable projection and the default sourceFaithful projection still depends on model draft copy instead of transcript-first reusable structure.
- Audit gap: optional provider failure traces are present on `Generation.ProviderTrace`; those should remain internal and not serialize to the app response.
- User instruction overrides normal repo commit/push rules: Hermes will verify, commit, comment, and close. Do not stage, commit, or push.

## 목표

- For fixture inputs, backend response contains both `sourceFaithful` and `goalAdapted` recipe and cutBoard variants.
- Top-level `recipe.scenes` and `cutBoard.items` are the default `sourceFaithful` projection.
- `goalAdapted` is available in the same response with the same projection cut IDs and reference spans, so it can be selected without creating a new recipe.
- `sourceFaithful` cuts preserve transcript line structure and timestamp span evidence.
- `sourceFaithful` guidance preserves reusable `{placeholder}` templates where applicable; do not strip braces.
- Partial-ready responses from transcript success plus visual extract failure remain usable and do not serialize raw provider traces or provider error strings.

## 범위

- In scope: backend Go contracts, response builder, prompt wording, and focused Go tests.
- Out of scope: #30-#33 UI work, live smoke, deployed QA, Notion upload, TypeScript changes, issue closing, commit, push.

## 변경 파일

- Modify: `services/reference-api/internal/analysis/response_builder.go`
- Modify: `services/reference-api/internal/analysis/response_builder_test.go`
- Modify: `services/reference-api/internal/analysis/model_draft_test.go`
- Modify if needed: `services/reference-api/internal/analysis/prompt.go`
- Modify if needed: `services/reference-api/internal/analysis/prompt_test.go`
- Modify: `services/reference-api/internal/contracts/reference_analysis.go`
- Modify: `services/reference-api/internal/contracts/reference_analysis_test.go`
- Create/update at completion: `context/context_20260520_issue_29_backend_two_variant_transcript_generation.md`

## 테스트

- `cd services/reference-api && go test ./...`
- `git diff --check`
- Do not run TypeScript checks unless a TypeScript contract file is touched.

## 롤백

- Revert this plan, the issue #29 context file, and the focused Go edits in `services/reference-api/internal/...`.
- No database, env, frontend, deployment, or persistent data changes are part of this plan.

## 리스크

- Existing untracked QA/context outputs belong to other work and must be preserved.
- The response contract currently exposes `generation.providerPipeline`; this plan hides raw provider traces and provider error strings, not the existing stable pipeline list.
- The deterministic sourceFaithful template is intentionally simple and transcript-first; richer source skeleton extraction can be improved by sibling issues without changing the #29 contract.

---

### Task 1: Add Failing Tests for Distinct Variants and Source-Faithful Grounding

**Files:**
- Modify: `services/reference-api/internal/analysis/response_builder_test.go`

- [x] **Step 1: Expand `TestBuildReferenceAnalysisResponseReturnsTwoVariants`**

Replace the existing single-scene assertion with a fixture where the transcript says `20 then 40 then 80, it does not end.` and the draft says `Your coaching plan compounds reps without burning out.`.

Expected assertions:

```go
if response.Recipe.DefaultVariant != "sourceFaithful" {
	t.Fatalf("recipe default variant = %q", response.Recipe.DefaultVariant)
}
if response.CutBoard.DefaultVariant != "sourceFaithful" {
	t.Fatalf("cutBoard default variant = %q", response.CutBoard.DefaultVariant)
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
```

- [x] **Step 2: Add source-faithful quality fixture test**

Add `TestBuildReferenceAnalysisResponseSourceFaithfulCutsKeepTranscriptSignalsAndSpans`.

Expected checks:

```go
response := BuildReferenceAnalysisResponse(ReferenceAnalysisBuildInput{/* three transcript segments with concrete timestamps */})
sourceItems := response.CutBoard.Variants["sourceFaithful"].Items
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
```

- [x] **Step 3: Run the focused response builder tests and confirm they fail before implementation**

Run:

```bash
cd services/reference-api && go test ./internal/analysis -run 'TestBuildReferenceAnalysisResponse(ReturnsTwoVariants|SourceFaithfulCutsKeepTranscriptSignalsAndSpans)' -count=1
```

Expected: FAIL because variants currently contain identical draft-driven copy and sourceFaithful does not contain backend-generated placeholder template guidance.

### Task 2: Build Source-Faithful Default and Goal-Adapted Variant Deterministically

**Files:**
- Modify: `services/reference-api/internal/analysis/response_builder.go`

- [x] **Step 1: Split scene and board construction into source and goal projections**

In `buildRecipeAndBoard`, keep the current draft-based scene/item as `goalScene` and `goalItem`, then create `sourceScene` and `sourceItem` from transcript-first helpers. Top-level `recipe.Scenes` and `cutBoard.Items` must use source projections.

Implementation shape:

```go
transcriptText := transcriptLine(transcript, index)
goalLine := fallbackString(draftScene.LineToSay, transcriptText)
sourceLine := sourceFaithfulLine(draftScene, transcriptText, index)
goalGuide := fallbackString(draftScene.ShootingGuideline, "Film this beat clearly and keep the action easy to repeat.")
sourceGuide := sourceFaithfulShootingGuideline(draftScene, transcriptText)

goalScene := contracts.RecipeScene{LineToSay: goalLine, ShootingGuideline: goalGuide, ...}
sourceScene := goalScene
sourceScene.LineToSay = sourceLine
sourceScene.ShootingGuideline = sourceGuide
```

- [x] **Step 2: Add sourceFaithful helper functions**

Add helpers below the copy helpers:

```go
func sourceFaithfulLine(draftScene RecipeDraftScene, transcriptText string, index int) string
func sourceFaithfulShootingGuideline(draftScene RecipeDraftScene, transcriptText string) string
func sourceFaithfulReferenceObservation(draftScene RecipeDraftScene, transcriptText string) string
func sourceFaithfulReferenceUsage(draftScene RecipeDraftScene, transcriptText string, index int) string
func sourceFaithfulMyTakeRelationship(draftScene RecipeDraftScene, transcriptText string, index int) string
func sourcePlaceholder(index int) string
func hasPlaceholder(text string) bool
```

Rules:

- `sourceFaithfulLine` prefers the transcript segment text over model draft line.
- If a draft line already has `{placeholder}` braces and no transcript text is available, preserve the draft line unchanged.
- `sourceFaithfulReferenceUsage` must include a placeholder such as `{hook_context}`, `{proof_detail}`, or `{viewer_action}` and a source phrase when transcript text exists.
- No helper strips `{}` from sourceFaithful fields.

- [x] **Step 3: Attach variants from distinct projections**

Change `attachRecipeVariants` signature to accept `goalScenes []contracts.RecipeScene` and `goalItems []contracts.CutBoardItem`.

Expected behavior:

```go
recipe.DefaultVariant = "sourceFaithful"
recipe.Variants["sourceFaithful"].Scenes = copyRecipeScenes(recipe.Scenes)
recipe.Variants["goalAdapted"].Scenes = copyRecipeScenes(goalScenes)
cutBoard.DefaultVariant = "sourceFaithful"
cutBoard.Variants["sourceFaithful"].Items = copyCutBoardItems(cutBoard.Items)
cutBoard.Variants["goalAdapted"].Items = copyCutBoardItems(goalItems)
```

- [x] **Step 4: Add source template evidence to breakdown cuts**

When appending each `cuts` map, add:

```go
"source_template": sourceFaithfulTemplate(transcriptText, index),
"source_transcript_text": transcriptText,
```

The template value must preserve braces.

- [x] **Step 5: Run the focused response builder tests and confirm they pass**

Run:

```bash
cd services/reference-api && go test ./internal/analysis -run 'TestBuildReferenceAnalysisResponse(ReturnsTwoVariants|SourceFaithfulCutsKeepTranscriptSignalsAndSpans)' -count=1
```

Expected: PASS.

### Task 3: Keep Provider Trace Details Internal to API JSON

**Files:**
- Modify: `services/reference-api/internal/contracts/reference_analysis.go`
- Modify: `services/reference-api/internal/contracts/reference_analysis_test.go`
- Modify: `services/reference-api/internal/analysis/model_draft_test.go`

- [x] **Step 1: Add serialization guard test**

In `reference_analysis_test.go`, add:

```go
func TestProviderTraceIsInternalOnly(t *testing.T) {
	response := ReadyFixture()
	response.Generation.ProviderTrace = []ProviderTraceEvent{{
		ErrorMessage: "raw provider stack detail",
		RequestID:    "req_trace",
		Stage:        "superdata.extract",
		Status:       "failure",
	}}

	bytes, err := json.Marshal(response)
	if err != nil {
		t.Fatalf("Marshal() error = %v", err)
	}
	body := string(bytes)
	if strings.Contains(body, "providerTrace") || strings.Contains(body, "raw provider stack detail") {
		t.Fatalf("provider trace leaked to JSON: %s", body)
	}
}
```

Add `encoding/json` and `strings` imports to that test file.

- [x] **Step 2: Add partial-ready no-leak assertion**

In `TestLiveProviderReturnsPartialReadyWhenExtractFailsButTranscriptAndDraftSucceed`, marshal the response and assert the serialized JSON does not contain `providerTrace` or `extract failed`.

Expected snippet:

```go
bodyBytes, err := json.Marshal(response)
if err != nil {
	t.Fatalf("Marshal() error = %v", err)
}
body := string(bodyBytes)
if strings.Contains(body, "providerTrace") || strings.Contains(body, "extract failed") {
	t.Fatalf("provider trace leaked to partial_ready JSON: %s", body)
}
if len(response.Generation.ProviderTrace) == 0 {
	t.Fatalf("internal provider trace should still be available on the Go response")
}
```

- [x] **Step 3: Hide provider trace from serialized contract**

Change the `Generation.ProviderTrace` JSON tag in `reference_analysis.go` to:

```go
ProviderTrace []ProviderTraceEvent `json:"-"`
```

- [x] **Step 4: Run focused contract and partial-ready tests**

Run:

```bash
cd services/reference-api && go test ./internal/contracts ./internal/analysis -run 'TestProviderTraceIsInternalOnly|TestLiveProviderReturnsPartialReadyWhenExtractFailsButTranscriptAndDraftSucceed' -count=1
```

Expected: PASS.

### Task 4: Tighten Prompt Contract Without Giving the Model Final Shape

**Files:**
- Modify: `services/reference-api/internal/analysis/prompt.go`
- Modify: `services/reference-api/internal/analysis/prompt_test.go`

- [x] **Step 1: Clarify draft role in prompt**

Add prompt rules that say the model writes goal-adapted natural scene draft copy only, while the backend derives the sourceFaithful template and canonical response.

Exact rules to add:

```text
7. Write lineToSay as natural complete goal-adapted copy for the requested niche and goal.
8. Do not use placeholder braces in goal-adapted lineToSay; the backend builds sourceFaithful templates from transcript spans.
```

- [x] **Step 2: Extend prompt test**

In `TestBuildPromptRequestsSmallDraftAndCarriesContext`, add required strings:

```go
"goal-adapted",
"backend builds sourceFaithful templates",
```

Keep existing forbidden canonical schema assertions.

- [x] **Step 3: Run focused prompt test**

Run:

```bash
cd services/reference-api && go test ./internal/analysis -run TestBuildPromptRequestsSmallDraftAndCarriesContext -count=1
```

Expected: PASS.

### Task 5: Full Focused Verification and Documentation

**Files:**
- Create: `context/context_20260520_issue_29_backend_two_variant_transcript_generation.md`
- Modify: `plans/20260520_issue_29_backend_two_variant_transcript_generation_superpowers.md`

- [x] **Step 1: Run required Go verification**

Run:

```bash
cd services/reference-api && go test ./...
```

Expected: PASS.

- [x] **Step 2: Run diff whitespace verification**

Run from repo root:

```bash
git diff --check
```

Expected: PASS.

- [x] **Step 3: Write context note**

Create `context/context_20260520_issue_29_backend_two_variant_transcript_generation.md` with:

```markdown
# 2026-05-20 Issue 29 Backend Two-Variant Transcript Generation

## Scope

- Backend-only implementation/audit for GitHub issue #29.
- No sibling issue work, no UI work, no live smoke, no commit, no push.

## Result

- SourceFaithful is the default top-level recipe and cutBoard projection.
- GoalAdapted is available as a same-response variant with the same projection cut IDs and source timestamp spans.
- SourceFaithful fields are transcript-first and preserve `{placeholder}` template guidance.
- Provider trace details remain available internally on the Go response but do not serialize into API JSON.

## Verification

- PASS: `cd services/reference-api && go test ./...`
- PASS: `git diff --check`

## Notes

- TypeScript contract files were not touched; TypeScript verification was not required.
- Existing unrelated untracked QA outputs were preserved.
```

- [x] **Step 4: Mark plan results**

Append a `## 결과` section to this plan with changed files, verification results, and the #29 PASS/PARTIAL/FAIL checklist.

Do not stage, commit, push, comment on GitHub, or close the issue.

## 결과

### Changed Files

- `plans/20260520_issue_29_backend_two_variant_transcript_generation_superpowers.md`
- `context/context_20260520_issue_29_backend_two_variant_transcript_generation.md`
- `services/reference-api/internal/analysis/response_builder.go`
- `services/reference-api/internal/analysis/response_builder_test.go`
- `services/reference-api/internal/analysis/model_draft_test.go`
- `services/reference-api/internal/analysis/prompt.go`
- `services/reference-api/internal/analysis/prompt_test.go`
- `services/reference-api/internal/contracts/reference_analysis.go`
- `services/reference-api/internal/contracts/reference_analysis_test.go`

### Acceptance Checklist

- PASS: Two-variant generation
  - Fixture response returns both `sourceFaithful` and `goalAdapted` recipe/cutBoard variants.
  - Top-level recipe and cutBoard default to `sourceFaithful`.
  - `goalAdapted` keeps the same projection cut IDs and reference spans, so it can be selected from the same response without creating a new recipe.
- PASS: Source-faithful quality
  - SourceFaithful lines are derived from transcript segment text, preserving source phrase/number/contrast evidence in fixture cuts.
  - SourceFaithful usage/template fields preserve `{placeholder}` braces.
  - SourceFaithful cutBoard items and breakdown cuts link to concrete transcript timestamp spans and segment IDs.
- PASS: Partial usability
  - Transcript success plus optional visual extract failure returns `partial_ready` with usable recipe/cutBoard.
  - Provider trace details remain on the Go response for internal inspection but do not serialize into API JSON.

### Verification Results

- PASS: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/analysis -run 'TestBuildReferenceAnalysisResponse(ReturnsTwoVariants|SourceFaithfulCutsKeepTranscriptSignalsAndSpans)' -count=1`
- PASS: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/contracts ./internal/analysis -run 'TestProviderTraceIsInternalOnly|TestLiveProviderReturnsPartialReadyWhenExtractFailsButTranscriptAndDraftSucceed' -count=1`
- PASS: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/analysis -run TestBuildPromptRequestsSmallDraftAndCarriesContext -count=1`
- PASS: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/analysis ./internal/contracts ./internal/httpapi ./internal/config`
- BLOCKED IN SANDBOX: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./...`
  - #29 packages passed.
  - Existing provider tests failed before assertions because `httptest.NewServer` could not bind a loopback port in this sandbox: `operation not permitted`.
- PASS: `git diff --check`

### Context

- Result note: `context/context_20260520_issue_29_backend_two_variant_transcript_generation.md`

No staging, commit, push, GitHub comment, or issue close was performed.
