# Reference Analysis Data Contracts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement GitHub issue #17 by adding durable reference analysis data contracts for normalized media input, immutable Breakdown artifacts, cut segments, Shooting Board projections, and user overrides.

**Architecture:** Keep the domain layer pure. Add a focused `reference-analysis-contract.ts` file for pipeline/data contracts, then extend the existing `reference-breakdown.ts` shape without breaking current mock data. The current Sandcastle-style `ReferenceBreakdown` remains valid while new v1 pipeline fields become available for future API/job work.

**Tech Stack:** TypeScript, Expo/React Native domain types, existing `sucrase-node` contract tests, `tsc --noEmit`, `npm run check:architecture`.

---

### Task 1: Add Reference Analysis Contract Types

**Files:**
- Create: `src/domain/recipes/reference-analysis-contract.ts`
- Test: `src/domain/recipes/reference-analysis-contract.test.ts`

- [ ] **Step 1: Write the contract test**

Create `src/domain/recipes/reference-analysis-contract.test.ts` with fixtures for a complete contract and a partial visual-only contract.

```ts
import {
  referenceProjectionTextLimits,
  type NormalizedReferenceMediaInput,
  type ReferenceAnalysisArtifactStatus,
  type ReferenceBreakdownArtifact,
  type ReferenceEvidenceRef,
  type ShootingBoardProjection,
  type UserRecipeBoardOverrides,
} from './reference-analysis-contract';

const mediaInput: NormalizedReferenceMediaInput = {
  assetVersion: 'sha256:food-promo-v1',
  byteSize: 2400000,
  dimensions: { height: 1920, width: 1080 },
  durationMs: 25000,
  mediaAssetId: 'media_food_promo',
  mimeType: 'video/mp4',
  playable: true,
  source: { kind: 'upload' },
  uri: 'file://food-promo.mp4',
  workspaceId: 'workspace_1',
};

const timeEvidence: ReferenceEvidenceRef = {
  id: 'evidence_opening',
  kind: 'timestamp_range',
  startMs: 0,
  endMs: 5000,
};

const breakdown: ReferenceBreakdownArtifact = {
  analysisProfileVersion: 'reference-analysis-v1',
  breakdownId: 'breakdown_food_promo_v1',
  confidence: { overall: 0.86, notes: [] },
  createdAt: '2026-05-17T10:00:00.000Z',
  cutSegments: [
    {
      confidence: 0.83,
      cutId: 'cut_001',
      durationMs: 5000,
      endMs: 5000,
      evidenceRefs: [timeEvidence],
      executionTitle: 'Immediate promise',
      inferredPurpose: 'Open on the finished result before explanation.',
      lineToSay: 'I stopped overthinking diet food and this finally stuck.',
      missingArtifacts: [],
      myTakeRelationship: 'Your take should prove the payoff before setup.',
      orderIndex: 0,
      referenceObservation: 'Finished plate appears before process.',
      referenceUsage: 'Match the finished-result first frame.',
      shootingGuide: 'Start on the final plate, then cut to reaction.',
      sourceModalities: ['visual', 'transcript'],
      startMs: 0,
      successCriteria: ['Finished result visible immediately'],
      transcriptRefs: ['tr_001'],
      visualRefs: ['frame_001'],
    },
  ],
  ideaAnalysis: {
    commonBeliefToChallenge: 'Diet food needs ingredient explanation first.',
    confidence: 0.82,
    contrarianReality: 'The final plate can persuade first.',
    evidenceRefs: [timeEvidence],
    ideaSeed: 'Open on the finished result.',
    status: 'ready',
    supportingEvidence: ['The first frame shows the finished plate.'],
    topic: 'Food promo',
    uniqueAngle: 'Low mental-load meal system.',
    userApplication: 'Show your best final plate before process.',
  },
  mediaAssetId: mediaInput.mediaAssetId,
  mediaAssetVersion: mediaInput.assetVersion,
  missingArtifacts: [],
  schemaVersion: 'parrotkit.reference_breakdown.v1',
  shootingBoardProjectionRef: {
    projectionId: 'projection_food_promo_v1',
    projectionSchemaVersion: 'parrotkit.shooting_board_projection.v1',
  },
  status: 'ready',
  summary: {
    audience: 'Food creators',
    confidence: 0.9,
    evidenceRefs: [timeEvidence],
    oneLiner: 'A result-first food promo.',
    promise: 'Show payoff first.',
    status: 'ready',
    whyViewersKeepWatching: 'The reward is visible immediately.',
  },
  transcript: {
    cleanText: 'I stopped overthinking diet food and this finally stuck.',
    confidence: 0.88,
    detectedLanguage: 'en',
    evidenceRefs: [timeEvidence],
    notableLines: [
      {
        evidenceRefs: [timeEvidence],
        line: 'I stopped overthinking diet food.',
        whyItMatters: 'Names the pain before process.',
      },
    ],
    segments: [
      {
        endMs: 5000,
        id: 'tr_001',
        startMs: 0,
        text: 'I stopped overthinking diet food and this finally stuck.',
      },
    ],
    status: 'ready',
  },
  hook: {
    adaptationRule: 'Swap in the painful habit and desired outcome.',
    category: 'problem',
    confidence: 0.81,
    evidenceRefs: [timeEvidence],
    formula: 'I stopped [painful habit] and this finally [desired outcome].',
    spokenHook: 'I stopped overthinking diet food and this finally stuck.',
    status: 'ready',
    visualHook: 'Finished plate first.',
    whyItWorks: 'Pain relief and result arrive together.',
  },
  storytellingFormat: {
    beatOrder: ['Finished plate', 'Proof in motion', 'Repeatable finish'],
    category: 'demo',
    confidence: 0.84,
    description: 'Promise-first demo.',
    evidenceRefs: [timeEvidence],
    reuseWhen: 'Use when food needs to feel repeatable.',
    status: 'ready',
    whyItWorks: 'It moves from desire to proof to reuse.',
  },
  updatedAt: '2026-05-17T10:00:00.000Z',
  visualLayout: {
    cameraMotion: 'Quick close-up into stable reaction.',
    captionStrategy: 'Short promise caption first.',
    category: 'product_demo',
    confidence: 0.8,
    evidenceRefs: [timeEvidence],
    framing: 'Final plate fills frame.',
    status: 'ready',
    subCategory: 'Food result close-up',
    subjectProductRelationship: 'Food stays primary.',
    userApplication: 'Keep dish dominant in the first beat.',
  },
  workspaceId: mediaInput.workspaceId,
};

const projection: ShootingBoardProjection = {
  analysisProfileVersion: breakdown.analysisProfileVersion,
  boardTitle: 'Food Promo Shooting Guide',
  breakdownId: breakdown.breakdownId,
  confidence: { overall: 0.84, notes: [] },
  createdAt: breakdown.createdAt,
  estimatedDurationSeconds: 25,
  items: [
    {
      durationSeconds: 5,
      editableFields: ['executionTitle', 'lineToSay', 'shotGuide', 'successCriteria'],
      executionTitle: 'Immediate promise',
      lineToSay: 'I stopped overthinking diet food and this finally stuck.',
      missingArtifacts: [],
      myTakeRelationship: 'Your take should prove the payoff before setup.',
      orderIndex: 0,
      projectionCutId: 'projection_cut_001',
      referenceMediaRef: {
        endMs: 5000,
        mediaAssetId: mediaInput.mediaAssetId,
        startMs: 0,
      },
      referenceObservation: 'Finished plate appears before process.',
      referenceUsage: 'Match the finished-result first frame.',
      shotGuide: 'Start on the final plate, then cut to reaction.',
      sourceCutIds: ['cut_001'],
      sourceTimeRangeMs: { endMs: 5000, startMs: 0 },
      successCriteria: ['Finished result visible immediately'],
    },
  ],
  mediaAssetId: mediaInput.mediaAssetId,
  mediaAssetVersion: mediaInput.assetVersion,
  missingArtifacts: [],
  projectionId: 'projection_food_promo_v1',
  projectionSchemaVersion: 'parrotkit.shooting_board_projection.v1',
  sourceCutCount: 1,
  status: 'ready',
  updatedAt: breakdown.updatedAt,
  workspaceId: mediaInput.workspaceId,
};

const overrides: UserRecipeBoardOverrides = {
  projectionId: projection.projectionId,
  recipeId: 'recipe_food_promo',
  updatedAt: '2026-05-17T10:10:00.000Z',
  userId: 'user_1',
  cutOverrides: [
    {
      projectionCutId: 'projection_cut_001',
      lineToSay: 'Here is the plate I repeat all week.',
    },
  ],
};

const partialStatus: ReferenceAnalysisArtifactStatus = 'partial_ready';

if (!mediaInput.playable) {
  throw new Error('Media input fixture must be playable');
}

if (breakdown.cutSegments.length !== projection.items.length) {
  throw new Error('Projection fixture should preserve source cut lineage');
}

if (projection.items[0]?.sourceCutIds[0] !== breakdown.cutSegments[0]?.cutId) {
  throw new Error('Projection item must reference the source cut segment');
}

if (overrides.cutOverrides[0]?.lineToSay === breakdown.cutSegments[0]?.lineToSay) {
  throw new Error('User overrides must be separate from generated Breakdown values');
}

if (partialStatus !== 'partial_ready') {
  throw new Error('partial_ready must be a first-class artifact status');
}

if (referenceProjectionTextLimits.executionTitle !== 56) {
  throw new Error('Projection title text limit must match the v1 compact UI contract');
}
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-contract.test.ts
```

Expected: FAIL because `reference-analysis-contract.ts` does not exist.

- [ ] **Step 3: Add minimal domain contract implementation**

Create `src/domain/recipes/reference-analysis-contract.ts` with exported types and projection text limits needed by the test.

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-contract.test.ts
```

Expected: PASS with no output.

### Task 2: Bridge Existing ReferenceBreakdown To New Contract

**Files:**
- Modify: `src/domain/recipes/reference-breakdown.ts`
- Test: `src/domain/recipes/reference-analysis-contract.test.ts`

- [ ] **Step 1: Extend the test**

Add a `ReferenceBreakdown` fixture that uses the existing Sandcastle fields plus optional new `artifact`, `cut_segments`, and `shooting_board_projection` fields.

- [ ] **Step 2: Update `reference-breakdown.ts`**

Import the new contract types and add optional fields to `ReferenceBreakdown`:

```ts
artifact?: ReferenceBreakdownArtifactMetadata;
cut_segments?: ReferenceCutSegment[];
shooting_board_projection?: ShootingBoardProjection;
user_overrides?: UserRecipeBoardOverrides;
```

Keep the existing `cuts` and `shooting_projection` fields unchanged for backwards compatibility.

- [ ] **Step 3: Run focused contract tests**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-contract.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts
```

Expected: both pass.

### Task 3: Verify And Document

**Files:**
- Modify: `context/context_20260517_reference_analysis_pipeline_contract.md`
- Modify: `plans/20260517_issue_17_reference_analysis_data_contracts.md`

- [ ] **Step 1: Run full local checks for this slice**

Run:

```bash
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
git diff --check
```

Expected: all pass.

- [ ] **Step 2: Update context**

Append a summary that #17 added the domain contract file, compatibility bridge fields, tests, and verification results.

- [ ] **Step 3: Update plan result**

Add a `## 결과` section to this plan with changed files and verification commands.

- [ ] **Step 4: Commit**

Run:

```bash
git add src/domain/recipes/reference-analysis-contract.ts src/domain/recipes/reference-analysis-contract.test.ts src/domain/recipes/reference-breakdown.ts context/context_20260517_reference_analysis_pipeline_contract.md plans/20260517_issue_17_reference_analysis_data_contracts.md
git commit -m "feat: add reference analysis data contracts"
```

## 결과

- Added `src/domain/recipes/reference-analysis-contract.ts`.
- Added `src/domain/recipes/reference-analysis-contract.test.ts`.
- Extended `src/domain/recipes/reference-breakdown.ts` with optional pipeline bridge fields while preserving existing Sandcastle-style fields.
- Updated `context/context_20260517_reference_analysis_pipeline_contract.md`.

## 검증

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-contract.test.ts` PASS.
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts` PASS.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` PASS.
- `npm run check:architecture` PASS.
- `git diff --check` PASS.
