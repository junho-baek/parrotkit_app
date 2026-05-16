# 2026-05-17 Recipe Board Breakdown UI

## Decision

Supadata/Gemini video analysis and automatic cut segmentation are deferred. The UI boundary was implemented first:

- `Board`: compact filming actions.
- `Breakdown`: video-level analysis from the Recipe Analysis Contract.

## Rationale

The Recipe Analysis Contract can store Sandcastle-level detail, but `DESIGN.md` requires the filming UI to stay compact and execution-first. Building the UI projection first prevents future analysis APIs from flooding the board with taxonomy labels.

## Implemented

- Added a recipe-level breakdown summary model.
- Added a `Board / Breakdown` switch on the shooting board page.
- Added a video-level Breakdown panel.
- Reworked collapsed cut rows so the reference is the left 9:16 anchor and My Take is the user's result/action state.
- Kept hook analysis video-level instead of repeating it per cut.

## Verification

Pending final verification.

