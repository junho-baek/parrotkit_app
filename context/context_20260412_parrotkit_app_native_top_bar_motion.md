# Context - Parrotkit App Native Top Bar Motion

## 작업 요약
- 기존 top bar는 safe-area를 포함한 고정 셸로 레이아웃 안에 들어가 있어서, 상단 네비게이션이 아래로 내려온 느낌을 만들고 있었다.
- 이를 레이아웃을 밀지 않는 오버레이 헤더로 바꾸고, 탭 루트 스크롤과 연결해 스크롤 다운 시 자연스럽게 숨고 스크롤 업 시 다시 나타나는 방향으로 바꿨다.
- 임시 `P` 배지는 제거하고 웹 로고 자산을 앱 assets로 가져와 실제 앵무새 로고를 상단바에 적용했다.
- 탭 루트 세로 스크롤 화면들은 공통 `AppScreenScrollView`를 쓰게 바꿔, top bar motion과 top inset을 한 구조로 통일했다.

## 변경 파일
- `plans/20260412_parrotkit_app_native_top_bar_motion.md`
- `context/context_20260412_parrotkit_app_native_top_bar_motion.md`
- `parrotkit-app/assets/parrot-logo.png`
- `parrotkit-app/src/core/providers/app-theme-provider.tsx`
- `parrotkit-app/src/core/navigation/app-chrome-provider.tsx`
- `parrotkit-app/src/core/navigation/app-top-bar.tsx`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/core/ui/app-screen-scroll-view.tsx`
- `parrotkit-app/src/core/ui/feature-preview-screen.tsx`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `parrotkit-app/src/features/profile/screens/profile-screen.tsx`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과

## 남은 리스크
- 이번 헤더는 custom overlay이므로 iOS native large title과 1:1로 같은 behavior는 아니다. 다만 현재 탭 구조에서는 레이아웃을 밀지 않으면서 네이티브에 가까운 감각을 우선 맞춘 상태다.
- 실제 기기에서 scroll velocity와 상단바 복귀 감도가 너무 빠르거나 느리게 느껴지면 `APP_TOP_BAR_HIDE_RANGE`와 top spacing 값을 한 번 더 조정할 수 있다.
