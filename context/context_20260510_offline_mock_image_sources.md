# 2026-05-10 Offline Mock Image Sources

## Background
- User reported that images disappear when the local server is not running.
- The visible symptom was home/recipe cards falling back to grey placeholders while the app UI itself still rendered.
- Root cause: `ugc-media.ts` converted bundled `assets/mock-media/*` files into `Image.resolveAssetSource(...).uri` strings. In Expo/RN dev, those strings can point at the Metro/dev server, so killing the server breaks image loading.

## Changes
- Added `toImageSource` / `imageSourceToUri` helper in `src/core/ui/image-source.ts`.
- Changed `ugcMedia` mock images to keep direct `require()` asset sources instead of pre-resolved URI strings.
- Expanded mock recipe/reference thumbnail typing to allow local bundled image sources as well as remote URL strings.
- Updated major image render paths to pass image sources directly:
  - Home continue card, quick recipe tiles, recent rows
  - Recipes tab continue rows, collection previews, save/publish flow covers
  - Explore recipe cards and detail hero
  - Shoot board scene cards, reference viewer, take review viewer
  - Native recipe scene cards and scene sequence rail
- Preserved URL strings for generated YouTube thumbnails and remote API results.
- Added `thumbnailSource` propagation through normalized native recipe scenes and shoot board cuts so local mock assets can survive beyond the seed list screens.

## Verification
- Ran `cd parrotkit-app && npx tsc --noEmit`: passed.
- Ran `cd parrotkit-app && npx tsx src/core/mocks/parrotkit-data.test.ts`: passed.
- Ran `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`: passed.
- Ran `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`: passed.
- Ran `git diff --check`: passed.
- Simulator smoke:
  - Started Metro on port 8083 and opened iOS Simulator.
  - Verified home mock card images loaded.
  - Stopped Metro.
  - Verified the already-rendered bundled mock card images remained visible instead of turning into placeholders.

## Notes
- A development client still needs Metro for cold JS loading and reloads. This fix removes the image URL dependency for bundled mock assets once the app bundle is running.
- Remote YouTube thumbnails still require network unless they are separately cached or bundled.
