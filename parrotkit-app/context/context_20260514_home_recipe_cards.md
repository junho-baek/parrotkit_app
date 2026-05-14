# Home Recipe Cards

## 작업 시간

- 2026-05-14

## 범위

- AC 4: Home shows the user's recipes as cards rather than duplicate lists.
- Local/mock-only Home recipe presentation.

## 변경 요약

- Updated `src/features/home/components/home-workspace-surface.tsx`.
- Replaced the previous duplicate recipe presentation:
  - removed the horizontal quick-start recipe rail
  - removed the separate recent recipe row list
- Added one `내 레시피` / `My recipes` section backed by the existing local/mock `recipes` array.
- Added `HomeRecipeCard` cards that show:
  - recipe thumbnail
  - recipe status badge
  - recipe title
  - shot progress
  - progress bar
  - scene count
  - latest saved/shot activity
- Kept card navigation on the existing recipe/cut-board route via `getShootBoardHref(recipe.id)`.
- Preserved the existing continue panel, recipe creation CTA, saved-take entry point, and `/recipes` route access.

## 검증

- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - Passed.

## 리스크 / 후속

- This worktree still contains concurrent sibling AC changes; this AC only changed Home recipe card presentation plus its plan/context files.
- Runtime visual QA was not run in Expo for this isolated AC.

## 연결된 plan

- `plans/20260514_home_recipe_cards.md`
