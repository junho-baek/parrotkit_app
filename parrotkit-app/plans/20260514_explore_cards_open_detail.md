# Explore Cards Open Detail

## 배경
ParrotKit v1 Explore는 mock guide/template cards를 보여주며, 각 카드는 상세 화면으로 진입할 수 있어야 한다. 현재 recipe-backed Explore 카드는 상세 route가 있지만, static brand/template card는 카드 탭 시 생성 플로우로 바로 이동한다.

## 목표
- Explore의 recipe card와 static card가 모두 detail route로 열린다.
- Static brand/template card의 Pro-locked action은 유지하되 카드 본문 탭과 분리한다.
- 기존 `/explore-recipe/[recipeId]` route를 활용해 route integrity를 유지한다.

## 범위
- Explore card press routing helper 추가
- Explore list card press 연결 변경
- Static brand/template detail fallback 추가
- 오프라인 TypeScript contract 검증 추가

## 변경 파일
- `plans/20260514_explore_cards_open_detail.md`
- `src/features/explore/lib/explore-card-routing.ts`
- `src/features/explore/lib/explore-card-routing.test.ts`
- `src/features/explore/screens/explore-screen.tsx`
- `src/features/explore/screens/explore-recipe-detail-screen.tsx`
- `tsconfig.explore-card-detail-check.json`
- `context/context_20260514_explore_cards_open_detail.md`

## 테스트
- `npm exec --offline -- tsc --noEmit -p tsconfig.explore-card-detail-check.json`
- `npm exec --offline -- tsc --noEmit`

## 롤백
- 위 변경 파일을 되돌리면 기존 Explore 동작으로 복귀한다.
- Static brand/template card는 다시 creation route로 직접 이동한다.

## 리스크
- Detail screen에 static card fallback이 추가되어 copy 중복이 생길 수 있다.
- Brand action은 Pro-locked/deferred 성격이므로, detail 진입과 action 진입을 혼동하지 않도록 CTA를 분리해야 한다.

## 결과
- Explore card body press routing을 `getExploreCardDetailPath`로 통일했다.
- Recipe-backed cards는 기존 `/explore-recipe/[recipeId]` detail로 열린다.
- Static brand/template card는 `/explore-recipe/brand-request-serum-launch` detail fallback으로 열린다.
- Static detail에서는 Pro-locked brand context 성격을 명시하고, free blank recipe workflow를 막지 않도록 local/mock 설명만 제공한다.
- Targeted 및 broad TypeScript 검증이 통과했다.
- 연결 context: `context/context_20260514_explore_cards_open_detail.md`
