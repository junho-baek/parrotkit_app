# 2026-05-15 Sub-AC 3.2 Explicit Complete Continue Exclusion

## 배경
Home Continue must resume unfinished recipe shooting boards, but explicit publish/complete actions can mark a board final even when required-cut My Take state is incomplete.

## 목표
Exclude recipe boards from Home Continue when an explicit publish or complete action has marked the board complete.

## 범위
- Minimal mock-model completion marker.
- Focused Home workflow selection coverage.
- No navigation changes, persistence refactor, bottom tab changes, or CTA copy changes.

## 변경 파일
- `src/core/mocks/parrotkit-data.ts`
- `src/features/home/lib/home-workflow-resolution.ts`
- `src/features/home/lib/home-workflow-resolution.test.ts`
- `plans/20260515_sub_ac_3_2_explicit_complete_continue_exclusion.md`
- `context/context_20260515_sub_ac_3_2_explicit_complete_continue_exclusion.md`

## 테스트
- RED/GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- Type check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 롤백
Remove the explicit completion marker, resolver exclusion, focused test, and this plan/context note.

## 리스크
- Explicit completion is represented as a simple mock boolean for v1; future persistence can map publish/complete actions onto this field without changing Continue selection semantics.

## 결과
- Added `MockRecipe.explicitCompletion?: boolean` as the minimal v1 explicit publish/complete marker.
- Updated Home workflow resolution to exclude explicitly completed boards before saved My Take completion checks.
- Added focused coverage for skipping an explicitly completed in-progress board with missing required My Takes, including the only-candidate empty state.
- 연결 context: `context/context_20260515_sub_ac_3_2_explicit_complete_continue_exclusion.md`
