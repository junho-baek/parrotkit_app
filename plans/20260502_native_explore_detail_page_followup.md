# Native Explore Detail Page Follow-up

## 배경
- Explore 탭 첫 콘텐츠가 상단 ParrotKit bar 아래에서 너무 멀리 시작해 hero/header가 느슨해 보인다.
- 첨부 시안 오른쪽에는 recipe description/detail page가 포함되어 있는데 현재 recipe detail overview는 scene card list 중심이라 탐색 카드에서 기대하는 설명 페이지로 쓰기 어렵다.

## 목표
- Explore 탭 header를 top bar와 더 가깝게 올린다.
- Recipe detail overview를 이미지 hero, creator/metric, key hook, structure preview, why-it-works, Save/Start Shooting CTA가 있는 설명 페이지로 바꾼다.
- 기존 scene 선택 후 analysis/recipe/shoot 상세와 prompter 진입은 유지한다.

## 범위
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- 문서 기록

## 변경 파일
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- `plans/20260502_native_explore_detail_page_followup.md`
- `context/context_20260502_native_explore_detail_page_followup.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- Metro reload 후 simulator에서 Explore와 recipe detail screenshot 확인

## 롤백
- Explore `AppScreenScrollView` content padding override를 제거한다.
- Recipe detail overview를 이전 scene-card list 중심 레이아웃으로 되돌린다.

## 리스크
- Detail page가 더 풍부해지면서 scene card list가 하단으로 내려가므로, scene별 편집은 하단 Structure Preview/Scene list에서 진입하게 된다.

## 결과
- Explore 탭의 content top padding을 줄여 상단 ParrotKit bar 아래의 느슨한 여백을 줄였다.
- Explore 추천/목록 카드가 저장을 먼저 수행하지 않고 `/recipe/:recipeId` 설명 페이지로 이동하도록 바꿨다.
- 저장 전 marketplace recipe도 `getRecipeById`에서 조회되도록 연결했다.
- Recipe detail overview를 캡처 시안처럼 full-bleed image hero, creator/metric, key hook, structure preview, why-it-works, Save/Start Shooting CTA가 있는 설명 페이지로 바꿨다.
- Save는 marketplace recipe를 downloaded recipe로 저장하고, Start Shooting은 저장 후 첫 scene prompter로 이어진다.

## 검증
- 2026-05-02 22:52 KST `cd parrotkit-app && npx tsc --noEmit` 통과
- 2026-05-02 22:52 KST `git diff --check` 통과
- Simulator/Metro `exp://127.0.0.1:8081/--/explore` 캡처: `output/playwright/native_explore_tighter_header_followup.png`
- Simulator/Metro `exp://127.0.0.1:8081/--/recipe/market-recipe-beauty-proof-routine` 캡처: `output/playwright/native_recipe_detail_explore_description_fixed.png`

## 연결 context
- `context/context_20260502_native_explore_detail_page_followup.md`
