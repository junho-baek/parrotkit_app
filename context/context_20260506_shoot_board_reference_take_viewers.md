# Shoot Board Reference And Take Viewers Context

## 시점
- 2026-05-06 KST

## 배경
- 사용자가 Shoot Board에서 `Example`/`Result`가 레거시 설명형 scene workspace tab으로 이동하는 UX를 원하지 않았다.
- 요구 방향은 컷 보드 안에서 작은 9:16 Reference/My Take 슬롯을 제공하고, 누르면 같은 `/recipe/[recipeId]` 화면에서 fullscreen popup viewer만 띄우는 것이었다.
- `Up`/`Down` 보조 reorder 버튼은 제거하고, 드래그 핸들 기반 reorder만 남겨야 했다.
- 최신 피드백으로 expanded card의 `Scene name`/`Instruction` 중복 섹션을 제거하고 9:16 버튼을 아주 작게 줄였다.

## 변경 요약
- `parrotkit-app/package.json`, `package-lock.json`
  - `react-native-draggable-flatlist`, `react-native-gesture-handler` 추가.
- `parrotkit-app/src/app/_layout.tsx`
  - `GestureHandlerRootView`로 앱 루트를 감싸 drag gesture runtime을 준비.
- `parrotkit-app/src/features/recipes/components/shoot-board-draggable-list.tsx`
  - 기존 PanResponder/manual reorder를 제거하고 `DraggableFlatList` 기반 list로 교체.
  - Board list가 root scroll/drag owner가 되도록 screen의 outer `ScrollView` 의존을 제거.
- `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`
  - `Up`/`Down` 보조 버튼 제거.
  - `Scene name`/`Instruction` expanded detail section 제거.
  - `Line to say`, `Shooting guideline`, `Required checklist` 중심으로 축소.
  - 작은 9:16 `Reference`/`My Take` 버튼, `Takes`, `Shoot` 액션을 배치.
- `parrotkit-app/src/features/recipes/components/shoot-board-media-slot.tsx`
  - 보드용 작은 9:16 Reference/My Take 버튼 추가.
- `parrotkit-app/src/features/recipes/components/reference-viewer-modal.tsx`
  - fullscreen black reference viewer modal 추가.
- `parrotkit-app/src/features/recipes/components/take-review-viewer-modal.tsx`
  - fullscreen black take review viewer modal 추가.
- `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`
  - `replaceShootBoardCutOrder` 추가.
  - blank custom scene 생성 동작 유지.
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - Reference/Take modal state와 handlers 추가.
  - `Example`/`Result` legacy workspace tab opening을 board flow에서 제거.
  - `Shoot`/`Retake`는 기존 prompter route로 연결.

## Route Contract
- Shoot Board: `/recipe/[recipeId]`
- Reference Viewer: 같은 `/recipe/[recipeId]` 안의 modal state
- Take Review Viewer: 같은 `/recipe/[recipeId]` 안의 modal state
- Camera/Prompter: `/recipe/[recipeId]/prompter?sceneId=[sceneId]`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `git diff --check`
- Legacy scan:
  - `rg -n "onMoveUp|onMoveDown|Move up|Move down|Up</Text>|Down</Text>|openCutWorkspace\\(cut, 'analysis'\\)|openCutWorkspace\\(cut, 'shoot'\\)|onMoveCut|onResult|Example|Result" parrotkit-app/src/features/recipes/components/shoot-board-* parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- iPhone 17 Pro Computer Use:
  - 중복 `Scene name`/`Instruction` 제거 확인.
  - 작은 9:16 Reference/My Take 버튼 확인.
  - Reference popup viewer 확인.
  - 좌표 기반 drag는 Computer Use에서 scroll로 잡혀 자동 검증이 완전하지 않았음.

## 남은 리스크
- 실제 손가락 롱프레스/드래그 조작감은 `react-native-draggable-flatlist` 경로로 교체했지만, Computer Use 좌표 드래그로는 완전 검증하지 못했다.
- 보드의 작은 9:16 버튼은 현재 이미지 썸네일보다 compact icon button 성격으로 둔다. 큰 reference/take visual은 modal에서 확인한다.
- Text edits are local-only and reset on app reload.
