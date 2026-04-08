# Recipe Card Heading Neutralize

## 배경
- 현재 레시피 카드 상단은 작은 보라색 전략 라벨과 큰 제목이 분리되어 있어 읽는 정보가 한 번 더 늘어납니다.
- 사용자는 전략 라벨을 별도 라벨이 아니라 헤딩 자체로 보길 원하고, 카드에서 보라/인디고 톤도 제거하길 원합니다.

## 목표
- 카드 상단의 전략 정보를 `HOOK / BASE / CTA` 헤딩으로 직접 노출합니다.
- 카드 내부의 보라/인디고 강조를 제거하고 더 중립적인 톤으로 정리합니다.
- 카드 정보량을 한 단계 더 줄입니다.

## 범위
- `src/components/common/RecipeResult.tsx`

## 변경 파일
- `plans/20260408_recipe_card_heading_neutralize.md` (신규)
- `src/components/common/RecipeResult.tsx` (수정 예정)
- `context/context_20260408_recipe_card_heading_neutralize.md` (작성 예정)

## 테스트
- 사용자 수동 확인 기준으로 로컬 레시피 카드 헤딩/색상 확인
- 별도 build/test는 사용자 요청 시 진행

## 롤백
- 헤딩을 다시 본문 제목으로 되돌리고, 전략 라벨을 별도 작은 텍스트로 복귀

## 리스크
- 카드 정보가 줄어들면서 상세 맥락이 약해질 수 있음
- 현재 휴리스틱 기반 전략 라벨은 일부 장면에서 사용자의 분류 감각과 다를 수 있음

## 결과
- 완료
- 전략 라벨을 카드 헤딩으로 직접 노출하도록 변경했습니다.
- 카드의 보라/인디고 계열 강조를 제거하고 중립 톤으로 정리했습니다.
- 카드 본문은 한 줄 요약 중심으로 더 간결하게 줄였습니다.

## 연결 context
- `context/context_20260408_recipe_card_heading_neutralize.md`
