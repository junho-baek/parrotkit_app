# Context 2026-05-14 Sub-AC 6.1.1 Home Workflow Selection Follow-up

## 작업
Sub-AC 6.1.1: Home이 기존 user/project state에서 어떤 in-progress 또는 recent workflow를 선택하는지 코드 계약으로 명시했다.

## 결정
- Home workflow 대상은 local creator workflow로 유지한다.
- 포함 ownership: `owned`, `downloaded`, `remixed`.
- 제외: `community` catalog recipe, `draft` Source state.
- 현재 mock/local state에서는 배열 순서가 recency source of truth다.
- 선택 우선순위는 first in-progress (`shootStatus === 'continue'`) 이후 first recent non-draft local workflow다.
- 선택 결과는 `getHomeWorkflowSelection`의 `reason`으로 명시한다: `inProgress`, `recent`, `none`.

## 변경
- Updated `src/features/home/lib/home-workflow-resolution.ts`
  - Added `HomeWorkflowSelection`.
  - Added `getHomeWorkflowSelection(recipes)`.
- Updated `src/features/home/lib/home-workflow-resolution.test.ts`
  - Added focused assertions for `inProgress`, `recent`, and `none` selection reasons.
- Added `plans/20260514_sub_ac_6_1_1_home_workflow_selection_followup.md`.

## 검증
- RED:
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`
  - Expected failure: missing `getHomeWorkflowSelection` export.
- GREEN:
  - `./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 리스크 / 후속
- iPhone simulator QA는 이 Sub-AC 범위 밖이며 실행하지 않았다.
- Human-readable mock timestamps remain unsuitable for absolute timestamp sorting; resolver intentionally uses local state order.
- No commit, push, or merge performed per Seed constraints.

## Follow-up verification
- 2026-05-14 follow-up run rechecked Sub-AC 1.1 against the current worktree.
- No additional code edits were required: `getHomeWorkflowSelection` still chooses the first local in-progress workflow, then the first local recent non-draft workflow, then `none`.
- GREEN: `./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`
