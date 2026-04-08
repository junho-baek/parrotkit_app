# 작업 기록: 레시피 카드 hover 중 스크롤 개선

## 작업 요약
- 레시피 목록 카드 위에 포인터가 올라간 상태에서도 스크롤 제스처가 더 자연스럽게 전달되도록 카드 레이어의 포인터 처리를 정리했습니다.
- 카드 클릭 진입 동작은 유지하면서, 내부 썸네일/텍스트/오버레이가 개별적으로 포인터를 잡지 않도록 조정했습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_card_scroll_hover_fix.md`
- `context/context_20260408_recipe_card_scroll_hover_fix.md`

## 주요 변경
- 카드 루트에 `touchAction: 'pan-y'`를 추가해 세로 스크롤 제스처 우선권을 높였습니다.
- 카드 내부 미디어/콘텐츠 레이어에 `pointer-events-none`을 적용해 카드 자식 레이어가 포인터를 따로 가로채지 않게 했습니다.
- 썸네일 이미지에 `draggable={false}`를 적용해 이미지 drag와 스크롤 제스처 충돌 가능성을 낮췄습니다.
- 추가로 카드 `onWheelCapture`에서 상위 레시피 스크롤 컨테이너의 `scrollTop`을 직접 갱신하도록 해 hover 상태에서도 휠 입력이 리스트 스크롤로 이어지게 했습니다.

## 검증
- 별도 실행 검증은 하지 않았습니다.
- 사용자 요청 기준 버그 수정만 우선 반영했습니다.

## 상태
- 로컬 코드 반영 완료
