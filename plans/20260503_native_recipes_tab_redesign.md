# Native Recipes Tab Redesign

## 배경
- 사용자는 레시피 탭을 첨부 시안처럼 `레시피 메인`, `컬렉션`, `레시피 발행` 화면으로 개편하길 원한다.
- 현재 Recipes 탭은 ownership filter와 2-column card grid 중심이라, 저장된 레시피/컬렉션/발행 워크플로우가 한 화면 안에서 명확하지 않다.

## Frontend Thesis
- Visual thesis: 흰 배경과 기존 하단 내비를 유지하면서, 레시피 탭을 저장된 촬영 자산을 빠르게 이어 찍고 정리하고 공유하는 가벼운 작업 공간처럼 만든다.
- Content plan: 메인은 이어가기/컬렉션/내 레시피/발행 CTA, 컬렉션은 폴더와 최근 컬렉션/내 레시피, 발행은 커버/제목/설명/카테고리/포함 항목/공개 범위/발행 CTA를 담당한다.
- Interaction thesis: 탭 내부 상태 전환으로 하단 내비를 유지하고, collection card/전체 보기/발행 CTA가 각각 컬렉션/발행 화면으로 전환된다.

## 목표
- Recipes main UI를 시안처럼 검색, 필터, 이어가기 카드, collection cards, compact recipe rows, community publish CTA로 개편한다.
- Collection sub-screen을 추가해 폴더 카드, 최근 사용 컬렉션, 컬렉션 내 레시피 목록을 보여준다.
- Publish sub-screen을 추가해 recipe publishing form mock UI를 제공한다.
- 한국어/영어 설정을 유지한다.

## 범위
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- 문서 기록

## 변경 파일
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `plans/20260503_native_recipes_tab_redesign.md`
- `context/context_20260503_native_recipes_tab_redesign.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- Metro/simulator에서 Recipes main, collection, publish 상태 캡처 확인

## 롤백
- `RecipesScreen`을 이전 ownership filter + `ShootableRecipeCard` grid 구조로 되돌린다.

## 리스크
- Collection/Publish는 현재 mock UI이므로 실제 컬렉션 CRUD나 서버 publish contract와 연결될 때 state model을 분리해야 한다.

## 결과
- Recipes tab main을 이어가기 카드, 컬렉션 폴더, compact recipe rows, community publish CTA 중심으로 재구성했다.
- Recipes tab 안에서 `main`, `collection`, `publish` 상태를 전환하도록 구현해 하단 탭을 유지했다.
- `?view=collection`, `?view=publish`, `?view=main` query로 QA direct entry가 가능하게 했다.
- Collection 화면에 폴더 grid, 최근 사용 컬렉션, 컬렉션 내 레시피, 관리 CTA를 추가했다.
- Publish 화면에 커버/제목/설명/카테고리/포함 항목/공개 설정을 추가하고 발행 CTA를 탭 위 고정 액션으로 배치했다.
- Recipes route에서는 글로벌 Source FAB를 숨기고, main 화면에만 recipe publish 전용 FAB를 노출했다.

## 검증
- 2026-05-03 01:25 KST `cd parrotkit-app && npx tsc --noEmit` 통과
- 2026-05-03 01:25 KST `git diff --check` 통과
- Metro status: `packager-status:running`
- Simulator screenshots:
  - `output/playwright/native_recipes_tab_main_redesign.png`
  - `output/playwright/native_recipes_tab_collection_redesign.png`
  - `output/playwright/native_recipes_tab_publish_redesign.png`

## 연결 context
- `context/context_20260503_native_recipes_tab_redesign.md`
