# 2026-05-16 Main Tab Paste QA

## Summary

- Target issue: GitHub #15, parent #11.
- Device completed: Android Emulator `Pixel_9`, 1080x2424.
- Result: PASS for #15 acceptance criteria on Android emulator.
- Remaining risk: iOS Simulator capture is blocked by `simctl` timeout, so #6 remains open for iPhone capture coverage.

## Scope

- Verify Paste opens in place from Home, Explore, Recipes, and My.
- Verify main tab experience does not expose Source Inbox, `/source`, or `/source-actions`.
- Record runtime setup commands, screenshots, and residual risk.

## Evidence

| Area | Screenshot |
| --- | --- |
| Home tab | `output/playwright/main-tab-paste-qa-20260516/android-home-tab.png` |
| Home -> Paste drawer | `output/playwright/main-tab-paste-qa-20260516/android-home-paste-drawer.png` |
| Explore tab | `output/playwright/main-tab-paste-qa-20260516/android-explore-tab.png` |
| Explore -> Paste drawer | `output/playwright/main-tab-paste-qa-20260516/android-explore-paste-drawer.png` |
| Recipes tab | `output/playwright/main-tab-paste-qa-20260516/android-recipes-tab.png` |
| Recipes -> Paste drawer | `output/playwright/main-tab-paste-qa-20260516/android-recipes-paste-drawer.png` |
| My tab | `output/playwright/main-tab-paste-qa-20260516/android-my-tab.png` |
| My -> Paste drawer | `output/playwright/main-tab-paste-qa-20260516/android-my-paste-drawer.png` |

Combined board: `output/playwright/main-tab-paste-qa-20260516/android-main-tab-paste-board.png`

## Commands Run

```bash
emulator -avd Pixel_9 -no-snapshot-load -no-audio -no-boot-anim
EXPO_NO_TELEMETRY=1 npm run start -- --port 8090
adb reverse tcp:8090 tcp:8090
EXPO_NO_TELEMETRY=1 ./node_modules/.bin/expo run:android --no-bundler
adb shell input tap 540 2260
adb exec-out screencap -p > output/playwright/main-tab-paste-qa-20260516/android-*.png
rg -n "Source Inbox|Source inbox|/source|source-actions" src/app src/app-shell src/features src/core -g '!**/*.test.ts' -g '!**/*.test.tsx'
./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts
./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
git diff --check
timeout 8 xcrun simctl list devices booted
```

## Findings

- Home, Explore, Recipes, and My remain visible destination tabs.
- Paste remains a prominent centered action in the bottom bar.
- Tapping Paste from each tested tab opens the `New recipe` modal sheet with dim backdrop, drag handle, close X, Blank/Link/Brand tabs, niche grid, goal cards, and bottom `Open recipe board` CTA.
- The drawer opens over the current tab instead of navigating to a Source Inbox route.
- Exact source-route residue search returned no hits for `Source Inbox`, `Source inbox`, `/source`, or `source-actions` in non-test app/navigation/features/core paths.
- Focused navigation tests, root-tabs TypeScript check, full TypeScript check, and `git diff --check` passed.

## Residual Risk

- iOS Simulator did not produce captures because `xcrun simctl list devices booted` repeatedly timed out with exit code 124. Computer Use also could not attach to the Simulator window (`cgWindowNotFound`).
- Before rebuilding the Android dev client, the installed runtime was stale and failed with missing native modules (`ExpoVideo`, `RNGestureHandlerModule`). Rebuilding and reinstalling the Android debug app resolved the runtime blocker.
- #6 should remain open because it explicitly requires native captures on both iPhone and Android.
- #11 should remain open until #6 is closed and the broader recipe-creation/close/reset/accessibility acceptance criteria are verified.

## Closure Recommendation

- Close #15: its targeted main-tab Paste QA criteria are satisfied on Android emulator and source-route residue search is clean.
- Keep #6 open: iPhone capture coverage is still missing.
- Keep #11 open: parent epic still depends on #6 and additional broader acceptance criteria.
