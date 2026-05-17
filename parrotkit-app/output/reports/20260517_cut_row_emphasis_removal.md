# Cut Row Emphasis Removal QA

## 테스트 시간

2026-05-17 14:40 KST

## 대상

- Local Expo dev client
- Android emulator `emulator-5554`
- Recipe execution board: `Food Promo Shooting Guide`

## 목적

Cut row의 left strip과 tinted background가 제거되어 행이 과하게 강조되지 않는지 확인한다.

## 검증 범위

- Current/highlighted row에 coral/yellow left strip이 없는지.
- Current/highlighted row에 tinted background가 없는지.
- Cut rows가 동일한 white row + divider rhythm을 유지하는지.
- `Line to Say` / `Shot guide` compact preview와 expanded detail이 유지되는지.

## 결과

- PASS: Left strip 제거됨.
- PASS: Tinted background 제거됨.
- PASS: Rows are separated by neutral dividers only.
- PASS: Timeline, reference thumbnail, Line to Say, Shot guide, My Take state remain visible.

## 스크린샷

- `output/playwright/recipe-execution-reference-20260517/android-no-row-emphasis-board.png`
- `output/playwright/recipe-execution-reference-20260517/android-no-row-emphasis-expanded.png`

## 리스크 / 다음 액션

- Current cut visual emphasis is intentionally removed. If users later need stronger orientation, prefer session-header progress or scroll position behavior before adding row-level decoration again.
