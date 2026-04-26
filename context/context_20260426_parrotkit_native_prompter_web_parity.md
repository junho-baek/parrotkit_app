# 2026-04-26 ParrotKit Native Prompter Web Parity

## Summary

- Implemented native prompter shooting parity on `dev`.
- Added movable, editable, pinch/toolbar-scalable cue overlays.
- Added double-tap cue editing, focused-cue color palette, cue add/hide controls, scene switching, record/stop flow, recorded take review/use-take persistence.
- Added provider APIs for prompter block layout/content/color/visibility/custom cue updates and recorded take state.
- Added Expo camera microphone permission config and aligned Expo SDK package versions.

## Notes

- `expo-video` was installed during the first pass, but the currently installed iOS dev client does not include its native module.
- To keep the simulator usable without rebuilding the dev client, `NativeTakeReview` currently uses a native-module-free recorded-take confirmation/retry/use-take fallback instead of `VideoView` playback.
- Full in-app video playback review can be restored after rebuilding the dev client with the native module included.

## Verification

- `cd parrotkit-app && npx tsc --noEmit`: passed.
- Metro dev client bundle on port `8082`: passed.
- iOS simulator deep link: `parrotkit-app:///recipe/recipe-korean-diet-hook/prompter`.
- Screenshot evidence:
  - `output/playwright/native-prompter-web-parity-adjusted.png`
  - `output/playwright/native-prompter-palette-swatches.png`

## Risk

- iOS simulator camera preview can be dark/placeholder-like depending on simulator camera availability.
- Actual device QA is still recommended for physical camera and audio recording behavior.
- Video playback review requires a dev-client rebuild if we decide to use `expo-video` in the review surface.
