# Context 2026-05-14 AC 5 Recipe Create Blank Board Flow

## 작업

- ParrotKit v1 navigation realignment follow-up AC 5.
- Scope stayed limited to confirming the corrected `레시피 생성` CTA reuses the existing manual blank recipe creation flow and opens a blank shoot-board.

## 변경

- `src/features/recipes/lib/blank-shoot-board-recipe.test.ts`
  - Added focused contract coverage that:
    - Korean primary floating CTA label remains `레시피 생성`.
    - Floating CTA destination is `/recipe-create?mode=manual`.
    - Home recipe creation entry shares the same manual destination.
    - Manual recipe creation route resolves to unlocked manual state.
    - Blank recipe creation returns `/recipe/{recipeId}` and includes editable starter cut cards.
- `plans/20260514_ac5_recipe_create_blank_board_flow.md`
  - Added the task plan and result.

## 검증

- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/blank-shoot-board-recipe.test.ts`
  - Passed.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-blank-shoot-board-recipe-check.json`
  - Passed.
- Copy search:
  - `rg -n "New Shoot|Start Shoot|Start shooting|Shoot CTA|새 빈 슛보드|빈 슛보드|\+ 빈 슛보드" src/core/navigation src/features/home src/features/recipes/lib/blank-shoot-board-recipe.test.ts src/features/recipes/screens/recipe-create-screen.tsx`
  - No forbidden English primary CTA wording found.
  - Existing Korean explanatory `빈 슛보드` copy remains only in locked guidance body text, not the primary blank creation CTA label.

## Simulator QA

- Attempted: `xcrun simctl list devices available`
- Result: failed with CoreSimulatorService connection invalid / connection refused.
- iPhone simulator UI QA could not be completed from this sandbox; no web QA was run.

## 참고

- Did not reintroduce Source or Recipes as bottom tabs.
- Did not commit, push, or merge.
