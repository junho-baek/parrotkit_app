# Reference Link Pro Badge

## 작업 시간

- 2026-05-14

## 범위

- Sub-AC 7.1: Add Pro badge/locked visual state to the Reference link option in the Home/shoot-board creation UI.
- Targeted the recipe creation sheet/screen reached from Home `+ 레시피 만들기`.

## 변경 요약

- Updated `src/features/recipes/lib/recipe-create-options.ts`.
  - Added `proBadgeLabel: "Pro"` to Pro-locked creation options.
  - Reference link remains visible and locked while manual/blank remains the unlocked default.
- Updated `src/features/recipes/lib/recipe-create-options.test.ts`.
  - Added a focused assertion that the Reference link option exposes the explicit `Pro` badge label.
- Updated `src/features/recipes/screens/recipe-create-screen.tsx`.
  - Creation option cards now render a distinct dark `Pro` badge and a separate lock-state pill.
  - CTA still shows `Pro locked` / `Pro 잠금` for locked options.

## 검증

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts`
  - Failed with `Reference link option must expose an explicit Pro badge label.`
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts`
  - Passed.
- Focused TypeScript: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
  - Passed.

## 리스크 / 후속

- No Expo runtime screenshot QA was run for this narrow metadata/UI pass.
- The shared worktree remains dirty with sibling AC edits; this subtask was not committed or pushed in isolation.
