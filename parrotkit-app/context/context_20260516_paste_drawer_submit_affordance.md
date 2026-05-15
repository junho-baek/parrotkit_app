# Context 2026-05-16 Paste Drawer Submit Affordance

## 작업
Issue 6 Sub-AC 3.3.1: Paste drawer/window에서 reference link를 입력한 뒤 recipe creation을 시작하는 primary CTA affordance를 명시했다.

## DESIGN.md 확인
- Recipe creation drawer는 bottom drawer/modal sheet pattern을 유지해야 함을 확인했다.
- Preferred v1 bottom navigation model에서 `Paste`는 larger center action이고 reference link를 recipe generation source로 쓰는 액션임을 확인했다.
- Recipe drawer CTA copy는 English `Open recipe board`, Korean `레시피 보드 열기`를 유지해야 함을 확인했다.
- box-in-box, redundant CTA, Shoot/New Shoot/Start Shoot/workflow/console/debug user-facing copy 금지 guardrail을 확인했다.

## 변경
- `src/features/recipes/lib/recipe-create-flow.ts`
  - `getRecipeCreateSubmitState`와 `RecipeCreateSubmitState`를 추가했다.
  - reference mode는 trimmed `referenceUrl`이 있을 때만 `enabled: true`를 반환한다.
  - manual/brand mode는 기존 creation 흐름을 유지하기 위해 항상 enabled로 둔다.
- `src/features/recipes/lib/recipe-create-flow.test.ts`
  - 빈 reference link에서는 Paste creation CTA가 비활성화되고, 링크 입력 후 활성화되는 계약을 추가했다.
  - manual creation은 reference link 없이도 CTA가 활성화되는 회귀 검증을 추가했다.
- `src/features/recipes/screens/recipe-create-screen.tsx`
  - submit state를 primary CTA에 연결해 disabled/accessibility state를 노출했다.
  - disabled 상태에서 press handler가 recipe draft를 만들지 않도록 guard를 추가했다.
  - primary CTA에 `recipe-create-primary-action` testID를 추가했다.

## 검증
- RED 확인: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - 기대대로 `getRecipeCreateSubmitState` missing export에서 실패했다.
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- PASS: `git diff --check -- src/features/recipes/lib/recipe-create-flow.ts src/features/recipes/lib/recipe-create-flow.test.ts src/features/recipes/screens/recipe-create-screen.tsx plans/20260516_paste_drawer_submit_affordance.md`
- PASS: DESIGN.md source check
  - `rg -n "Recipe creation must use the bottom drawer|Paste as the larger center action|Paste is not a generic plus button|Do not create box-in-box|Do not add redundant CTA|Recipe drawer CTA" DESIGN.md`
- PASS: 금지 copy 검색
  - `rg -n "Shoot|New Shoot|Start Shoot|workflow|console|debug" src/features/recipes/screens/recipe-create-screen.tsx src/features/recipes/lib/recipe-create-flow.ts -S`
  - 결과 없음.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`
  - sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패했다 (`ENOTFOUND`).
  - repo-local `package.json`/`node_modules/.bin`에는 DESIGN.md lint script/binary가 없다.

## 리스크 / 후속
- 실제 iPhone/Android capture에서 keyboard interaction과 disabled CTA rendering은 후속 simulator QA AC에서 확인해야 한다.
- shared worktree에 sibling-agent 변경이 많아 이번 subtask 파일만 분리 커밋하기 어렵다. Seed 제약상 QA screenshots/local plans는 커밋 대상에서 제외해야 한다.
