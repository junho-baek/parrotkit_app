# Context 2026-05-15 Sub-AC 8.1 Next Required Cut Highlight

## 작업
Home Continue가 resumed recipe shooting board overview를 열 때 하이라이트할 다음 required cut을 결정하는 계약을 추가했다.

## 변경
- Updated `src/features/home/lib/home-workflow-resolution.ts`
  - Added `getNextRequiredCutWithoutSavedMyTakeId`.
  - Required cut id 계산과 saved My Take cut id 계산을 shared helper로 분리했다.
  - `isRecipeBoardUnfinishedByRequiredMyTakes`가 같은 helper를 사용해 completion rule과 next-cut rule의 기준을 맞췄다.
- Updated `src/features/home/lib/home-workflow-resolution.test.ts`
  - Saved My Take가 있는 required cut과 optional cut을 건너뛰고, 첫 missing required cut을 반환하는지 검증했다.
- Updated `src/features/home/lib/home-continue-workflow-card.ts`
  - `HomeContinueWorkflowEntry.highlightCutId`를 추가했다.
  - Continue destination은 `/recipe/{recipeId}` overview route를 유지하고, highlight target만 metadata로 반환한다.
- Updated `src/features/home/lib/home-continue-workflow-card.test.ts`
  - Continue entry가 다음 missing required cut id를 노출하는지 검증했다.
  - Destination이 camera/prompter/checklist/cut deep link가 아닌 기존 overview route인지 계속 검증한다.
- Updated `plans/20260515_sub_ac_8_1_next_required_cut_highlight.md`
  - 결과와 연결 context를 기록했다.

## 검증
- RED: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
  - Expected failure: `getNextRequiredCutWithoutSavedMyTakeId` export 없음.
- RED: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
  - Expected failure: `Home continue overview entry must expose the next required cut missing a saved My Take for highlight.`
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`

## 리스크 / 후속
- This Sub-AC determines the overview highlight target and keeps the route simple. Any future visual scroll/flash treatment should consume `highlightCutId` without turning Continue into a cut/camera deep link.
- No commit or push performed per Seed constraints.
