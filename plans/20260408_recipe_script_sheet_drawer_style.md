# Recipe Script Sheet Drawer Style

## 배경
- `analysis` 탭 sheet는 하단 drawer 느낌으로 정리됐지만, `recipe` 탭 sheet는 여전히 중앙 팝업처럼 떠 보여 일관성이 떨어집니다.

## 목표
- `recipe` 탭의 script sheet도 하단에 붙는 drawer 스타일로 정리합니다.

## 범위
- `src/components/common/RecipeResult.tsx`
- `context/context_20260408_recipe_script_sheet_drawer_style.md`

## 변경 파일
- `plans/20260408_recipe_script_sheet_drawer_style.md` (신규)
- `src/components/common/RecipeResult.tsx` (수정 예정)
- `context/context_20260408_recipe_script_sheet_drawer_style.md` (작성 예정)

## 테스트
- 로컬 recipe 상세에서 recipe 탭 sheet가 하단 drawer처럼 보이는지 수동 확인
- 별도 build/test는 사용자 요청 시 진행

## 롤백
- recipe 탭 sheet 컨테이너를 이전 중앙 팝업형 스타일로 되돌림

## 리스크
- 기존 팝업형보다 하단 고정 느낌이 강해져 시각 인상은 더 무거워질 수 있음
