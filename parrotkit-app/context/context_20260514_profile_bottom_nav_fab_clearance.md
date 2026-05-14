# Profile Bottom Nav FAB Clearance

## 작업 시간

- 2026-05-14

## 범위

- AC 7: My/Profile content is not obscured by the bottom nav or FAB on iPhone simulator-sized layouts.
- Change stayed local to the My/Profile scroll bottom padding contract.

## 변경 요약

- Added `src/features/profile/lib/profile-layout.ts`.
  - Encodes Profile bottom scroll padding as 196pt plus the iPhone safe-area bottom inset.
  - This yields 230pt on home-indicator iPhones, clearing the native tab bar and the `/my` global FAB stack.
- Added `src/features/profile/lib/profile-layout.test.ts`.
  - Verifies compact iPhone padding is 196pt.
  - Verifies home-indicator iPhone padding is 230pt.
  - Verifies the bottom safe-area inset is applied exactly once.
- Updated `src/features/profile/screens/profile-screen.tsx`.
  - Passes `bottomPadding={getProfileScrollBottomPadding(insets.bottom)}` to `AppScreenScrollView`.
- Added `tsconfig.profile-bottom-clearance-check.json` for focused type validation.

## 검증

- Red: `./node_modules/.bin/sucrase-node src/features/profile/lib/profile-layout.test.ts`
  - Failed before implementation because `profile-layout` did not exist.
- Green: `./node_modules/.bin/sucrase-node src/features/profile/lib/profile-layout.test.ts`
  - Passed.
- Focused TypeScript: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.profile-bottom-clearance-check.json`
  - Passed.

## Simulator QA

- Attempted iPhone simulator discovery with `xcrun simctl list devices booted` and `xcrun simctl list devices available`.
- Blocked by CoreSimulatorService connection failure: `CoreSimulatorService connection became invalid` / `Unable to locate device set`.
- Web QA was intentionally not used because this run scopes the UI gate to iPhone simulator behavior.

## 리스크 / 후속

- Live simulator screenshot/tap evidence could not be captured in this sandbox due to CoreSimulatorService failure.
- Validate `/my` on a real iPhone simulator/device in the next executable level.
