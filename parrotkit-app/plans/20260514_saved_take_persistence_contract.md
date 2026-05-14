# Saved Take Persistence Contract

## 배경

Sub-AC 17.2.1 requires saved prompter takes to have an explicit local/mock persistence contract. The current take state records a URI and label, but does not preserve enough recipe and cut-card context for reliable replay, Home/My listing, or later review.

## 목표

Define and wire a saved-take contract that stores the recording URI, recipe id/title, cut card ids/content, timestamps, and local metadata needed to replay and list a saved take.

## 범위

- Add a typed saved-take persistence contract helper.
- Extend mock saved take types without introducing server/cloud storage.
- Update recipe prompter save persistence to snapshot the active recipe and cut card.
- Add focused TypeScript tests for the contract shape and URI aliasing.

## 변경 파일

- `src/core/mocks/parrotkit-data.ts`
- `src/core/providers/mock-workspace-provider.tsx`
- `src/features/recipes/lib/saved-take-contract.ts`
- `src/features/recipes/lib/saved-take-contract.test.ts`
- `src/features/recipes/lib/take-projects.ts`
- `plans/20260514_saved_take_persistence_contract.md`
- `context/context_20260514_saved_take_persistence_contract.md`

## 테스트

- Red check: run `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` before implementing the missing helper import/test.
- Green check: run `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` after implementation.

## 롤백

Remove the saved-take contract helper/test, restore `MockProjectTake` to URI-only metadata, and restore `addSceneProjectTake` to passing only `recipeId`, `sceneId`, and URI into `createProjectTake`.

## 리스크

- Existing sibling changes touch `mock-workspace-provider.tsx`; edits must preserve `recipeEditorBoards` and `prompterTextSizeLevel`.
- Native recording replay cannot be fully proven by TypeScript, so this sub-AC focuses on the persistence contract and local state shape.

## 결과

- Added `SavedTakePersistenceContract` as the local/mock saved take payload with recording URI, recipe id/title, scene id/title, cut-card ids/content snapshots, ISO/display timestamps, and replay/listing metadata.
- Extended `MockProjectTake` with optional `savedTake` while preserving existing `uri` access for native replay/export.
- Updated recipe take saves to build the contract from the current recipe, scene, and editor cut before adding the take to the local recipe take project.
- Added contract coverage in `src/features/recipes/lib/saved-take-contract.test.ts`.
- 연결 context: `context/context_20260514_saved_take_persistence_contract.md`

## 검증

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` failed on the missing `createProjectTake` persistence option and `savedTake` field.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` passed immediately after this implementation.
- Fresh final full-project check is currently blocked by unrelated sibling-task files:
  - `src/features/recipes/lib/cut-card-action-status.test.ts` imports missing `cut-card-action-status`.
  - `src/features/recipes/lib/prompter-display.test.ts` imports missing `getActiveRecipePrompterFullScript`.
- Focused saved-take contract compiler check passed with a TypeScript API compile rooted at `src/features/recipes/lib/saved-take-contract.test.ts`.
