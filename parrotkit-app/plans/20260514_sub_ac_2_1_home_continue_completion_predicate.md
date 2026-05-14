# 2026-05-14 Sub-AC 2.1 Home Continue Completion Predicate

## 배경
Home Continue v1 must resume an unfinished recipe shooting board. The Seed defines unfinished primarily by required cuts that do not yet have a saved My Take, with checklist progress only supporting display.

## 목표
Define a focused board completion predicate that treats a recipe board as unfinished when at least one required cut has no saved My Take.

## 범위
- Home workflow resolution library and focused tests.
- Mock model only; no persistence refactor.
- No bottom-tab or creation CTA changes.

## 변경 파일
- `src/features/home/lib/home-workflow-resolution.ts`
- `src/features/home/lib/home-workflow-resolution.test.ts`
- `plans/20260514_sub_ac_2_1_home_continue_completion_predicate.md`
- `context/context_20260514_sub_ac_2_1_home_continue_completion_predicate.md`

## 테스트
- RED/GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- Type check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 롤백
Remove the predicate/test additions from the Home workflow resolution files and delete this plan/context note.

## 리스크
- Current mock recipes do not store a dedicated required-cut field, so required cuts will map conservatively to recipe scenes/cuts in the existing model.
- Activity ordering and board overview highlighting are outside this Sub-AC and should remain for later criteria.

## 결과
- Added `isRecipeBoardUnfinishedByRequiredMyTakes` in Home workflow resolution.
- The predicate maps required cuts to current mock recipe scene ids and treats a board as unfinished when any required scene lacks a saved My Take for that recipe.
- Saved My Take matching accepts either `sceneId` or `cardIds`, matching current saved-take records and cut-card snapshots.
- Added focused regression coverage for missing and complete required-cut My Take state.

## 연결 context
- `context/context_20260514_sub_ac_2_1_home_continue_completion_predicate.md`
