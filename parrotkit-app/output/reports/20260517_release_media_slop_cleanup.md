# Release Media Slop Cleanup QA

Date: 2026-05-17 17:16 KST

## Purpose

Verify the release-media cleanup for the recipe board, reference viewer, and prompter camera surfaces after removing user-visible AI-slop labels and syncing the filming UI to the shoot-board cuts.

## Scope

- Recipe shooting board on Android and iOS.
- Reference viewer on Android.
- Prompter idle surface on Android and iOS.
- Static checks for reference viewer, prompter display, cut navigation, overlay controls, take-save copy, TypeScript, architecture, and `DESIGN.md`.

## Screenshots

Capture board: `output/playwright/release-media-slop-cleanup-20260517/capture-board.md`

| Platform | Screen | Evidence |
| --- | --- | --- |
| Android | Shooting board | ![Android shooting board](../playwright/release-media-slop-cleanup-20260517/android-board-clean.png) |
| Android | Reference viewer | ![Android reference viewer](../playwright/release-media-slop-cleanup-20260517/android-reference-viewer-clean-v2.png) |
| Android | Prompter idle | ![Android prompter idle](../playwright/release-media-slop-cleanup-20260517/android-prompter-idle-clean.png) |
| iOS | Shooting board | ![iOS shooting board](../playwright/release-media-slop-cleanup-20260517/ios-board-clean.png) |
| iOS | Prompter direct route | ![iOS prompter direct route](../playwright/release-media-slop-cleanup-20260517/ios-prompter-direct.png) |

## Result

Pass:

- Board removes the prior `No take yet` and `0 takes` copy from the main cut rows.
- Board note affordance is no longer a box inside a box.
- Reference viewer title uses the execution title, not `Reference` or `Cut #1: Hook`.
- Reference viewer cut rail is compact numeric navigation.
- Prompter no longer exposes `READY`, `Scene 1`, `CARD PROMPT`, `FULL SCRIPT`, or `SHOOTING GUIDELINE` as visible copy.
- Prompter exposes compact `Line` / `Script` modes, text size controls, opacity controls, and cut rail controls.
- iOS Expo Go route can open both the shooting board and prompter surface.

Blocked / risk:

- Android emulator crashed while attempting the latest record-button QA. The implementation passed static and visual idle checks, but this run should not be counted as a fresh Android record/save pass.
- iOS dev-client was not installed in the simulator, so iOS runtime evidence used Expo Go and direct route screenshots. Record/save still needs a dev-client or device QA pass before store submission.
- The Android camera preview image is simulator placeholder output, not real camera feed evidence.

## Verification

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

## Next Action

Before App Store / Play Store submission, run a dev-client or physical-device QA pass focused on camera record, take review, local keep, export/share, and return-to-cut behavior on both platforms.
