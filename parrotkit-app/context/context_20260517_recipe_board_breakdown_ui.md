# 2026-05-17 Recipe Board Breakdown UI

## Decision

Supadata/Gemini video analysis and automatic cut segmentation are deferred. The UI boundary was implemented first:

- `Board`: compact filming actions.
- `Breakdown`: video-level analysis from the Recipe Analysis Contract.

## Rationale

The Recipe Analysis Contract can store Sandcastle-level detail, but `DESIGN.md` requires the filming UI to stay compact and execution-first. Building the UI projection first prevents future analysis APIs from flooding the board with taxonomy labels.

## Implemented

- Added a recipe-level breakdown summary model.
- Added a `Board / Breakdown` switch on the shooting board page.
- Added a video-level Breakdown panel.
- Reworked collapsed cut rows so the reference is the left 9:16 anchor and My Take is the user's result/action state.
- Kept hook analysis video-level instead of repeating it per cut.

## Verification

PASS:

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md`
- `git diff --check`

Android QA evidence:

- `output/playwright/recipe-board-breakdown-20260517/android-board.png`
- `output/playwright/recipe-board-breakdown-20260517/android-breakdown.png`

iOS fresh capture remains blocked because `xcrun simctl openurl` and screenshot commands timed out with exit 124. No stale iOS screenshot was reused.
