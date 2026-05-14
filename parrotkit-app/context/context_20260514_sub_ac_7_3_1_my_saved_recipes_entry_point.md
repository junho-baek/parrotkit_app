# Context 2026-05-14 Sub-AC 7.3.1 My Saved Recipes Entry Point

## 작업
Sub-AC 7.3.1: My 화면의 Saved Recipes entry point를 추가 또는 검증한다.

## 확인
- `src/features/profile/screens/profile-screen.tsx`는 My/Profile 화면에 localized Saved Recipes 섹션을 노출한다.
- Saved recipe row는 recipe detail destination과 start-filming destination을 모두 유지한다.
- My/Profile saved recipe list는 `getSavedTakeProfileAccessEntries()`의 shared access contract를 사용하며, 해당 contract는 `getSavedRecipeAccessEntries(recipes)`를 포함한다.
- Source와 Recipes는 visible bottom tab으로 재도입하지 않았다.
- primary floating CTA copy/route behavior는 변경하지 않았다.

## 변경
- Production UI code 변경 없음.
- Retry audit trail을 위해 이 context 문서를 추가했다.
- 기존 plan `plans/20260514_sub_ac_7_3_1_my_saved_recipes_entry_point.md`의 결과와 연결된다.

## 검증
- `./node_modules/.bin/sucrase-node src/features/profile/lib/my-saved-recipes-entry.test.ts` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.my-saved-recipes-entry-check.json` 통과.
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts` 통과.
- `xcrun simctl list devices booted` 실패:
  - CoreSimulatorService connection invalid / connection refused.
  - 이 환경에서는 iPhone simulator screenshot/tap evidence를 생성하지 못했다.

## 리스크
- Acceptance UI gate는 iPhone simulator지만 현재 실행 환경에서 CoreSimulatorService가 차단되어 live UI 확인은 불가했다.
- 판단 근거는 current source route contract와 focused TypeScript/runtime checks이다.

## Git
- Seed constraint에 따라 commit, push, merge를 수행하지 않았다.
