# Plan - Parrotkit App Platform Top Bar Refine

## 배경
- 현재 custom top bar는 iOS에서는 보이지만, Android에서는 기대한 만큼 드러나지 않거나 바로 숨은 것처럼 보여 일관성이 약하다.
- 사용자 피드백은 Android 적용 문제, camera 화면의 Android 상단 safe area 부족, 그리고 iPhone 헤더가 덜 네이티브하게 보인다는 점이다.

## 목표
- Android에서 top bar가 안정적으로 보이도록 overlay layer와 scroll threshold를 조정한다.
- iPhone top bar는 그림자를 줄이고 더 투명한 톤으로 바꿔 compact native chrome에 가깝게 만든다.
- camera 화면 상단 컨트롤 영역에 Android 추가 inset을 넣어 펀치홀/상단 cutout과 더 안전하게 떨어뜨린다.

## 범위
- `parrotkit-app/src/core/navigation/app-top-bar.tsx`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/core/ui/app-screen-scroll-view.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_platform_top_bar_refine.md`
- `context/context_20260412_parrotkit_app_platform_top_bar_refine.md`
- `parrotkit-app/src/core/navigation/app-top-bar.tsx`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/core/ui/app-screen-scroll-view.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`

## 롤백
- platform-specific header style과 Android camera inset 조정을 제거하고 이전 native top bar motion 버전으로 되돌린다.

## 리스크
- custom chrome은 native default header와 다르기 때문에 플랫폼별 미세 조정이 남을 수 있다.
- Android 기기별 status bar / cutout 조합이 다양해서 실기기에서 top inset을 한 번 더 확인하는 편이 좋다.

## 결과
- Android에서 top bar가 안정적으로 드러나도록 overlay layer/elevation과 scroll threshold를 조정했다.
- iPhone top bar는 그림자를 제거하고 더 투명한 surface로 바꿔 compact native chrome에 더 가깝게 만들었다.
- camera 화면의 상단/하단 컨트롤 영역은 Android에서 extra inset을 주도록 변경했다.
- `cd parrotkit-app && npx tsc --noEmit` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_platform_top_bar_refine.md`
