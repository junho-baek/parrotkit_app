# Context 2026-05-15 Sub-AC 2.3.1 Complete Required My Take Coverage

## 작업
Home Continue completion behavior에 대해 모든 required cut이 saved My Take를 가진 board들이 Continue 후보에서 제외되는 focused test coverage를 추가했다.

## 변경
- Updated `src/features/home/lib/home-workflow-resolution.test.ts`
  - `getHomeWorkflowSelection`이 모든 후보 board를 completed로 판단하는 경우 `reason: "none"` 및 `recipe: null`을 반환하는지 검증한다.
  - Coverage includes an in-progress board and a ready board where every required cut has a saved My Take.
- Updated `plans/20260515_sub_ac_2_3_1_complete_required_mytake_coverage.md`
  - 결과와 연결 context를 기록했다.

## 검증
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 리스크 / 후속
- No production code changes were needed; existing resolver behavior already matched this complete-board case.
- Explicit publish/complete state, activity ordering, and next missing required cut highlighting remain outside this Sub-AC.
- No commit or push performed per Seed constraints.
