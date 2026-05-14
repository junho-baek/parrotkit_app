# 2026-05-15 Sub-AC 1.3.2 Board Overview State Shape

## 배경
Home Continue로 열린 shooting board overview는 camera를 자동으로 열지 않고 다음 saved My Take가 없는 required cut을 안내해야 한다. Board overview UI가 이 값을 raw route param이 아니라 명시적인 state shape로 다룰 필요가 있다.

## 목표
- Board overview UI state에 computed next required cut id를 포함한다.
- State metadata로 source/highlight 상태를 표현해 이후 card highlight UI가 일관된 값을 사용할 수 있게 한다.
- Camera/prompter entry는 사용자 탭 기반으로 유지한다.

## 범위
- `src/features/recipes/screens/recipe-detail-screen.tsx`
- Focused type/test check
- Context 기록

## 변경 파일
- `plans/20260515_sub_ac_1_3_2_board_overview_state_shape.md`
- `src/features/recipes/screens/recipe-detail-screen.tsx`
- `context/context_20260515_sub_ac_1_3_2_board_overview_state_shape.md`

## 테스트
- Board overview state helper가 route metadata와 computed fallback을 포함하는지 focused check로 확인한다.
- `tsc --noEmit`은 관련 check config가 있으면 사용하고, 없으면 최소 범위로 확인한다.

## 롤백
- 추가 state type/helper와 usage를 되돌리면 overview는 기존 `highlightCutId` route param 직접 사용으로 돌아간다.

## 리스크
- Existing adjacent sub-AC edits가 많은 상태이므로 변경 범위를 recipe detail overview state로 제한한다.

## 결과
- `RecipeDetailScreen`에 `BoardOverviewUiState`를 추가해 `nextRequiredCutId`, `highlightCutId`, `highlightState`, `routeHighlightCutId`, `cameraEntryRequiresTap`을 명시적으로 다룬다.
- Board overview highlight는 saved My Take records를 기준으로 `getNextRequiredShootBoardCutWithoutSavedMyTake`에서 계산한 다음 missing required cut을 우선 사용하고, route `highlightCutId`는 유효한 cut일 때 fallback으로만 사용한다.
- Camera/prompter entry route는 변경하지 않았고, highlight/expand는 overview card state에만 반영했다.
- 연결 context: `context/context_20260515_sub_ac_1_3_2_board_overview_state_shape.md`

## 검증
- RED: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
  - Expected failure: `Recipe overview must model next required cut guidance in an explicit UI state shape.`
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
