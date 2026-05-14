# Home Recipe Create Entry

## 작업 시간

- 2026-05-14

## 범위

- AC 5: Recipe creation entry is clearly available with the label `+ 레시피 만들기`.
- v1 Home 중심 흐름에서 blank/manual recipe creation을 우선 노출한다.

## 변경 요약

- Added `src/features/home/lib/home-recipe-create-entry.ts`.
  - Korean label: `+ 레시피 만들기`.
  - English fallback label: `+ Create recipe`.
  - Destination: `/recipe-create?mode=manual`.
- Added `src/features/home/lib/home-recipe-create-entry.test.ts` for the label/destination contract.
- Updated `src/features/home/components/home-workspace-surface.tsx`.
  - Home welcome area now shows a prominent recipe creation CTA.
  - CTA routes to the blank/manual recipe creation flow.
- Updated `src/features/recipes/screens/recipe-create-screen.tsx`.
  - Direct `/recipe-create` entry defaults to manual mode when no valid mode param is supplied.

## 검증

- Red: `./node_modules/.bin/sucrase-node src/features/home/lib/home-recipe-create-entry.test.ts`
  - Failed before implementation because `home-recipe-create-entry` did not exist.
- Green: `./node_modules/.bin/sucrase-node src/features/home/lib/home-recipe-create-entry.test.ts`
  - Passed.
- TypeScript: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - Passed.

## 리스크 / 후속

- This was a focused code/type verification pass, not a headed Expo runtime QA pass.
- The shared worktree still contains concurrent sibling AC changes; this AC only added the Home recipe creation entry contract and UI wiring.
