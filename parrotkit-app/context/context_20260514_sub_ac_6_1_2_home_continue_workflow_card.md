# Context 2026-05-14 Sub-AC 6.1.2 Home Continue Workflow Card

## 작업
Sub-AC 2: Home이 선택된 workflow state를 사용해 명확한 Continue section/card를 렌더링하도록 보강했다.

## 변경
- Updated `src/features/home/lib/home-continue-workflow-card.ts`
  - Continue card view model에 `sectionTitle`, `stateLabel`, `accessibilityLabel`을 추가했다.
  - `inProgress` 선택은 `이어갈 워크플로우` / `진행 중`으로 표시한다.
  - `recent` 선택은 `Recent workflow` / `Recent`로 표시하고 ready recent workflow를 in-progress로 설명하지 않도록 body copy를 분리했다.
- Updated `src/features/home/components/home-workspace-surface.tsx`
  - Continue section heading을 selected workflow card state에서 렌더링한다.
  - Continue card title/body/action/state pill을 view model에서 렌더링한다.
  - Primary Continue card and action에 accessibility label을 연결했다.
- Updated `src/features/home/lib/home-continue-workflow-card.test.ts`
  - Selected workflow state label, section title, recent body copy regression을 추가했다.
- Updated `plans/20260514_sub_ac_6_1_2_home_continue_workflow_card.md`
  - Follow-up run scope and result notes를 추가했다.

## 검증
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json`

## 시뮬레이터
- `xcrun simctl list devices available`
  - 실패: CoreSimulatorService connection invalid / connection refused.
  - 이 환경에서는 iPhone simulator UI QA를 수행할 수 없었다.

## 리스크 / 후속
- Web QA는 Seed 범위 밖이라 수행하지 않았다.
- Bottom navigation and global `레시피 생성` CTA files were not reworked for this Sub-AC.
- No commit, push, or merge performed per Seed constraints.
