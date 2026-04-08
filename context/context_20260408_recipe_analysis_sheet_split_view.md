# 작업 기록: 레시피 analysis split view

## 작업 요약
- `analysis` drawer 안에 원래 스크립트 섹션을 복원했습니다.
- drawer가 열리면 비디오 영역이 자연스럽게 위로 줄어드는 split view를 적용했고, analysis drawer 최대 높이는 50%로 맞췄습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_analysis_sheet_split_view.md`
- `context/context_20260408_recipe_analysis_sheet_split_view.md`

## 주요 변경
- analysis sheet 안에 `Original Script` 섹션을 다시 추가했습니다.
- analysis 탭에서 sheet 오픈 시 비디오 래퍼 높이를 50%로 줄이도록 변경했습니다.
- analysis 탭의 sheet backdrop은 더 가볍게 유지해 영상과 sheet를 함께 볼 수 있도록 정리했습니다.

## 검증
- 별도 build/test는 수행하지 않았습니다.

## 상태
- 로컬 코드 반영 완료
