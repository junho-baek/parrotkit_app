# Native Explore Detail Page Follow-up Context

## 작업 시간
- 2026-05-02 22:53 KST

## 배경
- 사용자가 Explore 탭에서 hero/header가 상단 bar와 너무 떨어져 보인다고 피드백했다.
- 첨부 시안에 있던 recipe description/detail page가 실제로 쓸 수 있어야 한다고 요청했다.

## 변경 요약
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
  - Explore scroll content top padding을 `52`로 줄여 상단 ParrotKit bar 아래 여백을 압축했다.
  - Explore recipe card press가 다운로드를 즉시 수행하지 않고 `/recipe/:recipeId`로 이동하도록 변경했다.
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
  - `getRecipeById`가 local recipes뿐 아니라 `exploreRecipeSeeds`도 조회하도록 변경해 저장 전 marketplace recipe detail을 열 수 있게 했다.
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - overview 상태를 scene list 중심에서 recipe 설명 페이지 중심으로 개편했다.
  - full-bleed image hero, partner/verified badges, title/summary/creator metrics/tags, key hook, structure preview, why-it-works, Save/Start Shooting CTA를 추가했다.
  - 영어/한국어 copy를 `useAppLanguage` 기준으로 제공한다.
  - Save는 marketplace recipe를 downloaded recipe로 저장하고, Start Shooting은 저장 후 첫 scene prompter로 진입한다.
  - 기존 scene 선택 후 analysis/recipe/shoot 상세와 prompter 진입은 유지했다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과
- `git diff --check` 통과
- Metro status: `packager-status:running`
- Simulator screenshot:
  - `output/playwright/native_explore_tighter_header_followup.png`
  - `output/playwright/native_recipe_detail_explore_description_fixed.png`

## 리스크 / 후속
- Recipe detail page의 scene card list는 상세 설명 섹션 아래로 내려갔다. scene별 편집은 Structure Preview 또는 Scene details에서 계속 진입 가능하다.
- Share icon은 현재 시각적 affordance만 있고 실제 공유 액션은 별도 후속 구현이 필요하다.
