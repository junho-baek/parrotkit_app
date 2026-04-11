# Context - Parrotkit App White Design System Cleanup

## 작업 요약
- 모바일 앱의 `canvas/surface/sheet` 토큰을 화이트 기준으로 되돌리고, border/muted 값을 더 차갑고 깨끗한 방향으로 조정했다.
- native tabs 루트를 `View` 셸로 감싸고 글로벌 floating `Paste` CTA를 얹을 수 있게 구조를 열었으며, gradient 액션 톤을 위해 `expo-linear-gradient`를 추가했다.
- `source-actions` 시트는 white sheet + subtle border + brand gradient CTA 구조로 재정리했고, placeholder screen은 마지막 불필요한 박스와 과한 warm tone을 줄여 web 디자인 시스템 쪽에 더 가깝게 맞췄다.

## 변경 파일
- `plans/20260412_parrotkit_app_white_design_system_cleanup.md`
- `context/context_20260412_parrotkit_app_white_design_system_cleanup.md`
- `parrotkit-app/package.json`
- `parrotkit-app/package-lock.json`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/core/theme/colors.ts`
- `parrotkit-app/src/core/ui/feature-preview-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`
- `parrotkit-app/tailwind.config.js`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과
- `cd parrotkit-app && npx expo config --type public`
  - 결과: 통과

## 남은 리스크
- 현재는 실제 데이터 대신 placeholder 구조가 많아서, 이후 실데이터 화면으로 갈 때 white surface 위계가 너무 밋밋해지지 않도록 density 조정이 필요할 수 있다.
- soft gradient CTA는 web 톤을 따르되, 실제 기기에서 채도가 높게 보이면 추후 알파와 shadow를 한 번 더 낮출 여지가 있다.
