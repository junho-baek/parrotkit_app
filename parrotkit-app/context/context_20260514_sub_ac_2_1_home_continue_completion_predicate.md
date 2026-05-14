# Context 2026-05-14 Sub-AC 2.1 Home Continue Completion Predicate

## 작업
Home Continue v1의 completion predicate를 정의했다. Recipe shooting board는 현재 mock model에서 recipe scene id를 required cut id로 보고, 해당 recipe의 saved My Take가 하나라도 없는 required cut이 있으면 unfinished로 판단한다.

## 변경
- Updated `src/features/home/lib/home-workflow-resolution.ts`
  - Added `RecipeBoardSavedMyTake`.
  - Added `isRecipeBoardUnfinishedByRequiredMyTakes`.
  - Saved My Take matching은 `sceneId`와 `cardIds`를 모두 허용한다.
  - Required cut이 없는 board는 이 predicate 기준 unfinished로 보지 않는다.
- Updated `src/features/home/lib/home-workflow-resolution.test.ts`
  - Required cut 중 하나가 saved My Take를 갖지 않으면 unfinished인 regression을 추가했다.
  - 모든 required cut이 saved My Take를 가지면 unfinished가 아닌 regression을 추가했다.
- Updated `plans/20260514_sub_ac_2_1_home_continue_completion_predicate.md`
  - 결과와 연결 context를 기록했다.

## 검증
- RED: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
  - 실패: `isRecipeBoardUnfinishedByRequiredMyTakes` export 없음.
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 리스크 / 후속
- Explicit publish/complete exclusion, multi-board activity ordering, and overview highlight routing are outside this Sub-AC.
- Current mock model lacks a first-class required-cuts collection, so recipe scenes remain the conservative required-cut source for v1.
- No commit or push performed per Seed constraints.
