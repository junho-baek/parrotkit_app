# Context 2026-05-14 Sub-AC 6.1.4 Home Empty Workflow Fallback

## 작업
Sub-AC 4: Home에 in-progress 또는 recent workflow가 없을 때 표시되는 empty/fallback state를 추가했다.

## 변경
- Updated `src/features/home/lib/home-continue-workflow-card.ts`
  - Added `HomeEmptyWorkflowFallback`.
  - Added `getHomeEmptyWorkflowFallback(...)`.
  - Empty selection only returns a fallback; existing workflow selection returns `null`.
  - Korean fallback action label is `레시피 생성`.
  - Fallback destination is `/recipe-create?mode=manual`.
- Updated `src/features/home/lib/home-continue-workflow-card.test.ts`
  - Added empty workflow fallback assertions for presence, Korean CTA copy, manual recipe route, and no Shoot/New Shoot/Start Shoot copy.
- Updated `src/features/home/components/home-workspace-surface.tsx`
  - Empty workflow panel now renders from `getHomeEmptyWorkflowFallback`.
  - The panel action now opens manual recipe creation instead of `/quick-shoot`.
  - The panel icon/copy now represent recipe creation rather than quick-shoot.
- Added and completed `plans/20260514_sub_ac_6_1_4_home_empty_workflow_fallback.md`.

## 검증
- RED:
  - `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
  - Expected failure: `getHomeEmptyWorkflowFallback` was missing.
- GREEN:
  - `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`

## 시뮬레이터
- `xcrun simctl list devices available`
  - Failed with CoreSimulatorService connection invalid / connection refused.
  - iPhone simulator UI QA could not run in this environment.

## 리스크 / 후속
- Web QA was not run because it is out of scope for this Seed follow-up.
- No commit, push, or merge performed per Seed constraints.
