# Context 2026-05-15 Sub-AC 3 No Camera Jump

## 작업
Home Continue가 board overview를 열 때 camera/prompter가 자동으로 열리지 않고, 사용자가 cut을 탭해야 camera로 들어가는 계약을 명시했다.

## 변경
- Updated `src/features/home/lib/home-continue-workflow-card.ts`
  - `HomeContinueWorkflowEntry.cameraEntryRequiresTap: true`를 추가했다.
  - Continue entry 생성 시 항상 `cameraEntryRequiresTap: true`를 반환한다.
- Updated `src/features/home/lib/home-continue-workflow-card.test.ts`
  - Continue entry가 camera entry를 explicit cut tap 뒤로 유지하는지 검증한다.
  - Continue destination은 camera/prompter/checklist/cut deep link가 아닌 overview route인지 계속 검증한다.
  - Continue href는 `highlightCutId` metadata만 포함하고 `prompter`, `camera`, `sceneId`, `retakeTakeId`를 포함하지 않도록 검증한다.
- Updated `plans/20260515_sub_ac_3_no_camera_jump.md`
  - 결과와 연결 context를 기록했다.

## 검증
- RED: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
  - Expected failure: `Home continue overview entry must keep camera entry gated behind an explicit cut tap.`
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`

## 결과
- Continue-opened board lands on `/recipe/{recipeId}?highlightCutId={cutId}` overview.
- Camera/prompter entry remains user-initiated through existing cut actions.
- No bottom navigation, FAB, Home/Explore/My nav, or 레시피 생성 CTA code was changed.

## 리스크 / 후속
- This subtask adds a contract-level regression guard. End-to-end visual QA remains covered by sibling verification work.
