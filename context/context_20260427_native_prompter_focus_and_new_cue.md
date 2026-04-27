# 2026-04-27 Native Prompter Focus And New Cue

## Summary

- Improved native shooting prompter focus and new-cue behavior.
- New cues no longer auto-enter edit mode, so they can be dragged immediately after creation.
- Color/scale/hide controls now target only an explicitly focused cue, not the first visible cue fallback.
- Scene changes clear previous focused cue state.

## Root Cause

- `handleAddCue` called `requestEditForBlock` immediately after creating a cue, which made the cue enter `TextInput` editing mode and disabled the overlay `PanResponder`.
- `focusedBlock` fell back to `selectedBlocks[0]`, so toolbar controls could appear and mutate a cue before the user explicitly selected it.

## Files

- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `plans/20260427_native_prompter_focus_and_new_cue.md`

## Verification

- `cd parrotkit-app && npx tsc --noEmit`: passed.
- Real-device dev-client relaunched against `192.168.0.104:8081` for bundle refresh.

## Notes

- Existing untracked `.superpowers/` artifacts remain untouched.
