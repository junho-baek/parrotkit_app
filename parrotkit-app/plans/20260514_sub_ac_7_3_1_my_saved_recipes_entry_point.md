# Sub-AC 7.3.1 My Saved Recipes Entry Point

## 배경
Previous navigation realignment follow-up work removed Source and Recipes from the visible bottom tabs while preserving My as the profile/account surface. This task is limited to the pending Saved Recipes entry point on the My screen.

## 목표
- Add or verify the Saved Recipes entry point on the My/Profile screen.
- Preserve the visible bottom-tab contract as Home, Explore, My.
- Avoid changing the primary floating CTA language or route behavior.

## 범위
- Focused My/Profile Saved Recipes entry verification.
- Focused route/access contract validation.
- Local checks only; iPhone simulator availability will be recorded if blocked.

## 변경 파일
- `plans/20260514_sub_ac_7_3_1_my_saved_recipes_entry_point.md`
- `context/context_20260514_sub_ac_7_3_1_my_saved_recipes_entry_point.md`
- `src/features/profile/lib/my-saved-recipes-entry.test.ts`
- `tsconfig.my-saved-recipes-entry-check.json`

## 테스트
- Run the focused My Saved Recipes entry contract test.
- Run focused TypeScript validation for the My/Profile saved recipes surface.
- Run the existing root-tab contract check to confirm Source and Recipes were not reintroduced.
- Attempt iPhone simulator availability check and record blocker if CoreSimulatorService remains unavailable.

## 롤백
- Remove this plan/context file.
- Remove the focused My Saved Recipes entry contract test and tsconfig.

## 리스크
- The iPhone simulator is the UI gate, but this environment may continue to block CoreSimulatorService.
- This AC should not alter recipe listing architecture if the existing My/Profile surface already exposes Saved Recipes.

## 결과
- My/Profile 화면은 기존 Saved Recipes 섹션을 이미 노출하고 있으며, saved recipe row의 detail entry와 start-filming entry를 유지한다.
- Production UI code 변경 없이 focused contract coverage만 추가했다.
- Source와 Recipes는 visible bottom tab으로 재도입하지 않았다.
- Primary floating CTA copy/route behavior는 변경하지 않았다.
- Focused checks passed:
  - `./node_modules/.bin/sucrase-node src/features/profile/lib/my-saved-recipes-entry.test.ts`
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.my-saved-recipes-entry-check.json`
  - `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- iPhone simulator check failed because CoreSimulatorService is unavailable in this environment (`connection became invalid` / `Connection refused`).
- 연결 context: `context/context_20260514_sub_ac_7_3_1_my_saved_recipes_entry_point.md`
