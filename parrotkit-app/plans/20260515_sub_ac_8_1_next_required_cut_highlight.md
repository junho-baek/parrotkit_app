# Sub-AC 8.1 Next Required Cut Highlight

## 배경
Home Continue는 recipe shooting board를 continuation unit으로 열고, required cut My Take 저장 여부를 완료 신호로 사용해야 한다. Resumed board overview에서는 아직 saved My Take가 없는 다음 required cut을 하이라이트해야 한다.

## 목표
- Saved My Take가 없는 첫 required cut id를 결정하는 pure helper를 추가한다.
- Home Continue entry가 overview destination은 유지하면서 highlight 대상 cut id를 함께 제공하도록 계약을 명시한다.
- Optional cut missing은 next required cut으로 취급하지 않는다.

## 범위
- Home workflow resolution helper/test.
- Home Continue entry helper/test.
- Context 기록.

## 변경 파일
- `plans/20260515_sub_ac_8_1_next_required_cut_highlight.md`
- `src/features/home/lib/home-workflow-resolution.ts`
- `src/features/home/lib/home-workflow-resolution.test.ts`
- `src/features/home/lib/home-continue-workflow-card.ts`
- `src/features/home/lib/home-continue-workflow-card.test.ts`
- `context/context_20260515_sub_ac_8_1_next_required_cut_highlight.md`

## 테스트
- RED: focused test가 helper/export/entry field 부재로 실패하는지 확인한다.
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- GREEN: 관련 tsconfig typecheck.

## 롤백
- 위 helper/test/context/plan 변경을 되돌린다.

## 리스크
- 이 Sub-AC는 route deep-link나 persistence refactor를 하지 않는다. 실제 scroll/visual highlight wiring이 별도 AC에 있다면 이 entry 계약을 사용해 이어서 연결해야 한다.

## 결과
- `getNextRequiredCutWithoutSavedMyTakeId`를 추가해 required cut 순서에서 saved My Take가 없는 첫 cut id를 반환하도록 했다.
- `isRecipeBoardUnfinishedByRequiredMyTakes`가 같은 required/saved cut helper를 공유하도록 정리해 completion rule과 highlight target rule이 같은 기준을 쓰게 했다.
- `getHomeContinueWorkflowEntry`가 overview route destination은 유지하면서 `highlightCutId`를 반환하도록 했다.
- 연결 context: `context/context_20260515_sub_ac_8_1_next_required_cut_highlight.md`
