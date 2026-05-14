# Context 2026-05-14 Sub-AC 3 Primary Floating CTA Verification

## 작업

- Follow-up Seed Sub-AC 3 verification only.
- Scope: primary floating CTA language and destination for the corrected recipe creation entry.

## 확인 결과

- `src/core/navigation/global-create-cta.ts`
  - Korean visible label is `레시피 생성`.
  - Korean accessibility label is `레시피 생성`.
  - Destination is `/recipe-create?mode=manual`.
  - English fallback is `Create recipe`, avoiding Source/Shoot language.
- `src/core/navigation/global-source-cta.tsx`
  - Renders the contract label.
  - Uses the contract accessibility label/hint.
  - Navigates with `router.push(getGlobalCreateCtaDestination() as Href)`.
- `src/app/recipe-create.tsx`
  - Exposes the `recipe-create` route.
- `src/features/recipes/screens/recipe-create-screen.tsx`
  - Reads `mode` from local search params.
  - Manual mode starts the blank recipe flow via `createBlankShootBoardRecipe`.

## 검증

- Passed: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts`
- Passed: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json`

## Simulator QA

- Attempted: `xcrun simctl list devices available`
- Result: failed with CoreSimulatorService connection invalid / connection refused.
- iPhone simulator UI QA could not be completed from this sandbox; no web QA was run.

## 참고

- No product code changes were needed for this Sub-AC.
- No commit, push, or merge was performed.
- Source/Recipes were not reintroduced as bottom tabs.
