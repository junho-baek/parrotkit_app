# Context 2026-05-15 Sub-AC 3.2 Explicit Complete Continue Exclusion

## 작업
Home Continue가 explicit publish/complete action으로 완료 표시된 recipe shooting board를 Continue 후보에서 제외하도록 구현했다.

## 변경
- Updated `src/core/mocks/parrotkit-data.ts`
  - v1 mock model에 `MockRecipe.explicitCompletion?: boolean`을 추가했다.
- Updated `src/features/home/lib/home-workflow-resolution.ts`
  - `isUnfinishedWorkflowRecipe`가 `explicitCompletion` board를 saved My Take 상태와 무관하게 unfinished 후보에서 제외하도록 했다.
- Updated `src/features/home/lib/home-workflow-resolution.test.ts`
  - Explicitly completed `continue` board가 required My Take missing 상태여도 skip되는지 검증했다.
  - Explicitly completed board만 있을 때 Home Continue selection이 `reason: "none"` 및 `recipe: null`을 반환하는지 검증했다.
- Updated `plans/20260515_sub_ac_3_2_explicit_complete_continue_exclusion.md`
  - 결과와 연결 context를 기록했다.

## 검증
- RED: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
  - Expected failure: `Home Continue must skip an explicitly completed board even when required My Takes are missing.`
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 리스크 / 후속
- Explicit completion is intentionally a simple mock boolean for v1 and does not introduce a persistence refactor.
- No navigation, bottom tab, CTA label, camera restore, or board overview entry behavior changed.
- No commit or push performed per Seed constraints.
