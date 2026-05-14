# Saved Take Storage Layer

## 배경

Sub-AC 17.2.1 defined the saved-take persistence contract and attached it to recipe scene takes. Sub-AC 17.2.2 needs a local/mock storage layer that can both create saved takes and read them back with recipe/card metadata for later Home/My access.

## 목표

- Provide pure local/mock helpers for writing recipe saved takes into a recipe take project.
- Provide read helpers that flatten saved recipe takes across projects while preserving recipe, scene, cut-card, URI, timestamp, and status metadata.
- Keep quick-shoot URI-only takes unchanged.

## 범위

- Add a storage/query helper under recipe libs.
- Add focused TypeScript coverage for create/read behavior.
- Wire the provider's scene take creation through the storage helper.
- No server, login, cloud sync, or persistent device storage.

## 변경 파일

- `src/features/recipes/lib/saved-take-storage.ts`
- `src/features/recipes/lib/saved-take-storage.test.ts`
- `src/core/providers/mock-workspace-provider.tsx`
- `plans/20260514_saved_take_storage_layer.md`
- `context/context_20260514_saved_take_storage_layer.md`

## 테스트

- Red: run a focused TypeScript compile against `saved-take-storage.test.ts` before implementation and confirm missing API failure.
- Green: rerun the focused TypeScript compile after implementation.
- Final: run full-project TypeScript compile if available.

## 롤백

Remove the storage helper/test and restore `addSceneProjectTake` to directly calling `createProjectTake` and `addSceneTake`.

## 리스크

- `mock-workspace-provider.tsx` has sibling AC edits; preserve `recipeEditorBoards` and `prompterTextSizeLevel`.
- Full-project checks may include unrelated dirty sibling files, so focused checks are required for this AC.

## 결과

- Added `saved-take-storage.ts` as the local/mock storage layer for creating recipe scene takes and reading flat saved-take records.
- Added saved-take records with take id, URI, export state, recipe id/title, scene id/title, cut-card snapshots, timestamps, data source, and final/saved state.
- Wired `MockWorkspaceProvider.addSceneProjectTake` through the storage helper.
- Exposed `getSavedRecipeTakes(recipeId?)` from the mock workspace context for Home/My/Profile access surfaces.
- 연결 context: `context/context_20260514_saved_take_storage_layer.md`

## 검증

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-storage-check.json` failed because `saved-take-storage` did not exist.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-storage-check.json` passed.
- Full check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` passed.
