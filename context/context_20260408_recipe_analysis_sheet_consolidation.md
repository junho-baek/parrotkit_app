# 작업 기록: 레시피 analysis sheet 통합

## 작업 요약
- recipe 상세 `analysis` 탭의 하단 플로팅 액션을 `View Original Analysis`로 바꾸고, 기존 플레이어 아래에 직접 보이던 분석 정보 패널을 drawer 안으로 옮겼습니다.
- `Motion View`, `Why It Works`가 이제 하단 sheet 안에서 열리도록 정리해 중첩 레이어 느낌을 줄였습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `src/components/common/RecipeVideoPlayer.tsx`
- `plans/20260408_recipe_analysis_sheet_consolidation.md`
- `context/context_20260408_recipe_analysis_sheet_consolidation.md`

## 주요 변경
- analysis 탭의 플로팅 버튼 라벨을 `View Original Analysis`로 변경했습니다.
- analysis 탭용 sheet 제목/설명도 `Original Analysis`, `Reference motion + reasoning`으로 맞췄습니다.
- script sheet 내부에서 analysis 탭일 때 `Motion View`, `Why It Works` 섹션을 렌더하도록 분기했습니다.
- RecipeVideoPlayer에서는 하단 분석 패널을 제거하고 비디오 영역만 남겼습니다.

## 검증
- 별도 build/test는 수행하지 않았습니다.
- 로컬 recipe 상세의 analysis 탭 UI 구조만 코드 기준으로 정리했습니다.

## 상태
- 로컬 코드 반영 완료
