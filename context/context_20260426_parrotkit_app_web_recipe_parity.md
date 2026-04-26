# ParrotKit App Web Recipe Parity Context

## Date
2026-04-26

## Summary
Implemented the native app recipe parity pass from the web product model. The recipe experience is now scene-first, with separate Analysis, Recipe, and Shoot surfaces. Recipe cue selection is backed by web-compatible `prompter.blocks`, and the native camera prompter displays only visible blocks.

## Changes
- Added native recipe domain types in `parrotkit-app/src/features/recipes/types/recipe-domain.ts`.
- Added `normalizeNativeRecipe` and `normalizeNativeRecipeScene` to lift legacy flat mock scenes into `analysis`, `recipe`, and `prompter.blocks`.
- Extended `MockRecipeScene` to accept web-compatible scene fields while keeping legacy mock fields.
- Added provider APIs for updating prompter block visibility/content.
- Rebuilt recipe detail around a scene sequence rail and per-scene `Analysis`, `Recipe`, and `Shoot` tabs.
- Rebuilt native prompter to consume visible `PrompterBlock`s directly.
- Simplified recipe copy away from console-like metadata.

## Verification
- `cd parrotkit-app && npx tsc --noEmit` passed.
- `cd parrotkit-app && npx expo start --dev-client --localhost --port 8082` launched Metro successfully.
- iOS simulator loaded recipe detail through `parrotkit-app:///recipe/recipe-korean-diet-hook`.
- iOS simulator loaded native prompter through `parrotkit-app:///recipe/recipe-korean-diet-hook/prompter?sceneId=scene-1`.
- Screenshot evidence:
  - `output/playwright/app-recipe-web-parity-detail-2.png`
  - `output/playwright/app-recipe-web-parity-prompter-camera-fixed-2.png`

## Notes
- Node/npm emitted engine warnings because this environment uses Node v20.15.0 while several React Native packages request newer Node 20.x, but type checking and Metro bundling completed.
- Camera preview on simulator shows a dark/placeholder feed, which is expected for this simulator context; prompter overlays and scene switcher rendered above it after z-order fix.
