# Shooting Session Board Redesign QA

Date: 2026-05-17 KST

Target: current native app from `/Users/junho/project/parrotkit-app/parrotkit-app`

## Summary

Android runtime QA: PASS.

iPhone Simulator fresh capture: BLOCKED by local Simulator/CoreSimulator tooling.

The shooting board now renders as a short-form filming session surface:

- dark session top bar with `Done`
- readable light status bar over the dark top bar
- recipe title in the white body header
- note row as an entry point
- note/check surface expands only after tapping the note row
- 9:16 Reference and My Take frames
- execution-first cut title: `Open on the finished look`
- quiet `Cut list` header and small reorder toggle

## Static Verification

PASS:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-execution-title.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-header.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-note-entry-contract.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-session-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
npx -y @google/design.md lint DESIGN.md
git diff --check
```

`DESIGN.md` lint result: 0 errors, 14 existing unused-token warnings.

## Android Evidence

Runtime setup:

```bash
EXPO_NO_TELEMETRY=1 npm run start -- --port 8096 --localhost
adb reverse tcp:8096 tcp:8096
adb shell am start -W -a android.intent.action.VIEW -d 'exp+parrotkit-app://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8096' com.anonymous.parrotkitapp
adb shell am start -W -a android.intent.action.VIEW -d 'parrotkit-app://recipe/recipe-korean-diet-hook' com.anonymous.parrotkitapp
adb exec-out screencap -p
```

Screenshots:

- `output/playwright/shooting-session-board-20260517/android-board-overview.png`
- `output/playwright/shooting-session-board-20260517/android-note-expanded.png`
- `output/playwright/shooting-session-board-20260517/contact-sheet.svg`

Observed:

- Status bar icons/text are readable over the dark top bar after the screen-local `StatusBar style="light"` fix.
- The dark top bar owns session stats and `Done`.
- The body header owns `Food Promo Shooting Guide`.
- The note row is collapsed by default.
- Tapping the note row opens the note/check surface without a boxed CTA stack.
- Reference and My Take media are vertical 9:16 frames.
- Collapsed row primary copy is execution-first, not `Hook`.

## iPhone Attempt

Fresh iPhone capture was attempted through:

```bash
timeout 8 xcrun simctl list devices booted
timeout 8 /Applications/Xcode.app/Contents/Developer/usr/bin/simctl list devices booted
timeout 8 /Applications/Xcode.app/Contents/Developer/usr/bin/simctl io booted screenshot output/playwright/shooting-session-board-20260517/ios-board-overview.png
timeout 8 /Applications/Xcode.app/Contents/Developer/usr/bin/simctl io 736C8797-5E0C-420B-AB37-57DA32D71E6A screenshot output/playwright/shooting-session-board-20260517/ios-board-overview.png
```

Blocked:

- `simctl` commands repeatedly timed out with exit code 124.
- Simulator app process existed, but Computer Use returned `cgWindowNotFound`, so no visible Simulator window was available for screenshot capture.

No stale iPhone screenshot was reused as passing evidence.

## Decision

The implementation passes static verification and Android runtime QA. iPhone fresh capture remains a local tooling blocker and should be retried after Simulator/CoreSimulator is healthy.
