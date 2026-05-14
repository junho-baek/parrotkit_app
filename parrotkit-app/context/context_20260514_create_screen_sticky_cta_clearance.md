# Create Screen Sticky CTA Clearance

## 작업 시간

- 2026-05-14

## 범위

- AC 6: Create screen lower cards remain readable and tappable above the sticky CTA on iPhone simulator-sized layouts.
- Change stayed local to the recipe create screen scroll/footer spacing contract.

## 변경 요약

- Added `src/features/recipes/lib/recipe-create-layout.ts`.
  - Encodes create-screen bottom scroll padding as safe-area bottom inset plus footer top padding, CTA minimum height, and 68pt card tap/readability clearance.
  - Preserves the prior compact-iPhone bottom padding value of 138pt while making the contract explicit.
- Added `src/features/recipes/lib/recipe-create-layout.test.ts`.
  - Verifies compact iPhone padding is 138pt.
  - Verifies home-indicator iPhone padding is 172pt.
  - Verifies the bottom safe-area inset is applied exactly once.
- Updated `src/features/recipes/screens/recipe-create-screen.tsx`.
  - Replaced inline `insets.bottom + 138` magic number with `getRecipeCreateScrollBottomPadding(insets.bottom)`.
- Updated `tsconfig.recipe-create-options-check.json`.
  - Includes the new layout helper/test in the focused create-screen type check.

## 검증

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-layout.test.ts`
  - Failed before implementation because `recipe-create-layout` did not exist.
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-layout.test.ts`
  - Passed.
- Regression: `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts`
  - Passed.
- Focused TypeScript: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
  - Passed.

## Simulator QA

- Attempted iPhone simulator discovery with `xcrun simctl list devices booted` and `xcrun simctl list devices available`.
- Blocked by CoreSimulatorService connection failure: `CoreSimulatorService connection became invalid` / `Unable to locate device set`.
- Web QA was intentionally not used because this run scopes the UI gate to iPhone simulator behavior.

## 리스크 / 후속

- Live simulator screenshot/tap evidence could not be captured in this sandbox due to CoreSimulatorService failure.
- The layout contract preserves the existing visual clearance while making future regressions detectable by focused tests.
