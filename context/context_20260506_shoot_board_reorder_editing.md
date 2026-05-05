# Shoot Board Reorder And Editing Context

## 시점
- 2026-05-06 KST

## 배경
- 사용자가 Shoot Board에서 드래그앤드랍 순서 변경이 실제로 동작하지 않는다고 보고했다.
- 순서 변경 후 `Scene #N` / `장면 #N` 숫자가 같이 바뀌는 것이 필요했다.
- 기존/신규 scene card 모두 세부 텍스트를 직접 수정하고, 카드별로 원래 텍스트로 되돌리는 기능이 필요했다.
- `Example` / `Result` 버튼의 목적지와 route contract를 명확히 해야 했다.

## 변경 요약
- `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`
  - `moveShootBoardCut` helper를 추가해 한 칸 위/아래 이동 시 scene number/title을 재계산한다.
  - `updateShootBoardCutText` helper를 추가해 instruction, line to say, shooting guideline, checklist label을 수정한다.
  - `resetShootBoardCut` helper를 추가해 특정 card text만 원본 snapshot으로 되돌린다.
  - `reorderShootBoardCuts`가 order 기준으로 정렬한 뒤 이동하도록 보강했다.
- `parrotkit-app/src/features/recipes/components/shoot-board-draggable-list.tsx`
  - drag handle에서 위/아래 이동을 live reorder로 처리한다.
  - reorder mode를 켜지 않아도 handle drag가 동작한다.
  - drag 상태를 screen에 알려 ScrollView 스크롤 충돌을 줄인다.
- `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`
  - expanded card에 subtle inline text input을 추가했다.
  - `Instruction`, `Line to say`, `Shooting guideline`, checklist labels를 수정할 수 있다.
  - 각 card에 `Reset` / `원래대로` action을 추가했다.
  - 후속 UI 피드백으로 `EDIT TEXT` 라벨을 제거하고, 기본 상태는 읽기 모드로 바꿨다.
  - `Edit` 버튼을 눌렀을 때만 text input이 나타난다.
  - expanded card 내부 구분선/underline을 제거했다.
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - original cut snapshot ref를 유지해 기존/신규 scene reset을 지원한다.
  - card text edit/reset/move handlers를 board state에 연결했다.
  - drag 중 `ScrollView`를 잠시 비활성화한다.

## Route Contract
- Shoot Board route: `/recipe/[recipeId]`
- `Example`: 새 route로 이동하지 않고 같은 `RecipeDetailScreen` 내부에서 해당 scene을 열고 `analysis` tab으로 전환한다.
- `Result`: 새 route로 이동하지 않고 같은 `RecipeDetailScreen` 내부에서 해당 scene을 열고 `shoot` tab으로 전환한다.
- `Shoot`: camera/prompter route인 `/recipe/[recipeId]/prompter?sceneId=[sceneId]`로 이동한다.

## 검증
- RED 확인:
  - `cd parrotkit-app && npx tsc --noEmit`
  - missing export errors for `moveShootBoardCut`, `resetShootBoardCut`, `updateShootBoardCutText`
- GREEN 확인:
  - `cd parrotkit-app && npx tsc --noEmit`
- iPhone 17 Pro visual QA:
  - URL: `exp://localhost:8081/--/recipe/recipe-korean-diet-hook`
  - Screenshot: `output/playwright/iphone17pro_shoot_board_editing_before_drag.png`
  - Follow-up screenshot: `output/playwright/iphone17pro_shoot_board_edit_button_read_mode.png`

## 남은 리스크
- Manual PanResponder reorder는 전용 DnD 라이브러리보다 단순하다.
- 현재 drag QA는 시뮬레이터 화면에서 시각 확인 중심이며, 자동 touch gesture 검증은 simctl에서 지원되지 않았다.
- Text edits are local-only and reset on app reload.
