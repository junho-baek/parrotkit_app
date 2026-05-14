# Context 2026-05-14 Explore Template Filming Hydration

## 작업

Sub-AC 23.3.3: saved Explore-derived template에서 촬영 플로우로 진입할 때 컷카드/프롬프터 내용이 녹화 전부터 hydrate되도록 보장했다.

## 변경

- `src/features/explore/lib/explore-template-recipe-copy.ts`
  - `hydrateExploreTemplateFilmingRecipe` helper를 추가했다.
  - filming route recipe id 또는 `savedTemplateRecipeId`로 saved recipe를 먼저 찾고, 없으면 `source=explore-template` + `sourceRecipeId`로 원본 Explore template을 owned local/mock recipe 형태로 합성한다.
- `src/features/explore/lib/explore-template-recipe-copy.test.ts`
  - saved recipe 직접 hydration과 source template fallback hydration contract를 추가했다.
  - fallback에서도 saved recipe id, scene/cut count, prompter key line/cue가 보존되는지 확인했다.
- `src/features/explore/screens/explore-screen.tsx`
  - Explore card의 shoot action이 saved template prompter URL과 source metadata를 사용하도록 연결했다.
- `src/features/explore/screens/explore-recipe-detail-screen.tsx`
  - Detail Start Shooting action도 같은 saved template prompter URL을 사용하도록 연결했다.
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - `recipeId`, `savedTemplateRecipeId`, `source`, `sourceRecipeId` route params로 filming recipe를 hydrate하도록 변경했다.

## 검증

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json` 실패 확인.
  - 실패 원인: `hydrateExploreTemplateFilmingRecipe` export 없음.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json` 통과.
- Full: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.

## 참고

- 데이터는 기존 local/mock recipe와 Explore seed만 사용했다.
- login, cloud sync, server storage, payment, search/community/recommendation 기능은 추가하지 않았다.
- shared worktree에 sibling AC 변경이 많아 commit/push는 수행하지 않았다.
