# Context 2026-05-14 Home Recent Workflow Resolution

## 작업
Sub-AC 1: Home이 기존 app state/data에서 가장 최근 또는 진행 중인 creator workflow를 고르는 방식을 정의했다.

## 결정
- Home workflow 대상은 local creator workflow로 제한한다.
- 포함 ownership: `owned`, `downloaded`, `remixed`
- 제외: `community` catalog recipe, `draft` Source state
- 정렬 기준은 현재 mock/local state 배열 순서다. 새로 만든 blank recipe나 copied template은 provider가 배열 앞에 prepend하므로 Home에서는 이 순서를 "최근"으로 본다.
- primary workflow는 첫 in-progress(`shootStatus === 'continue'`) 항목을 우선하고, 없으면 첫 non-draft local workflow로 fallback한다.

## 변경
- Added `src/features/home/lib/home-workflow-resolution.ts`
  - `getHomeInProgressWorkflowRecipe`
  - `getHomeRecentWorkflowRecipe`
  - `getHomePrimaryWorkflowRecipe`
- Updated `src/features/home/lib/home-workflow-resolution.test.ts`
  - Direct `sucrase-node` 실행을 위해 resolver runtime import를 relative import로 정리했다.
- Updated `src/core/providers/mock-workspace-provider.tsx`
  - Home continue/latest getter가 broad catalog/download-count sorting 대신 Home resolver를 사용한다.

## 검증
- RED:
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`
  - 실패 원인: `src/features/home/lib/home-workflow-resolution.ts` missing module
- GREEN:
  - `./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts` 통과
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json` 통과
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과

## 리스크 / 후속
- 이번 sub-AC는 workflow 선택 계약과 static/runtime helper 검증에 집중했다.
- iPhone simulator UI QA는 Seed의 최종 acceptance gate지만, 현재 sub-AC 범위에서는 실행하지 않았다.
- commit/push는 사용자 제약에 따라 수행하지 않았다.
