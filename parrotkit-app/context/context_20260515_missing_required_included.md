# Context 2026-05-15 Missing Required Included

## 작업

AC 4 `missing_required_included`: required cut 중 하나라도 saved My Take가 없으면 recipe board가 Home Continue 후보로 유지되는지 검증했다.

## 변경

- Added `plans/20260515_missing_required_included.md`
  - 작업 범위, 테스트, 리스크, 결과 및 연결 context 파일명을 기록했다.
- No production code changes were required.
  - `isRecipeBoardUnfinishedByRequiredMyTakes` already returns unfinished when any required cut is missing saved My Take coverage.
  - `getHomeWorkflowSelection` already keeps a `continue` board eligible when exactly one required cut lacks a saved My Take.

## 검증

- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 리스크 / 후속

- This AC did not change navigation labels, CTA language, optional cut behavior, explicit completion behavior, persistence, or Supabase contracts.
- Existing sibling edits remain in the worktree and were not reverted or modified for this AC.
