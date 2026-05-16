# Context: 2026-05-16 Issue 6 iOS Capture Unblock

## What changed

- Fixed iOS visibility for the centered Paste tab action.
- Added `getRootTabScreenHref()` in `src/app-shell/navigation/root-native-tabs.tsx` so the product config can keep `rootTabHrefs.paste === null` while the iOS `Tabs.Screen` item remains visible.
- Added a source guard in `src/core/navigation/root-tab-config.test.ts` to prevent regressing the iOS Paste visibility workaround.
- Added #6 iPhone screenshots and contact board under `output/playwright/issue-6-ios-capture-20260516/`.
- Added QA report at `output/reports/20260516_issue_6_ios_capture_unblock.md`.

## Why

On iPhone Simulator via Expo Go, `href: null` caused the Paste tab item to be hidden. Android had already shown the intended five-slot bottom nav, so this was an iOS visibility regression rather than a product decision change.

## Verification

- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts` passed.
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts` passed.
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-ios-layout-verification.test.ts` passed.
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-android-layout-verification.test.ts` passed.
- `./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts` passed.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` passed.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` passed.
- `npx -y @google/design.md lint DESIGN.md` completed with 0 errors, 14 warnings, 1 info.
- `git diff --check` passed.

## Screenshots

- `output/playwright/issue-6-ios-capture-20260516/ios-home-tab.png`
- `output/playwright/issue-6-ios-capture-20260516/ios-explore-tab.png`
- `output/playwright/issue-6-ios-capture-20260516/ios-paste-drawer.png`
- `output/playwright/issue-6-ios-capture-20260516/ios-recipes-tab.png`
- `output/playwright/issue-6-ios-capture-20260516/ios-my-tab.png`
- `output/playwright/issue-6-ios-capture-20260516/ios-issue-6-nav-board.png`

## Environment notes

- The Xcode wrapper at `/Applications/Xcode.app/Contents/Developer/usr/bin/simctl` calls `xcodebuild -runFirstLaunch` because Xcode expects CoreSimulator `1051.54` but the machine has `1051.50`.
- Underlying CoreSimulator simctl at `/Library/Developer/PrivateFrameworks/CoreSimulator.framework/Versions/A/Resources/bin/simctl` works and was used for boot/openurl/screenshot.
- iOS dev-client build is blocked until the Xcode/Simulator runtime mismatch is fixed. Expo Go was sufficient for nav rendering capture.
