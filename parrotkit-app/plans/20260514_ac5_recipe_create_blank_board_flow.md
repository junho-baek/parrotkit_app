# AC 5 Recipe Create Blank Board Flow

## 배경

- Previous navigation realignment follow-up completed the bottom tab and CTA label changes.
- AC 5 remains focused on confirming the corrected `레시피 생성` CTA enters the existing manual blank recipe creation path and lands on a blank shoot-board.

## 목표

- Verify the primary creation CTA destination is the manual recipe creation route.
- Verify manual creation state reuses the blank/manual recipe flow.
- Verify the created recipe returns a recipe detail shoot-board destination with blank cut cards.

## 범위

- Focused contract tests and minimal implementation only if the current flow does not satisfy AC 5.
- iPhone simulator QA is the intended UI gate, but this environment may not expose CoreSimulatorService.

## 변경 파일

- `src/features/recipes/lib/blank-shoot-board-recipe.test.ts`
- `tsconfig.home-blank-shoot-board-recipe-check.json`
- `plans/20260514_ac5_recipe_create_blank_board_flow.md`
- `context/context_20260514_ac5_recipe_create_blank_board_flow.md`

## 테스트

- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/blank-shoot-board-recipe.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-blank-shoot-board-recipe-check.json`
- `xcrun simctl list devices available` to check whether simulator QA is available.

## 롤백

- Revert the AC 5 focused test/context/plan changes.
- If implementation is needed, revert only the minimal flow wiring change introduced for AC 5.

## 리스크

- This checkout has many sibling AC changes and untracked files; avoid broad edits.
- Simulator service may be unavailable in the sandbox, preventing live iPhone UI evidence.

## 결과

- Added a focused contract check to `src/features/recipes/lib/blank-shoot-board-recipe.test.ts`.
- The check ties the Korean primary floating CTA label to `레시피 생성`, confirms both floating CTA and Home entry use `/recipe-create?mode=manual`, confirms manual mode opens the unlocked blank creation state, and confirms the blank recipe factory returns `/recipe/{id}` with starter cut cards.
- No production code change was required because the existing AC 3/4/8 wiring already satisfied AC 5.
- Connected context: `context/context_20260514_ac5_recipe_create_blank_board_flow.md`.
