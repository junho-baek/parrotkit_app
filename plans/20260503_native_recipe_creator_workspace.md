# Native Recipe Creator Workspace

## 배경
- 사용자는 레시피 생성 화면을 단순 발행 폼이 아니라 `빠른 생성`, `커뮤니티 발행`, `브랜드 캠페인` 목적별 워크스페이스처럼 구성하길 원한다.
- 첨부 시안은 흰 배경과 기존 하단 내비를 유지하면서 단계, 컷 구성, 예시/레퍼런스, 포인트/브랜드 검토를 한 흐름으로 보여준다.

## Frontend Thesis
- Visual thesis: 기존 레시피 보관함 UI는 그대로 두고, 생성 순간만 별도 전체화면으로 분리해 집중형 레시피 빌더처럼 만든다.
- Content plan: 모드 선택, 진행 상태, 입력 섹션, 컷 구조, 레퍼런스/포인트, 하단 저장/생성 CTA 순서로 구성한다.
- Interaction thesis: Recipes 탭의 플러스/발행 CTA가 하단 내비 없는 `recipe-create` stack screen으로 이동하고, 생성 완료/뒤로가기로 보관함에 돌아오게 한다.

## 목표
- Recipes 탭의 레시피 보관함/컬렉션 UI는 유지한다.
- 레시피 생성 화면을 목적별 전체화면 워크스페이스로 새로 만든다.
- 빠른 생성, 발행용 생성, 브랜드 캠페인 모드를 제공한다.
- 시안처럼 단계 진행률, 입력 섹션, 컷 구성, 예시/레퍼런스, 촬영 노하우/브랜드 가이드 영역을 제공한다.
- 한국어/영어 설정을 유지한다.

## 범위
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-creator-screen.tsx`
- `parrotkit-app/src/app/recipe-create.tsx`
- `parrotkit-app/src/app/_layout.tsx`
- 작업 plan/context 문서

## 변경 파일
- `plans/20260503_native_recipe_creator_workspace.md`
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-creator-screen.tsx`
- `parrotkit-app/src/app/recipe-create.tsx`
- `parrotkit-app/src/app/_layout.tsx`
- `context/context_20260503_native_recipe_creator_workspace.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- Metro/simulator direct route로 `/recipe-create?mode=quick|publish|brand` 화면 확인

## 롤백
- `recipe-create` route와 `recipe-creator-screen.tsx`를 제거하고 Recipes 탭 CTA를 이전 `view=publish` 전환으로 되돌린다.

## 리스크
- 실제 저장/발행/브랜드 검토 API가 아직 연결되지 않은 mock UI이므로, 이후 Supabase contract와 연결할 때 입력 state와 validation을 별도 모듈로 분리해야 한다.

## 결과
- 기존 Recipes 탭의 메인/컬렉션/레시피 리스트 UI는 유지했다.
- Recipes 탭의 `+` FAB는 `/recipe-create?mode=reference`로 이동하게 변경했다.
- Recipes 탭의 `커뮤니티로 발행` CTA는 `/recipe-create?mode=manual`로 이동하게 변경했다.
- 기존 `?view=publish` direct entry는 `/recipe-create?mode=manual`로 우회해 하단 내비가 있는 생성 폼을 피하게 했다.
- `/recipe-create` stack screen을 추가해 하단 내비/글로벌 상단바 없는 전체화면 생성 플로우를 제공했다.
- 생성 화면은 레퍼런스 링크, 직접 만들기, 브랜드 브리프 3가지 선택과 간단한 입력 프리뷰/CTA로 단순화했다.
- `/recipes`에서는 글로벌 상단바를 숨겨 화면 자체 헤더와 겹치지 않게 했다.

## 검증
- 2026-05-03 KST `cd parrotkit-app && npx tsc --noEmit` 통과
- 2026-05-03 KST `git diff --check` 통과
- Simulator QA:
  - `exp://127.0.0.1:8081/--/recipe-create?mode=reference`
  - `exp://127.0.0.1:8081/--/recipes?view=main`
- Screenshots:
  - `output/playwright/native_recipe_create_reference_simple_final.png`
  - `output/playwright/native_recipes_main_preserved_no_global_topbar.png`

## 연결 context
- `context/context_20260503_native_recipe_creator_workspace.md`
