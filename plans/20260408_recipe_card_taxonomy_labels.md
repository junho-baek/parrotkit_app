# Recipe Card Taxonomy Labels

## 배경
- 1열 카드 전환 후에도 카드당 읽어야 하는 정보가 많아 여전히 설명 카드처럼 느껴집니다.
- 사용자는 카드 헤딩을 장면 요약 문장 대신 `HOOK / BASE / CTA` 구조와 훅 패턴 영어 라벨로 더 간결하게 보고 싶어 합니다.

## 목표
- 레시피 카드 헤더를 전략 라벨 중심으로 단순화합니다.
- `Ready` 같은 기본 상태 노출은 줄이고, 필요한 경우에만 상태 배지를 보여 카드 밀도를 낮춥니다.

## 범위
- `src/components/common/RecipeResult.tsx`

## 변경 파일
- `plans/20260408_recipe_card_taxonomy_labels.md` (신규)
- `src/components/common/RecipeResult.tsx` (수정 예정)
- `context/context_20260408_recipe_card_taxonomy_labels.md` (작성 예정)

## 테스트
- 사용자 수동 확인 기준으로 로컬 레시피 상세 카드 밀도와 라벨 문구 확인
- 별도 build/test는 사용자 요청 시 진행

## 롤백
- 카드 헤더를 기존 `summary.eyebrow` 중심 구조로 되돌리고, 현재 분류 헬퍼를 제거

## 리스크
- 현재 훅/베이스/CTA 패턴은 장면 텍스트 기반 휴리스틱이라 완벽히 맞지 않을 수 있음
- 향후 장면별 구조화된 패턴 필드가 생기면 해당 값을 우선하도록 바꾸는 것이 더 정확함

## 결과
- 완료
- 카드 헤더를 장면 요약 문장 대신 `HOOK / BASE / CTA` 영어 전략 라벨로 바꿨습니다.
- 기본 `Ready` 상태는 숨기고, 실제로 의미 있는 상태만 보여 카드 상단의 복잡도를 낮췄습니다.
- 보조 칩과 보조 문구를 제거해 카드당 정보량을 줄였습니다.

## 연결 context
- `context/context_20260408_recipe_card_taxonomy_labels.md`
