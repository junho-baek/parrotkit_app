# 2026-05-17 Recipe Board Breakdown UI Superpower Plan

## 배경

The Recipe Analysis Contract seed was added, but the user raised a valid risk: Sandcastle-level analysis could make the UI too complex. The current product direction is to keep the shooting board compact, like the exercise-app reference, and move video-level analysis into a separate Breakdown layer.

## 목표

Create a Superpowers implementation plan that:

- Defers Supadata/Gemini video ingestion and automatic cut segmentation.
- Adds a `Board / Breakdown` UI boundary.
- Keeps `Board` compact and filming-first.
- Shows full video-level analysis only in `Breakdown`.

## 범위

Plan only. No code implementation in this task.

## 변경 파일

- `docs/superpowers/plans/2026-05-17-recipe-board-breakdown-ui.md`
- `parrotkit-app/plans/20260517_recipe_board_breakdown_ui_superpower_plan.md`
- `parrotkit-app/context/context_20260517_recipe_board_breakdown_ui_superpower_plan.md`

## 테스트

- `git diff --check`

## 롤백

Remove the added plan/context docs.

## 리스크

- The implementation plan includes concrete code sketches, but implementers must still adapt them to exact local TypeScript types.
- The Supadata/Gemini ingestion layer is intentionally deferred.

## 결과

Superpower plan saved at `docs/superpowers/plans/2026-05-17-recipe-board-breakdown-ui.md`.

