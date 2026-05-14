# Context 2026-05-14 Set Final Card State

## 작업

Sub-AC 12.4.3 범위로 expanded cut card의 Set as final 액션이 선택된 take를 카드 final state로 갱신하고, expanded card UI와 local/mock saved-take 상태에 반영되도록 보강했다.

## 변경

- `src/features/recipes/lib/saved-take-storage.ts`
  - `selectSavedRecipeFinalTake` helper 추가
  - 선택한 recipe/scene/take가 존재할 때 local/mock take project의 best take를 갱신
- `src/features/recipes/lib/saved-take-storage.test.ts`
  - 선택한 take만 final record가 되고 이전 final record는 saved 상태로 돌아가는 회귀 테스트 추가
- `src/features/recipes/lib/cut-card-take-viewer-section.test.ts`
  - `selectShootBoardFinalTake` 이후 expanded card viewer가 최종 테이크 status, selected item, disabled Set as final control을 표시하는 검증 추가
- `src/features/recipes/screens/recipe-detail-screen.tsx`
  - expanded card Set as final handler가 board state와 saved-take project best take state를 함께 갱신하도록 연결

## 검증

- Red: `npm exec --offline -- tsc --noEmit --pretty false --project tsconfig.saved-take-storage-check.json`
  - `selectSavedRecipeFinalTake` export 누락으로 실패 확인
- Green: `npm exec --offline -- tsc --noEmit --pretty false --project tsconfig.saved-take-storage-check.json` 통과
- Green: `npm exec --offline -- tsc --noEmit --pretty false` 통과

## 연결된 plan

- `plans/20260514_set_final_card_state.md`
