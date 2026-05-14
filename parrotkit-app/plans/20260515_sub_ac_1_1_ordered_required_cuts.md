# 2026-05-15 Sub-AC 1.1 Ordered Required Cuts

## 배경
Home Continue로 열린 board overview는 다음 saved My Take가 없는 required cut을 안내해야 한다. 이를 위해 overview가 board cut order와 recipe scene metadata를 기준으로 required cuts를 안정적으로 해석할 수 있어야 한다.

## 목표
- Board overview에서 사용할 ordered required cuts helper를 추가한다.
- Optional scene metadata를 normalization 이후에도 유지한다.
- Helper가 board의 현재 cut order를 존중하고 optional scene cut을 제외하도록 검증한다.

## 범위
- Recipe domain scene type/normalizer.
- Shoot board model helper/test.
- Context 기록.

## 변경 파일
- `plans/20260515_sub_ac_1_1_ordered_required_cuts.md`
- `src/features/recipes/types/recipe-domain.ts`
- `src/features/recipes/lib/recipe-domain-normalizer.ts`
- `src/features/recipes/lib/shoot-board-model.ts`
- `src/features/recipes/lib/shoot-board-model.test.ts`
- `context/context_20260515_sub_ac_1_1_ordered_required_cuts.md`

## 테스트
- RED: focused shoot-board model test가 helper export 부재로 실패하는지 확인한다.
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts`
- GREEN: relevant TypeScript check.

## 롤백
- 위 파일 변경을 되돌리면 board overview는 required cut ordering helper 없이 기존 동작으로 돌아간다.

## 리스크
- 이 Sub-AC는 UI highlight 표시나 camera routing을 변경하지 않는다. Visual wiring은 별도 AC에서 helper를 소비해야 한다.

## 결과
- `NativeRecipeScene.isOptional`을 보존해 board overview가 기존 recipe/video scene metadata를 읽을 수 있게 했다.
- `getOrderedRequiredShootBoardCuts`를 추가해 board의 현재 cut order를 기준으로 optional scene cut을 제외한 required cuts를 반환하도록 했다.
- 연결 context: `context/context_20260515_sub_ac_1_1_ordered_required_cuts.md`
