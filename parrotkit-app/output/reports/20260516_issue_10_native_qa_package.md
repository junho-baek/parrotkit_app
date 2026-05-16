# Issue #10 Native QA Package

Date: 2026-05-16 19:30 KST

Target: current native app from `/Users/junho/project/parrotkit-app/parrotkit-app`

## Summary

- Android fresh capture: PASS.
- Static checks: PASS.
- iPhone fresh recapture: BLOCKED by local Simulator/CoreSimulator state.
- Same-day iPhone evidence was included for reference, but some files are stale and must not be treated as final #10 acceptance.

## Static Checks

- PASS `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS `npm run check:architecture`
- PASS `git diff --check`
- PASS `npx -y @google/design.md lint DESIGN.md`

`DESIGN.md` lint result: 0 errors, 14 existing unused-token warnings.

## Android Fresh Evidence

Captured from the current 8094 development build through `com.anonymous.parrotkitapp`.

- `output/playwright/issue-10-native-qa-20260516/android-01-home.png`
- `output/playwright/issue-10-native-qa-20260516/android-02-explore.png`
- `output/playwright/issue-10-native-qa-20260516/android-03-explore-detail.png`
- `output/playwright/issue-10-native-qa-20260516/android-04-create-drawer.png`
- `output/playwright/issue-10-native-qa-20260516/android-05-goal-grid.png`
- `output/playwright/issue-10-native-qa-20260516/android-06-board-overview.png`
- `output/playwright/issue-10-native-qa-20260516/android-07-board-expanded.png`

Observed:

- Explore detail uses `Reference feature`, `Reference structure`, and `Apply it to your case`.
- Explore detail no longer shows the old `Included` grid or fixed `Key Hook` section on Android.
- Recipe create drawer shows dim backdrop, drag handle, close button, tabs, niche grid, goal cards, and bottom CTA.
- Board now shows a top reference preview above the title area on Android.
- Cut rows use compact left space, show `Line to Say` and `Shot guide`, and completion is oriented around My Take status.

## iPhone Evidence

Fresh iPhone capture was attempted through Expo CLI, `simctl`, Simulator app restart, and Simulator window discovery.

Blocked:

- `xcrun simctl list devices booted` timed out.
- `xcrun simctl io booted screenshot ...` timed out.
- Simulator relaunched with no device window exposed to capture.

Included same-day existing iPhone files:

- `output/playwright/issue-10-native-qa-20260516/ios-01-home-existing.png`
- `output/playwright/issue-10-native-qa-20260516/ios-02-explore-existing.png`
- `output/playwright/issue-10-native-qa-20260516/ios-03-explore-detail-existing.png`
- `output/playwright/issue-10-native-qa-20260516/ios-04-create-drawer-existing.png`
- `output/playwright/issue-10-native-qa-20260516/ios-05-goal-grid-existing.png`
- `output/playwright/issue-10-native-qa-20260516/ios-06-board-overview-existing.png`
- `output/playwright/issue-10-native-qa-20260516/ios-07-board-expanded-existing.png`

Important: these iPhone files are not final fresh #10 evidence. At least the existing iOS Explore detail and board captures show stale pre-follow-up UI.

## Contact Sheet

- `output/playwright/issue-10-native-qa-20260516/issue-10-contact-sheet.svg`

## Fix During QA

Android QA exposed that the board-level reference preview could disappear when runtime board media was missing or stale. The board now:

- hydrates missing reference media from the source board when an existing editor board is reused;
- still renders a reference preview shell even when a media URI is unavailable.

## Decision

Do not close #10 yet. Android and static acceptance are covered, but iPhone fresh recapture is still required before the issue can be honestly marked complete.

## Recommended Next Action

Restart or rebuild the iOS Simulator/CoreSimulator environment, then recapture the same seven iPhone screens from the current 8094 dev build.

