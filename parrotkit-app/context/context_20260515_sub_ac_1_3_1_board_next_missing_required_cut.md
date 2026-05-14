# Context 2026-05-15 Sub-AC 1.3.1 Board Next Missing Required Cut

## 작업
Board overview가 직접 사용할 수 있는 selector/helper를 추가해, 현재 board order에서 saved My Take가 없는 earliest required cut을 찾도록 했다.

## 변경
- Updated `src/features/recipes/lib/shoot-board-model.ts`
  - Added `ShootBoardSavedMyTakeReference`.
  - Added `getNextRequiredShootBoardCutWithoutSavedMyTake`.
  - Existing `getOrderedRequiredShootBoardCuts` 결과를 재사용해 optional scene cut을 제외하고 board order를 유지한다.
  - Saved My Take records는 현재 board id만 반영하며 `sceneId`와 `cardIds`를 모두 cut coverage로 취급한다.
- Updated `src/features/recipes/lib/shoot-board-model.test.ts`
  - Reordered board에서 saved required cut, optional saved cut, 다른 board saved cut이 섞인 경우 earliest missing required cut을 선택하는 계약을 추가했다.
- Updated `plans/20260515_sub_ac_1_3_1_board_next_missing_required_cut.md`
  - 결과와 연결 context를 기록했다.

## 검증
- RED 시도: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts`
  - 현재 환경에서 `@/...` alias를 해석하지 못해 테스트 로딩 전 실패했다.
- Focused runtime smoke: in-process `@/` alias resolver + `sucrase/register`로 `getNextRequiredShootBoardCutWithoutSavedMyTake` selector case 통과.
- Full aliased runtime file check:
  - New selector assertion은 통과했으나 기존 documented mismatch `Scene titles should use the required Scene #N: Role format.`에서 중단된다.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

## 결과
- Continue-opened board overview가 사용할 수 있는 board-level selector가 생겼다.
- Selector는 camera/prompter route를 변경하지 않고, 다음 highlight target 계산에 필요한 cut object만 반환한다.
- iPhone simulator layout, Home/Explore/My nav, 레시피 생성 CTA에는 변경이 없다.

## 리스크 / 후속
- Existing full `shoot-board-model.test.ts` runtime은 title-format mismatch로 끝까지 실행되지 않는다. 이번 helper는 별도 focused smoke와 TypeScript로 검증했다.
