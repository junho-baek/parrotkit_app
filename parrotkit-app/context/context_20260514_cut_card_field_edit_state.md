# Context 2026-05-14 Cut Card Field Edit State

## 작업

Sub-AC 9.2.3 범위로 컷 카드의 `Hook`, `Line to Say`, `Shot/Action`, `Note` 필드 편집이 레시피 편집 세션 상태에 지속되도록 연결했다.

## 변경

- `src/features/recipes/lib/recipe-editor-state.ts`
  - 레시피별 `ShootBoardRecipe`를 저장하는 local/mock editor board state helper 추가
  - `createRecipeEditorBoardState`, `getRecipeEditorBoard`, `setRecipeEditorBoard`, `updateRecipeEditorBoard` 제공
- `src/features/recipes/lib/recipe-editor-state.test.ts`
  - 컷 카드 필드 patch가 editor board state에 저장되고 다시 조회되는 smoke test 추가
- `src/core/providers/mock-workspace-provider.tsx`
  - `WorkspaceState`에 `recipeEditorBoards` 추가
  - provider context에 recipe editor board getter/setter/updater 노출
- `src/features/recipes/screens/recipe-detail-screen.tsx`
  - 레시피 상세 진입 시 기존 editor board state가 있으면 재사용
  - 컷 카드 필드 편집, 리셋, 추가, 재정렬 등 `updateBoard` 경로가 provider editor board state에도 write-through 되도록 연결
  - 최신 board ref를 기준으로 업데이트해 연속 입력 중 이전 render snapshot으로 되돌아가지 않게 처리

## 검증

- `npm exec --offline -- tsc --noEmit` 통과.
- 로컬 Expo runtime QA는 수행하지 않았다.

## 연결된 plan

- `plans/20260514_cut_card_field_edit_state.md`
