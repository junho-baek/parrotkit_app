# Context 2026-05-16 Paste Drawer Link Validation

## 작업
Issue 6 Sub-AC 3.3.2: Paste drawer/window에서 reference link의 기본 client-side validation과 사용자-facing error/disabled state를 구현했다.

## DESIGN.md 확인
- Recipe creation은 bottom drawer/modal sheet pattern을 유지해야 함을 확인했다.
- Preferred v1 bottom navigation model에서 `Paste`는 larger center action이고 reference link를 recipe generation source로 쓰는 액션임을 확인했다.
- Drawer는 one primary CTA를 유지해야 하며 box-in-box와 redundant CTA를 피해야 함을 확인했다.
- `Shoot`, `New Shoot`, `Start Shoot`, `workflow`, `console`, `debug` user-facing copy 금지 guardrail을 확인했다.

## 변경
- `src/features/recipes/lib/recipe-create-flow.ts`
  - `getRecipeCreateReferenceLinkValidationState`와 `RecipeCreateReferenceLinkValidationState`를 추가했다.
  - Reference link는 trimmed 값이 비어 있으면 `empty`, http/https URL이면 `valid`, 그 외는 `invalid`로 분류한다.
  - `getRecipeCreateSubmitState`가 reference mode에서 valid URL일 때만 enabled를 반환하고 invalid 값에는 `referenceLinkError: "invalid-url"`를 반환하도록 확장했다.
- `src/features/recipes/lib/recipe-create-flow.test.ts`
  - empty/plain text/ftp/http(s) validation 계약을 추가했다.
  - empty reference는 disabled without error, invalid reference는 disabled with error, valid reference는 enabled without error로 검증했다.
  - manual mode가 Paste link error를 상속하지 않는 회귀 검증을 추가했다.
- `src/features/recipes/screens/recipe-create-screen.tsx`
  - Paste drawer reference input에 error underline/icon 색상, inline error text, accessibility hint/alert, `recipe-create-reference-link-error` testID를 연결했다.
  - Invalid link copy는 English/Korean 모두 http/https 시작 링크를 안내한다.

## 검증
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
  - repo-local lint binary가 없어 network 없는 DESIGN.md lint 실행이 불가능했다.

## 리스크 / 후속
- 현재 validation은 http/https URL만 허용한다. Scheme 없는 `tiktok.com/...` 입력을 허용하려면 별도 URL normalization 정책이 필요하다.
- 실제 iPhone/Android capture에서 keyboard/error layout은 후속 simulator QA AC에서 확인해야 한다.
