# Breakdown State Slop Cleanup

## 배경

Issue #21 QA support added visible partial/failed analysis state cards above the Breakdown content. The resulting yellow/red warning boxes look like system alerts and conflict with `DESIGN.md` simplicity guardrails: no mechanical warning surfaces, no implementation-state copy, and no box-in-box clutter unless it reduces immediate user uncertainty.

## 목표

- Remove alert-like yellow/red boxes from the Breakdown surface.
- Hide partial analysis state from normal Breakdown UI when the Breakdown itself is readable.
- Keep failed/retry state available only as a quiet inline note, not a warning card.
- Preserve the QA deep links and source-contract coverage.

## 범위

- `RecipeBreakdownPanel` presentation only.
- Breakdown state copy/helper tests.
- Context/report update for this cleanup.

Out of scope:

- Provider retry implementation.
- Android emulator blocker.
- Replacing the full Breakdown layout.

## 변경 파일

- `src/features/recipes/components/recipe-breakdown-panel.tsx`
- `src/features/recipes/lib/recipe-breakdown-summary.ts`
- `src/features/recipes/lib/recipe-breakdown-summary.test.ts`
- `src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts`
- `context/context_20260517_breakdown_state_slop_cleanup.md`

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `git diff --check`

## 롤백

- Revert the final cleanup commit to restore the previous visible state card behavior.

## 리스크

- Hiding partial state means QA cannot visually prove partial state from a screenshot alone. The source-contract test and query path still prove the route/model behavior.
- A failed state still needs a retry affordance later when the provider pipeline becomes real; this cleanup only changes the visual treatment.

## 결과

- Partial Breakdown state no longer renders a visible alert or banner.
- Failed Breakdown state renders as a muted inline note, not a colored warning card.
- Alert-like yellow/red colors and `AnalysisStateCard` are blocked by source-contract tests.
- iOS Simulator evidence:
  - `output/playwright/breakdown-state-slop-cleanup-20260517/ios-partial-no-alert.png`
  - `output/playwright/breakdown-state-slop-cleanup-20260517/ios-failed-inline-note.png`

Context: `context/context_20260517_breakdown_state_slop_cleanup.md`
Report: `output/reports/20260517_breakdown_state_slop_cleanup.md`
