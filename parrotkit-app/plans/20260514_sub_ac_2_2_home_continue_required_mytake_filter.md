# 2026-05-14 Sub-AC 2.2 Home Continue Required My Take Filter

## 배경
Home Continue v1 must treat the recipe shooting board as the continuation unit, and unfinished state must be based primarily on required-cut saved My Take completion.

## 목표
Update Home Continue board lookup/filtering so completed boards are excluded when all required cuts already have saved My Takes, even if legacy mock fields still say the recipe is in progress.

## 범위
- Home workflow resolution helper and focused tests.
- Provider call sites that resolve Home continue/latest workflow from mock state.
- No persistence refactor, direct camera restore, bottom tab changes, or CTA copy changes.

## 변경 파일
- `src/features/home/lib/home-workflow-resolution.ts`
- `src/features/home/lib/home-workflow-resolution.test.ts`
- `src/core/providers/mock-workspace-provider.tsx`
- `plans/20260514_sub_ac_2_2_home_continue_required_mytake_filter.md`
- `context/context_20260514_sub_ac_2_2_home_continue_required_mytake_filter.md`

## 테스트
- RED/GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- Type check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 롤백
Revert the resolver signature/filtering changes and the associated test/context/plan updates.

## 리스크
- Current mock model does not have explicit completion/publish state, so this sub-AC will only wire required-cut My Take filtering and leave explicit completion for a later criterion.
- Provider has access to saved take records but Home component direct resolver calls may need a compatible default to keep existing focused UI tests simple.

## 결과
- Home surface now passes the existing saved My Take records into `getHomeWorkflowSelection`, so Continue lookup excludes boards whose required cuts all have saved My Takes.
- The visible Saved takes list still shows only the first four records; the resolver receives the full list for completion filtering.
- 연결 context: `context/context_20260514_sub_ac_2_2_home_continue_required_mytake_filter.md`
