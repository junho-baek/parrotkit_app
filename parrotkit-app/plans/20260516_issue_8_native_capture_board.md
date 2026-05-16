# 2026-05-16 Issue 8 Native Capture Board

## 배경

GitHub issue #8 requires iPhone and Android evidence for the restored recipe creation drawer, goal grid, and Other custom niche input before the issue can be closed.

## 목표

- Capture iPhone evidence for drawer, goal grid, and Other input.
- Capture Android evidence for drawer, goal grid, and Other input.
- Create a compact capture board and QA report that can be linked back to #8.
- Close #8 only if both platform evidence sets are produced and verified.

## 범위

- Included: simulator/emulator launch attempts, Expo runtime smoke, screenshots, capture board, QA report, GitHub issue comment.
- Excluded: product UI changes, native dependency fixes, dev-client linker fixes, Notion upload.

## 변경 파일

- `plans/20260516_issue_8_native_capture_board.md`
- `context/context_20260516_issue_8_native_capture_board.md`
- `output/playwright/issue-8-native-capture-20260516/`
- `output/reports/20260516_issue_8_native_capture_board.md`

## 테스트

- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- alias-hook `src/features/recipes/lib/recipe-create-flow.test.ts`
- iPhone simulator screenshot evidence
- Android emulator screenshot evidence
- Capture board visual inspection

## 롤백

- Remove the created plan/context/report and `output/playwright/issue-8-native-capture-20260516/` artifacts.
- No production code rollback should be needed because this is QA-only.

## 리스크

- Native dev-client iOS build is already documented as blocked by Xcode linker issues.
- Android emulator may boot but app install/runtime can fail if native build tooling is unavailable.
- Expo Go can verify the JS drawer flow, but any Expo Go limitation must be called out explicitly.

## 결과

- Android `Pixel_9` emulator booted and produced fresh Expo Go captures.
- Android captures cover Home, drawer/goal grid, Other selected, and `PetCare` typed in the custom input.
- Fresh iPhone `simctl openurl` and `simctl io ... screenshot` attempts hung even after restarting Simulator/CoreSimulator.
- Existing current-main iPhone Expo Go captures were copied into the issue-specific folder and included in the capture board.
- Capture board created at `output/playwright/issue-8-native-capture-20260516/issue-8-capture-board.png`.
- QA report created at `output/reports/20260516_issue_8_native_capture_board.md`.
- Linked context: `context/context_20260516_issue_8_native_capture_board.md`.
