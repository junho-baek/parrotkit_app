# 2026-05-17 Issue #21 Partial/Failed Analysis State Support

## 배경

Issue #21 QA needs app-visible states for partial and failed reference analysis without changing the execution-first Board. The existing domain contract already exposes a client-safe `ReferenceAnalysisJobReadModel` with `clientStatus`, retryability, and user-safe error text.

## 변경

- `getRecipeBreakdownSummary` now derives an optional `analysisState` from `analysisMetadata.reference_analysis_job` or `analysisMetadata.referenceAnalysisJob`.
- Partial jobs show a Breakdown-scoped card that says the Breakdown is usable while some generated recipe support is still missing.
- Failed jobs show a Breakdown-scoped card with the client-safe error message and a retry label when the read model is retryable.
- `RecipeBreakdownPanel` renders the state card above the existing Breakdown sections.
- Board and recipe detail screen flow were not changed.
- Mocks were not changed.

## 검증

PASS:

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

## 연결된 plan

- `plans/20260517_issue_21_mobile_analysis_qa.md`
