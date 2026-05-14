# Saved Take Storage Layer

## 작업 시간

- 2026-05-14

## 범위

- Sub-AC 17.2.2: storage layer for creating and reading saved takes with recipe/card metadata.
- Local/mock-only recipe take state.

## 변경 요약

- Added `src/features/recipes/lib/saved-take-storage.ts`.
- Added `createSavedRecipeTake` to write a saved prompter take into local recipe scene take projects.
- Added `listSavedRecipeTakes` to read flat saved-take records for later Home/My/Profile surfaces.
- Saved-take records expose:
  - take id, label, URI, and export status
  - recipe id/title and scene id/title
  - cut-card ids and cut-card snapshots
  - machine/display timestamps
  - local mock data source
  - saved/final take state inferred from the scene best take
- Updated `MockWorkspaceProvider.addSceneProjectTake` to use the storage helper.
- Exposed `getSavedRecipeTakes(recipeId?)` from `useMockWorkspace`.

## 검증

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-storage-check.json`
  - Failed as expected before implementation because `@/features/recipes/lib/saved-take-storage` was missing.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-storage-check.json`
  - Passed.
- Full check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - Passed.

## 리스크 / 후속

- This storage layer does not add device persistence; it intentionally remains in-memory local/mock state for v1.
- Home/My/Profile can now consume `getSavedRecipeTakes`, but this sub-AC did not redesign those screens.
