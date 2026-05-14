# Brand Context Locked Guidance

## 작업 시간

- 2026-05-14

## 범위

- Sub-AC 9.2: Brand context UI remains locked and shows only Pro/coming-soon guidance.
- Kept changes scoped to the recipe creation option contract/test and recipe creation screen copy.

## 변경 요약

- Updated `src/features/recipes/lib/recipe-create-options.test.ts`.
  - Added a focused assertion that Brand context locked guidance does not expose upload or brief-flow wording.
- Updated `src/features/recipes/screens/recipe-create-screen.tsx`.
  - Replaced stale Brand helper text with Pro/coming-soon locked guidance.
  - Replaced stale Brand field/chip fallback copy with locked-only wording.
  - Kept Brand route/tap behavior on the existing locked guidance path and did not add paid/API/upload flows.

## 검증

- `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts`
  - Passed.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
  - Passed.
- `rg -n "Upload a brand|Brief upload|brand brief|upload a brief|PDF, doc|브리프 업로드|PDF, 문서|업로드하면|업로드" src/features/recipes/screens/recipe-create-screen.tsx src/features/recipes/lib/recipe-create-options.test.ts src/features/recipes/lib/recipe-create-options.ts`
  - No matches in focused creation files.
- iPhone simulator gate attempted with `xcrun simctl list devices booted`.
  - Blocked by unavailable CoreSimulatorService in this sandbox (`connection invalid`, `Connection refused`).

## 리스크 / 후속

- Live iPhone simulator UI QA still needs to be run in an environment where CoreSimulatorService is available.
- No commit or push was made per task constraint.
