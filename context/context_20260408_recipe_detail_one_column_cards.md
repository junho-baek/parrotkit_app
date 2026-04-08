# 작업 기록: 레시피 상세 1열 카드 전환

## 작업 요약
- 레시피 상세 화면의 카드 배열을 2열 피드형 그리드에서 1열 샷리스트 구조로 전환했습니다.
- 이 화면이 레퍼런스 갤러리보다 실행용 레시피라는 점에 맞춰 순서, 시간 구간, 상태, 액션 문구가 더 먼저 보이도록 재배치했습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_detail_one_column_cards.md`
- `context/context_20260408_recipe_detail_one_column_cards.md`

## 주요 변경
- 카드 리스트 컨테이너를 `grid grid-cols-2`에서 1열 `flex` 스택으로 변경했습니다.
- 카드 내부를 `왼쪽 9:16 썸네일 / 오른쪽 실행 정보` 구조로 재편했습니다.
- 카드 우측 상단에 상태 배지(`Ready`, `Captured`, `Uploading`, `Retry shoot`, `Saved locally`)를 추가했습니다.
- `Scene N · start → end` 정보를 본문 영역에서도 다시 보여줘 순서 추적을 쉽게 했습니다.
- 카드 하단 카피를 `Tap to open the full shot plan`으로 바꿔 이 화면의 목적을 더 분명하게 했습니다.

## 검증
- 별도 실행 검증은 하지 않았습니다.
- 사용자 수동 확인 기준으로 레이아웃 변경만 우선 반영했습니다.

## 상태
- 로컬 코드 반영 완료
