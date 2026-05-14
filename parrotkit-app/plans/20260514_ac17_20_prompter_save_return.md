# AC17-20 Prompter Save Return

## 배경

Pass 3 is limited to AC17-20 in the dirty ParrotKit worktree. Existing saved-take storage/reload helpers can persist and hydrate local/mock takes, but the prompter completion flow still needs a deterministic return to the same cut board after saving.

## 목표

- Recording can be saved from the prompter flow.
- After saving a take, the app returns to the same cut board instead of Home.
- My Take slot updates immediately after save.
- Take status updates immediately after save.

## 범위

- Prompter save-state helper coverage.
- Local/mock saved-take save result wiring.
- Prompter completion return route to the current recipe/cut/take.
- No server persistence, broad build, commit, push, Notion upload, or unrelated dirty-file cleanup.

## 변경 파일

- `src/features/recipes/lib/prompter-take-save-state.ts`
- `src/features/recipes/lib/prompter-take-save-state.test.ts`
- `src/core/providers/mock-workspace-provider.tsx`
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `context/context_20260514_ac17_20_prompter_save_return.md`

## 테스트

- Red: focused save-state check should fail before the new return target helper exists.
- Green:
  - `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-take-save-state.test.ts`
  - `./node_modules/.bin/sucrase-node src/features/recipes/lib/saved-take-storage.test.ts`
  - `./node_modules/.bin/sucrase-node src/features/recipes/lib/saved-take-reload.test.ts`
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-storage-check.json`
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-reload-check.json`

## 롤백

Remove the return target helper/test additions, restore `addSceneProjectTake` to `void`, and restore the prompter saved-state action to only clear the review overlay.

## 리스크

- Direct `sucrase-node` execution currently fails before test logic because Node does not resolve the repo `@/...` alias; the TypeScript focused checks do resolve it.
- React state updates are still in-memory local/mock state only; no device/server persistence is introduced.
