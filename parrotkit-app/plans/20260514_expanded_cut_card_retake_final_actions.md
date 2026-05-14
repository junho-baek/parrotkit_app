# 배경

Sub-AC 12.4.1은 확장 컷 카드의 기존 action area에 Retake와 Set as final 컨트롤을 노출해야 한다. 현재 expanded card는 Take viewer와 하단 Takes/Shoot 버튼만 있어 저장된 테이크가 있는 컷에서 재촬영과 최종 테이크 지정 액션이 카드 내부에서 바로 드러나지 않는다.

# 목표

- 저장된 테이크가 있는 expanded cut card에 Retake와 Set as final action controls를 렌더링한다.
- 기존 expanded card action area를 재사용한다.
- 저장된 take가 없거나 loading 중인 상태에서는 final 지정 액션이 비활성/숨김 상태가 되도록 한다.
- 기존 Take viewer modal, Shoot/Prompter 진입, local/mock board state 흐름을 유지한다.

# 범위

- Take viewer/action helper에 expanded action metadata 추가
- helper smoke test 추가 또는 기존 test 확장
- `ShootBoardSceneCard` expanded action row 렌더링 수정
- 필요한 callback을 `ShootBoardDraggableList`와 `RecipeDetailScreen`으로 연결
- 작업 결과 context 문서 추가

# 변경 파일

- 예정: `src/features/recipes/lib/cut-card-take-viewer-section.ts`
- 예정: `src/features/recipes/lib/cut-card-take-viewer-section.test.ts`
- 예정: `src/features/recipes/components/shoot-board-scene-card.tsx`
- 예정: `src/features/recipes/components/shoot-board-draggable-list.tsx`
- 예정: `src/features/recipes/screens/recipe-detail-screen.tsx`
- 예정: `context/context_20260514_expanded_cut_card_retake_final_actions.md`

# 테스트

- Red: expanded action metadata가 구현 전 실패하는지 확인
- Green: targeted TypeScript check로 관련 helper/component 타입 검증
- 가능하면 전체 `npm exec --offline -- tsc --noEmit` 확인

# 롤백

- action metadata, card action row 변경, callback 연결을 제거하면 기존 Takes/Shoot expanded action area로 복귀한다.

# 리스크

- 공유 worktree에 sibling AC 변경이 많으므로 이 subtask 단독 commit/push는 수행하지 않는다.
- `recipe-prompter-camera-screen.tsx`는 이번 범위에서 수정하지 않아 기존 prompter overlap 리스크를 피한다.

# 결과

- `getCutCardTakeViewerSection`이 populated/final 상태에서 expanded action metadata를 제공하도록 확장했다.
- `ShootBoardSceneCard`의 기존 expanded action area에 저장된 take가 있는 경우 Retake와 Set as final 버튼을 렌더링했다.
- Retake는 기존 촬영/prompter 진입 callback을 사용하고, Set as final은 현재 active take를 `selectShootBoardFinalTake` 경로로 연결했다.
- empty/loading 상태에서는 saved-take 전용 action controls가 보이지 않으며, 이미 final인 take의 Set as final은 비활성화된다.
- 연결 context: `context/context_20260514_expanded_cut_card_retake_final_actions.md`
