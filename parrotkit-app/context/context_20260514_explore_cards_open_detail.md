# Context 2026-05-14 Explore Cards Open Detail

## 작업
AC 22: Explore cards can be opened for detail.

## 변경
- `src/features/explore/lib/explore-card-routing.ts`
  - Explore card detail route를 계산하는 `getExploreCardDetailPath`를 추가했다.
  - recipe-backed card는 recipe id를, static card는 card id를 detail id로 사용한다.
- `src/features/explore/lib/explore-card-routing.test.ts`
  - route contract용 TypeScript check를 추가했다.
- `src/features/explore/screens/explore-screen.tsx`
  - card body press가 항상 `/explore-recipe/[id]` detail route로 이동하도록 변경했다.
  - brand/template card의 action은 기존처럼 Pro/deferred creation route 성격을 유지한다.
- `src/features/explore/screens/explore-recipe-detail-screen.tsx`
  - `brand-request-serum-launch` static detail fallback을 추가했다.
  - Pro-locked brand context와 reference-assisted creation이 v1 deferred/pro option임을 detail에서 보여준다.
- `tsconfig.explore-card-detail-check.json`
  - Explore detail routing 관련 파일만 대상으로 한 offline TypeScript 검증 config를 추가했다.
- `plans/20260514_explore_cards_open_detail.md`
  - 계획과 결과를 기록했다.

## 검증
- `npm exec --offline -- tsc --noEmit -p tsconfig.explore-card-detail-check.json`
  - 통과했다.
- `npm exec --offline -- tsc --noEmit`
  - 통과했다.

## 참고
- Home, My/Profile, recipe editor, prompter high-overlap 파일은 건드리지 않았다.
- 기존 `/explore-recipe/[recipeId]` route를 재사용해 route integrity를 유지했다.
- worktree에 sibling AC 변경이 많아 commit/push는 수행하지 않았다.
