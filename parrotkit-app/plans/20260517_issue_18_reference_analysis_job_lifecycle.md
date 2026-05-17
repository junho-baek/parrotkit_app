# Reference Analysis Job Lifecycle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement GitHub issue #18 by adding the v1 reference analysis job lifecycle, polling read model, retry/cancel/error semantics, and idempotency contract.

**Architecture:** Build on #17's pure domain contracts. Add a focused `reference-analysis-job.ts` domain file with internal job statuses, client-facing statuses, stable error codes, stage checklist helpers, idempotency key creation, retry rules, terminal artifact coherence checks, and a client-safe read-model projector. No DB, network API, or worker implementation belongs in this slice.

**Tech Stack:** TypeScript domain types, existing `sucrase-node` contract tests, `tsc --noEmit`, `npm run check:architecture`.

---

### Task 1: Job Lifecycle Contract

**Files:**
- Create: `src/domain/recipes/reference-analysis-job.ts`
- Test: `src/domain/recipes/reference-analysis-job.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/domain/recipes/reference-analysis-job.test.ts` with fixtures that cover idempotency, client status mapping, stage checklist, retryable errors, non-retryable errors, coherent terminal artifacts, and client-safe read model projection.

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-job.test.ts
```

Expected: FAIL because `reference-analysis-job.ts` does not exist.

- [ ] **Step 3: Add minimal implementation**

Create `src/domain/recipes/reference-analysis-job.ts` with:

- `ReferenceAnalysisJobStatus`
- `ReferenceAnalysisClientStatus`
- `ReferenceAnalysisJobErrorCode`
- `ReferenceAnalysisJob`
- `ReferenceAnalysisJobReadModel`
- `createReferenceAnalysisIdempotencyKey`
- `getReferenceAnalysisClientStatus`
- `createReferenceAnalysisStageChecklist`
- `isReferenceAnalysisTerminalStatus`
- `isReferenceAnalysisRetryableError`
- `shouldRetryReferenceAnalysisJob`
- `hasCoherentReferenceAnalysisTerminalArtifacts`
- `toReferenceAnalysisJobReadModel`

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-job.test.ts
```

Expected: PASS with no output.

### Task 2: Pipeline Metadata Bridge

**Files:**
- Modify: `src/domain/recipes/reference-analysis-contract.ts`
- Test: `src/domain/recipes/reference-analysis-contract.test.ts`

- [ ] **Step 1: Extend contract metadata**

Add optional job lineage fields to `ReferenceBreakdownArtifactMetadata`:

```ts
jobId?: string;
traceId?: string;
```

- [ ] **Step 2: Extend the existing contract test**

Set `jobId` and `traceId` on the `ReferenceBreakdownArtifact` fixture and assert the values are preserved.

- [ ] **Step 3: Run contract tests**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-contract.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-job.test.ts
```

Expected: both pass.

### Task 3: Verify And Document

**Files:**
- Modify: `context/context_20260517_reference_analysis_pipeline_contract.md`
- Modify: `plans/20260517_issue_18_reference_analysis_job_lifecycle.md`

- [ ] **Step 1: Run full local checks for this slice**

Run:

```bash
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
git diff --check
```

Expected: all pass.

- [ ] **Step 2: Update context**

Append a summary that #18 added the job lifecycle/read-model contract and verification results.

- [ ] **Step 3: Update plan result**

Add a `## 결과` section to this plan with changed files and verification commands.

- [ ] **Step 4: Commit**

Run:

```bash
git add src/domain/recipes/reference-analysis-job.ts src/domain/recipes/reference-analysis-job.test.ts src/domain/recipes/reference-analysis-contract.ts src/domain/recipes/reference-analysis-contract.test.ts context/context_20260517_reference_analysis_pipeline_contract.md plans/20260517_issue_18_reference_analysis_job_lifecycle.md
git commit -m "feat: add reference analysis job lifecycle contract"
```

## 결과

- Added `src/domain/recipes/reference-analysis-job.ts`.
- Added `src/domain/recipes/reference-analysis-job.test.ts`.
- Extended `src/domain/recipes/reference-analysis-contract.ts` with optional `jobId` and `traceId` lineage fields on `ReferenceBreakdownArtifactMetadata`.
- Updated `src/domain/recipes/reference-analysis-contract.test.ts`.
- Updated `context/context_20260517_reference_analysis_pipeline_contract.md`.

## 검증

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-job.test.ts` PASS.
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-contract.test.ts` PASS.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` PASS.
- `npm run check:architecture` PASS.
- `git diff --check` PASS.
