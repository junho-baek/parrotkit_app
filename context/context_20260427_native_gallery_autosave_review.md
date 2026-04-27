# Context 2026-04-27 Native Gallery Autosave Review

## Summary
- Changed the native shooting flow so a recorded take starts saving to the native gallery/camera roll immediately after `recordAsync` returns.
- Reworked the review overlay to show a real video preview and gallery save status instead of exposing the local `file://` URI.
- `Keep Take` now only confirms a take that has reached the native gallery; failed or denied saves stay on the review screen and can be retried with `Save to Gallery`.

## Files
- `parrotkit-app/src/features/recipes/components/native-take-review.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `plans/20260427_native_gallery_autosave_review.md`

## Verification
- `cd parrotkit-app && npx tsc --noEmit` passed.
- Metro on `192.168.0.104:8081` was running.
- The installed iPhone dev-client launched successfully through `xcrun devicectl` with the 8081 development URL.
- Metro produced fresh iOS bundles after launch; older `ExpoMediaLibrary` native-module errors in the log were from before the rebuilt dev-client was installed.

## Notes
- This change is JS-only on top of the already rebuilt dev-client that includes `ExpoMediaLibrary`.
- Actual final smoke check still requires recording a take on the device and accepting the iOS Photos permission prompt.
