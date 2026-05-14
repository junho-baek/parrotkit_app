# Sub-AC 3 Primary Floating CTA Verification

## 배경

- Follow-up Seed task is limited to failed/pending navigation realignment items.
- Sub-AC 3 requires verifying the primary floating CTA uses `레시피 생성` and still opens the intended recipe creation flow.

## 목표

- Confirm the global floating CTA visible label/accessibility label is `레시피 생성` in Korean.
- Confirm the CTA destination remains the blank/manual recipe creation flow.

## 범위

- Verification only unless the current implementation fails the focused contract.
- No root tab changes and no Source/Recipes bottom-tab reintroduction.

## 변경 파일

- `plans/20260514_sub_ac_3_primary_floating_cta_verification.md`
- `context/context_20260514_sub_ac_3_primary_floating_cta_verification.md` after verification

## 테스트

- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json`
- iPhone simulator availability probe via `xcrun simctl list devices available`

## 롤백

- Remove this verification-only plan/context if the follow-up run is discarded.

## 리스크

- iPhone simulator UI verification may be blocked by CoreSimulator availability in the sandbox.

## 결과

- Verified `src/core/navigation/global-create-cta.ts` returns Korean label/accessibility label `레시피 생성`.
- Verified `getGlobalCreateCtaDestination()` returns `/recipe-create?mode=manual`.
- Verified `src/core/navigation/global-source-cta.tsx` uses the contract for the visible label/accessibility label and calls `router.push(getGlobalCreateCtaDestination() as Href)`.
- Verified `src/app/recipe-create.tsx` exists and `src/features/recipes/screens/recipe-create-screen.tsx` consumes `mode=manual`, then creates a blank recipe through `createBlankShootBoardRecipe`.
- No product code changes were needed for Sub-AC 3.
- Context: `context/context_20260514_sub_ac_3_primary_floating_cta_verification.md`.

## 검증

- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts` passed.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json` passed.
- `xcrun simctl list devices available` failed because CoreSimulatorService was unavailable (`Connection invalid` / `Connection refused`), so simulator UI QA could not be completed in this sandbox.
