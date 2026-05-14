# Context 2026-05-14 Sub-AC 6.1.3 Continue Workflow Destination

## 작업
Sub-AC 3: Home continue action을 선택된 workflow destination으로 명시적으로 연결하고, blank creation primary CTA 언어를 `레시피 생성`으로 정리했다.

## 변경
- Updated `src/features/home/lib/home-continue-workflow-card.ts`
  - Added `getHomeContinueWorkflowDestination`.
  - Selected workflow가 있으면 `/recipe/{recipeId}` cut-board route를 반환한다.
  - 선택된 workflow가 없으면 `/recipe-create?mode=manual`을 반환한다.
- Updated `src/features/home/lib/home-continue-workflow-card.test.ts`
  - Continue action destination과 empty fallback destination 계약을 추가했다.
- Updated `src/features/home/components/home-workspace-surface.tsx`
  - Continue card primary action을 `getHomeContinueWorkflowDestination` 결과로 push하도록 연결했다.
- Updated `src/features/home/lib/home-primary-cta.ts`
  - Korean blank creation action label을 `레시피 만들기`에서 `레시피 생성`으로 변경했다.
- Updated `src/features/home/lib/home-primary-cta.test.ts`
  - Korean blank creation CTA label regression assertion을 추가했다.
- Added `plans/20260514_sub_ac_6_1_3_continue_workflow_destination.md`.

## 검증
- RED:
  - `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
    - 실패: `getHomeContinueWorkflowDestination` export 없음.
  - `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
    - 실패: Korean blank creation action label이 `레시피 생성`이 아님.
- GREEN:
  - `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
  - `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-primary-cta-check.json`

## 시뮬레이터
- `xcrun simctl list devices available`
  - 실패: CoreSimulatorService connection invalid / connection refused.
  - 이 환경에서는 iPhone simulator UI QA를 수행할 수 없었다.

## 리스크 / 후속
- Web QA는 Seed 범위 밖이라 수행하지 않았다.
- No commit, push, or merge performed per Seed constraints.
