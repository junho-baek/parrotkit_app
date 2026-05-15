# Recipe Create Support Split

## 배경

Task 8 from `plans/20260516_ddd_architecture_simplification.md` reduces `recipe-create-screen.tsx` complexity by moving static support code out of the screen.

## 목표

Extract recipe create static copy/config and stylesheet definitions while preserving the current drawer UI flow and behavior.

## 범위

- `src/features/recipes/screens/recipe-create-screen.tsx`
- Support modules under `src/features/recipes/screens/recipe-create/`
- Main DDD plan Task 8 result note
- Context update

## 변경 파일

- Modify: `src/features/recipes/screens/recipe-create-screen.tsx`
- Create: `src/features/recipes/screens/recipe-create/recipe-create-copy.ts`
- Create: `src/features/recipes/screens/recipe-create/recipe-create-styles.ts`
- Modify: `plans/20260516_ddd_architecture_simplification.md`
- Modify: `context/context_20260516_ddd_architecture_simplification.md`

## 테스트

- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-flow.test.ts`
- `git diff --check`

## 롤백

Remove the new support modules and restore the local `createCopy` object and `styles` constant in `recipe-create-screen.tsx`.

## 리스크

- Importing extracted styles incorrectly could break React Native `StyleSheet` usage.
- Removing `StyleSheet` from the screen would break existing `StyleSheet.absoluteFillObject` and `StyleSheet.absoluteFill` usage, so the import must remain.

## 결과

- Extracted static recipe create copy/config to `src/features/recipes/screens/recipe-create/recipe-create-copy.ts`.
- Extracted the screen stylesheet to `src/features/recipes/screens/recipe-create/recipe-create-styles.ts`.
- Updated `src/features/recipes/screens/recipe-create-screen.tsx` to import the extracted support modules while preserving drawer JSX and `StyleSheet.absoluteFill*` usage.
- Linked context: `context/context_20260516_ddd_architecture_simplification.md`.
