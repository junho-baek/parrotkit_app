# 20260428 Shoot First Recipe Ownership

## 요약
- Home/Shoot 화면을 촬영 이어하기 중심으로 개편했다.
- 레시피에 ownership, verification, download, shoot progress metadata를 추가했다.
- Explore를 verified creator recipe network로 바꾸고 다운로드 액션을 mock workspace에 연결했다.
- Recipes를 owned/downloaded/remixed library로 정리했다.
- 하단 첫 탭 라벨을 `Shoot`로 바꿔 앱의 기본 루프를 촬영 중심으로 맞췄다.

## 변경
- `parrotkit-app/src/core/mocks/parrotkit-data.ts`: creator trust, recipe ownership, verification, shoot progress seed 추가.
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`: explore recipes, download, continue shoot/latest shootable lookup 추가.
- `parrotkit-app/src/features/recipes/lib/recipe-ownership.ts`: ownership/verification/progress/home ordering helper 추가.
- `parrotkit-app/src/features/recipes/components/shootable-recipe-card.tsx`: Home, Explore, Recipes 공통 shootable recipe card 추가.
- `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`: Continue Shoot 우선 홈으로 재구성.
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`: verified/community/all 레시피 탐색 및 다운로드 화면으로 재구성.
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`: All/Owned/Saved/Remixes 라이브러리로 재구성.
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`: 첫 탭 라벨을 `Shoot`로 변경.

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과.
- `git diff --check` 통과.
- `http://localhost:8081/status`에서 Metro `packager-status:running` 확인.
- Explore 화면은 8081 render QA에서 verified creators, verified recipe cards, Download 노출을 확인했다.
- Home/Recipes는 코드 리뷰와 타입 검증까지 완료했고, 실제 기기 탭 QA는 추가 확인이 필요하다.

## 리뷰 메모
- Task별 spec/code review에서 Critical/Important blocker는 없었다.
- 남은 minor polish: filter chip selected accessibility state, narrow width two-column grid 안정화, unsaved Explore card의 download count 표시 방식.

## 남은 리스크
- 소유권과 다운로드는 mock local state이며 서버 권한 모델은 없다.
- Verified creator 기준은 seed data의 `trust: 'verified'`와 recipe `verification: 'verified_creator'`에 의존한다.
- 실제 공유 링크, 리믹스 계보 저장, 공개/비공개 권한은 다음 계획에서 별도 구현해야 한다.
