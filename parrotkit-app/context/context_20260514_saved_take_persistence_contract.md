# Saved Take Persistence Contract

## 작업 시간

- 2026-05-14

## 범위

- Sub-AC 17.2.1: saved take persistence contract definition.
- Local/mock-only recipe take state.

## 변경 요약

- Added `SavedTakePersistenceContract` in `src/features/recipes/lib/saved-take-contract.ts`.
- The contract stores:
  - `recordingUri`
  - `recipeId` / `recipeTitle`
  - `sceneId` / `sceneTitle`
  - `cardIds`
  - cut card snapshots with hook, line to say, shot action, note, role, order, and title
  - `createdAtIso` and `recordedAtLabel`
  - local replay/listing metadata such as `dataSource`, `takeStatus`, `isFinalTake`, `durationSeconds`, and `exportStatus`
- Extended `MockProjectTake` with optional `savedTake` while keeping the existing `uri` alias for replay/export callers.
- Updated `createProjectTake` to accept an optional saved-take contract.
- Updated `addSceneProjectTake` in `MockWorkspaceProvider` to snapshot the current recipe, active scene, and editor cut when a recipe take is saved.
- Added focused TypeScript coverage in `src/features/recipes/lib/saved-take-contract.test.ts`.

## 검증

- Red check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - Failed as expected before implementation because `createProjectTake` did not accept a persistence option and `MockProjectTake` did not expose `savedTake`.
- Green check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - Passed.

## 리스크 / 후속

- This AC defines and wires the local contract only. UI listing surfaces can now read `take.savedTake`, but this task did not redesign Home/My saved-take views.
- Quick shoot takes remain URI-only because the required contract depends on recipe and cut-card identity.
