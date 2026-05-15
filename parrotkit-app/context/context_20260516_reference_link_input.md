# Context 2026-05-16 Reference Link Input

## 작업
Issue 6 Sub-AC 3.2.2: Paste drawer/window 안의 reference-link input field 계약을 명시하고, placeholder와 controlled input state를 보장했다.

## DESIGN.md 확인
- Recipe creation은 bottom drawer/modal sheet pattern을 유지해야 함을 확인했다.
- Preferred bottom navigation model은 Home, Explore, Paste, Recipes, My이며 Paste는 reference link를 recipe generation source로 쓰는 중심 액션임을 확인했다.
- box-in-box, redundant CTA, Shoot/New Shoot/Start Shoot/workflow/console/debug user-facing copy 금지 guardrail을 확인했다.

## 변경
- `src/features/recipes/lib/recipe-create-flow.ts`
  - `getRecipeCreateModeInputConfig`와 `RecipeCreateModeInputConfig`를 추가했다.
  - reference mode는 visible/editable URL input, link placeholder, controlled `referenceUrl` value를 반환한다.
  - manual mode는 input hidden, brand mode는 visible but non-editable empty value로 유지한다.
- `src/features/recipes/lib/recipe-create-flow.test.ts`
  - manual/reference/brand mode별 input 표시, placeholder, editable state, URL keyboard affordance, controlled value 계약을 추가했다.
- `src/features/recipes/screens/recipe-create-screen.tsx`
  - `ModeInput`을 `getRecipeCreateModeInputConfig`에 연결했다.
  - reference input에 placeholder 기반 accessibility label과 `recipe-create-reference-link-input` testID를 추가했다.
  - 기존 `referenceUrl` state와 `setReferenceUrl` controlled input wiring은 유지했다.

## 검증
- RED 확인: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - 기대대로 `getRecipeCreateModeInputConfig` missing export에서 실패했다.
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- PASS: `git diff --check -- src/features/recipes/lib/recipe-create-flow.ts src/features/recipes/lib/recipe-create-flow.test.ts src/features/recipes/screens/recipe-create-screen.tsx plans/20260516_reference_link_input.md`
- PASS: DESIGN.md source check
  - `rg -n 'Recipe creation must use the bottom drawer|Paste as the larger center action|Do not create box-in-box|Do not add redundant CTA|Avoid the word \`workflow\`' DESIGN.md`
  - `rg -n 'Paste|Bottom navigation|Recipe creation' DESIGN.md`
- PASS: 금지 copy 검색
  - `rg -n 'Shoot|New Shoot|Start Shoot|workflow|console|debug' src/features/recipes/screens/recipe-create-screen.tsx src/features/recipes/lib/recipe-create-flow.ts src/features/recipes/lib/recipe-create-flow.test.ts -S`
  - 결과 없음.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`
  - sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패했다 (`ENOTFOUND`).
  - repo-local `node_modules/.bin`에는 design lint binary가 없다.

## 리스크 / 후속
- 실제 iPhone/Android capture에서 keyboard interaction과 drawer height는 후속 simulator QA AC에서 확인해야 한다.
- shared worktree에 sibling-agent 변경이 많아 이번 subtask 파일만 분리 커밋하기 어렵다. Seed 제약상 QA screenshots/local plans는 커밋 대상에서 제외해야 한다.
