# Context: 2026-05-16 Main Tab Paste QA

## What changed

- Added a QA plan for GitHub #15.
- Captured Android Emulator evidence for Home, Explore, Recipes, and My.
- Captured Android Emulator evidence that the centered Paste CTA opens the `New recipe` bottom drawer from all four main tabs.
- Added QA report at `output/reports/20260516_main_tab_paste_qa.md`.

## Verification

- Android Emulator `Pixel_9` booted and ran the current app after rebuilding the dev client with `EXPO_NO_TELEMETRY=1 ./node_modules/.bin/expo run:android --no-bundler`.
- Metro ran on port 8090 with `EXPO_NO_TELEMETRY=1 npm run start -- --port 8090`.
- `adb reverse tcp:8090 tcp:8090` was applied before runtime QA.
- Exact source-route residue search found no non-test hits for `Source Inbox`, `Source inbox`, `/source`, or `source-actions`.
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts` passed.
- `./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts` passed.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` passed.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` passed.
- `git diff --check` passed.

## Screenshots

- `output/playwright/main-tab-paste-qa-20260516/android-home-tab.png`
- `output/playwright/main-tab-paste-qa-20260516/android-home-paste-drawer.png`
- `output/playwright/main-tab-paste-qa-20260516/android-explore-tab.png`
- `output/playwright/main-tab-paste-qa-20260516/android-explore-paste-drawer.png`
- `output/playwright/main-tab-paste-qa-20260516/android-recipes-tab.png`
- `output/playwright/main-tab-paste-qa-20260516/android-recipes-paste-drawer.png`
- `output/playwright/main-tab-paste-qa-20260516/android-my-tab.png`
- `output/playwright/main-tab-paste-qa-20260516/android-my-paste-drawer.png`
- `output/playwright/main-tab-paste-qa-20260516/android-main-tab-paste-board.png`

## Issue status recommendation

- #15 can be closed.
- #6 should stay open because it explicitly requires iPhone and Android captures; iPhone capture remains blocked by `simctl` timeout.
- #11 should stay open because it is the parent epic and still depends on #6 plus broader creation/reset/accessibility checks.

## Residual risk

- `timeout 8 xcrun simctl list devices booted` repeatedly exited 124, and Computer Use could not attach to the Simulator window. iOS coverage must be retried after CoreSimulator is healthy.
- The first Android app launch hit a stale dev-client runtime with missing native modules. Rebuilding the Android dev client fixed this for QA.
