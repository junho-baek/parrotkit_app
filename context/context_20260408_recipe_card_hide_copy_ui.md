# 작업 기록: 레시피 카드 UI 대사/설명 제거

## 작업 요약
- `/home?view=recipe&recipeId=...` 레시피 카드 UI에서 장면 대사와 설명 문구를 제거했습니다.
- 데이터나 로직은 유지하고, 카드에서만 텍스트를 숨겨 더 짧고 빠르게 스캔되는 형태로 정리했습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_card_hide_copy_ui.md`
- `context/context_20260408_recipe_card_hide_copy_ui.md`

## 주요 변경
- 카드 렌더에서 장면 제목/설명 문구 출력 블록을 제거했습니다.
- 카드 import와 내부 변수에서 더 이상 쓰지 않는 `getSceneCardSummary`와 `summary` 참조를 정리했습니다.
- 카드 하단은 `Open →` 액션만 남도록 단순화했습니다.

## 검증
- 별도 실행 검증은 하지 않았습니다.
- 사용자 수동 확인 기준으로 UI 텍스트 제거만 우선 반영했습니다.

## 상태
- 로컬 코드 반영 완료
