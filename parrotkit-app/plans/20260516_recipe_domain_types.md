# 2026-05-16 Recipe Domain Types

## 배경

Task 3 of `20260516_ddd_architecture_simplification.md` moves recipe-shaped mock types out of `src/core/mocks/parrotkit-data.ts` so recipe domain types no longer depend on core UI image helpers.

## 목표

- Add a pure `src/domain/recipes/recipe.ts` type module.
- Keep existing `Mock*` type exports from `parrotkit-data.ts` working through aliases.
- Remove the `AppImageSource` import from `parrotkit-data.ts`.

## 범위

- Included: recipe/reference/partner creator/platform/ownership/verification/shoot status type extraction.
- Excluded: saved take contract relocation, provider relocation, runtime seed changes, UI changes.

## 변경 파일

- Create: `src/domain/recipes/recipe.ts`
- Modify: `src/core/mocks/parrotkit-data.ts`
- Update: `plans/20260516_ddd_architecture_simplification.md`
- Create or update: `context/context_20260516_recipe_domain_types.md`

## 테스트

- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`

## 롤백

Remove `src/domain/recipes/recipe.ts` and restore the previous inline mock type declarations plus `AppImageSource` import in `src/core/mocks/parrotkit-data.ts`.

## 리스크

- `RecipeImageSource` must stay domain-safe while remaining compatible with existing mock media seeds that can be numeric native asset IDs or URI source objects.
- Architecture check is expected to keep failing until later tasks remove existing core-to-feature imports.

## 결과

- Created `src/domain/recipes/recipe.ts` with pure recipe/reference/partner creator type definitions.
- Updated `src/core/mocks/parrotkit-data.ts` to keep the existing exported `Mock*` names as aliases to domain types.
- Removed the `AppImageSource` import from `parrotkit-data.ts`.
- Used a structural `RecipeImageSource` union for strings, numeric native asset IDs, and URI source objects so the existing mock media seeds continue to type-check without importing React Native.
- Verification context: `context/context_20260516_recipe_domain_types.md`.
