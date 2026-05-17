# Issue #21 Mobile Analysis UX QA Plan

> Superpowers execution mode: use `superpowers:subagent-driven-development` with an isolated worktree. Explorers map the QA flows and native launch/capture path; the coordinator executes the final device captures and integration.

## 배경

#20 connected `shooting_board_projection` to the compact Shooting Board data model. #21 now needs native Android and iOS QA evidence for analysis-generated recipe states and the execution board. The important product boundary is still: Board is compact and execution-first; Breakdown owns deep Sandcastle-style analysis labels.

## 목표

- Capture Android Emulator and iOS Simulator evidence for ready Breakdown, compact Board, partial analysis state, failed/retry state, and reference viewer.
- Confirm Board does not expose internal pipeline labels or AI-slop labels.
- Confirm Reference viewer remains discoverable and 9:16-oriented from board cuts.
- Save QA screenshots/reports under `output/playwright/` and `output/reports/`.
- Update context and GitHub issue #21 with concise results and links.

## 범위

- Native QA and small test-fixture/source-contract changes only if needed to make partial/failed states reachable.
- Recipe detail / Shooting Board / Breakdown / Reference Viewer flows.
- Android Emulator and iOS Simulator capture attempts.

Out of scope:

- Provider adapter implementation (#19).
- Supabase schema or server analysis execution.
- Real camera recording on physical device.
- Notion upload.

## 변경 파일

Expected:

- Create: `output/reports/20260517_issue_21_mobile_analysis_qa.md`
- Create: `output/playwright/issue-21-mobile-analysis-qa-20260517/*`
- Modify or create: `context/context_20260517_issue_21_mobile_analysis_qa.md`
- Modify: `plans/20260517_issue_21_mobile_analysis_qa.md`

Possible if QA access needs a fixture:

- Test/fixture files under `src/core/mocks/` or `src/features/recipes/`
- Source-contract tests for partial/failed state labels

Implementation slice for current task:

- Modify: `src/features/recipes/lib/recipe-breakdown-summary.ts`
- Modify: `src/features/recipes/lib/recipe-breakdown-summary.test.ts`
- Modify: `src/features/recipes/components/recipe-breakdown-panel.tsx`
- Avoid native capture/report files for this app-visible support pass.

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node <changed contract tests>`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `git diff --check`
- Android Emulator screenshots saved under `output/playwright/issue-21-mobile-analysis-qa-20260517/`
- iOS Simulator screenshots saved under `output/playwright/issue-21-mobile-analysis-qa-20260517/`

`npm run build` is not required unless a build-only failure appears.

## 롤백

- Revert the final #21 commit to remove QA report/context/fixture changes.
- QA screenshots are additive artifacts; if a capture is wrong, replace only that artifact and update the report.

## 리스크

- iOS Simulator has previously timed out on this machine; if it fails again, record the exact command/error and do not reuse stale screenshots.
- Expo dev-client/native install may take time. If a device already has the app installed, prefer opening the existing app and deep link.
- Partial/failed analysis states may not yet be user-reachable without a fixture. If so, add the smallest mock/state switch needed and cover it with a source-contract test.
- Screenshots must show the actual execution screen, not the home screen.

## Task 1: QA Flow Map

- [x] Use subagent findings to list exact target routes/deep links for:
  - compact Shooting Board
  - ready Breakdown
  - partial analysis state
  - failed/retry state
  - reference viewer
  - My Take/take state if reachable
- [x] Identify any missing fixture or UI state required for partial/failed capture.

## Task 2: Native Launch And Capture Setup

- [x] Confirm Android device/emulator availability.
- [x] Confirm iOS Simulator availability.
- [x] Start Metro/dev client if needed.
- [x] Document exact launch and screenshot commands.

## Task 3: Capture Board/Breakdown/Reference UX

- [ ] Capture Android compact board.
- [ ] Capture Android ready Breakdown.
- [ ] Capture Android reference viewer.
- [ ] Capture Android partial analysis state.
- [ ] Capture Android failed/retry state.
- [x] Capture iOS compact board.
- [x] Capture iOS ready Breakdown.
- [x] Capture iOS reference viewer.
- [x] Capture iOS partial analysis state.
- [x] Capture iOS failed/retry state.

## Task 4: Report And Context

- [x] Create Markdown report with test time, target app/build, scope, results, risks, screenshots, and next action.
- [x] Update context with final QA summary and blockers.
- [x] Comment on #21 with the report summary.

## Task 5: Finish

- [x] Run applicable TypeScript/architecture/diff checks.
- [ ] Commit and push branch.
- [ ] Open/merge PR to `main` if verification is acceptable.
- [ ] Close #21 only if Android and iOS evidence are both captured or an explicit blocker is documented and accepted.

## Implementation Result: Partial/Failed Breakdown State Support

- [x] Added app-facing partial/failed analysis state derivation to Breakdown summary helpers.
- [x] Rendered the derived state as a compact card inside `RecipeBreakdownPanel`.
- [x] Kept Board execution-first; no Board UI changes.
- [x] Avoided recipe detail screen, mocks, native capture, and report files.

Context: `context/context_20260517_issue_21_partial_failed_analysis_state.md`

## Implementation Result: Mobile QA And Merge Prep

- [x] Added `boardTab=breakdown` QA deep-link support and protected it from board-state initialization reset.
- [x] Added `analysisQaState=partial|failed` QA state support for recipe detail.
- [x] Captured iOS Simulator evidence for Board, ready Breakdown, Reference viewer, partial Breakdown, and failed/retry Breakdown.
- [x] Retried Android Emulator with `Pixel_9`; capture is blocked by emulator-level `adb protocol fault` and `QEMU2 main loop` hang before ADB device attachment.
- [x] Verification passed: focused Breakdown tests, full TypeScript check, architecture boundary check, and `git diff --check`.

Report: `output/reports/20260517_issue_21_mobile_analysis_qa.md`
Context: `context/context_20260517_issue_21_mobile_analysis_qa.md`
