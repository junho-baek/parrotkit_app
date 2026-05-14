# Saved Take Reload Validation

## 배경

Sub-AC 17.2.4 requires focused validation coverage for saving a take and reloading the recipe/card metadata later. Previous saved-take work added the local/mock contract and storage layer; this task should prove the reload behavior explicitly without expanding v1 into server or device persistence.

## 목표

- Add focused TypeScript validation for the recipe prompter saved-take flow.
- Prove a saved take can be reloaded by recipe/scene with recipe id/title, scene id/title, URI, and cut-card metadata intact.
- Prove the reloaded metadata is a snapshot of the saved card, not a live pointer to later board edits.

## 범위

- Test-only validation around `createSavedRecipeTakeFromPrompterCompletion` and `listSavedRecipeTakes`.
- No UI redesign, server storage, login, cloud sync, or persistent device storage.
- No changes to source/import/reference-assisted flows.

## 변경 파일

- `src/features/recipes/lib/saved-take-reload.test.ts`
- `tsconfig.saved-take-reload-check.json`
- `plans/20260514_saved_take_reload_validation.md`
- `context/context_20260514_saved_take_reload_validation.md`

## 테스트

- Red: run the focused TypeScript compile before adding the test include and observe the missing test file.
- Green: run the focused TypeScript compile after adding the validation.
- Final: run full-project TypeScript compile if current sibling edits allow it.

## 롤백

Remove the new focused test, its TypeScript check config, and this plan/context note.

## 리스크

- This remains TypeScript/runtime-throw validation rather than a Jest runner because the project currently has no test script.
- Full-project validation may be affected by unrelated sibling-task files in the dirty worktree.

## 결과

- Added focused saved-take reload validation in `src/features/recipes/lib/saved-take-reload.test.ts`.
- The validation saves a prompter take from an explicit active cut card, reloads records by recipe and scene, and verifies take URI, recipe metadata, scene metadata, and cut-card snapshot fields.
- The validation mutates the source cut after save and confirms the reloaded saved-take record still exposes the original saved card content.
- Added `tsconfig.saved-take-reload-check.json` for a narrow compiler check around this validation.
- 연결 context: `context/context_20260514_saved_take_reload_validation.md`

## 검증

- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-reload-check.json` passed.
- Full check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` passed.
