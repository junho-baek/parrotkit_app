# Context 2026-05-15 Sub-AC 1.1 Ordered Required Cuts

## 작업
Board overview가 다음 required cut 안내를 계산할 수 있도록, 기존 board order와 recipe scene optional metadata에서 ordered required cuts를 해석하는 helper를 추가했다.

## 변경
- Updated `src/features/recipes/types/recipe-domain.ts`
  - `NativeRecipeScene.isOptional`을 추가했다.
- Updated `src/features/recipes/lib/recipe-domain-normalizer.ts`
  - Mock recipe scene의 `isOptional` metadata를 native recipe scene으로 보존한다.
- Updated `src/features/recipes/lib/shoot-board-model.ts`
  - `getOrderedRequiredShootBoardCuts`를 추가했다.
  - Board cut `order`를 기준으로 정렬하고, `sceneId`가 optional scene에 매핑되는 cut은 제외한다.
- Updated `src/features/recipes/lib/shoot-board-model.test.ts`
  - Optional scene cut을 제외하고 현재 board order의 required cuts만 반환하는 계약을 추가했다.
- Updated `plans/20260515_sub_ac_1_1_ordered_required_cuts.md`
  - 결과와 연결 context를 기록했다.

## 검증
- RED: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - Expected failure: `getOrderedRequiredShootBoardCuts` export 없음.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- GREEN: direct Sucrase runtime check with in-process `@/` alias resolver for the new ordered required cuts case.

## 참고 / 리스크
- Plain `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts`는 현재 환경에서 `@/...` alias를 해석하지 못해 실행 전 막힌다.
- Alias resolver를 붙여 전체 legacy test file을 실행하면 기존 assertion `Scene titles should use the required Scene #N: Role format.`이 먼저 실패한다. 현재 런타임은 `Cut #1: Hook`을 반환한다. 이 작업의 변경과 별개의 기존 test/runtime mismatch로 보고 direct focused runtime check와 TypeScript로 검증했다.
- UI highlight 표시, camera route 유지 검증, bottom/FAB layout QA는 후속 Sub-AC 범위다.
