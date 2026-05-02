# Native Recipe Detail Safe Back Context

## 작업 시간
- 2026-05-02 23:17 KST

## 증상
- Recipe detail page를 direct URL/reload 상태로 열고 hero back 버튼을 누르면 `The action 'GO_BACK' was not handled by any navigator` LogBox warning이 표시됐다.

## 원인
- direct route로 상세 화면이 root stack의 첫 화면처럼 열린 경우 navigation history가 없다.
- `RecipeDetailScreen`의 hero back 버튼과 not-found back 버튼이 `router.back()`을 직접 호출해 history가 없을 때 `GO_BACK` action을 처리할 navigator가 없었다.
- 같은 앱의 prompter screen은 이미 `router.canGoBack()` fallback 패턴을 쓰고 있었다.

## 변경 요약
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - `handleBack`을 추가했다.
  - `router.canGoBack()`이 true면 기존처럼 `router.back()`을 호출한다.
  - history가 없으면 `router.replace('/explore')`로 안전하게 이동한다.
  - hero back 버튼과 recipe-not-found back 버튼이 `handleBack`을 사용하도록 변경했다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과
- `git diff --check` 통과
- Metro status: `packager-status:running`
- Simulator direct route 검증:
  - Open URL: `exp://127.0.0.1:8081/--/recipe/market-recipe-beauty-proof-routine`
  - Back button click 후 Explore 탭으로 이동
  - LogBox warning 재발 없음
- Screenshot: `output/playwright/native_recipe_detail_safe_back_explore.png`

## 후속
- 없음. 다른 direct route back 문제가 보이면 동일한 `canGoBack` fallback 패턴으로 맞추면 된다.
