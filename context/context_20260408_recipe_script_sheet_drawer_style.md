# 작업 기록: 레시피 script sheet drawer 스타일

## 작업 요약
- `recipe` 탭의 script sheet를 하단에 붙는 drawer 스타일로 정리했습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_script_sheet_drawer_style.md`
- `context/context_20260408_recipe_script_sheet_drawer_style.md`

## 주요 변경
- recipe 탭 sheet 외곽의 좌우 여백과 하단 여백을 제거했습니다.
- recipe 탭도 rounded top + bottom attached 스타일을 쓰도록 맞췄습니다.
- script sheet 내부는 flex column + scroll 영역 구조로 정리해 drawer처럼 보이게 했습니다.

## 검증
- 별도 build/test는 수행하지 않았습니다.

## 상태
- 로컬 코드 반영 완료
