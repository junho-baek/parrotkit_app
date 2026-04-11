# Plan - Parrotkit App White Design System Cleanup

## 배경
- 현재 모바일 앱은 전체 베이스가 누런 톤(`canvas/surface/sheet`)으로 남아 있고, 특히 `source-actions` 시트는 white sheet 안에 또 다른 box가 들어가 web design system보다 더 무겁게 보인다.
- 사용자 피드백은 색을 화이트 기준으로 돌리고, box 안의 box를 줄이며, NativeWind 기반으로 웹 프로젝트 디자인 시스템에 맞춰 달라는 것이다.

## 목표
- 모바일 디자인 토큰을 화이트 기반으로 정리한다.
- `source-actions` 시트를 web `PasteDrawer`에 가까운 white sheet + subtle border + brand gradient CTA 구조로 바꾼다.
- placeholder 화면의 불필요한 마지막 박스를 제거해 box 중첩을 줄인다.

## 범위
- `parrotkit-app/tailwind.config.js`
- `parrotkit-app/src/core/theme/colors.ts`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/core/ui/feature-preview-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_white_design_system_cleanup.md`
- `context/context_20260412_parrotkit_app_white_design_system_cleanup.md`
- `parrotkit-app/tailwind.config.js`
- `parrotkit-app/src/core/theme/colors.ts`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/core/ui/feature-preview-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx expo config --type public`

## 롤백
- 색 토큰을 이전 warm tone으로 되돌리고, `source-actions` 시트와 preview screen의 구조를 이전 버전으로 복원한다.

## 리스크
- 화이트 토큰으로 통일하면 카드 분리감이 약해질 수 있어 border/shadow 밸런스를 한 번 더 조정해야 할 수 있다.
- 시트 구조를 플랫하게 만들면 placeholder 화면보다 실제 폼 구조가 더 빨리 필요해질 수 있다.

## 결과
- 모바일 디자인 토큰을 white 기반으로 정리하고 muted/border 값을 웹 톤에 더 가깝게 맞췄다.
- native tabs 셸 위에 글로벌 floating `Paste` CTA를 올릴 수 있도록 루트 탭 구조를 정리하고, `expo-linear-gradient`를 추가했다.
- `source-actions` 시트와 placeholder 화면을 더 플랫한 white surface 기준으로 정리해 box 안의 box 느낌을 줄였다.
- `cd parrotkit-app && npx tsc --noEmit`, `cd parrotkit-app && npx expo config --type public` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_white_design_system_cleanup.md`
