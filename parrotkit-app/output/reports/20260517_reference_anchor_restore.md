# Reference Anchor Restore QA

## Target

- Android emulator
- Recipe detail shooting board
- `Food Promo Shooting Guide`

## Result

PASS. The reference video entry is visible again as a 9:16 preview in each compact cut row, and tapping it opens the reference viewer.

## Evidence

- Board: `output/playwright/recipe-board-breakdown-20260517/android-board-reference-fixed.png`
- Viewer: `output/playwright/recipe-board-breakdown-20260517/android-reference-viewer-fixed.png`

## Notes

- The previous UI technically kept `onPreview`, but the visible entry point collapsed to a small play icon on the left edge.
- The restored UI makes the reference video discoverable without returning to the previous side-by-side media-slot boxes.
