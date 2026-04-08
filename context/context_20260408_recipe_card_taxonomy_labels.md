# 작업 기록: 레시피 카드 전략 라벨 단순화

## 작업 요약
- 원격 상태를 `git fetch origin`으로 먼저 확인했고, 현재 작업 기준은 계속 `origin/dev`와 같은 선상으로 유지되고 있습니다.
- 레시피 카드의 설명량을 줄이기 위해 헤더를 장면 요약 문장 대신 `HOOK / BASE / CTA` 영어 전략 라벨로 교체했습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_card_taxonomy_labels.md`
- `context/context_20260408_recipe_card_taxonomy_labels.md`

## 주요 변경
- 카드 헤더에 `HOOK: Problem-Led`, `HOOK: Outcome-First`, `HOOK: Myth-Busting`, `BASE #1: Question Lead`, `BASE #1: Scene Change`, `BASE #1: Real Example`, `BASE #1: Authority Cue`, `CTA: Hard CTA`, `CTA: Soft CTA` 같은 영어 패턴 라벨이 보이도록 분류 헬퍼를 추가했습니다.
- 카드 내 기본 상태인 `Ready` 배지는 숨기고, `Uploading / Saved locally / Retry shoot / Captured`처럼 의미 있는 상태만 노출하도록 줄였습니다.
- `Analysis / Recipe / Prompter` 칩과 보조 문구를 제거해 한 카드당 읽어야 하는 줄 수를 줄였습니다.

## 검증
- 별도 실행 검증은 하지 않았습니다.
- 사용자 수동 확인 기준으로 카드 밀도와 라벨 체계 변경만 우선 반영했습니다.

## 상태
- 로컬 코드 반영 완료
