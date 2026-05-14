# Sub-AC 6.2 Home Primary Floating Recipe CTA

## 배경

- Follow-up Seed task is limited to failed/pending ParrotKit v1 navigation realignment items.
- Sub-AC 6.2 requires the Home primary floating CTA to use corrected recipe creation language and route into the recipe creation flow.
- Correct Korean primary blank creation label is `레시피 생성`, not Shoot/New Shoot/Start Shoot.

## 목표

- Verify the Home-visible floating creation CTA label is `레시피 생성` in Korean.
- Verify the CTA routes to `/recipe-create?mode=manual`.
- Preserve previously completed bottom tab and navigation fixes.

## 범위

- Focused verification and minimal test/code change only if the current contract is missing.
- No bottom tab changes.
- No web QA.
- No commit, push, or merge.

## 변경 파일

- `plans/20260514_sub_ac_6_2_home_primary_floating_recipe_cta.md`
- `context/context_20260514_sub_ac_6_2_home_primary_floating_recipe_cta.md`

## 테스트

- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-primary-cta-check.json`
- `xcrun simctl list devices available`

## 롤백

- Remove this Sub-AC plan/context if the follow-up verification record is discarded.

## 리스크

- iPhone simulator QA depends on CoreSimulatorService availability in this sandbox.

## 결과

- 기존 `src/core/navigation/global-create-cta.ts` contract가 Home-visible floating CTA의 Korean label/accessibility label을 `레시피 생성`으로 유지하고, destination을 `/recipe-create?mode=manual`로 반환하는 것을 확인했다.
- 기존 `src/core/navigation/global-source-cta.tsx`가 floating plus-button pattern을 유지하면서 `getGlobalCreateCtaDestination()`로 push하는 것을 확인했다.
- 기존 `src/features/home/lib/home-primary-cta.ts` no-workflow primary action도 Korean `레시피 생성`과 `/recipe-create?mode=manual` fallback route contract를 유지한다.
- Code change는 필요하지 않아 verification/context 기록만 추가했다.
- 연결 context: `context/context_20260514_sub_ac_6_2_home_primary_floating_recipe_cta.md`
