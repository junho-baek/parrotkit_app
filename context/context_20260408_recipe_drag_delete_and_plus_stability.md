# 2026-04-08 Recipe drag delete 및 plus 안정화

## 요약
- Shooting drag target을 다시 trash can 시각으로 되돌려 삭제 affordance를 유지했다.
- Recipe 탭 cue 카드에 drag-and-drop 삭제 영역을 추가했다.
- Recipe 탭 plus 버튼은 편집 중 draft를 먼저 반영한 뒤 새 cue를 추가하게 바꿔, 클릭이 씹히는 경우를 줄였다.

## 변경 파일
- src/components/common/CameraShooting.tsx
- src/components/common/RecipeResult.tsx
- plans/20260408_recipe_drag_delete_and_plus_stability.md

## 상세
### 1. Shooting delete affordance 유지
- 하단 drag target의 아이콘과 hover tone을 trash can / rose 계열로 복원했다.
- eye-off visibility panel은 그대로 유지하면서, drag gesture는 계속 delete / hide affordance로 읽히게 했다.

### 2. Recipe cue drag delete 추가
- Recipe cue 카드에 draggable을 붙이고, 드래그 중 하단 중앙 trash zone을 띄우도록 했다.
- drop 시 custom cue는 실제 제거하고, 기본 cue는 inactive 처리(visible false)한다.
- drag가 끝나면 trash hover 및 dragging 상태를 정리한다.

### 3. Recipe plus 안정화
- plus 버튼에 pointer down guard를 넣어 편집 textarea blur로 클릭이 사라지는 상황을 줄였다.
- 새 cue 추가 전에 현재 편집 중인 draft를 먼저 scenes에 반영하고, 그 다음 새 cue를 append하도록 바꿨다.
- 그래서 편집 중 plus를 눌러도 기존 수정이 날아가거나 새 cue 생성이 무시될 가능성을 낮췄다.

## 검증
- 사용자 요청에 따라 별도 테스트 및 build는 수행하지 않았다.
