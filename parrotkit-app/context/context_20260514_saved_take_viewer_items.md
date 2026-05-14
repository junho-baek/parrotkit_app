# Context 2026-05-14 Saved Take Viewer Items

## 작업

Sub-AC 12.3.3 범위로 확장 컷 카드 Take viewer 안에 저장된 테이크 항목 목록을 추가했다.

## 변경

- `src/features/recipes/lib/cut-card-take-viewer-section.ts`
  - `CutCardTakeViewerItem` 타입 추가
  - `takeItems` 반환 필드 추가
  - 각 테이크의 preview/playback label, duration/recorded metadata, saved/final/reshoot status, selected 여부를 계산
- `src/features/recipes/lib/cut-card-take-viewer-section.test.ts`
  - populated/final 상태에서 saved take item metadata와 selection 상태가 노출되는지 확인하도록 보강
- `src/features/recipes/components/shoot-board-scene-card.tsx`
  - Take viewer에 saved take row 목록 렌더링 추가
  - row press 시 해당 take를 기존 review modal로 전달
- `src/features/recipes/components/shoot-board-draggable-list.tsx`
  - `onTake`가 선택된 take를 선택적으로 전달할 수 있게 확장
- `src/features/recipes/screens/recipe-detail-screen.tsx`
  - card row에서 전달된 take id를 `selectedTakeId`로 설정해 review modal 진입 시 선택 상태 유지

## 검증

- Red: `npm exec --offline -- tsc --noEmit --pretty false`가 `takeItems` 미구현 오류로 실패하는 것을 확인했다.
- Green: `npm exec --offline -- tsc --noEmit --pretty false` 통과.

## 연결된 plan

- `plans/20260514_saved_take_viewer_items.md`
