# Context: Release Media Slop Cleanup

Date: 2026-05-17

## Summary

Cleaned up the recipe reference viewer and filming prompter to better match the compact short-form execution direction in `DESIGN.md`.

## Changes

- Added `DESIGN.md` guardrails for reference viewer titles, compact reference rails, camera prompter labels, cut-count source of truth, and filming controls.
- Added `reference-viewer-ui` model helpers and tests so reference viewer copy uses execution titles and compact numeric cut navigation.
- Updated `ReferenceViewerModal` to remove visible `Reference` / `Cut #` taxonomy headers and use compact cut rail labels.
- Updated prompter display copy from `CARD PROMPT` / `FULL SCRIPT` to `Line` / `Script`.
- Added cut-navigation and overlay-control helpers for cut-count sync, pinch text sizing, and opacity stepping.
- Updated `RecipePrompterCameraScreen` to prefer shoot-board cuts for active navigation, display compact cut progress, remove visible AI-slop labels, add pinch text sizing, expose opacity controls, and save takes against the active cut.
- Updated take review copy so the primary local action is `Keep take`.
- Added a contract test that blocks the removed prompter slop labels from reappearing.

## Verification

Passed:

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-viewer-ui.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-cut-navigation.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-overlay-controls.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-take-save-state.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/saved-take-storage.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-prompter-camera-screen-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md`
- `git diff --check`

Runtime evidence:

- Android board: `output/playwright/release-media-slop-cleanup-20260517/android-board-clean.png`
- Android reference viewer: `output/playwright/release-media-slop-cleanup-20260517/android-reference-viewer-clean-v2.png`
- Android prompter idle: `output/playwright/release-media-slop-cleanup-20260517/android-prompter-idle-clean.png`
- iOS board: `output/playwright/release-media-slop-cleanup-20260517/ios-board-clean.png`
- iOS prompter direct route: `output/playwright/release-media-slop-cleanup-20260517/ios-prompter-direct.png`
- Capture board: `output/playwright/release-media-slop-cleanup-20260517/capture-board.md`
- QA report: `output/reports/20260517_release_media_slop_cleanup.md`

## Remaining Risk

- Android emulator crashed during the latest record-button QA attempt, so record/save should be re-run on a stable emulator or physical Android device.
- iOS dev-client was not installed in the simulator; iOS evidence used Expo Go and direct route screenshots. Record/save should be repeated in dev-client or on device before store submission.
- External reference URL playback remains out of scope for this task.

## Follow-up: Reference Viewer Bottom UI

The first implementation still left a thumbnail-strip control under the reference video. That was not aligned with the compact rail rule and still looked like a second preview/card layer.

Follow-up changes:

- Replaced the bottom thumbnail strip with compact numeric rail buttons.
- Removed bottom-rail thumbnail image rendering from `ReferenceViewerModal`.
- Shortened the bottom actions to `Guide` and `Film`.
- Added `src/features/recipes/components/reference-viewer-modal-contract.test.ts` to block the thumbnail-strip rail from returning.

Verification:

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/reference-viewer-modal-contract.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-viewer-ui.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `git diff --check`
