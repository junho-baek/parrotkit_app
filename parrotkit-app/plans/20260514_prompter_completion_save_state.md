# Prompter Completion Save State

## 배경

ParrotKit v1 requires a clear local save action after recording a prompter take. The current recipe prompter completion overlay can keep a take, but the action/state is not explicit enough for the Home-centric saved-take flow.

## 목표

Make the prompter recording completion UI show an explicit save action and a visible saved state before returning to the current cut board context.

## 범위

- Add deterministic UI copy/state helper for recorded-take save state.
- Update the native take review UI to support a locally saved recipe-take state.
- Update the recipe prompter camera screen so a recorded take can be saved locally and then dismissed back to the same scene.

## 변경 파일

- `src/features/recipes/lib/prompter-take-save-state.ts`
- `src/features/recipes/lib/prompter-take-save-state.test.ts`
- `src/features/recipes/components/native-take-review.tsx`
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `context/context_20260514_prompter_completion_save_state.md`

## 테스트

- Add a failing helper test first for saved-take review copy.
- Run focused TypeScript verification for the helper/test if needed.
- Run full `tsc --noEmit` verification after implementation.

## 롤백

Remove the helper/test and restore the take review overlay to the previous idle/saving/export states with the prompter primary action labeled `Use take`.

## 리스크

- Native camera recording and video preview behavior cannot be fully validated from TypeScript alone.
- This file has active sibling edits around manual scroll and text-size controls, so the change must stay focused on completion-save state.

## 결과

- Added explicit recorded-take save copy/state for the prompter completion overlay.
- The recipe prompter completion primary action now saves the take locally, shows `Saved to recipe`, and then lets the user return to the current cut.
- Linked context: `context/context_20260514_prompter_completion_save_state.md`
