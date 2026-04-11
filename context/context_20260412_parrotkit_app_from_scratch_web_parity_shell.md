# Context - Parrotkit App From Scratch Web Parity Shell

## 작업 요약
- 웹 `home`, `explore`, `paste drawer`, `recipes`, `my`, `recipe result` 흐름을 기준으로 RN 앱의 product shell을 from-scratch mock 버전으로 재구성했다.
- 서버 로직 없이도 화면 간 흐름이 이어지도록 `MockWorkspaceProvider`를 추가해 `recentReferences`, `trendingReferences`, `recipes`, `likedReferences`를 local source-of-truth로 관리하도록 만들었다.
- `Paste` drawer submit은 이제 local draft recipe를 생성하고 새 `recipe/[recipeId]` route로 이동한다.
- 웹의 Magic UI `WordRotate`는 RN에서 `RotatingWord` 컴포넌트로 근사 구현해 `Instagram Reels`, `TikTok`, `YouTube Shorts` 헤더 회전을 적용했다.

## 변경 파일
- `plans/20260412_parrotkit_app_from_scratch_web_parity_shell.md`
- `context/context_20260412_parrotkit_app_from_scratch_web_parity_shell.md`
- `parrotkit-app/src/app/_layout.tsx`
- `parrotkit-app/src/app/recipe/[recipeId].tsx`
- `parrotkit-app/src/core/mocks/parrotkit-data.ts`
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
- `parrotkit-app/src/core/ui/media-tile-card.tsx`
- `parrotkit-app/src/core/ui/rotating-word.tsx`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- `parrotkit-app/src/features/profile/screens/profile-screen.tsx`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과
- `cd parrotkit-app && npx expo config --type public`
  - 결과: 통과

## 남은 리스크
- 현재는 local mock state라서 실제 backend contract와 scene editing semantics는 아직 붙지 않았다.
- 웹 `RecipeResult` 전체 편집 기능까지는 아직 옮기지 않았고, 이번 단계는 viewable product shell과 mock detail 흐름 확보에 집중했다.
- 웹의 세밀한 motion, marquee, gradient text는 RN에서 가능한 범위로 근사했기 때문에 시각 QA 후 spacing과 animation tuning이 한 번 더 필요할 수 있다.
