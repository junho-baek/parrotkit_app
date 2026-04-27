# 2026-04-27 Native Prompter Control Access

## Summary

- Improved native shooting prompter controls after real-device feedback.
- Double tap now opens cue text editing instead of relying on long press.
- Drag bounds now allow cues to move much lower on the shooting surface.
- Color swatches are larger for easier touch targeting.
- Hidden cues can be restored from the shooting toolbar through a compact eye/count control.

## Root Cause

- Cue `Text` had `onPress={onFocus}`, while double tap editing only lived in the parent `PanResponder` release path, so real taps on text could focus without entering edit mode.
- The overlay used a tight custom bound plus `pointFromGesture`, which applied its own default clamp before the overlay clamp.
- Toolbar swatches were 28px, too small for fast real-device shooting.
- The shooting screen filtered to visible blocks and exposed hide, but had no restore control.

## Files

- `parrotkit-app/src/features/recipes/components/native-prompter-block-overlay.tsx`
- `parrotkit-app/src/features/recipes/components/native-prompter-toolbar.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `plans/20260427_native_prompter_control_access.md`

## Verification

- `cd parrotkit-app && npx tsc --noEmit`: passed.
- Real-device dev-client relaunched against `192.168.0.104:8081` for bundle refresh.

## Notes

- Existing untracked `.superpowers/` artifacts remain untouched.
