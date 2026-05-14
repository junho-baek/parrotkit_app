# Home Saved Takes Access

## 작업 시간

- 2026-05-14

## 범위

- Sub-AC 17.3.1: Home saved recipes/takes entry point에서 저장한 테이크를 다시 열고 선택할 수 있는지 검증 및 보강.
- Local/mock-only saved recipe take flow.

## 변경 요약

- Added `src/features/recipes/lib/saved-take-home-access.ts`.
  - `getSavedTakeHomeDestination()` builds a route to the saved take's recipe board, target cut/scene, and selected take id.
- Added a focused contract test in `src/features/recipes/lib/saved-take-home-access.test.ts`.
- Added `tsconfig.saved-take-home-access-check.json` for focused verification.
- Updated `HomeWorkspaceSurface`:
  - reads `getSavedRecipeTakes()`
  - shows a Home `Saved takes` / `저장한 테이크` section
  - routes each saved take to the matching recipe board destination.
- Updated `RecipeDetailScreen`:
  - accepts `takeId` route param
  - expands the matching cut from `sceneId`
  - opens `TakeReviewViewerModal` with the requested take selected
  - keeps user take selection visible while switching/selecting final takes.

## 검증

- Red check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-home-access-check.json`
  - Failed as expected before implementation because `saved-take-home-access` did not exist.
- Green check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-home-access-check.json`
  - Passed.
- Full TypeScript check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - Passed.

## 리스크 / 후속

- Saved takes remain in-memory local/mock state, matching v1 scope.
- This does not add cloud persistence, login, search, community, payments, or server storage.
