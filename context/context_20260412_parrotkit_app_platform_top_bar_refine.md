# Context - Parrotkit App Platform Top Bar Refine

## 작업 요약
- Android에서 custom top bar가 적용되지 않은 것처럼 보인 이유는, current overlay chrome이 iOS 쪽 감각에 더 맞춰져 있었고 Android 쪽에서는 visibility와 scroll threshold가 덜 보수적으로 잡혀 있었기 때문이다.
- top bar overlay layer에 별도 absolute/elevation 레이어를 두고, 작은 초기 scroll에서는 절대 숨지 않도록 threshold를 추가했다.
- iPhone top bar는 더 네이티브하게 느껴지도록 그림자를 제거하고, 더 투명한 표면 + hairline border 쪽으로 톤을 바꿨다.
- camera 화면은 generic SafeAreaView에만 기대지 않고 Android에서 top/bottom inset을 추가로 확보하도록 바꿨다.

## 변경 파일
- `plans/20260412_parrotkit_app_platform_top_bar_refine.md`
- `context/context_20260412_parrotkit_app_platform_top_bar_refine.md`
- `parrotkit-app/src/core/navigation/app-top-bar.tsx`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/core/ui/app-screen-scroll-view.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과

## 남은 리스크
- Android 실제 기기별로 status bar/cutout 값이 조금씩 달라서, camera 상단 여백은 실기기에서 한 번 더 미세 조정할 수 있다.
- iOS top bar는 blur를 쓰지 않고 투명 surface만 적용한 상태라, 진짜 시스템 blur 질감까지 원하면 추후 `expo-blur`를 도입할 여지는 있다.
