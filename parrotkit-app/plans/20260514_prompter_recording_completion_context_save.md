# Prompter Recording Completion Context Save

## 배경

Sub-AC 17.2.1 and 17.2.2 added the local saved-take contract and storage helpers. Sub-AC 17.2.3 needs the prompter recording completion flow itself to persist the recorded take against the active recipe and cut-card context.

## 목표

- Carry the active cut card context from the shoot board into the prompter route.
- Save completed prompter recordings with explicit recipe, scene, and card metadata.
- Keep the flow local/mock-only and preserve the existing return-to-cut behavior.

## 범위

- Add focused TypeScript coverage for active-card save context.
- Extend local saved-take creation to prefer explicit `cutId` when available.
- Wire recipe detail -> prompter route -> save action with the active cut id.
- No login, cloud sync, server storage, payment, search, or recommendation scope.

## 변경 파일

- `src/features/recipes/lib/saved-take-storage.ts`
- `src/features/recipes/lib/saved-take-storage.test.ts`
- `src/core/providers/mock-workspace-provider.tsx`
- `src/features/recipes/screens/recipe-detail-screen.tsx`
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `plans/20260514_prompter_recording_completion_context_save.md`
- `context/context_20260514_prompter_recording_completion_context_save.md`

## 테스트

- Red: run the focused saved-take TypeScript compile before implementation and confirm the active cut context assertion fails.
- Green: rerun the focused compile after implementation.
- Final: run full TypeScript compile if available.

## 롤백

Remove the `cutId` route/save plumbing and restore `addSceneProjectTake(recipeId, sceneId, uri)` to scene-only snapshot behavior.

## 리스크

- `mock-workspace-provider.tsx` and `recipe-prompter-camera-screen.tsx` have sibling AC edits; preserve recipe editor board state, prompter text size, and manual scroll controls.
- Route compatibility must remain intact for older prompter links that only include `sceneId`; those should continue using scene-based fallback.

## 결과

- Added `createSavedRecipeTakeFromPrompterCompletion` so completed recordings create the saved-take contract from the active recipe, scene, and explicit cut card when present.
- Updated shoot-board prompter navigation to include `cutId` alongside `sceneId`, `lineToSay`, and `shootingGuideline`.
- Updated the prompter completion save action to pass the current `cutId` into `addSceneProjectTake`.
- Kept legacy scene-only prompter links compatible by falling back to scene-based cut lookup.
- 연결 context: `context/context_20260514_prompter_recording_completion_context_save.md`

## 검증

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-storage-check.json` failed because `createSavedRecipeTakeFromPrompterCompletion` was not exported yet.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-storage-check.json` passed.
- Full check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` passed.
