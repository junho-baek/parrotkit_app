# Context 2026-05-14 Expanded Cut Card Take Viewer

## 작업

Sub-AC 12.3.2 범위로 확장 컷 카드에 Take viewer 섹션을 추가했다.

## 변경

- `src/features/recipes/lib/cut-card-take-viewer-section.ts`
  - `getCutCardTakeViewerSection` helper 추가
  - empty, loading, populated 상태와 final take 상태 copy 분리
  - 대표 take, take count, thumbnail, primary CTA label을 card layout용 데이터로 제공
- `src/features/recipes/lib/cut-card-take-viewer-section.test.ts`
  - empty/loading/populated/final 상태 smoke test 추가
- `src/features/recipes/components/shoot-board-scene-card.tsx`
  - 확장 상태 editor/reference viewer 아래에 Take viewer 섹션 추가
  - empty 상태는 촬영 CTA, populated/final 상태는 기존 take review modal 진입 CTA로 연결
  - loading preview/button disabled style 추가
  - `takeViewerLoading` optional prop으로 loading 상태 렌더링 경로를 열어두고 기존 caller 기본 동작은 유지

## 검증

- `npm exec --offline -- tsc --noEmit` 통과.

## 연결된 plan

- `plans/20260514_expanded_cut_card_take_viewer.md`
