# Context 2026-05-14 Home Primary CTA Routing

## 작업
Sub-AC 3.1.3 범위로 Home primary CTA가 creator workflow의 올바른 screen/step으로 바로 이동하는 routing 계약을 명시했다.

## 변경
- `src/features/home/lib/home-primary-cta.ts`
  - `getHomePrimaryCtaDestination` helper를 추가했다.
  - 기존 workflow `recipeId`가 있으면 `/recipe/{recipeId}` shoot board route를 반환한다.
  - workflow가 없으면 `/recipe-create?mode=manual` manual creation step을 반환한다.
- `src/features/home/lib/home-primary-cta.test.ts`
  - continue workflow CTA가 selected recipe shoot board로 이동하는지 검증한다.
  - empty workflow CTA가 manual creation step으로 이동하는지 검증한다.
- `src/features/home/components/home-workspace-surface.tsx`
  - Home primary CTA의 inline route 분기를 helper 기반 destination push로 정리했다.
- `plans/20260514_home_primary_cta_routing.md`
  - 계획과 결과를 기록했다.

## 검증
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
  - 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-primary-cta-check.json`
  - 통과.

## Simulator QA
- 시도:
  - `xcrun simctl list devices available`
- 결과:
  - CoreSimulatorService connection invalid / connection refused로 실패했다.
  - 현재 sandbox에서는 iPhone simulator device list에 접근할 수 없어 simulator UI QA 증거를 새로 만들지 못했다.

## 참고
- Source 또는 Recipes를 bottom tab으로 복원하지 않았다.
- Reference link, Brand context, paid/API/upload flow는 추가하지 않았다.
- orch_78808bb15d74의 기존 Home/Explore/My, saved recipe/take, locked guidance 변경은 되돌리지 않았다.
