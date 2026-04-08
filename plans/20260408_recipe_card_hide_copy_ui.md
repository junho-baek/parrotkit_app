# Recipe Card Hide Copy UI

## 배경
- 레시피 카드에서 장면 대사와 설명 문구가 함께 보이면서 카드 높이가 길어지고 정보 밀도가 높아졌습니다.
- 현재 요구는 데이터/로직 삭제가 아니라 `/home?view=recipe&recipeId=...` 카드 UI에서만 대사/설명 문구를 숨기는 것입니다.

## 목표
- 레시피 카드 UI에서 장면 대사와 설명 문구를 제거합니다.
- 카드가 더 짧고 빠르게 스캔되는 구조가 되도록 정리합니다.

## 범위
- `src/components/common/RecipeResult.tsx`

## 변경 파일
- `plans/20260408_recipe_card_hide_copy_ui.md` (신규)
- `src/components/common/RecipeResult.tsx` (수정 예정)
- `context/context_20260408_recipe_card_hide_copy_ui.md` (작성 예정)

## 테스트
- 사용자 수동 확인 기준으로 로컬 레시피 카드 UI 확인
- 별도 build/test는 사용자 요청 시 진행

## 롤백
- 카드 본문에 장면 제목/설명 문구를 다시 노출하도록 되돌림

## 리스크
- 카드에 담기는 맥락이 줄어들어 첫 인상은 더 간결하지만, 한 번에 읽히는 정보량은 감소할 수 있음

## 결과
- 완료
- 카드 UI에서 장면 대사와 설명을 제거했습니다.
- 카드 본문은 전략 헤딩, 장면 구간, `Open` 액션만 남는 더 압축된 구조로 정리했습니다.

## 연결 context
- `context/context_20260408_recipe_card_hide_copy_ui.md`
