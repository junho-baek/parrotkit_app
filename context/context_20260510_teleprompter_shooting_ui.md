# 2026-05-10 Teleprompter Shooting UI

## Background
- User requested the shooting screen to become a dark camera-based teleprompter UI for demo recording.
- The PRD emphasized script-first shooting, lightweight progress, current/next cut flow, immediate editing, New clue, speed, opacity, color, and style controls.
- Existing screen was more board/control oriented and used a heavier bottom scene/take structure.

## Changes
- Reworked `RecipePrompterCameraScreen` into a dark translucent camera UI.
- Added a top scene pill with a thin progress indicator.
- Added a large script overlay with faint next-cut preview.
- Added teleprompter state for speed, pause/play, font size, opacity, color preset, style preset, and top/center mode.
- Added basic PanResponder gestures:
  - drag up/down toggles teleprompter top/center mode.
  - two-finger pinch resizes script font within limits.
- Added double-tap script editing modal.
- Added New clue modal that appends a runtime clue to the current scene.
- Replaced the heavy bottom tray/switcher UI with floating speed, record, previous/next, and palette docks.
- Preserved existing camera permission, recording, review, and take save/export flows.

## Verification
- Ran `cd parrotkit-app && npx tsc --noEmit`: passed.
- Ran `git diff --check`: passed.
- Verified in iOS Simulator:
  - shooting screen opens from the recipe cut board.
  - dark camera UI renders with current script and next cut preview.
  - top scene pill and thin progress indicator render.
  - speed dock, record button, previous/next buttons, and palette dock render.
  - New clue modal opens and closes.

## Notes
- Simulator camera preview is dark/black because the local simulator has no real camera feed; the overlay layout was validated against that preview.
- Gesture physics are MVP-level because the implementation uses built-in React Native `PanResponder` rather than adding a dedicated gesture library.
- New clue is local runtime state for the current screen; persistence beyond the screen/session remains out of scope for this demo pass.
