# Reference Media And Sandcastle Schema QA

## Scope

- Fix Board reference preview image for `Food Promo Shooting Guide`.
- Add Sandcastle-style breakdown schema and extraction prompt.
- Attempt Android and iPhone simulator QA.

## Result

Android PASS. Board reference preview now uses the influencer/product reference image instead of a generic food fallback.

iPhone BLOCKED. CoreSimulator/`simctl` did not respond reliably enough to open URL or capture screenshots.

## Evidence

- Android board: `output/playwright/recipe-execution-reference-20260517/android-board-influencer-reference.png`

## iPhone Attempts

- Opened Simulator app.
- Queried booted simulators through `simctl list devices booted`.
- Inspected local simulator device plists and found `iPhone 17 Pro` UDID `736C8797-5E0C-420B-AB37-57DA32D71E6A` in booted state.
- Tried `simctl openurl` against that UDID.
- Tried `simctl io screenshot` against that UDID.
- Restarted Simulator, `simdiskimaged`, `SimLaunchHost.arm64`, and CoreSimulator service.

Observed result: Simulator process exists but has no accessible window; `simctl` commands timeout with exit 124.

## Files

- `docs/reference-analysis/sandcastle-breakdown-schema-and-prompt.md`
- `src/domain/shoot-board/shoot-board-model.ts`
- `src/features/recipes/lib/shoot-board-model.test.ts`
