# Prompter Recording Completion Context Save

## 작업 시간

- 2026-05-14 03:44 KST

## 범위

- Sub-AC 17.2.3: Wire the prompter recording completion flow to persist the recorded take using the active recipe and card context.
- Local/mock-only saved recipe takes.

## 변경 요약

- Added `createSavedRecipeTakeFromPrompterCompletion` to create a saved take from prompter completion with recipe, scene, and cut-card context.
- Active cut lookup now prefers explicit `activeCutId` and falls back to `sceneId` for older prompter links.
- Updated recipe detail prompter navigation to pass `cutId` through the route.
- Updated `RecipePrompterCameraScreen` to forward the active `cutId` when saving a completed recording.
- Updated `MockWorkspaceProvider.addSceneProjectTake` to accept optional active cut context and route saves through the prompter completion helper.

## 검증

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-storage-check.json`
  - Failed as expected because `createSavedRecipeTakeFromPrompterCompletion` did not exist.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-storage-check.json`
  - Passed.
- Full check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - Passed.

## 리스크 / 후속

- This remains in-memory local/mock state only; no device persistence or server storage was introduced.
- Scene-only prompter URLs remain supported, but explicit cut routing is now the preferred path from the shoot board.
