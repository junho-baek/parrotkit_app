# Context 2026-05-16 Recipe Domain Types

## 작업

Task 3 from `plans/20260516_ddd_architecture_simplification.md` was implemented without committing.

## 변경

- Added `src/domain/recipes/recipe.ts` as a pure domain type module for recipe platform, creator trust, ownership, verification, shoot status, image source, references, partner creators, scenes, and recipes.
- Updated `src/core/mocks/parrotkit-data.ts` so `MockPlatform`, `MockCreatorTrust`, `MockRecipeOwnership`, `MockRecipeVerification`, `MockRecipeShootStatus`, `MockReference`, `MockPartnerCreator`, `MockRecipeScene`, and `MockRecipe` remain exported as aliases to domain types.
- Removed the `AppImageSource` import from `src/core/mocks/parrotkit-data.ts`.
- Left `SavedTakePersistenceContract` imported from `@/features/recipes/lib/saved-take-contract` as requested; Task 4 owns that move.

## 검증

- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` passed.
- `npm run check:architecture` failed only with existing `core_does_not_import_features` violations. No `domain_is_pure` violation was reported.

## 리스크

- `npm run check:architecture` still reports the known `src/core/mocks/parrotkit-data.ts` saved take contract import and provider/navigation feature imports until later DDD tasks move those dependencies.
