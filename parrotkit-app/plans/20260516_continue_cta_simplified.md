# Continue CTA Simplified

## 배경
Seed issue 6 AC 6은 Home Continue card 자체가 tappable일 때 중복되는 큰 CTA 버튼을 제거해야 한다. `DESIGN.md`도 card press가 CTA이면 redundant CTA button을 두지 말라고 명시한다.

## 목표
- Home Continue card press가 recipe overview로 이동하는 단일 CTA 역할을 유지한다.
- card 내부에 별도 큰 duplicate action button을 렌더링하지 않도록 회귀 테스트를 추가한다.

## 범위
- `src/features/home/components/home-workspace-surface.tsx`
- `src/features/home/lib/home-continue-workflow-card.test.ts`
- `plans/20260516_continue_cta_simplified.md`
- `context/context_20260516_continue_cta_simplified.md`

## 변경 파일
- 작업 전 계획 기준. 실제 변경 후 결과 섹션에 확정 파일을 남긴다.

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`

## 롤백
- 추가한 test assertion과 Home Continue card 내부 CTA 제거 변경을 되돌린다.

## 리스크
- 병렬 agent가 같은 Home Continue copy/test 파일을 수정 중일 수 있다. 기존 변경을 보존하고 AC 6에 필요한 최소 diff만 적용한다.

## 결과
- `ContinueRecipePanel`의 `styles.continueCard`가 적용된 card surface 자체를 `Pressable`로 변경했다.
- card 내부의 `card.actionLabel` duplicate CTA text를 제거하고 progress bar만 supporting context로 남겼다.
- `src/features/home/lib/home-continue-workflow-card.test.ts`에 card surface tappability와 duplicate actionLabel 미렌더링 회귀 검사를 추가했다.
- 연결 context: `context/context_20260516_continue_cta_simplified.md`
