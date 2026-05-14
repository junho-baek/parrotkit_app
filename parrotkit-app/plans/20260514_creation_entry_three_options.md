# Creation Entry Three Options

## 배경

- AC 6 requires the existing three creation options to remain available from the recipe creation entry.
- v1 prioritizes blank/manual shoot-board creation, but reference link and brand context must remain visible as Pro-locked options.
- Home now routes directly to `/recipe-create?mode=manual`, so the creation screen must still preserve all creation choices once opened.

## 목표

- Preserve the three creation modes from the creation entry: reference link, blank/manual recipe, and brand context.
- Keep manual/blank as the default and primary v1 option.
- Mark reference link and brand context as Pro-locked or coming-soon style non-main options.

## 범위

- Creation option contract and recipe creation screen copy/rendering.
- Focused verification for the creation option model.

## 변경 파일

- `src/features/recipes/lib/recipe-create-options.ts`
- `src/features/recipes/lib/recipe-create-options.test.ts`
- `src/features/recipes/screens/recipe-create-screen.tsx`
- `plans/20260514_creation_entry_three_options.md`
- `context/context_20260514_creation_entry_three_options.md`

## 테스트

- Add a focused contract test that fails until the three creation options are exported with the expected ordering/default/lock state.
- Run the focused test with `./node_modules/.bin/sucrase-node`.
- Run a focused TypeScript check if feasible in the shared worktree.

## 롤백

- Remove the creation option model/test and restore the creation screen to its previous local mode list/copy.

## 리스크

- `recipe-create-screen.tsx` is already modified by AC 5; keep edits focused to option metadata and lock badges.
- Sibling work is active in Explore, so avoid Explore files.

## 결과

- Added a creation option model that preserves all three entry options: blank/manual, reference link, and brand context.
- Blank/manual is first and remains the unlocked default v1 creation path.
- Reference link and brand context remain selectable/visible from the creation entry, with Pro lock labels and locked CTA icon/copy.
- 연결 context: `context/context_20260514_creation_entry_three_options.md`
