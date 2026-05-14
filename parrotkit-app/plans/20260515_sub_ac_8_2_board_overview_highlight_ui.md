# 2026-05-15 Sub-AC 8.2 Board Overview Highlight UI

## 배경
Home Continue는 recipe shooting board overview를 열고, 다음 missing required cut을 하이라이트해야 한다. Sub-AC 8.1에서 `highlightCutId` 계산 계약은 추가되었지만 실제 board overview UI에 전달/표시하는 wiring이 남아 있다.

## 목표
- Home Continue에서 board overview route를 유지하면서 `highlightCutId`를 overview UI에 전달한다.
- Recipe board overview가 selected next missing required cut을 펼치고 시각적으로 우선 표시한다.
- Continue가 camera/prompter/checklist detail로 직접 복원되지 않도록 유지한다.

## 범위
- Home Continue route wiring.
- Recipe board overview params/state.
- Shoot board list/card highlight prop and visual treatment.
- Focused tests/typecheck/context update.

## 변경 파일
- `plans/20260515_sub_ac_8_2_board_overview_highlight_ui.md`
- `src/features/home/lib/home-continue-workflow-card.ts`
- `src/features/home/lib/home-continue-workflow-card.test.ts`
- `src/features/home/components/home-workspace-surface.tsx`
- `src/features/recipes/screens/recipe-detail-screen.tsx`
- `src/features/recipes/components/shoot-board-draggable-list.tsx`
- `src/features/recipes/components/shoot-board-scene-card.tsx`
- `context/context_20260515_sub_ac_8_2_board_overview_highlight_ui.md`

## 테스트
- RED: focused Continue href/highlight routing test가 helper 부재로 실패하는지 확인한다.
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- GREEN: relevant tsconfig typecheck.

## 롤백
- 위 파일 변경을 되돌리면 Continue는 기존 overview route만 열고 highlight UI는 사라진다.

## 리스크
- URL query는 overview metadata로만 사용한다. v1에서는 direct camera/checklist restoration이나 persistence refactor를 하지 않는다.

## 결과
- Recipe detail overview route가 `highlightCutId` query metadata를 받아 해당 cut을 자동 확장한다.
- Shoot board list/card에 highlighted state를 전달해 다음 missing required cut 하나만 시각적으로 강조한다.
- Continue route는 overview destination을 유지하고 camera/prompter entry는 사용자 cut CTA 탭에만 남겼다.
- 연결 context: `context/context_20260515_sub_ac_8_2_board_overview_highlight_ui.md`
