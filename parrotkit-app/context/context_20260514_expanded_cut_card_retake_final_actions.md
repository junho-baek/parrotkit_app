# Context 2026-05-14 Expanded Cut Card Retake Final Actions

## 작업

Sub-AC 12.4.1 범위로 expanded cut card의 기존 action area에 Retake와 Set as final 컨트롤을 추가했다.

## 변경

- `src/features/recipes/lib/cut-card-take-viewer-section.ts`
  - `actionControls.retake`와 `actionControls.setFinal` metadata 추가
  - saved/populated take 상태에서 Retake와 Set as final label/visible/disabled 상태 제공
  - final take 상태에서는 Set as final disabled 처리
- `src/features/recipes/lib/cut-card-take-viewer-section.test.ts`
  - populated/final 상태 action metadata 검증 추가
- `src/features/recipes/components/shoot-board-scene-card.tsx`
  - expanded action area에 Retake와 Set as final 버튼 렌더링
  - Retake는 기존 `onShoot`, Set as final은 active take 기반 `onSetFinalTake` callback 사용
- `src/features/recipes/components/shoot-board-draggable-list.tsx`
  - card-level `onSetFinalTake` callback 전달
- `src/features/recipes/screens/recipe-detail-screen.tsx`
  - expanded card Set as final 액션을 기존 `selectShootBoardFinalTake` 업데이트 경로에 연결

## 검증

- Red: `npm exec --offline -- tsc --noEmit --pretty false`가 `actionControls` 누락으로 실패하는 것을 확인했다.
- Green: `npm exec --offline -- tsc --noEmit --pretty false` 통과.

## 연결된 plan

- `plans/20260514_expanded_cut_card_retake_final_actions.md`
