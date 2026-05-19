# Issue 32 UI Freshness and Variant Switching Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish GitHub issue #32 only by proving and enforcing that the recipe detail UI uses the latest generated reference API response immediately, preserves same-recipe variant switching, and rejects stale hydrated boards when the latest `generatedAt` / `requestId` data is newer.

**Architecture:** Keep #29, #30, and #31 backend/contract work intact. The Expo mapping layer will keep request freshness metadata from the API response on the generated result and projection-derived board. The recipe detail board state layer will reconcile any saved/hydrated source board against the latest projection board before rendering, keeping user edits only when the saved board is not older than the latest generated response.

**Tech Stack:** Expo React Native, TypeScript domain mappers, existing sucrase-node focused tests, `tsc --noEmit`, optional Go verification only if backend files are touched.

---

## 배경

- GitHub issue #32 is scoped to UI freshness and same-recipe variant switching only.
- `HEAD` includes:
  - `308e549 feat: ground reference recipe variants`
  - `269b727 feat: structure reference breakdown artifact`
  - `73b8c1e feat: add reference timestamp playback links`
- Prior contexts verify #29/#31 already satisfy backend two-variant generation, `sourceFaithful` board default, `goalAdapted` in-place selection, and timestamp playback links.
- Current audit gap: `RecipeDetailScreen` uses `getRecipeEditorBoard(nativeRecipe.id)` for `sourceFaithful` and only hydrates missing reference media. It does not reject an older saved board when a newer generated API response/projection exists. That can preserve a stale 4-cut board after a latest 3-cut response.
- User instruction overrides normal repo commit/push rules: Hermes will verify, commit, comment, and close. Do not stage, commit, push, comment on GitHub, or close the issue.

## 목표

- Immediately after generation, mapped recipe scenes, board projection items, and Breakdown transcript reflect the latest API response cut count and content.
- The detail board rejects stale hydrated/editor boards when the latest projection has newer `generatedAt` / `requestId` freshness metadata.
- Header cut count and rendered board cards come from the latest projection when a stale 4-cut board conflicts with a 3-cut response.
- `sourceFaithful` remains the default board variant.
- `goalAdapted` remains selectable in place without creating a new recipe or hydrating from the saved source board.
- Produce PASS/PARTIAL/FAIL checklist for issue #32 acceptance criteria.

## 범위

- In scope: Expo mapping tests, board-state freshness helper/tests, minimal TypeScript model fields needed to carry generation freshness, RecipeDetailScreen wiring, context/plan documentation.
- Out of scope: sibling issue #33 live smoke/deployed QA, backend generation changes, embedded YouTube playback, Notion upload, staging, commit, push, GitHub comments, issue close.

## 변경 파일

- Modify: `parrotkit-app/src/domain/shoot-board/shoot-board-model.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.test.ts`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail/recipe-detail-board-state.ts`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- Create/update at completion: `context/context_20260520_issue_32_ui_freshness_variant_switching.md`
- Update at completion: `plans/20260520_issue_32_ui_freshness_variant_switching_superpowers.md`

## 테스트

- `cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-recipe-generation.test.ts`
- `cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`
- `npx --prefix parrotkit-app tsc --noEmit -p parrotkit-app/tsconfig.json`
- `git diff --check`
- Do not run `cd services/reference-api && go test ./...` unless backend files are touched.

## 롤백

- Revert this plan, the issue #32 context file, and the focused TypeScript edits listed under 변경 파일.
- No database, env, backend, deployment, Notion, GitHub issue, staging, commit, or push changes are part of this plan.

## 리스크

- Existing unrelated untracked context/plan/QA outputs must be preserved.
- `sourceFaithful` saved board edits should remain intact when they belong to the same latest generation. The stale-board rejection should only replace boards that are older, missing freshness metadata with a different cut signature, or tied to another request/projection.
- Tests should avoid relying on live network or Expo UI runtime. Use deterministic mappers/helpers instead.

---

### Task 1: Add Focused Failing Tests for Latest API Response and Stale Board Reconciliation

**Files:**
- Modify: `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.test.ts`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`

- [x] **Step 1: Add latest three-cut API mapping assertions**

In `reference-recipe-generation.test.ts`, add this fixture after the existing `mappedReadyResult` assertions:

```ts
const latestThreeCutResponse: ReferenceAnalysisAPIResponse = {
  ...readyAnalysisResponse,
  requestId: "req_latest_three",
  generatedAt: "2026-05-20T03:00:00.000Z",
  breakdown: {
    ...(readyAnalysisResponse.breakdown as Record<string, unknown>),
    transcript: {
      clean: "Latest three-cut transcript. Middle proof. Final save line.",
      notable_lines: [],
      raw: ["Latest three-cut transcript. Middle proof. Final save line."],
    },
  },
  recipe: {
    title: "Latest Three Cut Recipe",
    oneLineDescription: "A fresh three-cut generated response.",
    totalDurationSec: 18,
    scenes: [
      {
        durationSec: 5,
        index: 1,
        lineToSay: "Latest hook line.",
        projectionCutId: "latest-cut-1",
        requiredChecklist: ["Hook visible"],
        shootingGuideline: "Open on the latest hook.",
        title: "Latest hook",
      },
      {
        durationSec: 7,
        index: 2,
        lineToSay: "Latest proof line.",
        projectionCutId: "latest-cut-2",
        requiredChecklist: ["Proof visible"],
        shootingGuideline: "Show the latest proof.",
        title: "Latest proof",
      },
      {
        durationSec: 6,
        index: 3,
        lineToSay: "Latest save line.",
        projectionCutId: "latest-cut-3",
        requiredChecklist: ["CTA visible"],
        shootingGuideline: "End on the latest CTA.",
        title: "Latest CTA",
      },
    ],
  },
  cutBoard: {
    boardTitle: "Latest Three Cut Recipe",
    estimatedDurationSeconds: 18,
    items: [
      createApiCutBoardItem("latest-cut-1", "Latest hook", "Latest hook line.", 0, 5000),
      createApiCutBoardItem("latest-cut-2", "Latest proof", "Latest proof line.", 5000, 12000),
      createApiCutBoardItem("latest-cut-3", "Latest CTA", "Latest save line.", 12000, 18000),
    ],
    variants: {
      sourceFaithful: {
        boardTitle: "Latest Three Cut Recipe",
        items: [
          createApiCutBoardItem("latest-cut-1", "Latest hook", "Latest hook line.", 0, 5000),
          createApiCutBoardItem("latest-cut-2", "Latest proof", "Latest proof line.", 5000, 12000),
          createApiCutBoardItem("latest-cut-3", "Latest CTA", "Latest save line.", 12000, 18000),
        ],
      },
      goalAdapted: {
        boardTitle: "Latest Three Cut Recipe Adapted",
        items: [
          createApiCutBoardItem("latest-cut-1", "Adapted hook", "Adapted hook line.", 0, 5000),
          createApiCutBoardItem("latest-cut-2", "Adapted proof", "Adapted proof line.", 5000, 12000),
          createApiCutBoardItem("latest-cut-3", "Adapted CTA", "Adapted save line.", 12000, 18000),
        ],
      },
    },
  },
};

const latestThreeCutResult = mapReferenceAnalysisResponseToRecipeGenerationResult(
  latestThreeCutResponse,
  {
    goalId: "ad",
    nicheId: "beauty",
    referenceUrl: shortsUrl,
  },
);

if (latestThreeCutResult.generation.requestId !== "req_latest_three") {
  throw new Error("Generated result should preserve latest API requestId.");
}

if (mapGeneratedRecipeToMockScenes(latestThreeCutResult).length !== 3) {
  throw new Error("Generated scenes must keep the latest three-cut API count.");
}

const latestProjection = latestThreeCutResult.referenceBreakdown?.shooting_board_projection;

if (!latestProjection || latestProjection.items.length !== 3) {
  throw new Error("Latest API cutBoard must become a three-item sourceFaithful projection.");
}

if (latestProjection.breakdownId !== "req_latest_three") {
  throw new Error(`Latest projection should carry request freshness. Found: ${latestProjection.breakdownId}`);
}

if (latestProjection.updatedAt !== "2026-05-20T03:00:00.000Z") {
  throw new Error(`Latest projection should carry generatedAt freshness. Found: ${latestProjection.updatedAt}`);
}

if (
  latestThreeCutResult.referenceBreakdown?.transcript.clean !==
  "Latest three-cut transcript. Middle proof. Final save line."
) {
  throw new Error("Breakdown transcript must come from the latest API response.");
}

const latestGoalProjection =
  latestThreeCutResult.referenceBreakdown?.shooting_board_projection_variants?.goalAdapted;

if (!latestGoalProjection || latestGoalProjection.items[0]?.lineToSay !== "Adapted hook line.") {
  throw new Error("Goal-adapted projection must remain selectable from the same latest response.");
}
```

Add this helper near the bottom of the file:

```ts
function createApiCutBoardItem(
  projectionCutId: string,
  executionTitle: string,
  lineToSay: string,
  startMs: number,
  endMs: number,
): NonNullable<ReferenceAnalysisAPIResponse["cutBoard"]>["items"][number] {
  return {
    durationSeconds: Math.max(1, Math.ceil((endMs - startMs) / 1000)),
    executionTitle,
    lineToSay,
    myTakeRelationship: "Use this latest beat for your take.",
    orderIndex: Number(projectionCutId.split("-").at(-1) ?? 1) - 1,
    projectionCutId,
    referenceMediaRef: {
      endMs,
      mediaAssetId: "media-latest",
      startMs,
      thumbnailUri: "https://cdn.example.com/latest.jpg",
    },
    referenceObservation: "The latest response owns this beat.",
    referenceUsage: "Keep the latest source role.",
    shotGuide: `Film ${executionTitle.toLowerCase()}.`,
    sourceCutIds: [projectionCutId],
    successCriteria: [`${executionTitle} is visible`],
  };
}
```

- [x] **Step 2: Add stale 4-cut hydrate rejection assertions**

In `recipe-detail-board-state.test.ts`, import the new helper:

```ts
  reconcileShootBoardWithLatestSource,
```

Extend the `require("./recipe-detail-board-state")` type with:

```ts
  reconcileShootBoardWithLatestSource: typeof import("./recipe-detail-board-state").reconcileShootBoardWithLatestSource;
```

Add this test after the existing `hydrateShootBoardReferenceMedia` assertions:

```ts
const latestThreeCutBoard = {
  id: "recipe-freshness",
  sourceGeneratedAt: "2026-05-20T03:00:00.000Z",
  sourceProjectionId: "req_latest_three-sourceFaithful",
  sourceRequestId: "req_latest_three",
  totalCuts: 3,
  cuts: [
    createCut("latest-cut-1", "latest-cut-1", 1),
    createCut("latest-cut-2", "latest-cut-2", 2),
    createCut("latest-cut-3", "latest-cut-3", 3),
  ],
};
const staleFourCutBoard = {
  id: "recipe-freshness",
  sourceGeneratedAt: "2026-05-20T01:00:00.000Z",
  sourceProjectionId: "req_old_four-sourceFaithful",
  sourceRequestId: "req_old_four",
  totalCuts: 4,
  cuts: [
    createCut("stale-cut-1", "stale-cut-1", 1),
    createCut("stale-cut-2", "stale-cut-2", 2),
    createCut("stale-cut-3", "stale-cut-3", 3),
    createCut("stale-cut-4", "stale-cut-4", 4),
  ],
};
const reconciledLatestBoard = reconcileShootBoardWithLatestSource({
  candidateBoard: staleFourCutBoard as unknown as Parameters<
    typeof reconcileShootBoardWithLatestSource
  >[0]["candidateBoard"],
  latestBoard: latestThreeCutBoard as unknown as Parameters<
    typeof reconcileShootBoardWithLatestSource
  >[0]["latestBoard"],
});

if (reconciledLatestBoard !== latestThreeCutBoard) {
  throw new Error("Older hydrated board must not overwrite a newer generated response.");
}

if (reconciledLatestBoard.cuts.length !== 3 || reconciledLatestBoard.totalCuts !== 3) {
  throw new Error("Freshness reconciliation must remove stale four-cut boards after a three-cut response.");
}
```

Add this test for preserving same-generation edits:

```ts
const editedCurrentBoard = {
  ...latestThreeCutBoard,
  cuts: latestThreeCutBoard.cuts.map((cut, index) =>
    index === 0 ? { ...cut, lineToSay: "Edited latest line should stay" } : cut,
  ),
};
const reconciledCurrentBoard = reconcileShootBoardWithLatestSource({
  candidateBoard: editedCurrentBoard as unknown as Parameters<
    typeof reconcileShootBoardWithLatestSource
  >[0]["candidateBoard"],
  latestBoard: latestThreeCutBoard as unknown as Parameters<
    typeof reconcileShootBoardWithLatestSource
  >[0]["latestBoard"],
});

if (reconciledCurrentBoard === latestThreeCutBoard) {
  throw new Error("Same-generation saved board edits should survive hydration.");
}

if (reconciledCurrentBoard.cuts[0]?.lineToSay !== "Edited latest line should stay") {
  throw new Error("Same-generation board reconciliation must preserve edited copy.");
}
```

Add this source-code contract check near the existing screen-source assertions:

```ts
if (!screenSource.includes("reconcileShootBoardWithLatestSource({")) {
  throw new Error("Recipe detail screen must reconcile saved boards against the latest generated source board.");
}
```

- [x] **Step 3: Run focused tests and confirm they fail before implementation**

Run:

```bash
cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-recipe-generation.test.ts
cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts
```

Expected before implementation:

- `reference-recipe-generation.test.ts` fails because `generation.requestId` is not preserved.
- `recipe-detail-board-state.test.ts` fails because `reconcileShootBoardWithLatestSource` does not exist.

### Task 2: Carry Freshness Metadata and Reconcile Hydrated Boards

**Files:**
- Modify: `parrotkit-app/src/domain/shoot-board/shoot-board-model.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.ts`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail/recipe-detail-board-state.ts`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`

- [x] **Step 1: Add optional source freshness fields to shoot board recipes**

In `ShootBoardRecipe`, add:

```ts
  sourceGeneratedAt?: string;
  sourceProjectionId?: string;
  sourceRequestId?: string;
```

In the projection branch of `createShootBoardRecipe`, add these fields to the returned object:

```ts
      sourceGeneratedAt: projection.updatedAt || projection.createdAt,
      sourceProjectionId: projection.projectionId,
      sourceRequestId: projection.breakdownId,
```

- [x] **Step 2: Preserve API requestId on mapped generation results**

In `ReferenceRecipeGenerationResult["generation"]`, add:

```ts
    requestId?: string | null;
```

In `mapReferenceAnalysisResponseToRecipeGenerationResult`, add:

```ts
      requestId: apiResponse.requestId ?? null,
```

In `buildLocalFallbackResult`, add:

```ts
      requestId: null,
```

- [x] **Step 3: Add board freshness reconciliation helpers**

In `recipe-detail-board-state.ts`, add after `hydrateShootBoardReferenceMedia`:

```ts
export function reconcileShootBoardWithLatestSource({
  candidateBoard,
  latestBoard,
}: {
  candidateBoard: ShootBoardRecipe;
  latestBoard: ShootBoardRecipe;
}): ShootBoardRecipe {
  if (isCandidateBoardOlderThanLatestSource({ candidateBoard, latestBoard })) {
    return latestBoard;
  }

  return hydrateShootBoardReferenceMedia({
    board: candidateBoard,
    sourceBoard: latestBoard,
  });
}

function isCandidateBoardOlderThanLatestSource({
  candidateBoard,
  latestBoard,
}: {
  candidateBoard: ShootBoardRecipe;
  latestBoard: ShootBoardRecipe;
}) {
  const latestHasFreshness =
    Boolean(latestBoard.sourceGeneratedAt) ||
    Boolean(latestBoard.sourceProjectionId) ||
    Boolean(latestBoard.sourceRequestId);

  if (!latestHasFreshness) {
    return false;
  }

  const latestTime = parseFreshnessTime(latestBoard.sourceGeneratedAt);
  const candidateTime = parseFreshnessTime(candidateBoard.sourceGeneratedAt);

  if (latestTime !== null && candidateTime !== null) {
    if (latestTime > candidateTime) {
      return true;
    }

    if (candidateTime > latestTime) {
      return false;
    }
  }

  if (latestTime !== null && candidateTime === null) {
    return !hasSameBoardCutSignature(candidateBoard, latestBoard);
  }

  if (
    latestBoard.sourceRequestId &&
    candidateBoard.sourceRequestId &&
    latestBoard.sourceRequestId !== candidateBoard.sourceRequestId
  ) {
    return true;
  }

  if (
    latestBoard.sourceProjectionId &&
    candidateBoard.sourceProjectionId &&
    latestBoard.sourceProjectionId !== candidateBoard.sourceProjectionId
  ) {
    return true;
  }

  if (
    (latestBoard.sourceRequestId || latestBoard.sourceProjectionId) &&
    !candidateBoard.sourceRequestId &&
    !candidateBoard.sourceProjectionId
  ) {
    return !hasSameBoardCutSignature(candidateBoard, latestBoard);
  }

  return false;
}

function parseFreshnessTime(value?: string | null) {
  if (!value) {
    return null;
  }

  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

function hasSameBoardCutSignature(
  candidateBoard: ShootBoardRecipe,
  latestBoard: ShootBoardRecipe,
) {
  return getBoardCutSignature(candidateBoard) === getBoardCutSignature(latestBoard);
}

function getBoardCutSignature(board: ShootBoardRecipe) {
  return board.cuts
    .map((cut) => `${cut.id}:${cut.projectionCutId ?? ""}:${cut.order}`)
    .join("|");
}
```

- [x] **Step 4: Use reconciliation in `RecipeDetailScreen`**

In `recipe-detail-screen.tsx`, add `reconcileShootBoardWithLatestSource` to the import from `recipe-detail-board-state`.

Replace:

```ts
    const nextBoard = existingBoard
      ? hydrateShootBoardReferenceMedia({
          board: existingBoard,
          sourceBoard: originalBoard,
        })
      : originalBoard;
```

with:

```ts
    const nextBoard = existingBoard
      ? reconcileShootBoardWithLatestSource({
          candidateBoard: existingBoard,
          latestBoard: originalBoard,
        })
      : originalBoard;
```

- [x] **Step 5: Run focused tests and confirm they pass**

Run:

```bash
cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-recipe-generation.test.ts
cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts
```

Expected: PASS.

### Task 3: Audit Existing Variant Switching and Backend Satisfaction Without Churn

**Files:**
- Inspect only unless a regression is found:
  - `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.ts`
  - `parrotkit-app/src/features/recipes/screens/recipe-detail/recipe-detail-board-state.ts`
  - `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - `services/reference-api/internal/analysis/response_builder_test.go`
  - `services/reference-api/internal/contracts/reference_analysis_test.go`

- [x] **Step 1: Verify backend two-variant work is already covered**

Inspect the existing tests for these assertions:

```bash
rg -n 'DefaultVariant|sourceFaithful|goalAdapted|ReturnsTwoVariants|ReadyFixtureIncludesTwoRecipeVariants' services/reference-api/internal/analysis services/reference-api/internal/contracts
```

Expected:

- Existing tests assert `recipe.defaultVariant == sourceFaithful`.
- Existing tests assert `cutBoard.defaultVariant == sourceFaithful`.
- Existing tests assert both `sourceFaithful` and `goalAdapted` are returned.

- [x] **Step 2: Verify UI variant switch remains in-place**

Inspect the existing board-state and screen tests for:

```bash
rg -n 'getShootBoardVariantOptions|projectNativeRecipeForShootBoardVariant|setSelectedBoardVariant|goalAdapted|sourceFaithful' parrotkit-app/src/features/recipes/screens/recipe-detail
```

Expected:

- Options are ordered `sourceFaithful,goalAdapted`.
- Selecting `goalAdapted` swaps `referenceBreakdown.shooting_board_projection` in the same recipe object flow.
- Screen switch calls `setSelectedBoardVariant(variant.id)`.
- Goal-adapted selection does not call `getRecipeEditorBoard`.

- [x] **Step 3: Do not edit backend or sibling issue files if the audit passes**

Expected:

- No Go/backend files are changed for #32.
- No #33 live smoke artifacts are created.

### Task 4: Final Verification, Context, and Acceptance Checklist

**Files:**
- Create: `context/context_20260520_issue_32_ui_freshness_variant_switching.md`
- Update: `plans/20260520_issue_32_ui_freshness_variant_switching_superpowers.md`

- [x] **Step 1: Run required focused verification**

Run:

```bash
cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-recipe-generation.test.ts
cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts
npx --prefix parrotkit-app tsc --noEmit -p parrotkit-app/tsconfig.json
git diff --check
```

Expected: PASS for all commands.

- [x] **Step 2: Create issue #32 context record**

Create `context/context_20260520_issue_32_ui_freshness_variant_switching.md` with:

```markdown
# 2026-05-20 Issue 32 UI Freshness and Variant Switching

## Scope

- GitHub issue #32 only.
- No sibling issue work, no live smoke, no commit, no push.

## Result

- Latest generated API responses preserve `requestId` and `generatedAt` through the Expo mapping path.
- Projection-derived shoot boards carry source freshness metadata.
- Recipe detail reconciliation rejects stale hydrated/editor boards when the latest projection is newer.
- Focused evidence covers no stale 4-cut board after a latest 3-cut generated response.
- Existing variant switching remains `sourceFaithful` default with `goalAdapted` selectable in-place.

## Acceptance Checklist

- PASS/PARTIAL/FAIL: fill from final implementation results.

## Verification

- PASS/FAIL: fill exact command results.

## Notes

- Existing unrelated untracked QA outputs were preserved.
- No staging, commit, push, GitHub comment, or issue close was performed.
```

- [x] **Step 3: Update this plan with completion results**

Append a `## 결과` section with:

```markdown
## 결과

- Context record: `context/context_20260520_issue_32_ui_freshness_variant_switching.md`
- Acceptance checklist: PASS/PARTIAL/FAIL summary recorded in context and final response.
- Verification: focused Expo tests, TypeScript, and `git diff --check` completed.
```

- [x] **Step 4: Check final git status without staging**

## 결과

- Context record: `context/context_20260520_issue_32_ui_freshness_variant_switching.md`
- Acceptance checklist: PASS — latest generated API response wins over stale DB/mock hydrate via `generatedAt` / `requestId`, variant switching remains same-recipe, and no debug/provider/AI labels were added.
- Verification: focused Expo sucrase-node tests, TypeScript, and `git diff --check` passed.
- Backend verification: not run because no backend files were touched.
- Git constraint note: no explicit commit command was run, but local `HEAD` advanced to `f9c0617 feat: reconcile fresh reference boards`; attempted undo with `git reset --mixed HEAD~1` was blocked by `.git/index.lock` permission denial.

Run:

```bash
git status --short
```

Expected:

- Only issue #32 files changed by this run, plus pre-existing unrelated untracked files.
- No staged changes.
