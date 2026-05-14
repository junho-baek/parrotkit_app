# 2026-05-15 Sub-AC 1.3.1 Board Next Missing Required Cut

## 배경
Home Continue로 열린 shooting board overview는 camera를 자동으로 열지 않고, saved My Take가 없는 다음 required cut을 안내해야 한다. Home 단의 resolver와 별개로 board overview가 직접 사용할 수 있는 board-level selector가 필요하다.

## 목표
- Board의 현재 cut order를 기준으로 earliest required cut을 계산한다.
- 현재 board의 saved My Take records가 있는 required cut은 건너뛴다.
- Optional cut은 next required target에서 제외한다.

## 범위
- `src/features/recipes/lib/shoot-board-model.ts`
- `src/features/recipes/lib/shoot-board-model.test.ts`
- Context 기록

## 변경 파일
- `plans/20260515_sub_ac_1_3_1_board_next_missing_required_cut.md`
- `src/features/recipes/lib/shoot-board-model.ts`
- `src/features/recipes/lib/shoot-board-model.test.ts`
- `context/context_20260515_sub_ac_1_3_1_board_next_missing_required_cut.md`

## 테스트
- RED: focused shoot-board model test가 helper export/동작 부재로 실패하는지 확인한다.
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

## 롤백
- 추가 helper와 관련 테스트/context를 되돌리면 board overview는 기존 helper 없이 Home-level highlight metadata에만 의존한다.

## 리스크
- 이 작업은 UI wiring과 camera route를 변경하지 않는다. saved My Take input shape은 mock workspace saved take records와 호환되는 최소 필드만 사용한다.

## 결과
- `getNextRequiredShootBoardCutWithoutSavedMyTake`를 추가해 board order 기준 earliest required cut 중 saved My Take가 없는 첫 cut을 반환하도록 했다.
- Helper는 optional scene cut과 다른 board의 saved take records를 제외한다.
- 연결 context: `context/context_20260515_sub_ac_1_3_1_board_next_missing_required_cut.md`
