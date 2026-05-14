# Create Screen Sticky CTA Clearance

## 배경

- AC 6 requires lower cards on the recipe create screen to remain readable and tappable above the sticky CTA on iPhone simulator.
- The create screen uses an absolute footer, so scroll content needs enough bottom clearance to expose the final cards above the CTA.

## 목표

- Keep the existing three creation options and locked Pro guidance behavior intact.
- Ensure the lower detail cards can scroll fully above the sticky CTA on iPhone-sized screens.
- Keep the change minimal and local to the create screen/layout contract.

## 범위

- Recipe create screen scroll/footer spacing.
- Focused layout contract verification.
- Context note for this AC.

## 변경 파일

- `src/features/recipes/screens/recipe-create-screen.tsx`
- `src/features/recipes/lib/recipe-create-layout.ts`
- `src/features/recipes/lib/recipe-create-layout.test.ts`
- `tsconfig.recipe-create-options-check.json`
- `plans/20260514_create_screen_sticky_cta_clearance.md`
- `context/context_20260514_create_screen_sticky_cta_clearance.md`

## 테스트

- Run focused layout test with `./node_modules/.bin/sucrase-node`.
- Run focused TypeScript check with `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`.
- Use iPhone simulator QA for the create screen when feasible in this run.

## 롤백

- Remove the layout helper/test and restore the create screen bottom padding to its prior inline value.

## 리스크

- `recipe-create-screen.tsx` has active sibling changes; avoid changing option semantics or navigation.
- Simulator availability may block live QA; record the exact blocker if it occurs.

## 결과

- Added an explicit create-screen scroll bottom padding helper and focused test.
- Wired `RecipeCreateScreen` to use the helper instead of the inline `insets.bottom + 138` value.
- Preserved the compact-iPhone 138pt bottom padding and home-indicator 172pt bottom padding contract.
- Focused checks passed:
  - `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-layout.test.ts`
  - `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts`
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- Simulator QA was attempted but blocked by CoreSimulatorService connection failure.
- Linked context: `context/context_20260514_create_screen_sticky_cta_clearance.md`
