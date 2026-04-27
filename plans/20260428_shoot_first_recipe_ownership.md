# 20260428 Shoot First Recipe Ownership

## 배경
- ParrotKit의 핵심 습관은 앱을 열면 바로 촬영을 이어가거나 시작하는 것이다.
- Home은 운영 대시보드보다 Continue Shoot과 내가 소유한 shootable recipe shelf가 되어야 한다.
- Explore 탭은 유지하되 영상 구경이 아니라 인증 크리에이터 레시피를 다운로드하고 촬영하는 네트워크가 되어야 한다.

## 목표
- Home 최상단 우선순위를 A: 마지막 촬영 이어하기, 없으면 B: 최근 저장/소유 레시피, 둘 다 없으면 D: 빈 Quick Shoot으로 만든다.
- Explore를 verified creator recipe discovery로 바꾼다.
- Recipes를 로컬에서 소유/저장/다운로드/리믹스한 레시피 보관함으로 정리한다.
- 레시피 카드의 주요 액션을 `Shoot`로 통일한다.

## 범위
- Mock data/model 확장.
- MockWorkspaceProvider 상태/액션 확장.
- Home, Explore, Recipes 화면 개편.
- 하단 첫 탭 라벨을 Shoot로 변경.

## 변경 파일
- `parrotkit-app/src/core/mocks/parrotkit-data.ts`
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `parrotkit-app/src/features/recipes/components/shootable-recipe-card.tsx`
- `parrotkit-app/src/features/recipes/lib/recipe-ownership.ts`
- `context/context_20260428_shoot_first_recipe_ownership.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- 8081 Metro에서 Home, Explore, Recipes 수동 QA.
- Home: active progress recipe가 있으면 Continue Shoot이 먼저 보인다.
- Home: active progress recipe가 없으면 최신 shootable recipe가 먼저 보인다.
- Explore: verified creator recipe가 먼저 보이고 다운로드 후 Recipes/Home에 반영된다.
- Recipes: owned/downloaded/remixed label이 보이고 Shoot 액션은 prompter, Open 액션은 recipe detail로 이동한다.

## 롤백
- 새 helper/card/context 파일을 제거한다.
- `parrotkit-data.ts`와 `mock-workspace-provider.tsx`를 이전 recipe/reference 중심 모델로 되돌린다.
- Home, Explore, Recipes 화면을 이전 카드 리스트로 되돌린다.
- RootNativeTabs 첫 탭 라벨을 Home으로 되돌린다.

## 리스크
- Mock-only ownership이므로 실제 서버 소유권과 다를 수 있다.
- Home과 Recipes가 같은 카드 컴포넌트를 공유하므로 카드 API가 과도하게 커지지 않게 유지해야 한다.
- Explore download는 로컬 복제 상태만 만든다. 실제 공유 링크/권한 모델은 다음 단계에서 따로 설계한다.
