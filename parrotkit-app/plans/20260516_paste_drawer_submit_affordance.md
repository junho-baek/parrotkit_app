# 2026-05-16 Paste Drawer Submit Affordance

## 배경
Issue 6 Sub-AC 3.3.1은 중심 Paste 액션으로 열린 drawer/window에서 reference link를 입력하고 그 링크로 recipe creation을 시작하는 명확한 UI affordance를 요구한다.

## 목표
Paste drawer reference mode에서 링크 입력값이 비어 있으면 생성 CTA가 비활성화되고, 링크를 입력하면 primary CTA로 recipe creation을 시작할 수 있게 한다.

## 범위
- Reference mode submit 가능 여부를 작은 helper와 타입 체크로 고정한다.
- Recipe creation drawer primary CTA에 disabled/accessibility/testID affordance를 연결한다.
- 기존 5-slot nav, route mapping, saved recipe route 동작은 건드리지 않는다.

## 변경 파일
- `src/features/recipes/lib/recipe-create-flow.ts`
- `src/features/recipes/lib/recipe-create-flow.test.ts`
- `src/features/recipes/screens/recipe-create-screen.tsx`
- `plans/20260516_paste_drawer_submit_affordance.md`
- `context/context_20260516_paste_drawer_submit_affordance.md`

## 테스트
- RED: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- DESIGN.md source check 및 금지 copy 검색

## 롤백
Submit-state helper와 CTA disabled/testID wiring을 제거하고 기존 항상 활성화된 primary CTA 동작으로 되돌린다.

## 리스크
- Route modal과 nav-owned Paste drawer가 같은 화면을 공유하므로 manual/brand mode submit 동작이 바뀌지 않아야 한다.

## 결과
- `getRecipeCreateSubmitState`를 추가해 reference mode는 trimmed reference link가 있을 때만 primary CTA를 활성화하도록 했다.
- `RecipeCreateScreen` primary CTA에 disabled/accessibility state와 `recipe-create-primary-action` testID를 연결했다.
- disabled 상태에서는 press handler가 recipe draft를 만들지 않도록 guard를 추가했다.
- manual/brand mode는 기존처럼 reference link 없이 CTA가 활성화되도록 유지했다.

## 검증 결과
- RED 확인: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`가 `getRecipeCreateSubmitState` missing export로 실패했다.
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- PASS: `git diff --check -- src/features/recipes/lib/recipe-create-flow.ts src/features/recipes/lib/recipe-create-flow.test.ts src/features/recipes/screens/recipe-create-screen.tsx plans/20260516_paste_drawer_submit_affordance.md`
- PASS: DESIGN.md source check 및 금지 copy 검색. 새 user-facing `Shoot`, `New Shoot`, `Start Shoot`, `workflow`, `console`, `debug` copy 없음.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`는 sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패했다 (`ENOTFOUND`). repo-local `package.json`/`node_modules/.bin`에도 DESIGN.md lint script/binary가 없다.
- 연결 context: `context/context_20260516_paste_drawer_submit_affordance.md`
