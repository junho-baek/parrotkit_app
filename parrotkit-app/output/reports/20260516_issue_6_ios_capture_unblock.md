# 2026-05-16 Issue 6 iOS Capture Unblock

## Summary

- Target issue: GitHub #6.
- Result: PASS for nav visibility and iPhone capture coverage after one iOS-specific visibility fix.
- Code fix: keep Paste configured as a non-destination action, but give the Expo Router `Tabs.Screen` a harmless Home href fallback so iOS/Expo Go does not hide the tab item.
- iPhone device: iPhone 17 Pro Simulator, iOS 26.4.1, 1206x2622.
- Android evidence reused from `output/playwright/main-tab-paste-qa-20260516/`.

## Key Finding

The first iPhone capture showed Home / Explore / Recipes / My only. The centered Paste action was missing on iOS even though Android showed it. The root cause was that Expo Router can hide a tab item when `Tabs.Screen` is configured with `href: null` on iOS/Expo Go. Product config still keeps `rootTabHrefs.paste` as `null`, but `RootNativeTabs` now uses `getRootTabScreenHref('paste')` to return `/` only for the screen option. The custom Paste `tabBarButton` still intercepts press and opens the drawer in place.

## Evidence

| Area | Screenshot |
| --- | --- |
| iPhone Home | `output/playwright/issue-6-ios-capture-20260516/ios-home-tab.png` |
| iPhone Explore | `output/playwright/issue-6-ios-capture-20260516/ios-explore-tab.png` |
| iPhone Paste drawer | `output/playwright/issue-6-ios-capture-20260516/ios-paste-drawer.png` |
| iPhone Recipes | `output/playwright/issue-6-ios-capture-20260516/ios-recipes-tab.png` |
| iPhone My | `output/playwright/issue-6-ios-capture-20260516/ios-my-tab.png` |
| iPhone board | `output/playwright/issue-6-ios-capture-20260516/ios-issue-6-nav-board.png` |
| Android board | `output/playwright/main-tab-paste-qa-20260516/android-main-tab-paste-board.png` |

## Commands Run

```bash
timeout 8 xcrun simctl list devices booted
timeout 8 xcrun simctl list runtimes
/Library/Developer/PrivateFrameworks/CoreSimulator.framework/Versions/A/Resources/bin/simctl list devices available
/Library/Developer/PrivateFrameworks/CoreSimulator.framework/Versions/A/Resources/bin/simctl boot 736C8797-5E0C-420B-AB37-57DA32D71E6A
/Library/Developer/PrivateFrameworks/CoreSimulator.framework/Versions/A/Resources/bin/simctl bootstatus 736C8797-5E0C-420B-AB37-57DA32D71E6A -b
EXPO_NO_TELEMETRY=1 npm run start:go -- --port 8090 --localhost
/Library/Developer/PrivateFrameworks/CoreSimulator.framework/Versions/A/Resources/bin/simctl openurl 736C8797-5E0C-420B-AB37-57DA32D71E6A exp://127.0.0.1:8090
/Library/Developer/PrivateFrameworks/CoreSimulator.framework/Versions/A/Resources/bin/simctl openurl 736C8797-5E0C-420B-AB37-57DA32D71E6A exp://127.0.0.1:8090/--/explore
/Library/Developer/PrivateFrameworks/CoreSimulator.framework/Versions/A/Resources/bin/simctl openurl 736C8797-5E0C-420B-AB37-57DA32D71E6A exp://127.0.0.1:8090/--/recipes
/Library/Developer/PrivateFrameworks/CoreSimulator.framework/Versions/A/Resources/bin/simctl openurl 736C8797-5E0C-420B-AB37-57DA32D71E6A exp://127.0.0.1:8090/--/my
/Library/Developer/PrivateFrameworks/CoreSimulator.framework/Versions/A/Resources/bin/simctl openurl 736C8797-5E0C-420B-AB37-57DA32D71E6A 'exp://127.0.0.1:8090/--/recipe-create?mode=reference'
/Library/Developer/PrivateFrameworks/CoreSimulator.framework/Versions/A/Resources/bin/simctl io 736C8797-5E0C-420B-AB37-57DA32D71E6A screenshot ...
./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts
./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts
./node_modules/.bin/sucrase-node src/core/navigation/root-tab-ios-layout-verification.test.ts
./node_modules/.bin/sucrase-node src/core/navigation/root-tab-android-layout-verification.test.ts
./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npx -y @google/design.md lint DESIGN.md
git diff --check
```

## Validation

- iPhone bottom navigation now shows Home / Explore / Paste / Recipes / My.
- Paste is prominent and centered on iPhone and Android captures.
- iPhone `recipe-create?mode=reference` renders the same `New recipe` drawer UI with dim backdrop, drag handle, close X, Blank/Link/Brand tabs, niche grid, goal cards, and Open recipe board CTA.
- Android tapping evidence from #15 confirms the center Paste button opens the drawer from Home, Explore, Recipes, and My.
- Focused navigation tests, TypeScript checks, and whitespace check passed.
- DESIGN.md lint completed with 0 errors, 14 warnings, 1 info.
- Exact source-route residue search found no non-test hits for `Source Inbox`, `Source inbox`, `/source`, or `source-actions`.

## Environment Notes

- The Xcode `simctl` wrapper is currently blocked by a local Xcode/CoreSimulator version mismatch: Xcode expects CoreSimulator `1051.54`, while the machine has `1051.50`.
- `xcodebuild` cannot target the installed iOS 26.4 simulator because the active Xcode only has the iOS 26.5 simulator SDK/runtime expectation.
- iPhone captures were taken through Expo Go using the underlying CoreSimulator `simctl` binary. This is enough for the nav/rendering acceptance criteria, but final dev-client iOS QA should wait until the Xcode/Simulator mismatch is fixed.

## Closure Recommendation

- Close #6: nav route correctness and iPhone/Android capture evidence are now present.
- Keep #10 open: it still requires a broader final QA capture package with board/reference/copy screens.
- Keep #11 open until the remaining broader drawer lifecycle/accessibility criteria are explicitly verified.
