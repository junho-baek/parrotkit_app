# Profile Saved Takes Access

## 작업 시간

- 2026-05-14

## 범위

- Sub-AC 17.3.2: My/Profile의 저장한 레시피/테이크 진입점에서 저장한 테이크를 다시 열고 선택할 수 있는지 검증 및 보강.
- v1 범위에 맞춰 My/Profile을 settings, language, Pro status, saved recipes, saved takes 중심으로 정리.

## 변경 요약

- Added `getSavedTakeProfileAccessEntries()` in `src/features/recipes/lib/saved-take-home-access.ts`.
  - Saved recipe entries route to `/recipe/:recipeId`.
  - Saved take entries route to `/recipe/:recipeId?sceneId=:cutOrSceneId&takeId=:takeId`.
  - Uses the same destination contract as Home, so the existing recipe detail screen opens the target cut and selected take.
- Updated `src/features/profile/screens/profile-screen.tsx`.
  - Shows Pro status, saved recipes, saved takes, and language settings.
  - Saved take rows are pressable and navigate back to the matching recipe cut board/take selection.
  - Removed the stats/liked-reference section from the visible v1 My/Profile flow.
- Updated `src/core/i18n/app-language.tsx` with English/Korean copy for Profile saved recipe/take and Pro status sections.
- Extended `src/features/recipes/lib/saved-take-home-access.test.ts` to cover the Profile entry contract.

## 검증

- Red check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-home-access-check.json`
  - Failed as expected before implementation because `getSavedTakeProfileAccessEntries` did not exist.
- Green check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-home-access-check.json`
  - Passed.
- Full TypeScript check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - Passed.

## 리스크 / 후속

- This remains local/mock-only and does not add login, cloud sync, server storage, payment management, search, community, recommendation, pinch zoom, or automatic prompter speed controls.
- Runtime UI smoke testing was not started because this Sub-AC was verified with focused route contract checks and TypeScript validation.
