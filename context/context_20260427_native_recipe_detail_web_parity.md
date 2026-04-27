# 2026-04-27 Native Recipe Detail Web Parity

## Summary

- Reworked native recipe detail around the web `RecipeResult` structure.
- Recipe overview now shows vertical scene cards instead of a large hero and scene rail.
- Scene detail now opens into Analysis, Recipe, and Shoot tabs.
- Recipe tab focuses on selectable prompter cue cards.
- Shoot tab links to the existing native prompter route.
- Added native scene strategy metadata helpers for HOOK/BASE/CTA labels.

## Implementation Notes

- Added `RecipeSceneCard` for the web-style overview list.
- Added explicit thumbnail dimensions after simulator QA showed NativeWind aspect sizing expanding the card image.
- Added safe-area padding to scene detail mode after simulator QA showed the top bar under the dynamic island.
- Kept `SceneSequenceRail` in the codebase but removed it from `RecipeDetailScreen`.
- `.superpowers/` brainstorming artifacts were not committed.

## Verification

- `cd parrotkit-app && npx tsc --noEmit`: passed.
- iOS dev-client recipe overview QA: passed.
- iOS scene detail Analysis tab QA: passed.
- iOS scene detail Recipe tab QA: passed.
- Native prompter route from Shoot tab: passed.

## Evidence

- `output/playwright/native-recipe-detail-web-parity-overview.png`
- `output/playwright/native-recipe-detail-web-parity-scene.png`
- `output/playwright/native-recipe-detail-web-parity-prompter.png`

## Risk

- Current mock recipe thumbnails repeat the same image per scene, so the overview can feel less rich than the web once real per-scene thumbnails exist.
- The scene detail tab bar currently scrolls with content; this is acceptable for this pass but could be pinned in a later polish task.
