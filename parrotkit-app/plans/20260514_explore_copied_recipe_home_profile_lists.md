# Explore Copied Recipe Home Profile Lists

## 배경

- Explore 템플릿 copy는 로컬/mock `owned` 레시피를 생성하도록 이전 Sub-AC에서 구현됐다.
- 이번 Sub-AC는 그 copied Explore 레시피가 Home과 My/Profile의 saved recipe 목록에 다시 나타나는지 보장한다.

## 목표

- Home saved recipe 카드 목록과 My/Profile saved recipe 목록이 같은 로컬/mock recipe source를 사용하게 한다.
- Explore에서 copy된 `owned` recipe copy도 일반 saved recipe entry로 노출되도록 contract를 남긴다.

## 범위

- 로컬/mock recipe list derivation.
- Home recipe cards.
- My/Profile saved recipe entries.
- Focused TypeScript contract check.

## 변경 파일

- `src/features/recipes/lib/saved-take-home-access.ts`
- `src/features/recipes/lib/saved-take-home-access.test.ts`
- `src/features/home/components/home-workspace-surface.tsx`
- `context/context_20260514_explore_copied_recipe_home_profile_lists.md`

## 테스트

- Red: focused TypeScript check에서 새 saved recipe access helper가 없어 실패하는지 확인.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-home-access-check.json`
- 가능하면 full `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

## 롤백

- saved recipe helper 사용을 제거하고 Home/Profile이 기존처럼 `recipes`를 직접 소비하도록 되돌린다.

## 리스크

- shared worktree에 sibling AC 변경이 많으므로 unrelated edits를 건드리지 않는다.
- copied recipe 노출은 현재 세션의 local/mock state에 한정된다.

## 결과

- `getSavedRecipeAccessEntries()`를 추가해 Home과 My/Profile saved recipe 목록이 같은 route/list entry contract를 쓰게 했다.
- Explore copied owned recipe가 saved recipe access list와 My/Profile saved recipe list에 포함되는 contract test를 추가했다.
- Home recipe card list는 shared saved recipe entries를 통해 원본 `recipe`를 렌더링하므로 copied Explore recipes도 current local/mock state에 저장되면 카드로 노출된다.

## 연결된 context

- `context/context_20260514_explore_copied_recipe_home_profile_lists.md`
