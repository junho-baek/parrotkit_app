# Sub-AC 6.3 Home Owned Recipe Card Navigation

## 배경

- Sub-AC 3 requires Home to display owned recipe cards with clear navigation to each recipe detail or management view.
- Previous work already filters Home recipe cards to owned recipes and routes view-all to `/recipes?filter=owned`.
- The remaining gap is making each individual owned recipe card expose an explicit detail/management navigation affordance, while preserving the existing start-filming route.

## 목표

- Keep Home recipe cards owned-only.
- Preserve card press navigation to the existing recipe board/detail route.
- Add a clear per-card management/detail action for each owned recipe card.

## 범위

- Home owned recipe card helper metadata.
- Home recipe card UI action affordance.
- Focused TypeScript validation only; no web QA, no build, no commit/push.

## 변경 파일

- `src/features/home/lib/home-owned-recipe-cards.ts`
- `src/features/home/lib/home-owned-recipe-cards.test.ts`
- `src/features/home/components/home-workspace-surface.tsx`
- `context/context_20260514_sub_ac_6_3_home_owned_recipe_card_navigation.md`

## 테스트

- Run `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-owned-recipe-cards-check.json` for RED and GREEN.
- Attempt iPhone simulator availability check as the UI gate if CoreSimulatorService is reachable.

## 롤백

- Remove the added management metadata from Home owned recipe card entries.
- Remove the management/detail button from `HomeRecipeCard`.
- Revert this plan and context note.

## 리스크

- The worktree contains many prior Seed edits; keep this change narrowly scoped.
- The recipe detail/management route is the existing `/recipe/:recipeId` board route, not a new destination.

## 결과

- `src/features/home/lib/home-owned-recipe-cards.ts` exposes owned-only Home card entries with:
  - `destination` for opening the owned recipe board/detail route.
  - `managementDestination` for the explicit per-card management/detail affordance.
  - `startFilmingDestination` to preserve the existing direct filming route.
- `src/features/home/components/home-workspace-surface.tsx` renders Home `내 레시피` / `My recipes` cards from owned entries and wires:
  - card media/title press to `entry.destination`.
  - `관리` / `Manage` button to `entry.managementDestination`.
  - `촬영 시작` / `Start filming` button to `entry.startFilmingDestination`.
- Focused TypeScript validation passed.
- iPhone simulator UI QA could not run because CoreSimulatorService returned connection invalid/refused.
- 연결된 context: `context/context_20260514_sub_ac_6_3_home_owned_recipe_card_navigation.md`

## 2026-05-14 AC 4 재확인 결과

- 추가 코드 변경 없이 existing wiring이 AC 4를 만족함을 확인했다.
- Home owned recipe card section, per-card detail/manage navigation, and direct filming route remain intact.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-owned-recipe-cards-check.json` 통과.
- iPhone simulator availability check는 CoreSimulatorService connection invalid/refused로 실패했다.
- 연결된 context: `context/context_20260514_sub_ac_6_3_home_owned_recipe_card_navigation.md`
