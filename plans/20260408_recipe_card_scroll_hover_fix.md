# Recipe Card Scroll Hover Fix

## 배경
- 레시피 목록 화면에서 카드 위에 마우스를 올린 상태로 휠/트랙패드 스크롤이 잘 먹지 않는다는 피드백이 들어왔습니다.
- 현재 카드는 전체가 클릭 영역이고, 내부에 썸네일/오버레이/텍스트 레이어가 여러 겹으로 쌓여 있습니다.

## 목표
- 카드 hover 상태에서도 레시피 목록 스크롤이 자연스럽게 동작하도록 개선합니다.
- 카드 클릭 동작과 기존 시각 구조는 유지합니다.

## 범위
- 레시피 카드 렌더링 및 포인터 이벤트 정리
- 영향 파일:
  - `src/components/common/RecipeResult.tsx`

## 변경 파일
- `plans/20260408_recipe_card_scroll_hover_fix.md` (신규)
- `src/components/common/RecipeResult.tsx` (수정 예정)
- `context/context_20260408_recipe_card_scroll_hover_fix.md` (작성 예정)

## 테스트
- 사용자 요청 시 `npm run dev` 기준 브라우저 수동 확인
- 이번 변경에서는 코드 레벨 수정만 우선 반영

## 롤백
- 레시피 카드의 `pointer-events` / `touchAction` / `draggable` 관련 변경만 되돌립니다.

## 리스크
- 카드 내부에 향후 개별 버튼/링크가 추가되면 `pointer-events-none` 구조와 충돌할 수 있어 그 시점에 클릭 영역 분리가 필요합니다.

## 결과
- 완료
- 레시피 카드 루트에 `touchAction: 'pan-y'`를 추가해 스크롤 제스처가 카드 hover 상태에서도 더 자연스럽게 전달되도록 했습니다.
- 카드 내부 썸네일/오버레이/텍스트 레이어에 `pointer-events-none`을 적용해 자식 레이어가 포인터를 따로 잡지 않도록 정리했습니다.
- 썸네일 이미지에는 `draggable={false}`를 적용했습니다.
- 카드 `onWheelCapture`에서 상위 스크롤 컨테이너를 직접 스크롤하도록 보강해 카드 hover 상태의 마우스 휠 입력도 리스트 스크롤로 전달되게 했습니다.

## 연결 context
- `context/context_20260408_recipe_card_scroll_hover_fix.md`
