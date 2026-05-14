# Sub-AC 4 Navigation Regression QA

## 배경

- Follow-up Seed task is limited to failed/pending ParrotKit v1 navigation realignment items.
- Sub-AC 4 requires a focused regression QA pass over the previously realigned navigation paths.
- Web QA is out of scope; iPhone simulator is the intended UI gate.

## 목표

- Re-verify the realigned navigation contracts that replaced Source/Recipes bottom tabs with Home/Explore/My.
- Re-verify the corrected primary creation CTA copy and route: `레시피 생성` -> `/recipe-create?mode=manual`.
- Re-verify Home, Explore copy/start, saved recipe/take, and prompter return paths covered by the prior failed/pending follow-up fixes.
- Record simulator availability, command evidence, failures, and residual risk.

## 범위

- QA/documentation only unless a focused regression fails and requires a minimal fix.
- No web QA.
- No commit, push, or merge.
- Preserve completed fixes from earlier Seed passes.

## 변경 파일

- `plans/20260514_sub_ac_4_navigation_regression_qa.md`
- `context/context_20260514_sub_ac_4_navigation_regression_qa.md`

## 테스트

- iPhone simulator availability probe with `xcrun simctl`.
- Focused sucrase contract checks for root tabs, global CTA, Home routes, recipe creation, saved access, Explore copy/start, and prompter/saved-take return flows.
- Focused TypeScript checks for the same navigation surfaces.

## 롤백

- Remove this plan/context if the QA-only follow-up run is discarded.

## 리스크

- Simulator UI evidence may remain blocked if CoreSimulatorService is unavailable in the sandbox.
- Existing sibling Seed changes are uncommitted; this pass must not revert or overwrite them.

## 결과

- Completed a focused regression QA pass over root tabs, global floating CTA, Home primary/blank creation paths, Explore copy/start paths, saved recipe/take access paths, and prompter saved-take return flows.
- No product-code regressions were found.
- iPhone simulator UI evidence remains blocked because `xcrun simctl` cannot connect to CoreSimulatorService in this sandbox.
- Context: `context/context_20260514_sub_ac_4_navigation_regression_qa.md`.

## 검증

- Focused sucrase checks passed for root tabs, global CTA, Home CTA/create/list/workflow, Explore routing/copy/start, saved-take storage/reload/access, and prompter saved-take state.
- Focused TypeScript checks passed for the related `tsconfig.*check.json` files.
- Direct sucrase checks that import `@/...` needed the known temporary alias shim at `/tmp/parrotkit-su-alias`.
