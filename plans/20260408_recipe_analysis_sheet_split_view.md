# Recipe Analysis Sheet Split View

## 배경
- `analysis` 탭에서 분석 정보는 drawer로 모았지만, 원래 들어가던 스크립트 라인이 빠졌고, drawer가 올라와도 비디오 영역과 자연스럽게 함께 보이는 split view가 부족합니다.
- 사용자는 원래 스크립트를 유지하면서, drawer가 최대 50%까지 올라오고 영상 영역도 함께 밀려 올라가며 같이 볼 수 있길 원합니다.

## 목표
- `analysis` drawer 안에 원래 스크립트 섹션을 복원합니다.
- `analysis` drawer 오픈 시 비디오 영역이 50% 높이로 자연스럽게 줄어드는 split view를 만듭니다.
- drawer 최대 높이는 50%로 제한합니다.

## 범위
- `src/components/common/RecipeResult.tsx`
- `context/context_20260408_recipe_analysis_sheet_split_view.md`

## 변경 파일
- `plans/20260408_recipe_analysis_sheet_split_view.md` (신규)
- `src/components/common/RecipeResult.tsx` (수정 예정)
- `context/context_20260408_recipe_analysis_sheet_split_view.md` (작성 예정)

## 테스트
- 로컬 recipe 상세 `analysis` 탭에서 drawer 오픈 시 비디오/analysis split view 수동 확인
- 별도 build/test는 사용자 요청 시 진행

## 롤백
- analysis drawer의 스크립트 복원과 split view 높이 제어를 제거하고 이전 consolidated sheet 상태로 되돌림

## 리스크
- 화면 높이가 작은 기기에서는 50% split이 다소 타이트하게 느껴질 수 있음

## 결과
- 완료
- analysis drawer를 더 drawer처럼 하단에 붙는 구조로 조정했습니다.
- 영상 오버레이 뱃지를 제거했습니다.
- recipe sheet에서는 괄호형 동작 지시 라인을 숨기고 말하는 스크립트만 보이도록 정리했습니다.

## 연결 context
- `context/context_20260408_recipe_analysis_sheet_split_view.md`
