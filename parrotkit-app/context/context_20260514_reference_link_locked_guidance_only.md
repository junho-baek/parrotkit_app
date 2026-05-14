# Reference Link Locked Guidance Only

## 작업 시간

- 2026-05-14

## 범위

- Sub-AC 9.1: Reference link UI remains locked and shows only Pro/coming-soon guidance.
- Targeted the recipe creation surface reached from Home/create entry points.

## 변경 요약

- Updated `src/features/recipes/lib/recipe-create-options.ts`.
  - Added `lockedGuidanceLabel: "Pro / coming soon"` to Pro-locked creation option metadata.
  - Kept Reference link and Brand context visible and locked.
- Updated `src/features/recipes/lib/recipe-create-options.test.ts`.
  - Added a focused assertion that Reference link exposes explicit Pro/coming-soon locked guidance.
  - Existing assertions continue to require Reference taps/routes to keep manual selected while showing guidance.
- Updated `src/features/recipes/screens/recipe-create-screen.tsx`.
  - Locked creation cards now render the locked guidance label as the card body.
  - Reference no longer presents the active link-generation card body while locked.

## 검증

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts`
  - Failed with `Reference link option must show only Pro/coming-soon guidance while locked.`
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts`
  - Passed.
- Focused TypeScript: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
  - Passed.
- iPhone simulator availability: `xcrun simctl list devices booted`
  - Blocked by unavailable CoreSimulatorService in the sandbox (`connection invalid`, simulator service/log permission errors).

## 리스크 / 후속

- No commit or push was made per task constraint.
- Live iPhone simulator UI QA still needs to be run in an environment where CoreSimulatorService is available.
