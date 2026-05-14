# Brand Context Pro Badge

## 작업 시간

- 2026-05-14

## 범위

- Sub-AC 7.2: Add Pro badge/locked visual state to the Brand context option in the relevant Home/shoot-board creation UI.
- Targeted the recipe creation sheet/screen reached from Home `+ 레시피 만들기`.

## 변경 요약

- Updated `src/features/recipes/lib/recipe-create-options.ts`.
  - Added explicit `displayName: "Brand context"` metadata for the Brand option.
  - Kept the Brand option visible, Pro-locked, and marked with `proBadgeLabel: "Pro"`.
- Updated `src/features/recipes/lib/recipe-create-options.test.ts`.
  - Added focused assertions for the Brand context Pro badge and user-facing identity.
- Updated `src/features/recipes/screens/recipe-create-screen.tsx`.
  - Changed visible Brand option title from `Brand brief` to `Brand context`.
  - Changed Korean title from `브랜드 브리프` to `브랜드 컨텍스트`.
  - Reused the existing distinct `Pro` badge and lock-state pill rendering.

## 검증

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts`
  - Failed with `Brand option must identify itself as the user-facing Brand context option.`
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts`
  - Passed.
- Focused TypeScript: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
  - First run reported a transient sibling-state provider error around `BlankShootBoardRecipeDraft.board`; the file then reflected the integrated `createShootBoardRecipe(draft.recipe, { isSaved: true })` path.
  - Re-run passed.

## 리스크 / 후속

- No Expo runtime screenshot QA was run for this narrow metadata/copy pass.
- The shared worktree remains dirty with sibling AC edits; this subtask was not committed or pushed in isolation.
