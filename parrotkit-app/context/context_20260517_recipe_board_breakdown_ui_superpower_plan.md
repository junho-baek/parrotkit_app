# 2026-05-17 Recipe Board Breakdown UI Superpower Plan

## 결정

Supadata/Gemini and Supadata-style reference video ingestion should wait. The immediate work should stabilize the UI projection boundary:

- `Board`: compact filming action rows.
- `Breakdown`: video-level analysis from the Recipe Analysis Contract.

## 이유

The Recipe Analysis Contract can store Sandcastle-level detail, but `DESIGN.md` requires the filming surface to avoid box-in-box layouts, repeated labels, and analysis-console clutter. If the UI boundary is not stable first, future video analysis will flood the cut board with metadata.

## 산출물

- Superpower plan: `docs/superpowers/plans/2026-05-17-recipe-board-breakdown-ui.md`
- Project plan bridge: `parrotkit-app/plans/20260517_recipe_board_breakdown_ui_superpower_plan.md`

## 검증

PASS:

- `git diff --check`
