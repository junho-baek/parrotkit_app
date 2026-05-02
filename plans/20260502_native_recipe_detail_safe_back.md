# Native Recipe Detail Safe Back

## 배경
- Recipe detail page를 direct route/reload 상태에서 열고 back 버튼을 누르면 navigation stack이 없어 `GO_BACK` warning이 발생한다.
- 최근 Explore card가 저장 전 recipe detail로 바로 이동하도록 바뀌면서 direct detail 진입 경로가 더 자주 쓰인다.

## 목표
- Recipe detail page의 back 버튼이 history가 있으면 기존처럼 뒤로 가고, history가 없으면 안전하게 Explore 탭으로 이동하게 한다.
- Recipe not found 상태의 Back 버튼도 동일하게 안전하게 처리한다.

## 범위
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- 문서 기록

## 변경 파일
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- `plans/20260502_native_recipe_detail_safe_back.md`
- `context/context_20260502_native_recipe_detail_safe_back.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- Simulator에서 direct recipe detail route 진입 후 back 버튼을 눌러 LogBox가 뜨지 않고 Explore로 이동하는지 확인

## 롤백
- Recipe detail back handler를 이전 `router.back()` 직접 호출로 되돌린다.

## 리스크
- history가 없는 상태에서 fallback 목적지는 Explore 탭으로 고정한다. 다른 출발 맥락을 알 수 없는 direct route에서는 가장 자연스러운 안전 목적지다.

## 결과
- Recipe detail page에 `handleBack`을 추가했다.
- navigation history가 있으면 `router.back()`을 유지하고, 없으면 `router.replace('/explore')`로 이동한다.
- Recipe not found 상태의 Back 버튼과 hero back 버튼 모두 같은 안전 back handler를 사용한다.

## 검증
- 2026-05-02 23:15 KST `cd parrotkit-app && npx tsc --noEmit` 통과
- 2026-05-02 23:15 KST `git diff --check` 통과
- Simulator에서 `exp://127.0.0.1:8081/--/recipe/market-recipe-beauty-proof-routine` 직접 진입 후 Back 클릭 시 LogBox 없이 Explore 탭으로 이동 확인
- Screenshot: `output/playwright/native_recipe_detail_safe_back_explore.png`

## 연결 context
- `context/context_20260502_native_recipe_detail_safe_back.md`
