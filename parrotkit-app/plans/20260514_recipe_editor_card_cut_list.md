# 배경

ParrotKit v1 레시피 플로우는 레시피 상세/편집 화면에서 컷 카드 기반 촬영 보드를 주 편집 표면으로 사용해야 한다. 이전 작업에서 컷 카드 모델과 필드 편집 UI는 추가되었지만, 레시피 편집 화면에는 아직 장면 중심 문구와 기본 체크리스트 편집이 남아 있다.

# 목표

- 레시피 편집 화면의 기본 편집 표면을 카드 기반 컷 리스트로 고정한다.
- 사용자-facing 문구는 레시피/컷 중심으로 정리하고 장면/보드 용어 노출을 줄인다.
- 확장 컷 카드의 기본 편집 영역은 Hook, Line to Say, Shot/Action, Note와 촬영/테이크 접근에 집중한다.
- 기존 `/recipe/[recipeId]` 및 `/recipe/[recipeId]/prompter` 경로는 유지한다.

# 범위

- `RecipeDetailScreen`의 컷 리스트 헤더/CTA 문구 정리
- `ShootBoardSceneCard`의 기본 확장 편집 UI에서 체크리스트 직접 편집 제거
- 컷 제목 및 reference/take modal 문구를 Cut 중심으로 정리
- 작업 결과 context 문서 추가

# 변경 파일

- 예정: `src/features/recipes/screens/recipe-detail-screen.tsx`
- 예정: `src/features/recipes/components/shoot-board-scene-card.tsx`
- 예정: `src/features/recipes/components/shoot-board-sticky-header.tsx`
- 예정: `src/features/recipes/components/reference-viewer-modal.tsx`
- 예정: `src/features/recipes/components/take-review-viewer-modal.tsx`
- 예정: `src/features/recipes/lib/shoot-board-model.ts`
- 예정: `context/context_20260514_recipe_editor_card_cut_list.md`

# 테스트

- `npm exec --offline -- tsc --noEmit`

# 롤백

- 위 변경 파일의 문구 및 컷 카드 확장 영역 변경을 되돌리면 기존 장면 중심 레시피 편집 UI로 복귀한다.

# 리스크

- 현재 별도 test script가 없으므로 검증은 TypeScript 컴파일 중심이다.
- 체크리스트를 기본 확장 영역에서 제거해도 완료 토글은 기존 전체 완료 동작을 유지한다.

# 결과

- 완료: 레시피 편집 화면의 기본 표면을 `ShootBoardDraggableList` 기반 컷 카드 리스트로 유지하고, 기존 `sceneId` deep link는 매칭 컷을 펼치도록 연결했다.
- 완료: 확장 컷 카드 기본 영역에서 체크리스트 직접 편집 UI를 제거하고 Hook, Line to Say, Shot/Action, Note 편집과 레퍼런스/테이크/촬영 액션에 집중하도록 정리했다.
- 완료: 사용자-facing 문구를 `Add cut`, `Cut cards`, `컷 추가`, `컷 카드`와 modal 내 `Cut #`/`컷 #` 중심으로 정리했다.
- 검증: `npm exec --offline -- tsc --noEmit` 통과.
- 연결 context: `context/context_20260514_recipe_editor_card_cut_list.md`
