# Home Recipe Create Entry

## 배경

- AC 5 requires the recipe creation entry to be clearly available with the user-facing label `+ 레시피 만들기`.
- v1 should prioritize blank/shoot-board recipe creation over reference or import creation.
- Source/Recipes tabs are no longer top-level tabs, so Home needs an obvious creation path.

## 목표

- Add a clear Home entry point labeled `+ 레시피 만들기` in Korean.
- Route that entry to the blank/manual recipe creation flow.
- Keep reference and brand creation paths available but non-primary.

## 범위

- Home creation CTA copy and route contract.
- Recipe creation screen default mode if opened without an explicit mode.
- Focused local/type verification only.

## 변경 파일

- `src/features/home/components/home-workspace-surface.tsx`
- `src/features/home/lib/home-recipe-create-entry.ts`
- `src/features/home/lib/home-recipe-create-entry.test.ts`
- `src/features/recipes/screens/recipe-create-screen.tsx`
- `plans/20260514_home_recipe_create_entry.md`
- `context/context_20260514_home_recipe_create_entry.md`

## 테스트

- Add a focused test for the Home recipe creation entry label and destination.
- Run the focused test with the repo's available TypeScript execution tooling.
- Run a TypeScript check if it completes cleanly in the shared worktree.

## 롤백

- Remove the Home CTA helper/test and revert Home/create-screen copy/default changes.

## 리스크

- Shared worktree contains concurrent sibling changes, so edits must stay away from prompter/detail high-overlap files.
- Full app runtime QA may be limited if Expo dev server/manual browser testing is outside this AC execution window.

## 결과

- Home에 명확한 `+ 레시피 만들기` / `+ Create recipe` CTA를 추가했다.
- CTA는 `/recipe-create?mode=manual`로 이동해 blank/manual recipe creation을 먼저 연다.
- `/recipe-create`를 직접 열어도 기본 선택이 reference가 아니라 manual mode가 되도록 조정했다.
- 연결 context: `context/context_20260514_home_recipe_create_entry.md`
