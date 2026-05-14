# Context 2026-05-14 AC 7 Home Continue Overview Entry

## 작업
AC 7 `overview_entry`: Home Continue가 shooting board overview screen을 열도록 entry contract를 명시했다.

## 변경
- Updated `src/features/home/lib/home-continue-workflow-card.ts`
  - Added `HomeContinueWorkflowEntry`.
  - Added `getHomeContinueWorkflowEntry`.
  - Selected workflow는 `screen: 'shooting-board-overview'` and `/recipe/{recipeId}` destination을 반환한다.
  - Empty state fallback은 기존 manual recipe creation destination을 유지한다.
- Updated `src/features/home/lib/home-continue-workflow-card.test.ts`
  - Continue entry screen이 `shooting-board-overview`인지 검증한다.
  - Continue destination이 selected recipe board route인지 검증한다.
  - Continue destination이 prompter/camera/checklist/cut restore deep link가 아닌지 검증한다.
- Updated `plans/20260514_ac7_home_continue_overview_entry.md`
  - 결과와 연결 context 파일명을 기록했다.

## 검증
- RED: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
  - 실패: `getHomeContinueWorkflowEntry` export 없음.
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`

## 리스크 / 후속
- This AC intentionally did not modify board selection, required-cut My Take completion, or next-missing-cut highlight logic to avoid colliding with sibling tasks.
- No commit or push performed per Seed constraints.
