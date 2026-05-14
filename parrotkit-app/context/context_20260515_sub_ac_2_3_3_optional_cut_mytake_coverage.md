# Context 2026-05-15 Sub-AC 2.3.3 Optional Cut My Take Coverage

## 작업
Home Continue completion behavior에 대해 required cuts는 모두 saved My Take가 있고 optional cuts만 saved My Take가 없는 board가 Continue 후보에서 제외되는 focused test coverage를 추가했다.

## 변경
- Updated `src/features/home/lib/home-workflow-resolution.test.ts`
  - `getHomeWorkflowSelection`이 required cuts 2개는 saved My Take가 있고 optional cut 1개만 missing인 `continue` board를 completed로 판단해 `reason: "none"` 및 `recipe: null`을 반환하는지 검증한다.
- Updated `src/core/mocks/parrotkit-data.ts`
  - Current mock model에서 optional cut을 표현하기 위한 minimal `MockRecipeScene.isOptional` 필드를 추가했다.
- Updated `src/features/home/lib/home-workflow-resolution.ts`
  - Required-cut My Take completion predicate가 `isOptional` scene을 required cut 목록에서 제외하도록 변경했다.
- Updated `plans/20260515_sub_ac_2_3_3_optional_cut_mytake_coverage.md`
  - 결과와 연결 context를 기록했다.

## 검증
- RED: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
  - Expected failure: `Home Continue must treat a board as complete when only optional cuts lack saved My Takes.`
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 리스크 / 후속
- This is a minimal mock-model extension, not a persistence refactor.
- Explicit publish/complete state, activity ordering, and board overview highlight behavior remain outside this Sub-AC.
- No commit or push performed per Seed constraints.
