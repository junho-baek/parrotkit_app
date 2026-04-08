# 작업 기록: 레시피 카드 헤딩 단순화 및 중립 톤 적용

## 작업 요약
- 카드 상단의 작은 전략 라벨 줄을 없애고, 해당 정보를 헤딩 자체로 올렸습니다.
- 카드에서 보라/인디고 계열 강조를 제거하고 중립적인 회색 톤으로 정리했습니다.
- 카드 본문은 장면 제목 중심으로 간결하게 유지하고, 보조 설명은 한 줄만 남겼습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_card_heading_neutralize.md`
- `context/context_20260408_recipe_card_heading_neutralize.md`

## 주요 변경
- 헤딩을 `HOOK: Outcome-First`, `BASE #1: Scene Change`, `CTA: Hard CTA` 같은 전략 정보로 직접 표시합니다.
- 카드 상단 번호 배경을 중립적인 `gray-900`으로 변경했습니다.
- 기본 상태의 중립 톤과 `Open` 링크 색상을 회색으로 조정했습니다.
- 카드 본문은 `summary.title`을 우선 노출하고, `summary.detail`은 제목과 다를 때만 한 줄로 보이도록 줄였습니다.

## 검증
- 별도 실행 검증은 하지 않았습니다.
- 사용자 수동 확인 기준으로 카드 헤딩/색상 정리만 우선 반영했습니다.

## 상태
- 로컬 코드 반영 완료
