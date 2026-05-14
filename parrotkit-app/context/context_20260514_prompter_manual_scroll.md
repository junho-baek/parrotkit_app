# 2026-05-14 Prompter Manual Scroll

## Summary

Implemented AC 13: the recipe camera prompter supports manual scrolling.

## Changes

- Added `src/features/recipes/lib/prompter-scroll.ts` for deterministic manual scroll step/clamp behavior.
- Added `src/features/recipes/lib/prompter-scroll.test.ts` covering scroll down, top clamp, and bottom clamp behavior.
- Updated `src/features/recipes/screens/recipe-prompter-camera-screen.tsx` so `LINE TO SAY` is a bounded native `ScrollView` with drag scrolling plus up/down/reset buttons.
- Reset prompter scroll state on active scene changes.

## Verification

- `npm ci --ignore-scripts` completed from `package-lock.json`.
- `./node_modules/.bin/tsc --noEmit -p tsconfig.prompter-scroll.json` passed for the new helper/test before the temporary config was removed.
- `./node_modules/.bin/tsc --noEmit -p tsconfig.prompter-screen.json` passed for the prompter route/screen before the temporary config was removed.
- Full `./node_modules/.bin/tsc --noEmit` passed after sibling shoot-board changes were present in the worktree.

## Notes

- `npm run dev` is not available in `package.json`; the app exposes `start`, `start:go`, `android`, `ios`, `web`, and `prebuild`.
- Existing/sibling worktree changes were present in navigation, shoot-board model files, and prompter text-size files; they were not modified for this AC.
