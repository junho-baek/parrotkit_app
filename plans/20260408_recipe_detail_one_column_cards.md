# Recipe Detail One-Column Cards

## 배경
- 레시피 상세 화면이 현재 2열 9:16 카드 그리드라서, 실행용 샷리스트보다는 레퍼런스 피드처럼 보입니다.
- 사용자 의도는 이 화면을 "예쁘게 보는 곳"보다 "순서대로 다시 찍는 곳"에 가깝게 정리하는 것입니다.

## 목표
- `/home?view=recipe&recipeId=...` 화면의 카드 레이아웃을 1열 샷리스트 구조로 전환합니다.
- 순서, 시간 구간, 상태, 다음 액션이 한눈에 보이도록 정보 우선순위를 재배치합니다.

## 범위
- `src/components/common/RecipeResult.tsx`

## 변경 파일
- `plans/20260408_recipe_detail_one_column_cards.md` (신규)
- `src/components/common/RecipeResult.tsx` (수정 예정)
- `context/context_20260408_recipe_detail_one_column_cards.md` (작성 예정)

## 테스트
- 사용자 수동 확인 기준으로 로컬 dev에서 레시피 상세 화면 레이아웃 확인
- 별도 build/test는 사용자 요청 시 진행

## 롤백
- 레시피 카드 리스트 컨테이너와 카드 내부 레이아웃을 이전 2열 grid 구조로 복귀

## 리스크
- 카드 정보량이 늘면서 세로 길이가 길어질 수 있음
- 카드 전체 클릭 구조를 유지하므로, 향후 카드 내부에 개별 버튼이 추가되면 클릭 분리가 필요할 수 있음

## 결과
- 완료
- 레시피 상세 카드 레이아웃을 2열 그리드에서 1열 샷리스트로 변경했습니다.
- 카드 내부 정보를 `썸네일 / 시간 / 핵심 설명 / 상태 / 액션` 순서로 재배치했습니다.
- 상태 배지를 추가해 사용자가 지금 어떤 컷을 먼저 다뤄야 하는지 더 빠르게 읽을 수 있게 했습니다.

## 연결 context
- `context/context_20260408_recipe_detail_one_column_cards.md`
