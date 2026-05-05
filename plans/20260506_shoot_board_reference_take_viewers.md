# Shoot Board Reference And Take Viewers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Shoot Board interaction around real drag-and-drop, compact 9:16 Reference/Take slots, and fullscreen popup viewers instead of legacy explanatory scene tabs.

**Architecture:** Keep `/recipe/[recipeId]` as the shooting board route, but remove the old scene workspace tab transition for `Example`/`Result`. Convert each expanded scene card into a practical filming routine card with text details plus two small vertical media slots: `Reference` and `My Take`. Use a proper draggable list implementation for tactile reordering and fullscreen modal viewers for reference video and saved takes.

**Tech Stack:** Expo Router, React Native, NativeWind, Expo Video or existing media placeholders, `Modal`, TypeScript, and a dedicated drag list implementation (`react-native-draggable-flatlist` preferred if compatible with Expo SDK 54; otherwise a focused Reanimated/PanResponder fallback).

---

## 배경
- 현재 Shoot Board는 컷 보드 방향은 맞지만, `Example`/`Result` 버튼이 기존 설명형 scene workspace tab으로 이동해 촬영 보드 흐름이 끊긴다.
- 사용자는 `Example`/`Result`를 설명 페이지가 아니라 작은 9:16 영상 슬롯으로 보고, 탭하면 영상만 집중해서 보는 팝업을 원한다.
- `Up/Down` 보조 버튼은 UI가 촌스럽고 운동 앱 같은 “드래그로 순서 바꾸기” 느낌을 해친다.
- 현재 수동 PanResponder drag는 ScrollView와 충돌해 조작감이 좋지 않다.
- Add scene은 앱이 임의 내용을 채우지 않고, 사용자가 제목/세부 내용을 직접 입력하는 빈 장면이어야 한다.

## 목표
- `Up`/`Down` 보조 버튼을 완전히 제거한다.
- `CUTS BOARD` reorder는 드래그 핸들로만 수행한다.
- 드래그 중 카드가 손가락을 따라 움직이고, 놓으면 순서가 확정되며 `Scene #N` 숫자가 즉시 재계산된다.
- 저장된 take 상태, final take 상태, checklist 상태는 reorder 후에도 scene identity에 붙어 유지된다.
- expanded card 하단에 `Reference / Take` 9:16 슬롯을 넣는다.
- `Reference` 슬롯을 누르면 설명형 tab이 아니라 fullscreen `Reference Viewer` modal이 열린다.
- `My Take` 슬롯 또는 `Takes` action을 누르면 fullscreen `Take Review Viewer` modal이 열린다.
- legacy `analysis/recipe/shoot` scene workspace tab은 Shoot Board의 `Example`/`Result` 흐름에서 제거한다.
- Add scene은 제목, instruction, line to say, shooting guideline, checklist가 빈 상태로 추가되고 바로 edit mode로 열린다.

## 범위
- In scope:
  - `/recipe/[recipeId]` Shoot Board overview.
  - Real drag reorder UX.
  - Compact scene card media slots.
  - Fullscreen Reference Viewer modal.
  - Fullscreen Take Review Viewer modal.
  - Local-only editable scene text and blank custom scenes.
  - Context/plan update and iPhone 17 Pro QA.
- Out of scope:
  - Server persistence for reorder/text/takes.
  - Real uploaded video playback pipeline beyond existing mock/local take data.
  - Explore marketplace detail screen.
  - Recipe creation flow redesign.

## 변경 파일
- Modify: `parrotkit-app/package.json`
  - Add drag dependency only if compatibility check passes: `react-native-draggable-flatlist`.
- Modify: `parrotkit-app/package-lock.json`
  - Lock dependency if added.
- Modify: `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`
  - Keep `move/reorder/update/reset` helpers.
  - Ensure `createAddedShootBoardCut` returns blank editable custom scenes.
  - Add lightweight selectors for reference media and take summary if useful.
- Modify: `parrotkit-app/src/features/recipes/lib/shoot-board-model.test.ts`
  - Assert blank custom scene behavior.
  - Assert reorder keeps scene identity/takes/checklist state.
- Replace or heavily modify: `parrotkit-app/src/features/recipes/components/shoot-board-draggable-list.tsx`
  - Replace manual PanResponder list with `DraggableFlatList` or a focused custom reorder list if dependency is rejected.
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`
  - Remove Up/Down controls.
  - Render compact 9:16 `Reference` and `My Take` slots.
  - Keep text details readable; only show inputs after `Edit`.
- Create: `parrotkit-app/src/features/recipes/components/shoot-board-media-slot.tsx`
  - Shared 9:16 thumbnail slot component for `Reference` / `My Take`.
- Create: `parrotkit-app/src/features/recipes/components/reference-viewer-modal.tsx`
  - Fullscreen black modal with vertical media, scene title, carousel, close, bookmark, `Use as guide`, `Shoot this scene`.
- Create: `parrotkit-app/src/features/recipes/components/take-review-viewer-modal.tsx`
  - Fullscreen black modal with selected take, take carousel, retake slot, delete, retake, final select.
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - Remove `Example`/`Result` tab-opening behavior from the board.
  - Wire `Reference` slot to reference viewer modal.
  - Wire `My Take`/`Takes` to take review modal.
  - Wire `Shoot` to existing `/recipe/[recipeId]/prompter?sceneId=[sceneId]`.
  - Keep or delete old scene workspace code only if no other route depends on it; otherwise make it unreachable from Shoot Board.
- Add: `context/context_20260506_shoot_board_reference_take_viewers.md`
  - Record implementation and route/modal behavior.

## Task 1: Freeze Current Direction And Clean Reorder UI

**Files:**
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-draggable-list.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`

- [x] **Step 1: Remove Up/Down UI**
  - Delete `onMoveUp`, `onMoveDown` props from `ShootBoardSceneCard`.
  - Delete the `Up`/`Down` button block.
  - Keep the drag handle visible.

- [x] **Step 2: Remove button-based reorder wiring**
  - Delete `onMoveCut` button-only usage from the card props.
  - Keep model reorder helper for actual drag callbacks.

- [x] **Step 3: Verify no reorder buttons remain**
  - Run:
    ```bash
    rg -n "Move up|Move down|onMoveUp|onMoveDown|Up</Text>|Down</Text>" parrotkit-app/src/features/recipes
    ```
  - Expected: no output.

## Task 2: Implement Real Drag Reorder

**Files:**
- Modify: `parrotkit-app/package.json`
- Modify: `parrotkit-app/package-lock.json`
- Replace: `parrotkit-app/src/features/recipes/components/shoot-board-draggable-list.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- Test: `parrotkit-app/src/features/recipes/lib/shoot-board-model.test.ts`

- [x] **Step 1: Confirm dependency option**
  - Preferred: install `react-native-draggable-flatlist` if it runs with Expo SDK 54 and existing Reanimated.
  - Run:
    ```bash
    cd parrotkit-app && npm install react-native-draggable-flatlist
    ```
  - If installation introduces incompatible peer dependency errors, revert package changes and implement the fallback described below.

- [x] **Step 2: Keep model reorder test**
  - Ensure `reorderShootBoardCuts(board, fourthCutId, 1)` still asserts:
    - moved scene identity changes position
    - title becomes `Scene #1: CTA`
    - saved takes stay attached by reference.

- [x] **Step 3: Render board with `DraggableFlatList`**
  - `data`: board cuts sorted by order.
  - `keyExtractor`: `cut.id`.
  - `renderItem`: pass `drag` to handle `onLongPress`/`onPressIn`.
  - `onDragEnd`: map reordered data through `renumber`/`reorder` helper and update board state.
  - Disable nested ScrollView conflict by making the board list itself the scroll owner, or keep the outer scroll only for note/header and render list with drag-compatible container.

- [x] **Step 4: Fallback if dependency is rejected**
  - Use a custom `Animated.View` overlay and absolute row measurements instead of row-local `PanResponder`.
  - Root cause to avoid: outer `ScrollView` stealing vertical gestures.
  - In fallback, reorder mode should lock scroll for the whole board while drag is active.

- [x] **Step 5: iPhone 17 Pro QA with Computer Use**
  - Open:
    ```bash
    xcrun simctl openurl 736C8797-5E0C-420B-AB37-57DA32D71E6A 'exp://localhost:8081/--/recipe/recipe-korean-diet-hook'
    ```
  - Use Computer Use to drag `Scene #2` below `Scene #3`.
  - Expected:
    - order changes visually
    - scene numbers recalculate
    - no Up/Down buttons exist
    - no accidental page scroll during drag.

## Task 3: Blank Add Scene

**Files:**
- Modify: `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/shoot-board-model.test.ts`
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`

- [x] **Step 1: Test blank custom scene**
  - Assert `createAddedShootBoardCut(board)` returns:
    - `title === "Scene #5"`
    - `roleLabel === ""`
    - `instruction === ""`
    - `speakingLine === ""`
    - `shootingGuideline === ""`
    - every checklist label is empty.

- [x] **Step 2: Implement blank custom scene**
  - `createAddedShootBoardCut` should not accept an instruction string.
  - It should only set structural fields: id/order/duration/sceneId/referenceVideoUrl/timeRange.
  - User-facing text fields start empty.

- [x] **Step 3: Open new scene in edit mode**
  - `ShootBoardSceneCard` should initialize `editing=true` only when custom scene content is blank.
  - Existing scenes remain read mode until `Edit` is tapped.

## Task 4: Replace Example/Result Buttons With 9:16 Slots

**Files:**
- Create: `parrotkit-app/src/features/recipes/components/shoot-board-media-slot.tsx`
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`

- [x] **Step 1: Create media slot component**
  - Props:
    - `label: 'Reference' | 'My Take'`
    - `thumbnailUrl?: string`
    - `caption?: string`
    - `status?: 'empty' | 'saved' | 'final' | 'needs_reshoot'`
    - `onPress: () => void`
  - Style:
    - 9:16 aspect ratio
    - small play/plus overlay
    - border status only
    - no explanatory paragraph.

- [x] **Step 2: Update scene card bottom**
  - Replace `Example` and `Result` large buttons with:
    - `Reference` slot
    - `My Take` slot
  - Keep primary `Shoot` action as a compact button below or beside slots, matching the instruction image.
  - Add optional `Takes (0)` small action if needed, but do not route to legacy tabs.

## Task 5: Reference Viewer Modal

**Files:**
- Create: `parrotkit-app/src/features/recipes/components/reference-viewer-modal.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`

- [x] **Step 1: Add modal state**
  - Add `referenceViewerCutId: string | null`.
  - Opening a `Reference` slot sets this id.
  - Closing clears it.

- [x] **Step 2: Build fullscreen viewer**
  - Use `Modal` with black background.
  - Header:
    - close/back
    - `Scene #N: Role`
    - pill `Reference`
    - bookmark/more icon.
  - Main:
    - 9:16 video/image area
    - text overlay if present.
  - Bottom:
    - horizontal 9:16 carousel of references
    - `Use as guide`
    - `Shoot this scene`.

- [x] **Step 3: Wire actions**
  - `Shoot this scene` calls existing prompter route:
    - `/recipe/[recipeId]/prompter?sceneId=[sceneId]`
  - `Use as guide` closes modal or marks reference selected locally.

## Task 6: Take Review Viewer Modal

**Files:**
- Create: `parrotkit-app/src/features/recipes/components/take-review-viewer-modal.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- Modify if needed: `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`

- [x] **Step 1: Add modal state**
  - Add `takeViewerCutId: string | null`.
  - Opening `My Take` slot sets this id.
  - Closing clears it.

- [x] **Step 2: Build fullscreen take viewer**
  - Use `Modal` with black background.
  - Header:
    - close/back
    - `Scene #N: Role`
    - pill like `Take 2 · Final selected` when applicable.
  - Main:
    - 9:16 take preview.
  - Bottom:
    - saved take carousel
    - dashed `Retake` slot
    - `삭제`
    - `재촬영`
    - `Final로 선택`.

- [x] **Step 3: Wire board state**
  - `Final로 선택` updates final take state.
  - `재촬영` routes to prompter camera for the scene.
  - Empty take slot opens camera.

## Task 7: Remove Legacy Scene Workspace From Board Flow

**Files:**
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`

- [x] **Step 1: Remove board `Example`/`Result` tab handlers**
  - Delete calls:
    - `openCutWorkspace(cut, 'analysis')`
    - `openCutWorkspace(cut, 'shoot')`
  - Replace with:
    - `openReferenceViewer(cut)`
    - `openTakeViewer(cut)`

- [x] **Step 2: Decide fate of legacy selected scene UI**
  - If no route depends on `sceneId` params for this screen, remove `selectedScene` branch and related panels.
  - If compatibility is needed, leave the branch only for direct deep links, but never trigger it from board slots.

- [x] **Step 3: Route contract after implementation**
  - Shoot Board: `/recipe/[recipeId]`
  - Reference Viewer: modal state inside `/recipe/[recipeId]`, no new route.
  - Take Review Viewer: modal state inside `/recipe/[recipeId]`, no new route.
  - Camera: `/recipe/[recipeId]/prompter?sceneId=[sceneId]`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- `rg -n "onMoveUp|onMoveDown|Up</Text>|Down</Text>|openCutWorkspace\\(cut, 'analysis'\\)|openCutWorkspace\\(cut, 'shoot'\\)" parrotkit-app/src/features/recipes`
- iPhone 17 Pro Computer Use QA:
  - drag reorder changes order and scene numbers.
  - Add scene opens blank editable scene.
  - Reference slot opens fullscreen reference modal.
  - My Take slot opens fullscreen take review modal.
  - Shoot opens `/recipe/[recipeId]/prompter?sceneId=[sceneId]`.
- Screenshots:
  - `output/playwright/iphone17pro_shoot_board_reference_slots.png`
  - `output/playwright/iphone17pro_reference_viewer_modal.png`
  - `output/playwright/iphone17pro_take_review_viewer_modal.png`

## 롤백
- If draggable dependency fails or worsens runtime behavior:
  - revert package changes
  - keep the media slot/modal work
  - implement fallback custom reorder in `shoot-board-draggable-list.tsx`.
- If modal viewers regress camera flow:
  - keep board UI slots
  - temporarily wire `Shoot` directly to prompter and disable viewer buttons.
- Full rollback target:
  - commit `a2c35d0` before the unfinished reorder/edit follow-up.

## 리스크
- New drag dependency may require gesture-handler setup. Verify early before deeper UI work.
- Modal video rendering may need real media URLs later; initial implementation can use thumbnail/image placeholders while preserving viewer layout.
- Removing legacy scene workspace may affect deep links using `sceneId` params; check existing links before deleting code.
- Current working tree already contains uncommitted experimental changes from the prior reorder/edit attempt. Start implementation by either cleaning those changes into the new direction or resetting the rejected Up/Down parts intentionally.

## 결과
- `react-native-draggable-flatlist`와 `react-native-gesture-handler`를 추가하고, 앱 루트에 `GestureHandlerRootView`를 적용했다.
- Shoot Board list를 `DraggableFlatList` 기반으로 교체해 board 자체가 root scroll/drag owner가 되도록 정리했다.
- `Up`/`Down` 보조 버튼과 button-based reorder wiring을 제거했다.
- `replaceShootBoardCutOrder` helper를 추가해 drag 결과 배열 기준으로 scene number/title을 재계산하고 checklist/take 상태는 scene id에 붙어 유지되도록 했다.
- `Example`/`Result` 흐름은 레거시 scene workspace tab 이동에서 제거하고, 같은 `/recipe/[recipeId]` 화면 안의 fullscreen modal로 바꿨다.
- expanded card에서 `Scene name`/`Instruction` 중복 섹션을 제거하고 `Line to say`, `Shooting guideline`, `Required checklist`, 작은 9:16 `Reference`/`My Take`, `Takes`, `Shoot` 중심으로 줄였다.
- `ReferenceViewerModal`과 `TakeReviewViewerModal`을 추가했다. Reference/Take는 route 이동 없이 modal로 열리고, `Shoot`/`Retake`만 `/recipe/[recipeId]/prompter?sceneId=[sceneId]`로 이동한다.
- Add scene은 앱이 임의 문구를 채우지 않고 빈 custom scene으로 추가된다.
- 연결 context: `context/context_20260506_shoot_board_reference_take_viewers.md`

## 검증 결과
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `git diff --check`
- `rg -n "onMoveUp|onMoveDown|Move up|Move down|Up</Text>|Down</Text>|openCutWorkspace\\(cut, 'analysis'\\)|openCutWorkspace\\(cut, 'shoot'\\)|onMoveCut|onResult|Example|Result" parrotkit-app/src/features/recipes/components/shoot-board-* parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- iPhone 17 Pro Computer Use QA:
  - 중복 `Scene name`/`Instruction` 제거 확인.
  - 작은 9:16 Reference/My Take 버튼 확인.
  - Reference modal popup 확인.
  - Computer Use coordinate drag는 시뮬레이터에서 scroll로 인식되어 완전 자동 검증은 불완전했지만, 코드 경로는 `DraggableFlatList` + gesture-handler drag handle로 교체했다.

## Self-Review
- Spec coverage:
  - Up/Down removed: Task 1.
  - Real drag feel: Task 2.
  - Blank Add Scene: Task 3.
  - 9:16 thumbnail slots: Task 4.
  - Reference popup: Task 5.
  - Take review popup: Task 6.
  - No legacy tab transition for Example/Result: Task 7.
- Placeholder scan:
  - No `TBD`, `TODO`, or unspecified implementation step remains.
- Type consistency:
  - Modal state names, component names, and route contract are consistent across tasks.
