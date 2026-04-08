# Recipe Analysis Sheet Consolidation

## 배경
- 레시피 상세의 `analysis` 탭은 현재 플레이어 하단에 분석 정보 패널이 고정으로 깔리고, 동시에 하단 플로팅 액션으로 또 다른 sheet를 여는 구조라 레이어가 겹쳐 보일 수 있습니다.
- 사용자는 플로팅 액션을 `View Original Analysis`로 바꾸고, 현재 화면 하단에 바로 노출된 분석 정보(`Motion View`, `Why It Works`)를 drawer 안으로 옮기길 원합니다.

## 목표
- `analysis` 탭의 하단 플로팅 액션 라벨을 `View Original Analysis`로 변경합니다.
- 플레이어 아래 고정 분석 패널을 제거합니다.
- 기존 drawer 안에 `Motion View`, `Why It Works` 분석 정보를 넣어 레이어 중첩을 줄입니다.

## 범위
- `src/components/common/RecipeResult.tsx`
- `src/components/common/RecipeVideoPlayer.tsx`
- `context/context_20260408_recipe_analysis_sheet_consolidation.md`

## 변경 파일
- `plans/20260408_recipe_analysis_sheet_consolidation.md` (신규)
- `src/components/common/RecipeResult.tsx` (수정 예정)
- `src/components/common/RecipeVideoPlayer.tsx` (수정 예정)
- `context/context_20260408_recipe_analysis_sheet_consolidation.md` (작성 예정)

## 테스트
- 로컬 recipe 상세에서 analysis 탭 플로팅 버튼/analysis sheet 구조 수동 확인
- 별도 build/test는 사용자 요청 시 진행

## 롤백
- 플로팅 버튼 라벨과 drawer 분기를 이전 스크립트 시트 구조로 되돌립니다.
- RecipeVideoPlayer 하단 분석 패널을 다시 복구합니다.

## 리스크
- 기존 analysis 탭에서 바로 보이던 정보가 이제 한 번 더 탭/열기 액션 뒤로 들어가 접근성이 달라질 수 있습니다.
