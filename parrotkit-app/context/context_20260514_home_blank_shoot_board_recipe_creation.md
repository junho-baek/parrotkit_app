# Home Blank Shoot-board Recipe Creation

## 작업 시간

- 2026-05-14

## 범위

- AC 8: A user can create a blank/shoot-board recipe from Home.
- Home CTA에서 manual creation 화면을 거쳐 local/mock 레시피와 컷보드를 생성하고 해당 레시피 화면으로 이동하는 흐름.

## 변경 요약

- Added `src/features/recipes/lib/blank-shoot-board-recipe.ts`.
  - Local/mock owned recipe factory.
  - Source URL is empty, shoot status starts as `continue`, and starter scenes map to Hook/Proof/CTA cut-card-ready data.
  - Returns `/recipe/{recipeId}` as the shoot-board destination.
- Added `src/features/recipes/lib/blank-shoot-board-recipe.test.ts`.
  - Verifies id/title preservation, local owned/no-source scope, unshot state, starter cuts, line/action-ready fields, and destination.
- Updated `src/core/providers/mock-workspace-provider.tsx`.
  - Added `createBlankShootBoardRecipe`.
  - Stores the new recipe in local mock state and stores an initialized editor shoot-board using `createShootBoardRecipe(normalizeNativeRecipe(...))`.
- Updated `src/features/recipes/screens/recipe-create-screen.tsx`.
  - Manual mode now has a recipe title input.
  - Manual CTA creates the blank recipe and `router.replace`s into the recipe cut-board route.
  - Pro-locked reference/brand modes remain visible but do not create a recipe from the CTA.
- Added `tsconfig.home-blank-shoot-board-recipe-check.json` for focused verification.

## 검증

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/blank-shoot-board-recipe.test.ts`
  - Initially failed because `blank-shoot-board-recipe` did not exist.
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/blank-shoot-board-recipe.test.ts`
  - Passed.
- Focused TypeScript: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-blank-shoot-board-recipe-check.json`
  - Passed.

## 리스크 / 후속

- This was a focused code/type verification pass, not a headed Expo runtime QA pass.
- Broad commit/push was not performed because this shared worktree contains many sibling AC changes and untracked files.
