# Context - Parrotkit App Top Bar Top Only Behavior

## 작업 요약
- 탭 전환 후 돌아왔을 때 생기던 Android 오버레이 현상은 top bar 표시 상태가 현재 화면의 실제 스크롤 위치와 분리되어 있었기 때문에 생겼다.
- `AppScreenScrollView`가 각 화면의 현재 offset을 기억하고, focus 시 그 offset 기준으로 top bar progress를 바로 복원하도록 바꿨다.
- top bar는 이제 스크롤 방향이 아니라 오직 현재 top offset에만 반응한다. 즉 긴 화면에서는 최상단 근처에서만 보이고, 중간 구간에서는 다시 나타나지 않는다.
- iPhone 상단 여백 문제는 ScrollView의 inset 자동 조정을 끄고 manual top padding만 남기도록 정리해 줄였다.
- iPhone top bar는 더 자연스럽게 페이지에 붙도록 fully transparent tone으로 바꿨다.

## 변경 파일
- `plans/20260412_parrotkit_app_top_bar_top_only_behavior.md`
- `context/context_20260412_parrotkit_app_top_bar_top_only_behavior.md`
- `parrotkit-app/src/core/navigation/app-chrome-provider.tsx`
- `parrotkit-app/src/core/navigation/app-top-bar.tsx`
- `parrotkit-app/src/core/ui/app-screen-scroll-view.tsx`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과

## 남은 리스크
- 현재는 custom chrome 정책이므로, true native header blur/material까지 완전히 맞추려면 추후 `expo-blur` 또는 시스템 헤더 전략으로 다시 결정할 수 있다.
- 아주 짧은 스크롤 구간에서만 보이는 정책으로 바뀌었기 때문에, 실제 기기에서 hide range가 너무 짧게 느껴지면 `APP_TOP_BAR_HIDE_RANGE`를 24 기준으로 조금만 더 미세 조정할 수 있다.
