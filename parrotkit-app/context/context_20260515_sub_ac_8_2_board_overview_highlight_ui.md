# Context 2026-05-15 Sub-AC 8.2 Board Overview Highlight UI

## 작업
Home Continue가 recipe shooting board overview를 열 때, saved My Take가 없는 다음 required cut을 overview 안에서 시각적으로 안내하도록 UI wiring을 완료했다. Camera/prompter 진입은 기존 cut CTA 탭에만 남겼다.

## 변경
- Updated `src/features/recipes/screens/recipe-detail-screen.tsx`
  - Overview route params에 `highlightCutId`를 추가했다.
  - `highlightCutId`가 있고 `sceneId` deep link가 아닌 경우 해당 cut을 찾아 `setExpandedCutIds([targetCut.id])`로 펼친다.
  - `ShootBoardDraggableList`에 `highlightedCutId={highlightedCutId}`를 전달한다.
- Updated `src/features/recipes/components/shoot-board-draggable-list.tsx`
  - `highlightedCutId?: string` prop을 추가했다.
  - `highlighted={highlightedCutId === cut.id}`로 next cut 카드 하나만 표시 상태를 넘긴다.
- Updated `src/features/recipes/components/shoot-board-scene-card.tsx`
  - `highlighted: boolean` prop을 추가했다.
  - `styles.highlightedCard`로 배경, 보더, 섀도우를 강화해 다음 required cut이 보이게 했다.
- Updated `plans/20260515_sub_ac_8_2_board_overview_highlight_ui.md`
  - 결과와 연결 context를 기록했다.

## 검증
- RED: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
  - Expected failure: Recipe overview route가 `highlightCutId` metadata를 아직 받지 않아 실패.
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`

## 결과
- Continue href는 `/recipe/{recipeId}?highlightCutId={cutId}` 형태로 overview route를 유지한다.
- Board overview는 `highlightCutId` 대상 cut을 자동 확장하고, 해당 카드만 시각적으로 강조한다.
- Camera/prompter는 자동으로 열리지 않으며 기존 `onShoot`/`onTake` 사용자 탭 경로를 그대로 사용한다.
- Bottom clearance는 기존 `contentContainerStyle={{ paddingBottom: insets.bottom + 112 }}`와 Floating Add Scene Button 구조를 유지해 iPhone simulator bottom nav/FAB overlap 리스크를 키우지 않았다.

## 리스크 / 후속
- 하이라이트는 현재 화면 내 카드 스타일과 확장 상태로만 제공한다. 긴 보드에서 자동 스크롤까지 필요해지면 별도 UX 검증 후 추가한다.
- No commit or push performed in this subtask.
