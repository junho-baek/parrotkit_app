# 2026-05-17 Issue #21 Mobile Analysis UX QA

## Summary

Implemented repeatable mobile QA support for analysis-generated recipe states and captured iOS evidence for the core recipe execution screens. The branch uses the Superpowers subagent-driven worktree flow from `codex/issue-21-mobile-analysis-qa`.

## What Changed

- `RecipeDetailScreen` now accepts `boardTab=board|breakdown` so QA can open the Breakdown sub-tab directly.
- `RecipeDetailScreen` now accepts `analysisQaState=partial|failed` to exercise degraded analysis states against the existing mock recipe.
- Breakdown summary helpers derive a client-facing partial/failed state from `reference_analysis_job`.
- `RecipeBreakdownPanel` renders the partial/failed state above Sandcastle-style sections.
- Source-contract tests now protect the Breakdown labels and the Board/Breakdown deep-link reset behavior.

## QA Evidence

iOS Simulator screenshots:

- `output/playwright/issue-21-mobile-analysis-qa-20260517/ios-01-board.png`
- `output/playwright/issue-21-mobile-analysis-qa-20260517/ios-02-breakdown-ready.png`
- `output/playwright/issue-21-mobile-analysis-qa-20260517/ios-03-reference-viewer.png`
- `output/playwright/issue-21-mobile-analysis-qa-20260517/ios-04-partial.png`
- `output/playwright/issue-21-mobile-analysis-qa-20260517/ios-05-failed.png`

Report:

- `output/reports/20260517_issue_21_mobile_analysis_qa.md`

## Android Blocker

Android capture was attempted on the local `Pixel_9` AVD after restarting ADB. The emulator emitted `adb protocol fault (couldn't read status length)` and `detected a hanging thread 'QEMU2 main loop'`, then never appeared in `adb devices -l`.

No Android screenshot was produced. This should keep GitHub issue #21 open until Android evidence can be captured with a healthy emulator or physical device.

## Verification

Passed:

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `git diff --check`

## GitHub

- #21 received the QA summary: https://github.com/junho-baek/parrotkit_app/issues/21#issuecomment-4470890306
- #21 should remain open because Android capture is blocked.
