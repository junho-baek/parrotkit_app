# Context 2026-05-16 Shoot Board Domain Model

## 작업

Task 5 from `plans/20260516_ddd_architecture_simplification.md` was implemented without committing.

## 변경

- Moved native recipe types to `src/domain/recipes/native-recipe.ts`.
- Moved shoot board model logic to `src/domain/shoot-board/shoot-board-model.ts`.
- Kept feature compatibility re-exports at `src/features/recipes/types/recipe-domain.ts` and `src/features/recipes/lib/shoot-board-model.ts`.
- Replaced React Native image types in domain with structural `NativeRecipeImageSource`.
- Removed `@/core/mocks/ugc-media` from the shoot board domain model and used equivalent fallback image URI objects.
- Updated safe direct-domain imports in the core provider, core mock test, and recipe normalizer.

## 검증

- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- EXPECTED FAIL: `npm run check:architecture` still reports remaining `core -> features` imports in navigation/provider files. No `domain_is_pure` failures were reported.
- BLOCKED/KNOWN FAIL: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts` still does not resolve `@/` in this runtime.
- KNOWN FAIL AFTER ALIAS WORKAROUND: `node -r sucrase/register ... shoot-board-model.test.ts` reaches the existing title-format assertion: `Scene titles should use the required Scene #N: Role format.`

## 리스크

- Domain fallback thumbnail sources are URI objects instead of bundled `require()` asset numbers because domain cannot import core mocks or React Native.
- Later provider/application migration still needs to remove the remaining core feature imports.
