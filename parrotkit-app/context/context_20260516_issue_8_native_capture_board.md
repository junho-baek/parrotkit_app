# Context 2026-05-16 Issue 8 Native Capture Board

## 작업

GitHub issue #8을 닫을 수 있도록 recipe create drawer QA evidence board를 만들었다.

## 변경

- Added `plans/20260516_issue_8_native_capture_board.md`.
- Added `output/playwright/issue-8-native-capture-20260516/` artifacts.
- Added `output/reports/20260516_issue_8_native_capture_board.md`.
- Added this context record.

## Evidence

- `output/playwright/issue-8-native-capture-20260516/issue-8-capture-board.png`
- Android fresh runtime captures:
  - `android-00-home.png`
  - `android-01-drawer.png`
  - `android-02-other-visible.png`
  - `android-04-other-petcare-keyboard.png`
- iPhone current-main evidence copied into the issue folder:
  - `ios-00-home-existing.png`
  - `ios-01-drawer-existing.png`
  - `ios-02-other-petcare-existing.png`

## 검증

- Android emulator `Pixel_9` booted.
- Android Expo Go opened `exp://127.0.0.1:8083`.
- Android drawer opened from centered Paste action.
- Android Other input accepted `PetCare`.
- Capture board created with `ffmpeg`.

## Blockers

- Fresh iPhone `simctl openurl` and `simctl io ... screenshot` attempts hung even after restarting Simulator/CoreSimulator.
- Reused current-main iPhone Expo Go evidence from `output/playwright/native-qa-20260516/`, because the issue was previously blocked only on missing Android evidence.

## 리스크

- This is QA-only. No product code changed.
- Expo Go evidence is used for the drawer UI path; native dev-client iOS build remains separately blocked by Xcode linker issues.
