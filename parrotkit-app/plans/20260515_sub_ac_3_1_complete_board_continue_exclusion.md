# 2026-05-15 Sub-AC 3.1 Complete Board Continue Exclusion

## 배경
Home Continue must resume unfinished recipe shooting boards, with required-cut saved My Take coverage as the primary completion signal.

## 목표
Ensure a recipe board is excluded from Home Continue when every required cut on that board has a saved My Take.

## 범위
- Focused Home Continue selection/card coverage.
- No navigation changes, persistence refactor, bottom tab changes, or CTA copy changes.

## 변경 파일
- `src/features/home/lib/home-continue-workflow-card.test.ts`
- `plans/20260515_sub_ac_3_1_complete_board_continue_exclusion.md`
- `context/context_20260515_sub_ac_3_1_complete_board_continue_exclusion.md`

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`

## 롤백
Remove the added focused test and this plan/context note.

## 리스크
- The resolver already has this behavior; this task may be a boundary coverage update only.
