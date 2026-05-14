# 2026-05-15 Sub-AC 3.1.2 Publish Success Completion Marker

## 배경
Explicit publish/complete completion marker exists on the v1 mock recipe record, but the publish/complete UI path still needs to write that marker only after the action succeeds.

## 목표
Wire the publish/complete success path so a recipe board is marked explicitly complete after a successful action, without marking on screen entry or failed/missing recipe state.

## 범위
- Mock workspace completion action.
- Recipes publish CTA wiring.
- Focused test/source contract for success-only marker writes.
- No navigation label, bottom tab, Supabase, or Home Continue predicate changes.

## 변경 파일
- `src/core/providers/mock-workspace-provider.tsx`
- `src/features/recipes/screens/recipes-screen.tsx`
- Focused test/config files as needed
- `plans/20260515_sub_ac_3_1_2_publish_success_completion_marker.md`
- `context/context_20260515_sub_ac_3_1_2_publish_success_completion_marker.md`

## 테스트
- RED/GREEN focused TypeScript or sucrase-node contract check.
- Existing focused Continue/recipe data checks if touched by the change.

## 롤백
Remove the workspace action, publish CTA wiring, focused tests/config, and this plan/context update.

## 리스크
- Current publish view is lightly wired in v1 and redirects from query params; this change intentionally limits marker persistence to the existing publish CTA success path rather than introducing a full publish backend.
