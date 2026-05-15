# 2026-05-16 Reference Link Input

## 배경
Issue 6 Sub-AC 3.2.2는 중심 Paste drawer/window 안에 reference-link 입력 필드가 명확히 보이고, placeholder와 controlled input state를 가져야 한다.

## 목표
Paste drawer가 reference mode로 열릴 때 링크 입력 affordance를 표시하고, 입력값이 React state로 유지되어 recipe draft 생성에 전달되도록 보장한다.

## 범위
- Reference mode input의 placeholder/value/editable 계약을 테스트로 고정한다.
- `RecipeCreateScreen`의 mode input 렌더링을 명시적인 config helper에 연결한다.
- 기존 drawer shell, nav route mapping, saved recipes/my routes는 건드리지 않는다.

## 변경 파일
- `src/features/recipes/lib/recipe-create-flow.ts`
- `src/features/recipes/lib/recipe-create-flow.test.ts`
- `src/features/recipes/screens/recipe-create-screen.tsx`
- `plans/20260516_reference_link_input.md`
- `context/context_20260516_reference_link_input.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- DESIGN.md 관련 문구 및 금지 copy 검색

## 롤백
`RecipeCreateScreen`의 `ModeInput`을 이전 inline mode 조건으로 되돌리고, reference input config helper와 테스트를 제거한다.

## 리스크
- `RecipeCreateScreen`은 route modal과 nav-owned drawer가 공유하므로, helper 변경이 manual/brand mode 입력 상태를 깨지 않아야 한다.

## 결과
- `getRecipeCreateModeInputConfig`를 추가해 manual/reference/brand mode별 input 표시, placeholder, editable, keyboard/input mode, controlled value 계약을 명시했다.
- `RecipeCreateScreen`의 drawer input을 해당 config에 연결하고 reference mode input에 accessibility label과 `recipe-create-reference-link-input` testID를 추가했다.
- reference mode는 `referenceUrl` state 값을 그대로 controlled value로 사용하고, `onChangeText={setReferenceUrl}`로 입력을 유지한다.

## 검증 결과
- RED 확인: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`가 `getRecipeCreateModeInputConfig` missing export로 실패했다.
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- PASS: `git diff --check -- src/features/recipes/lib/recipe-create-flow.ts src/features/recipes/lib/recipe-create-flow.test.ts src/features/recipes/screens/recipe-create-screen.tsx plans/20260516_reference_link_input.md`
- PASS: DESIGN.md source check 및 금지 copy 검색. 새 user-facing `Shoot`, `New Shoot`, `Start Shoot`, `workflow`, `console`, `debug` copy 없음.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`는 sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패했다 (`ENOTFOUND`). repo-local `node_modules/.bin`에도 design lint binary가 없다.
- 연결 context: `context/context_20260516_reference_link_input.md`
