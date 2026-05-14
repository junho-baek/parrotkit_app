# Context 2026-05-14 Expanded Cut Card Reference Viewer

## 작업

Sub-AC 12.2 범위로 확장 컷 카드에 Reference viewer 섹션을 추가했다.

## 변경

- `src/features/recipes/lib/cut-card-reference-viewer-section.ts`
  - `getCutCardReferenceViewerSection` helper 추가
  - reference source를 `linked`, `attached`, `empty`로 분류
  - 한국어/영어 status, body, CTA 문구 제공
- `src/features/recipes/lib/cut-card-reference-viewer-section.test.ts`
  - linked reference, thumbnail-only attached reference, empty reference 계약을 smoke test로 검증
- `src/features/recipes/components/shoot-board-scene-card.tsx`
  - 확장 상태 editor 아래에 Reference viewer 섹션 추가
  - linked/attached reference는 썸네일 preview와 CTA로 기존 `onPreview` reference modal을 연다
  - empty reference는 빈 상태를 보여주되 v1 blank/shoot-board 흐름을 막지 않는다

## 검증

- Red: `npm exec --offline -- tsc --noEmit`가 `cut-card-reference-viewer-section` 모듈 없음으로 실패하는 것을 확인.
- Green: `npm exec --offline -- tsc --noEmit` 통과.

## 연결된 plan

- `plans/20260514_expanded_cut_card_reference_viewer.md`
