# 2026-05-16 Paste Drawer Link Validation

## 배경
Issue 6 Sub-AC 3.3.2는 Paste drawer에서 reference link 입력값에 대한 기본 client-side validation과 사용자에게 보이는 error/disabled 상태를 요구한다.

## 목표
Reference mode에서 비어 있거나 유효하지 않은 링크로 recipe board를 열 수 없게 하고, 유효하지 않은 값은 drawer 안에서 즉시 이해 가능한 오류 문구로 표시한다.

## 범위
- Reference link validation helper와 submit state 계약 확장
- Paste drawer input의 invalid/error visual state 및 copy 연결
- 기존 manual/brand mode 생성 흐름과 route/nav 동작은 변경하지 않음

## 변경 파일
- `src/features/recipes/lib/recipe-create-flow.ts`
- `src/features/recipes/lib/recipe-create-flow.test.ts`
- `src/features/recipes/screens/recipe-create-screen.tsx`
- `plans/20260516_paste_drawer_link_validation.md`
- `context/context_20260516_paste_drawer_link_validation.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- `git diff --check` on touched files
- DESIGN.md source check 및 금지 copy 검색

## 롤백
Validation helper, error copy/style wiring, 관련 테스트를 제거하고 기존 non-empty submit check로 되돌린다.

## 리스크
- URL validation이 지나치게 엄격하면 사용자가 붙여넣은 모바일 short link를 막을 수 있다. http/https URL 형식만 최소 조건으로 둔다.

## 결과
- `getRecipeCreateReferenceLinkValidationState`를 추가해 reference link를 `empty` / `invalid` / `valid`로 분류했다.
- `getRecipeCreateSubmitState`가 reference mode에서 http/https URL만 활성 상태로 판단하고 invalid 상태에는 `invalid-url` error contract를 반환하도록 했다.
- Paste drawer reference input에 invalid underline/icon 색상, inline error text, accessibility hint/alert, error testID를 연결했다.
- 빈 값은 CTA disabled만 유지하고, 잘못된 값은 사용자-facing error를 표시한다. manual/brand mode는 link error를 상속하지 않는다.

## 검증 결과
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- PASS: `git diff --check -- src/features/recipes/lib/recipe-create-flow.ts src/features/recipes/lib/recipe-create-flow.test.ts src/features/recipes/screens/recipe-create-screen.tsx plans/20260516_paste_drawer_link_validation.md`
- PASS: DESIGN.md source check
  - `rg -n "Recipe creation must use the bottom drawer|Paste as the larger center action|Paste is not a generic plus button|Do not create box-in-box|Do not add redundant CTA|Recipe drawer CTA" DESIGN.md`
- PASS: 금지 copy 검색
  - `rg -n "Shoot|New Shoot|Start Shoot|workflow|console|debug" src/features/recipes/screens/recipe-create-screen.tsx src/features/recipes/lib/recipe-create-flow.ts src/features/recipes/lib/recipe-create-flow.test.ts -S`
  - 결과 없음.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`
  - sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패했다 (`ENOTFOUND`).
  - 이전 Paste subtasks와 동일하게 repo-local lint binary가 없어 network 없는 실행이 불가능했다.
- 연결 context: `context/context_20260516_paste_drawer_link_validation.md`
