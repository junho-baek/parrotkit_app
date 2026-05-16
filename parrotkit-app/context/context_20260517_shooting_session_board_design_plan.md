# 2026-05-17 Shooting Session Board Design Plan

## 배경

User reviewed the current shooting board against a short-form creator workflow and a workout-session reference UI. The current direction still felt too much like nested cards and visible implementation structure. The product decision is that the shooting board should behave like an active short-form filming session:

- dark session top bar
- `Done` / `완료` in that top bar
- recipe/guide title in the body header
- note row as an entry point, not a default checklist block
- reference and My Take media as 9:16 short-form frames
- collapsed cuts as execution items, not role-label cards

## 변경 사항

- Added a `Shooting board` section to `DESIGN.md`.
- Codified the dark session bar and top-bar `Done` / `완료` action.
- Codified the body header title and lightweight note entry model.
- Codified that note/checklist content opens from the note row instead of appearing by default.
- Codified 9:16 default media frames for Reference and My Take.
- Codified execution-first cut names and lower priority for `Hook`, `Proof`, `Demonstration`, and `CTA` role labels.
- Created a Superpowers implementation plan at `plans/20260517_shooting_session_board_redesign.md`.

## 검증

PASS:

- `npx -y @google/design.md lint DESIGN.md`
  - 0 errors
  - 14 existing unused-token warnings
- `git diff --check`

No app build was run because this change only updates design/plan/context docs.

## 연결된 plan

- `plans/20260517_shooting_session_board_redesign.md`
