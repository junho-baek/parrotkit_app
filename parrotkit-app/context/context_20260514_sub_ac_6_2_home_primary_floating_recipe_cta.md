# Context 2026-05-14 Sub-AC 6.2 Home Primary Floating Recipe CTA

## 작업

- Retry attempt 1 for ParrotKit v1 navigation realignment follow-up Sub-AC 6.2.
- Scope was limited to the Home primary floating creation CTA language and route.
- Correct product language is `레시피 생성`; Shoot/New Shoot/Start Shoot must not be used for the primary blank creation action.

## 확인

- `src/core/navigation/global-create-cta.ts`
  - Korean label: `레시피 생성`
  - Korean accessibility label: `레시피 생성`
  - Destination: `/recipe-create?mode=manual`
  - Home pathname `/` remains visible through `shouldShowGlobalCreateCta`.
- `src/core/navigation/global-source-cta.tsx`
  - Reuses the existing floating plus-button UI.
  - Pushes `getGlobalCreateCtaDestination()` on press.
- `src/core/navigation/root-native-tabs.tsx`
  - Renders `GlobalSourceCta` over the root tabs while Home chrome is visible.
- `src/features/home/lib/home-primary-cta.ts`
  - No-workflow Korean primary action label is `레시피 생성`.
  - No-workflow destination helper resolves to `/recipe-create?mode=manual`.

## 변경

- No production code changes were required.
- Updated `plans/20260514_sub_ac_6_2_home_primary_floating_recipe_cta.md`.
- Added this context record.

## 검증

- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts`
  - Passed.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json`
  - Passed.
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
  - Passed.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-primary-cta-check.json`
  - Passed.

## Simulator QA

- Attempted: `xcrun simctl list devices available`
- Result: failed with CoreSimulatorService connection invalid / connection refused.
- iPhone simulator UI QA could not be completed from this sandbox. Web QA was not run because it is out of scope for this Seed.

## 참고

- Did not reintroduce Source or Recipes as bottom tabs.
- Did not change completed previous Seed fixes.
- Did not commit, push, or merge.
