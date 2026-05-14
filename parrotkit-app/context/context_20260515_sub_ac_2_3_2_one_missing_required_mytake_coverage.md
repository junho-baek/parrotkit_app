# Context 2026-05-15 Sub-AC 2.3.2 One Missing Required My Take Coverage

## 작업
Home Continue completion behavior에 대해 exactly one required cut이 saved My Take를 갖지 않은 board가 Continue 후보로 유지되는 focused test coverage를 추가했다.

## 변경
- Updated `src/features/home/lib/home-workflow-resolution.test.ts`
  - `getHomeWorkflowSelection`이 required cuts 3개 중 2개만 saved My Take를 가진 `continue` board를 `reason: "inProgress"`로 선택하는지 검증한다.
  - Fixture sets `shotSceneCount` equal to `totalSceneCount` so checklist-style progress alone cannot complete the board.
- Updated `plans/20260515_sub_ac_2_3_2_one_missing_required_mytake_coverage.md`
  - 결과와 연결 context를 기록했다.

## 검증
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 리스크 / 후속
- No production code changes were needed; existing resolver behavior already matched this one-missing-required-cut case.
- Explicit publish/complete state, activity ordering, and board overview highlight behavior remain outside this Sub-AC.
- No commit or push performed per Seed constraints.
