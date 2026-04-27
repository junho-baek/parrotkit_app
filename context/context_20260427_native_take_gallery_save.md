# Context 2026-04-27 Native Take Gallery Save

## Summary
- Added Photos/Gallery saving to the native recipe shooting flow.
- After a recording is reviewed, tapping `Use Take` requests Photos permission and saves the recorded video URI through `expo-media-library`.
- The app still records the take internally if Photos permission is denied or saving fails, and the shooting screen shows the resulting status message.

## Files
- `parrotkit-app/package.json`
- `parrotkit-app/package-lock.json`
- `parrotkit-app/app.json`
- `parrotkit-app/src/features/recipes/components/native-take-review.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `plans/20260427_native_take_gallery_save.md`

## Verification
- `cd parrotkit-app && npx tsc --noEmit` passed.
- `cd parrotkit-app && npx pod-install ios` completed and installed `ExpoMediaLibrary (18.2.1)`.
- Real-device iOS debug build succeeded with `xcodebuild` for iPhone `00008110-0012708C2E82801E`.
- The built app installed successfully on the connected iPhone through `xcrun devicectl device install app`.
- Launch through `xcrun devicectl device process launch` was blocked because the connected device was locked.

## Notes
- The local generated Pods project still needs the known quoted path workaround for this repository path containing parentheses after pod install.
- Actual Photos save smoke QA requires the phone to be unlocked, a recording to be made, and the first Photos permission prompt to be accepted.
