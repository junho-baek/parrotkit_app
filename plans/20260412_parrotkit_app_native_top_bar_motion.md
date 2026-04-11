# Plan - Parrotkit App Native Top Bar Motion

## 배경
- 최근 추가한 RN 상단바는 safe-area를 포함한 고정 셸로 들어가 있어서, 사용자가 보기엔 네비게이션 바가 아래로 내려온 느낌이 난다.
- 사용자 요청은 더 네이티브한 맛, 스크롤 시 자연스럽게 사라지는 동작, 그리고 실제 앵무새 로고 적용이다.

## 목표
- 상단바를 레이아웃을 밀지 않는 오버레이 크롬으로 바꾼다.
- 루트 스크롤과 연동해 상단바가 스크롤 다운 시 자연스럽게 숨고, 스크롤 업 시 다시 나타나게 만든다.
- 임시 브랜드 배지를 실제 앵무새 로고로 교체한다.

## 범위
- `parrotkit-app/src/core/providers/app-theme-provider.tsx`
- `parrotkit-app/src/core/navigation/app-top-bar.tsx`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/core/navigation/app-chrome-provider.tsx`
- `parrotkit-app/src/core/ui/app-screen-scroll-view.tsx`
- 탭 루트 화면들
- `parrotkit-app/assets/parrot-logo.png`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_native_top_bar_motion.md`
- `context/context_20260412_parrotkit_app_native_top_bar_motion.md`
- `parrotkit-app/assets/parrot-logo.png`
- `parrotkit-app/src/core/providers/app-theme-provider.tsx`
- `parrotkit-app/src/core/navigation/app-top-bar.tsx`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/core/navigation/app-chrome-provider.tsx`
- `parrotkit-app/src/core/ui/app-screen-scroll-view.tsx`
- `parrotkit-app/src/core/ui/feature-preview-screen.tsx`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `parrotkit-app/src/features/profile/screens/profile-screen.tsx`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`

## 롤백
- 오버레이 헤더와 app chrome provider를 제거하고 이전 고정 top bar 셸 구조로 되돌린다.

## 리스크
- 커스텀 오버레이 헤더는 native stack 기본 헤더보다 유지보수 비용이 약간 높다.
- scroll-linked motion이 모든 탭 루트에서 같은 감도로 자연스럽게 느껴지는지는 실기기에서 한 번 더 확인해야 한다.

## 결과
- top bar를 레이아웃 안의 고정 셸에서 absolute overlay 크롬으로 바꿔, 상단 네비게이션이 아래로 밀려 보이던 문제를 제거했다.
- 탭 루트 세로 스크롤 화면들을 공통 `AppScreenScrollView`로 묶고, 스크롤 방향에 따라 top bar가 자연스럽게 숨고 다시 나타나도록 공통 motion source를 붙였다.
- 임시 브랜드 배지를 제거하고 `parrot-logo.png`를 앱 assets로 가져와 실제 앵무새 로고를 적용했다.
- `cd parrotkit-app && npx tsc --noEmit` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_native_top_bar_motion.md`
