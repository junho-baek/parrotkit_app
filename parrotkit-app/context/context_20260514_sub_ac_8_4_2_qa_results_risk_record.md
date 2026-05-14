# Context 2026-05-14 Sub-AC 8.4.2 QA Results and Regression Risk Record

## 작업

- Follow-up Seed Sub-AC 8.4.2.
- Scope: record QA results and any remaining regression risk after Sub-AC 8.4.1.
- Time: 2026-05-14 17:02:18 KST.
- Constraint: no product-code changes, no web QA, no commit, push, or merge.

## QA 결과 요약

- Source record: `context/context_20260514_sub_ac_8_4_1_focused_local_qa.md`.
- Focused `sucrase-node` navigation/CTA regression checks passed for root tabs, global create CTA, Home creation/workflow paths, Explore template copy/start paths, saved take access/reload/storage, and prompter save state.
- Focused `tsc --noEmit` contract configs passed for root tabs, global create CTA, Home CTA/blank recipe/recent workflow/owned recipe paths, saved take contracts, Explore detail routing, prompter mode/full-script display, and recipe creation options.
- Source-level audit confirmed:
  - root bottom tabs remain `index`, `explore`, and `my`;
  - Source/Recipes were not reintroduced as bottom tabs;
  - Korean global floating CTA remains `레시피 생성`;
  - global floating CTA still routes to `/recipe-create?mode=manual`;
  - no user-facing source hits for `New Shoot`, `Start Shoot`, or `Start Shooting` outside tests.
- Web QA was not run, matching the Seed scope.

## Remaining Regression Risk

- Live iPhone simulator UI QA is still not complete because `xcrun simctl list devices available` failed in this sandbox with CoreSimulatorService unavailable (`CoreSimulatorService connection became invalid`, `Connection refused`, `Unable to locate device set`).
- The remaining risk is visual/runtime-only: bottom tab layout, floating CTA placement, and modal transition behavior still need confirmation in an environment where an iPhone simulator can start.
- Automated tests and source audits cover the route/copy contracts, so no known product-code regression remains from the focused local QA pass.
- A remaining `Start Shooting` string exists only in `src/features/recipes/lib/shoot-board-model.test.ts` assertion text and is not user-facing UI copy.

## 결과

- QA results and remaining regression risk are now recorded for Sub-AC 8.4.2.
- No app source files were changed.
- No commit, push, merge, Notion upload, or web QA was performed.
