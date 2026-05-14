# Home Primary CTA Routing

## 배경
Home primary CTA는 creator workflow를 명확히 보여주지만, CTA가 어떤 workflow screen 또는 step으로 이동해야 하는지 컴포넌트 내부 분기만으로 암묵적으로 처리되어 있다.

## 목표
- Home primary CTA routing 계약을 명시한다.
- 이어갈 workflow가 있으면 해당 recipe의 shoot board로 바로 이동한다.
- 이어갈 workflow가 없으면 manual recipe creation step으로 바로 이동한다.

## 범위
- Home primary CTA destination helper와 Home surface wiring만 최소 변경한다.
- Source 또는 Recipes를 bottom tab으로 복원하지 않는다.
- Reference link, Brand context, paid/API/upload flow는 추가하지 않는다.

## 변경 파일
- `plans/20260514_home_primary_cta_routing.md`
- `src/features/home/lib/home-primary-cta.ts`
- `src/features/home/lib/home-primary-cta.test.ts`
- `src/features/home/components/home-workspace-surface.tsx`
- `context/context_20260514_home_primary_cta_routing.md`

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-primary-cta-check.json`

## 롤백
- Home primary CTA destination helper와 Home surface wiring 변경을 되돌려 이전 inline routing 분기로 복원한다.

## 리스크
- 이번 변경은 simulator-oriented 최소 routing 계약만 다루며, simulator 실행 가능 여부는 환경에 의존한다.

## 결과
- Home primary CTA destination helper를 추가했다.
- 기존 workflow가 있으면 `/recipe/{recipeId}` shoot board route로 바로 이동한다.
- 기존 workflow가 없으면 `/recipe-create?mode=manual` manual creation step으로 바로 이동한다.
- Home surface의 inline 분기를 helper 기반 destination push로 정리했다.
- 연결 context: `context/context_20260514_home_primary_cta_routing.md`

## 검증 결과
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
  - 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-primary-cta-check.json`
  - 통과.
- `xcrun simctl list devices available`
  - CoreSimulatorService connection invalid / connection refused로 실패. 현재 sandbox에서 iPhone simulator UI QA를 실행할 수 없었다.
