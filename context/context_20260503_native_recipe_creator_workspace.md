# Native Recipe Creator Workspace Context

## 작업 시간
- 2026-05-03 KST

## 배경
- 사용자는 기존 레시피 보관함 UI는 유지하고, 레시피 생성 UI만 더 간단한 `새 레시피 시작` 흐름으로 바꾸길 원했다.
- 생성 화면에서는 하단 네비가 없어도 된다고 정리했다.

## 변경 요약
- `parrotkit-app/src/app/recipe-create.tsx`
  - 새 recipe creation stack route를 추가했다.
- `parrotkit-app/src/app/_layout.tsx`
  - `recipe-create` stack screen을 등록하고 `slide_from_bottom` 전환을 적용했다.
- `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
  - 하단 네비/글로벌 상단바 없는 전체화면 생성 UI를 추가했다.
  - 레퍼런스 링크, 직접 만들기, 브랜드 브리프 3가지 시작 방식을 제공한다.
  - 선택된 방식에 따라 간단한 입력 프리뷰와 CTA를 표시한다.
  - `?mode=reference|manual|brand` direct QA를 지원한다.
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
  - 기존 레시피 메인/컬렉션/리스트 UI는 유지했다.
  - `+` FAB는 `/recipe-create?mode=reference`로 이동한다.
  - `커뮤니티로 발행` CTA는 `/recipe-create?mode=manual`로 이동한다.
  - 기존 `?view=publish`는 `/recipe-create?mode=manual`로 우회한다.
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
  - `/recipes` 경로에서는 글로벌 상단바를 숨겨 Recipes 자체 헤더와 겹치지 않게 했다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과
- `git diff --check` 통과
- Metro status: `packager-status:running`
- Simulator direct route QA:
  - `exp://127.0.0.1:8081/--/recipe-create?mode=reference`
  - `exp://127.0.0.1:8081/--/recipes?view=main`
- Screenshots:
  - `output/playwright/native_recipe_create_reference_simple_final.png`
  - `output/playwright/native_recipes_main_preserved_no_global_topbar.png`

## 리스크 / 후속
- `/recipe-create`는 아직 mock UI이며 실제 레시피 생성, URL 분석, 브리프 업로드 API와 연결되어 있지 않다.
- CTA 이후 저장/생성 플로우가 정해지면 mode별 validation과 provider/Supabase 연결이 필요하다.
