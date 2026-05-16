# Issues 7 9 4 Design Burn-Down QA

## Test Time

2026-05-16 Asia/Seoul

## Scope

- #7: Explore card CTA simplification.
- #4: Passive next-cut guidance without auto-open/focus.
- #9: Shooting board page layout and reference placement.

## Summary

PASS.

- Explore recommended cards and browse rows are now the primary action surfaces. Duplicate nested CTA buttons and old action helpers are removed.
- Board entry no longer auto-opens the next cut from passive guidance, board load, or completion toggles.
- Explicit `sceneId` links still open the requested cut once per board/scene/take route key.
- Expanded shooting board content is board-like: line to say, shot guide, reference, checklist/progress, and saved takes are visible without the old nested editor/reference/take boxes.

## Commands

```bash
./node_modules/.bin/sucrase-node src/features/explore/lib/explore-card-cta-contract.test.ts
./node_modules/.bin/sucrase-node src/features/explore/lib/explore-template-copy-action.test.ts
./node_modules/.bin/sucrase-node src/features/explore/lib/explore-template-recipe-copy.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
npx -y @google/design.md lint DESIGN.md
git diff --check
EXPO_NO_TELEMETRY=1 npx expo start --go --port 8092 --localhost --clear
~/Library/Android/sdk/emulator/emulator -avd Pixel_9 -no-snapshot-load
~/Library/Android/sdk/platform-tools/adb reverse tcp:8092 tcp:8092
~/Library/Android/sdk/platform-tools/adb shell am start -a android.intent.action.VIEW -d 'exp://127.0.0.1:8092/--/explore' host.exp.exponent
~/Library/Android/sdk/platform-tools/adb exec-out screencap -p
/Library/Developer/PrivateFrameworks/CoreSimulator.framework/Versions/A/Resources/bin/simctl openurl 736C8797-5E0C-420B-AB37-57DA32D71E6A 'exp://127.0.0.1:8092/--/explore'
/Library/Developer/PrivateFrameworks/CoreSimulator.framework/Versions/A/Resources/bin/simctl io 736C8797-5E0C-420B-AB37-57DA32D71E6A screenshot ...
```

## Test Results

- Focused source contracts: PASS.
- TypeScript: PASS.
- Architecture boundary check: PASS.
- `git diff --check`: PASS.
- `DESIGN.md` lint: PASS with 0 errors, 14 existing warnings about unused design tokens.
- Android Expo Go QA: PASS.
- iPhone Expo Go QA: PASS using underlying CoreSimulator `simctl`.

## Android Evidence

- #7 Explore overview: `output/playwright/issue-7-explore-qa-20260516/android-explore-overview.png`
- #7 Explore card opens detail: `output/playwright/issue-7-explore-qa-20260516/android-explore-card-open.png`
- #4 Board overview, no scene route: `output/playwright/issue-4-passive-next-cut-qa-20260516/android-board-overview.png`
- #9 Expanded board with reference/checklist/saved takes: `output/playwright/issue-9-board-qa-20260516/android-board-expanded.png`

## iPhone Evidence

- #7 Explore overview: `output/playwright/issue-7-explore-qa-20260516/ios-explore-overview.png`
- #7 Explore card opens detail: `output/playwright/issue-7-explore-qa-20260516/ios-explore-card-open.png`
- #4 Board overview, no scene route: `output/playwright/issue-4-passive-next-cut-qa-20260516/ios-board-overview.png`
- #9 Expanded board with reference/checklist/saved takes: `output/playwright/issue-9-board-qa-20260516/ios-board-expanded.png`

## Issue Results

### #7

PASS.

- Recommended card has no duplicate nested action button.
- Browse row has no button cluster.
- Card/row opens detail.
- Old action helper contract was removed from Explore code.

### #4

PASS.

- Board overview keeps passive highlight only.
- No next-cut auto-open on board entry.
- No next-cut auto-open on completion toggle.
- No camera jump.
- Explicit scene deep links still expand only the requested cut and do not repeatedly override manual choices.

### #9

PASS.

- Expanded cut layout no longer uses the old nested `editorSection`, `referenceViewerSection`, or `takeViewerSection`.
- Reference sits near cut copy in a wrapping primary board area.
- Checklist/progress is visible and interactive.
- Saved takes and film/retake/final actions remain reachable.
- Preview controls now have explicit accessibility labels/hints.

## Review Notes

Subagent review found and we fixed:

- #7 contract initially missed stale helper/callback coverage.
- #4 still had board-load, completion-toggle, and stale deep-link auto-expansion paths.
- #9 initially missed checklist/progress and preview accessibility labels.
- Final review found saved-take checklist hydration could override user checklist edits; hydration now preserves explicit checklist state after the first saved-take hydration.

## Residual Risk

- Several regression tests are source-contract tests. They are useful for this UI regression class, but some are intentionally formatting-sensitive.
- Existing recipe lib tests using `@/core/mocks/parrotkit-data` still fail under raw `sucrase-node` alias resolution before assertions run. The changed focused tests avoid that issue.
- iPhone QA uses Expo Go and the underlying CoreSimulator `simctl` binary because the Xcode `simctl` wrapper mismatch remains documented from earlier QA.

## Recommendation

- Close #7.
- Close #4.
- Close #9.
- Keep broader #10 native capture package open unless the owner wants this issue-specific evidence to count toward that final board.
