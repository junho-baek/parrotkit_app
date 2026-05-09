# 2026-05-10 Teleprompter Inline Edit, Language, Speed

## Background
- User clarified that EN/KO switching should not live in the shooting UI.
- Shooting screen should follow the app-level language setting.
- User also requested real teleprompter scrolling, a way to hide the prompter completely, and draggable prompter placement.

## Changes
- Removed the EN/KO toggle from the shooting screen.
- Shooting copy and script selection now follow `useAppLanguage()`.
- Kept EN/KO query data support from shoot-board entry so the prompter can choose the correct line based on app language.
- Moved script editing into the prompter panel itself instead of using the previous modal.
- Added a speed sheet opened from the bottom palette; speed remains between opacity and color.
- Added a Hide/Show palette action:
  - Hide removes the script panel from the camera preview.
  - Show displays a small floating restore pill.
- Added drag offset state for the script panel:
  - one-finger drag moves the prompter panel within bounds.
  - upward drag still snaps toward top teleprompter placement.
- Strengthened pinch handling for font size changes.
- Changed recording scroll from a fixed small offset to a duration and distance based on script length, next preview length, line height, and selected speed.

## Verification
- Ran `cd parrotkit-app && npx tsc --noEmit`: passed.
- Ran `git diff --check`: passed.
- Verified in iOS Simulator:
  - shooting screen no longer shows EN/KO toggle.
  - bottom palette includes `Opacity`, `Speed`, `Color`, `Style`, and `Hide`.
  - speed sheet opens from the Speed palette action.
  - Hide removes the prompter panel and Show restores it.
  - inline edit remains available by double tapping the script panel.

## Notes
- Simulator recording failed with the existing local camera error, so recording save was not validated in this pass.
- Automated coordinate drag through Computer Use returned an Apple event window error, so drag movement was verified at code level rather than through a completed automation gesture.
