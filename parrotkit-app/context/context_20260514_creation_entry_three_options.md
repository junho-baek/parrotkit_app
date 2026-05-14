# Creation Entry Three Options

## 작업 시간

- 2026-05-14

## 범위

- AC 6: Existing three creation options remain available from creation entry.
- v1 기본 흐름은 빈 레시피/직접 만들기를 우선하되, 레퍼런스 링크와 브랜드 컨텍스트는 Pro 잠금 옵션으로 계속 노출한다.

## 변경 요약

- Added `src/features/recipes/lib/recipe-create-options.ts`.
  - Creation options are now modeled as `manual`, `reference`, and `brand`.
  - `manual` is the first/default unlocked option.
  - `reference` and `brand` are visible but `isProLocked`.
- Added `src/features/recipes/lib/recipe-create-options.test.ts`.
  - Verifies the three-option contract, ordering/default behavior, and Pro lock state.
- Added `tsconfig.recipe-create-options-check.json` for focused verification while the shared worktree has sibling AC files in progress.
- Updated `src/features/recipes/screens/recipe-create-screen.tsx`.
  - Renders the modeled option list from the creation entry.
  - Shows `Pro locked` / `Pro 잠금` badges for reference link and brand brief options.
  - Keeps locked options selectable so users can inspect them, while the CTA clearly shows lock state.

## 검증

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts`
  - Failed before implementation because `recipe-create-options` did not exist.
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts`
  - Passed.
- Focused TypeScript: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
  - Passed.
- Broad TypeScript: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - Blocked by sibling Explore work: `src/features/explore/lib/explore-template-copy-action.test.ts` imports a not-yet-present `./explore-template-copy-action`.

## 리스크 / 후속

- This was a focused code/type verification pass, not headed Expo runtime QA.
- The shared worktree remains dirty with concurrent sibling AC edits; do not commit this AC in isolation without coordinating the aggregate change set.
