# Sub-AC 7.1 Bottom Nav No Recipes Preserve My

## 배경
Previous ParrotKit v1 navigation realignment work removed broad prototype bottom tabs and kept the app focused on Home, Explore, and My. This follow-up is limited to the failed/pending item: ensure there is no Recipes bottom tab while preserving access to My.

## 목표
- Bottom navigation contract must not expose `recipes` as a visible tab.
- Bottom navigation contract must keep `my` as a visible tab.
- Preserve completed fixes from the previous Seed run.

## 범위
- Inspect the current root tab configuration and native tab shell.
- Add or tighten focused regression coverage if needed.
- Update context documentation with verification results.
- Do not perform web QA, broad refactors, commit, push, or merge.

## 변경 파일
- `plans/20260514_sub_ac_7_1_bottom_nav_no_recipes_preserve_my.md`
- `context/context_20260514_sub_ac_7_1_bottom_nav_no_recipes_preserve_my.md`
- Potentially `src/core/navigation/root-tab-config.test.ts`
- Potentially `src/core/navigation/root-tab-config.ts`

## 테스트
- Run focused root tab contract test.
- Run focused TypeScript check for root tab configuration.
- Attempt iPhone simulator availability check and record blocker if CoreSimulatorService remains unavailable.

## 롤백
- Remove this plan/context file.
- Revert any focused root tab config/test changes from this Sub-AC only.

## 리스크
- iPhone simulator remains the UI gate, but this environment may still block CoreSimulatorService.
- `src/app/(tabs)/recipes.tsx` may remain as a hidden route; the acceptance concern is visible bottom tab exposure, not route deletion.

## 결과
- Current production tab shell already satisfies this Sub-AC: `src/core/navigation/root-tab-config.ts` exposes `index`, `explore`, and `my` only.
- `src/core/navigation/root-native-tabs.tsx` renders `NativeTabs.Trigger` only by mapping `rootTabNames`, so `recipes` is not a visible bottom tab and `my` remains visible.
- `src/app/(tabs)/my.tsx` continues to export `ProfileScreen`, preserving My route access.
- Focused checks passed:
  - `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- iPhone simulator check failed because CoreSimulatorService is unavailable in this environment (`connection became invalid` / `Connection refused`).
- 연결 context: `context/context_20260514_sub_ac_7_1_bottom_nav_no_recipes_preserve_my.md`
