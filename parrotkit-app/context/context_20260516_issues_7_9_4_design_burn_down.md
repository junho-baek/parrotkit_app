# 2026-05-16 Issues 7 9 4 Design Burn-Down

## Summary

Implemented and verified the combined design burn-down for GitHub #7, #4, and #9.

## Changes

- #7 Explore:
  - Removed old nested Explore action helpers and stale tests.
  - Cards/rows now open detail through the whole pressable surface.
  - Added `explore-card-cta-contract.test.ts`.

- #4 Passive next-cut:
  - Removed board-entry next-cut auto-expansion.
  - Removed completion-toggle next-cut auto-expansion.
  - Kept explicit scene/cut route expansion, guarded as one-shot per board/scene/take key.
  - Added behavior/source coverage in `recipe-detail-board-state.test.ts`.

- #9 Shooting board:
  - Reworked expanded cut layout away from nested editor/reference/take boxes.
  - Added board-style copy/reference area, interactive checklist/progress, saved takes, and accessible preview controls.
  - Added `shoot-board-scene-card-design-contract.test.ts`.
  - Fixed saved-take hydration so explicit checklist edits are preserved after workspace-take hydration.

## Verification

PASS:

```bash
./node_modules/.bin/sucrase-node src/features/explore/lib/explore-card-cta-contract.test.ts
./node_modules/.bin/sucrase-node src/features/explore/lib/explore-template-copy-action.test.ts
./node_modules/.bin/sucrase-node src/features/explore/lib/explore-template-recipe-copy.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
git diff --check
```

`npx -y @google/design.md lint DESIGN.md` passed with 0 errors and existing unused-token warnings.

## QA Artifacts

- Report: `output/reports/20260516_issues_7_9_4_design_burn_down.md`
- #7 Android/iPhone: `output/playwright/issue-7-explore-qa-20260516/`
- #4 Android/iPhone: `output/playwright/issue-4-passive-next-cut-qa-20260516/`
- #9 Android/iPhone: `output/playwright/issue-9-board-qa-20260516/`

## Review

Used subagent-driven development with per-slice implementation, spec review, quality review, and final integration review. All blocking findings were addressed before final verification.

## Remaining Notes

- Existing raw `sucrase-node` tests that import `@/core/mocks/parrotkit-data` can still fail before assertions due alias resolution. The focused tests touched here avoid that by using source contracts or local fixtures.
- iPhone QA was captured in Expo Go through the underlying CoreSimulator `simctl` binary.
