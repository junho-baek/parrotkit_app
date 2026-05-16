# 2026-05-17 Recipe Board Breakdown UI QA

## Target

Local Expo development build, Android emulator, recipe detail shooting board.

## Purpose

Verify the Superpowers plan implementation:

- Board remains the default filming surface.
- Breakdown separates video-level analysis from cut rows.
- Collapsed cut rows are compact and execution-first.
- Supadata/Gemini ingestion remains deferred.

## Results

PASS:

- Board is the default tab.
- Breakdown tab renders video-level analysis.
- Hook appears once as a video-level breakdown item, not on every cut.
- Collapsed cut rows use execution titles.
- Reference is positioned as the left 9:16 source anchor.
- My Take is shown as the user's result/action state.
- Redundant empty take labels are not shown.

## Android Evidence

- `output/playwright/recipe-board-breakdown-20260517/android-board.png`
- `output/playwright/recipe-board-breakdown-20260517/android-breakdown.png`

## iOS Status

Fresh iOS capture is blocked locally:

- `timeout 8 xcrun simctl openurl booted 'exp+parrotkit-app://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8096'` exited 124.
- `timeout 8 xcrun simctl openurl booted 'parrotkit-app://recipe/recipe-korean-diet-hook'` exited 124.
- `timeout 8 xcrun simctl io booted screenshot output/playwright/recipe-board-breakdown-20260517/ios-board.png` exited 124.

No stale iOS screenshot was reused.

## Verification

PASS:

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md`
- `git diff --check`

`DESIGN.md` lint returned 0 errors and 14 existing unused-token warnings.

