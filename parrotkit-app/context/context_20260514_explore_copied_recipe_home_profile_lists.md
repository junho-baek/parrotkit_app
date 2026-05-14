# Context 2026-05-14 Explore Copied Recipe Home Profile Lists

## 작업

Sub-AC 23.2.3: Ensure copied Explore recipes appear in Home/My/Profile saved recipe lists.

## 변경

- `src/features/recipes/lib/saved-take-home-access.ts`
  - `SavedRecipeAccessEntry` 타입과 `getSavedRecipeAccessEntries()`를 추가했다.
  - My/Profile saved recipe entries가 새 helper를 사용하도록 정리했다.
- `src/features/home/components/home-workspace-surface.tsx`
  - Home `내 레시피` / `My recipes` 카드 목록이 shared saved recipe entry helper를 사용하도록 변경했다.
  - Entry에 포함된 원본 recipe 객체를 계속 렌더링해 기존 카드 UI와 route 동작을 유지했다.
- `src/features/recipes/lib/saved-take-home-access.test.ts`
  - Explore template copy로 생성한 owned recipe가 saved recipe access list에 포함되는지 검증했다.
  - My/Profile saved recipe entries에도 copied Explore recipe가 포함되는지 검증했다.
- `plans/20260514_explore_copied_recipe_home_profile_lists.md`
  - 작업 계획과 결과를 기록했다.

## 검증

- Red 확인:
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-home-access-check.json`
  - `getSavedRecipeAccessEntries` export가 없어 실패했다.
- Green 확인:
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-home-access-check.json` 통과.
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.

## 참고

- 데이터는 기존 Explore copy flow의 local/mock `recipes` state에 머문다.
- login, cloud sync, server storage, payment management, search, community, recommendation 기능은 추가하지 않았다.
- shared worktree에 sibling AC 변경이 많아 commit/push는 수행하지 않았다.
