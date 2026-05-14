# Sub-AC 8.4.1 Focused Local QA

## 배경

- Previous ParrotKit v1 navigation realignment follow-up left simulator UI QA blocked by local CoreSimulatorService access.
- This pass covers only the pending QA item: focused local QA or automated tests for previously fixed navigation and CTA flows.
- Seed language correction remains: primary floating CTA is `레시피 생성`, not Shoot/New Shoot/Start Shoot.

## 목표

- Re-run focused navigation and CTA contract checks.
- Attempt iPhone simulator availability check as the UI gate.
- Record evidence without changing product behavior.

## 범위

- Include root tab contract, global creation CTA, Home CTA/workflow routing, blank recipe creation, Explore routing/copy/start paths, saved take access/reload/storage, and prompter save state checks.
- Exclude web QA.
- Exclude unrelated refactors.
- Exclude commit, push, or merge.

## 변경 파일

- `plans/20260514_sub_ac_8_4_1_focused_local_qa.md`
- A new `context/context_20260514_sub_ac_8_4_1_focused_local_qa.md` summary after verification.

## 테스트

- Focused `sucrase-node` tests for navigation/CTA flow contracts.
- Focused `tsc --noEmit` configs matching those contracts.
- `xcrun simctl` availability check for iPhone simulator QA.

## 롤백

- Remove this plan and the generated context summary if the QA record needs to be discarded.
- No product-code rollback is expected because this is verification-only.

## 리스크

- iPhone simulator may remain unavailable in the sandbox, producing an environment blocker instead of live UI evidence.
- Direct `sucrase-node` checks may need the known temporary `@/...` alias shim for files importing path aliases.

## 결과

- Focused `sucrase-node` navigation/CTA regression checks passed.
- Focused `tsc --noEmit` navigation/CTA regression configs passed.
- Source-level audit found no user-facing `New Shoot`, `Start Shoot`, or `Start Shooting` hits outside tests and no Source/Recipes bottom-tab declarations.
- iPhone simulator QA remains blocked by CoreSimulatorService connection failure.
- Context: `context/context_20260514_sub_ac_8_4_1_focused_local_qa.md`
