# 2026-04-27 Native Prompter Drag Smoothness

## Summary

- Improved native shooting prompter drag smoothness on `dev`.
- Root cause: `NativePrompterBlockOverlay` called `onUpdate` on every `PanResponder` move frame, which updated provider recipe state and forced normalize/render work while the finger was moving.
- Fix: moved drag/pinch live feedback to local `Animated.ValueXY` / `Animated.Value` and persist `x/y/scale` only on release or terminate.

## Files

- `parrotkit-app/src/features/recipes/components/native-prompter-block-overlay.tsx`
- `plans/20260427_native_prompter_drag_smoothness.md`

## Verification

- `cd parrotkit-app && npx tsc --noEmit`: passed.
- Real iPhone dev-client relaunched against `192.168.0.104:8081`; Metro bundled the updated overlay module without a fresh runtime error.

## Notes

- Metro log still contained earlier transient `View` runtime errors from the middle of the edit, before the JSX was fully converted to `Animated.View`; after relaunch, the fresh bundle completed without a new error.
- Existing untracked `.superpowers/` artifacts were left untouched.
