# Context 2026-05-14 Recipe Editor Card Cut List

## 작업

Sub-AC 9.2.2 범위로 레시피 편집 화면이 카드 기반 컷 리스트를 v1 기본 편집 표면으로 사용하도록 정리했다.

## 변경

- `src/features/recipes/screens/recipe-detail-screen.tsx`
  - `sceneId`가 있는 기존 recipe route 진입 시 예전 장면 workspace로 빠지지 않고 매칭 컷 카드를 펼치도록 변경
  - 리스트 헤더와 floating CTA 문구를 `Cut cards` / `Add cut`, 한국어 `컷 카드` / `컷 추가`로 정리
  - 기본 컷 카드 리스트에서 체크리스트 항목별 토글 핸들러 연결 제거
- `src/features/recipes/components/shoot-board-scene-card.tsx`
  - 확장 컷 카드의 기본 편집 UI에서 체크리스트 직접 편집 영역 제거
  - Hook, Line to Say, Shot/Action, Note 필드와 Reference/My Take/촬영 액션 중심으로 유지
- `src/features/recipes/components/shoot-board-draggable-list.tsx`
  - 체크리스트 항목별 토글 prop 제거
- `src/features/recipes/components/shoot-board-sticky-header.tsx`
  - 컷 리스트 제목을 주입 가능하게 변경하고 기본 문구를 Cut cards/컷 카드로 변경
- `src/features/recipes/lib/shoot-board-model.ts`
  - 생성/리셋되는 컷 카드 제목을 `Scene #`/`장면 #`에서 `Cut #`/`컷 #`로 변경
- `src/features/recipes/components/reference-viewer-modal.tsx`
  - reference modal 제목/CTA를 Cut 중심 문구로 변경
- `src/features/recipes/components/take-review-viewer-modal.tsx`
  - take review modal 제목을 Cut 중심 문구로 변경

## 검증

- `npm exec --offline -- tsc --noEmit` 통과.
- 로컬 Expo runtime QA는 수행하지 않았다.

## 연결된 plan

- `plans/20260514_recipe_editor_card_cut_list.md`
