# Context 2026-05-14 Sub-AC 6.3 Home Owned Recipe Card Navigation

## 작업

Sub-AC 3: Home displays owned recipe cards with clear navigation to each recipe detail or management view.

## 확인/변경

- 현재 shared workspace에는 이미 Sub-AC 6.3 구현이 적용되어 있었다.
- `src/features/home/lib/home-owned-recipe-cards.ts`
  - Home recipe card entries를 `ownership === 'owned'` 레시피로 제한한다.
  - 각 entry에 기존 board/detail route인 `destination`과 동일한 `managementDestination`을 노출한다.
  - 기존 direct filming route인 `startFilmingDestination`을 유지한다.
- `src/features/home/components/home-workspace-surface.tsx`
  - Home `내 레시피` / `My recipes` 섹션을 owned recipe card entries로 렌더링한다.
  - 카드 media/title press는 `entry.destination`으로 이동한다.
  - `관리` / `Manage` 버튼은 `entry.managementDestination`으로 이동한다.
  - `촬영 시작` / `Start filming` 버튼은 기존 `entry.startFilmingDestination`으로 이동한다.

## 검증

- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-owned-recipe-cards-check.json`
  - 통과. 출력 없음, exit code 0.
- `xcrun simctl list devices available`
  - 실패. CoreSimulatorService connection invalid / connection refused.
  - 이 환경에서는 iPhone simulator UI gate를 수행할 수 없었다.

## 2026-05-14 재검증

- AC 4 범위로 `src/features/home/lib/home-owned-recipe-cards.ts`와 `src/features/home/components/home-workspace-surface.tsx`를 재확인했다.
- Home `내 레시피` / `My recipes`는 `getHomeOwnedRecipeCardEntries(recipes)` 기반 owned recipe card만 렌더링한다.
- 각 card media/title press는 `entry.destination`으로 `/recipe/:recipeId`를 열고, `관리` / `Manage` 버튼은 `entry.managementDestination`으로 같은 detail/management route를 연다.
- `촬영 시작` / `Start filming` direct route는 `entry.startFilmingDestination`으로 유지된다.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-owned-recipe-cards-check.json`
  - 통과. 출력 없음, exit code 0.
- `xcrun simctl list devices available`
  - 실패. CoreSimulatorService connection invalid / connection refused.
  - iPhone simulator UI gate는 현재 실행 환경에서 접근할 수 없었다.

## 범위 제한

- Source/Recipes bottom tab은 재도입하지 않았다.
- primary floating CTA label은 변경하지 않았고, Shoot/New Shoot/Start Shoot 문구를 primary blank creation action으로 추가하지 않았다.
- Web QA, build, commit, push, merge는 수행하지 않았다.

## 연결된 plan

- `plans/20260514_sub_ac_6_3_home_owned_recipe_card_navigation.md`
