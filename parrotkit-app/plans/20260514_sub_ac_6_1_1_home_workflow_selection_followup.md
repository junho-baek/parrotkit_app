# Sub-AC 6.1.1 Home Workflow Selection Follow-up

## 배경
Home must choose a single creator workflow from existing local app state without relying on Source or Recipes as bottom tabs.

## 목표
- Define the Home workflow selection contract in code and focused tests.
- Prefer an in-progress local creator workflow over ready workflows.
- Fall back to the most recent local creator workflow when nothing is in progress.

## 범위
- Home workflow resolver and focused resolver test only.
- Mock workspace provider wiring only if the resolver contract needs adjustment.
- No navigator, Explore, My, or simulator-specific UI changes.

## 변경 파일
- `plans/20260514_sub_ac_6_1_1_home_workflow_selection_followup.md`
- `src/features/home/lib/home-workflow-resolution.ts`
- `src/features/home/lib/home-workflow-resolution.test.ts`
- `context/context_20260514_sub_ac_6_1_1_home_workflow_selection_followup.md`

## 테스트
- RED: run the focused Home workflow resolver check and confirm the missing/incorrect contract fails.
- GREEN: run the focused Home workflow resolver check after the minimal resolver update.
- Run the focused TypeScript config for the resolver.

## 롤백
- Revert the resolver/test/context/plan changes from this Sub-AC only.

## 리스크
- Existing mock timestamps are human-readable strings, so the resolver should keep using local state order as the recency signal unless numeric timestamps are introduced later.

## 결과
- Added `getHomeWorkflowSelection(recipes)` as the explicit Home workflow decision contract.
- The resolver returns `reason: 'inProgress'` when the first local in-progress creator workflow is selected.
- The resolver returns `reason: 'recent'` when it falls back to the first local non-draft creator workflow.
- The resolver returns `reason: 'none'` when only community catalog recipes or draft Source state are available.
- Existing helper behavior remains intact: Home still prefers local `owned` / `downloaded` / `remixed` workflows and does not add Source or Recipes bottom tabs.

## 검증 결과
- RED: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json` failed with missing `getHomeWorkflowSelection` export.
- GREEN: `./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts` passed.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json` passed.

## 연결 context
- `context/context_20260514_sub_ac_6_1_1_home_workflow_selection_followup.md`

## 재검증
- 2026-05-14 follow-up run confirmed no additional code change was needed for Sub-AC 1.1.
- GREEN: `./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`
