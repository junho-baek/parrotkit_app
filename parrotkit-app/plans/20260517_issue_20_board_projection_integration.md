# Board Projection Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement GitHub issue #20 by wiring `shooting_board_projection` into the recipe board while preserving the DESIGN.md boundary: compact execution-first board, deep analysis only in Breakdown, and user edits as overrides.

**Architecture:** Keep projection mapping in the pure domain layer. Add a focused projection mapper near the existing shoot-board model, then make `createShootBoardRecipe()` prefer `recipe.referenceBreakdown.shooting_board_projection` when present. Keep old scene/template generation as fallback. User edits must remain board state/override data, not mutations to generated `ReferenceBreakdown` or `ShootingBoardProjection`.

**Tech Stack:** TypeScript domain model, existing sucrase contract tests, React Native UI consuming `ShootBoardRecipe`, `tsc --noEmit`, `npm run check:architecture`.

---

### Task 1: Projection-To-Board Mapper

**Files:**
- Create: `src/domain/shoot-board/shoot-board-projection.ts`
- Test: `src/domain/shoot-board/shoot-board-projection.test.ts`
- Read: `src/domain/recipes/reference-analysis-contract.ts`
- Read: `src/domain/shoot-board/shoot-board-model.ts`

- [ ] **Step 1: Write the failing mapper test**

Create `src/domain/shoot-board/shoot-board-projection.test.ts`.

The test should build a `ShootingBoardProjection` fixture with two items:

```ts
const projection = {
  analysisProfileVersion: "reference-analysis-v1",
  boardTitle: "Food Promo Shooting Guide",
  breakdownId: "breakdown_food_promo_v1",
  confidence: { overall: 0.84, notes: [] },
  createdAt: "2026-05-17T10:00:00.000Z",
  estimatedDurationSeconds: 25,
  items: [
    {
      durationSeconds: 5,
      editableFields: ["executionTitle", "lineToSay", "shotGuide", "successCriteria"],
      executionTitle: "Immediate promise",
      lineToSay: "I stopped overthinking diet food and this finally stuck.",
      missingArtifacts: [],
      myTakeRelationship: "Your take should prove the payoff before setup.",
      orderIndex: 0,
      projectionCutId: "projection_cut_001",
      referenceMediaRef: { endMs: 5000, mediaAssetId: "media_food_promo", startMs: 0 },
      referenceObservation: "Finished plate appears before process.",
      referenceUsage: "Match the finished-result first frame.",
      shotGuide: "Start on the final plate, then cut to reaction.",
      sourceCutIds: ["cut_001"],
      sourceTimeRangeMs: { endMs: 5000, startMs: 0 },
      successCriteria: ["Finished result visible immediately"],
    },
    {
      durationSeconds: 8,
      editableFields: ["lineToSay", "shotGuide"],
      executionTitle: "Proof in motion",
      lineToSay: "Here is the prep proof.",
      missingArtifacts: [],
      myTakeRelationship: "Your take should answer one uncertainty.",
      orderIndex: 1,
      projectionCutId: "projection_cut_002",
      referenceMediaRef: { endMs: 13000, mediaAssetId: "media_food_promo", startMs: 5000 },
      referenceObservation: "Fast prep cuts show texture and speed.",
      referenceUsage: "Borrow the proof rhythm, not the exact food.",
      shotGuide: "Stack prep, drizzle, and final bite.",
      sourceCutIds: ["cut_002"],
      sourceTimeRangeMs: { endMs: 13000, startMs: 5000 },
      successCriteria: ["One visual proof per cut"],
    },
  ],
  mediaAssetId: "media_food_promo",
  mediaAssetVersion: "sha256:food-promo-v1",
  missingArtifacts: [],
  projectionId: "projection_food_promo_v1",
  projectionSchemaVersion: "parrotkit.shooting_board_projection.v1",
  sourceCutCount: 2,
  status: "ready",
  updatedAt: "2026-05-17T10:00:00.000Z",
  workspaceId: "workspace_1",
} satisfies ShootingBoardProjection;
```

Assert that `mapShootingBoardProjectionToCuts({ projection, recipe })`:

- returns 2 `ShootBoardCut`s in `orderIndex` order;
- maps `executionTitle` to `title` without adding `Hook`, `Proof`, `Storytelling`, `Visual Layout`, or confidence labels;
- maps `lineToSay`, `shotGuide`, `referenceUsage`, `myTakeRelationship`, and `successCriteria`;
- maps reference media/time into `referenceVideoUrl` and `timeRangeLabel`;
- uses `projectionCutId` as the cut id and preserves `sourceCutIds` in `sceneId` or a new `sourceCutIds`-style field if added.

- [ ] **Step 2: Run test to verify it fails**

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/shoot-board/shoot-board-projection.test.ts
```

Expected: FAIL because the mapper does not exist.

- [ ] **Step 3: Implement minimal mapper**

Create `src/domain/shoot-board/shoot-board-projection.ts` with:

- `mapShootingBoardProjectionToCuts`
- `createProjectionCutTimeRangeLabel`
- `getProjectionCutReferenceVideoSource`
- a small forbidden-label guard helper used by tests

Use existing `ShootBoardCut` shape. Prefer adding only necessary optional fields to `ShootBoardCut`, such as:

```ts
sourceCutIds?: string[];
projectionCutId?: string;
referenceUsage?: string;
myTakeRelationship?: string;
```

- [ ] **Step 4: Run mapper test**

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/shoot-board/shoot-board-projection.test.ts
```

Expected: PASS.

### Task 2: Prefer Projection In `createShootBoardRecipe`

**Files:**
- Modify: `src/domain/shoot-board/shoot-board-model.ts`
- Test: `src/features/recipes/lib/shoot-board-model.test.ts`
- Test: `src/domain/shoot-board/shoot-board-projection.test.ts`

- [ ] **Step 1: Add a failing integration assertion**

Extend `src/features/recipes/lib/shoot-board-model.test.ts` with a recipe fixture whose `referenceBreakdown.shooting_board_projection` is present.

Assert:

- `createShootBoardRecipe(recipeWithProjection).cuts.length` equals projection item count;
- first cut title is the projection execution title, not `Cut #1: Hook`;
- first cut `lineToSay` equals projection `lineToSay`;
- first cut `shotAction` equals projection `shotGuide`;
- board summary duration equals projection `estimatedDurationSeconds`;
- forbidden board labels do not appear in `title`, `roleLabel`, `hook`, `note`, `lineToSay`, `shotAction`.

- [ ] **Step 2: Update `createShootBoardRecipe`**

Inside `createShootBoardRecipe`, before scene/template cut creation:

```ts
const projection = recipe.referenceBreakdown?.shooting_board_projection;
if (projection?.items.length) {
  const cuts = mapShootingBoardProjectionToCuts({ projection, recipe, shotCutIds });
  return createShootBoardRecipeFromCuts({ cuts, projection, recipe, isSaved });
}
```

Keep existing scene/template path as fallback.

- [ ] **Step 3: Run focused tests**

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/shoot-board/shoot-board-projection.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts
```

Expected: PASS.

### Task 3: Override Preservation Across Projection Regeneration

**Files:**
- Create or modify: `src/domain/shoot-board/shoot-board-projection.ts`
- Test: `src/domain/shoot-board/shoot-board-projection.test.ts`
- Read: `src/domain/recipes/reference-analysis-contract.ts`

- [ ] **Step 1: Add failing override preservation test**

Add test coverage for:

```ts
applyUserBoardOverridesToProjection({
  projection: regeneratedProjection,
  overrides: {
    projectionId: "old_projection",
    recipeId: "recipe_food_promo",
    updatedAt: "2026-05-17T10:10:00.000Z",
    userId: "user_1",
    cutOverrides: [
      {
        projectionCutId: "projection_cut_001",
        lineToSay: "Edited line survives regeneration.",
        shotGuide: "Edited guide survives regeneration.",
      },
    ],
  },
});
```

Assert matching `projectionCutId` overrides win, generated projection object remains unchanged, and unmatched overrides are ignored.

- [ ] **Step 2: Implement override helper**

Implement `applyUserBoardOverridesToProjection` as a pure helper that returns a new `ShootingBoardProjection`.

Do not mutate `projection.items`.

- [ ] **Step 3: Run projection test**

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/shoot-board/shoot-board-projection.test.ts
```

Expected: PASS.

### Task 4: Preserve Breakdown Boundary And UI Labels

**Files:**
- Test: `src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts`
- Test: `src/features/recipes/screens/recipe-detail/recipe-detail-board-reference-contract.test.ts`
- Possibly modify: `src/features/recipes/components/shoot-board-scene-card.tsx`

- [ ] **Step 1: Add/extend label guard tests**

Add assertions that board-facing source files do not introduce:

```ts
[
  "Storytelling Format",
  "Visual Layout",
  "Proof point",
  "Proof Point",
  "confidence",
  "model",
  "prompt",
]
```

as visible board row labels.

- [ ] **Step 2: Keep Breakdown labels in Breakdown only**

If any board component renders the forbidden labels, remove them or move the content behind existing Breakdown rendering.

- [ ] **Step 3: Run contract tests**

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-reference-contract.test.ts
```

Expected: PASS.

### Task 5: Verification And Handoff

**Files:**
- Modify: `context/context_20260517_reference_analysis_pipeline_contract.md`
- Modify: `plans/20260517_issue_20_board_projection_integration.md`

- [ ] **Step 1: Run full checks**

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/shoot-board/shoot-board-projection.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-reference-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
git diff --check
```

- [ ] **Step 2: Update context and issue**

Append #20 result to `context/context_20260517_reference_analysis_pipeline_contract.md`, then comment on GitHub issue #20 with the commit, tests, and any UI QA remaining.

- [ ] **Step 3: Commit and push**

```bash
git add src/domain/shoot-board/shoot-board-projection.ts src/domain/shoot-board/shoot-board-projection.test.ts src/domain/shoot-board/shoot-board-model.ts src/features/recipes/lib/shoot-board-model.test.ts src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts src/features/recipes/screens/recipe-detail/recipe-detail-board-reference-contract.test.ts context/context_20260517_reference_analysis_pipeline_contract.md plans/20260517_issue_20_board_projection_integration.md
git commit -m "feat: integrate reference projection with shoot board"
git push origin main
```

## Plan Review Notes

- #20 should run before #19 provider work. Provider output must target the stable Board projection boundary instead of forcing UI changes later.
- This plan intentionally avoids native screenshots. #21 owns Android/iOS QA after projection behavior lands.
- Do not close #20 until projection-to-board mapping, override preservation, label guards, TypeScript, and architecture checks pass.
