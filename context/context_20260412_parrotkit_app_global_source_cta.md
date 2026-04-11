# Context - Parrotkit App Global Source CTA

## 작업 요약
- `Source` 화면 안에서만 보이던 중앙 `+` FAB를 제거하고, native tabs 셸 전역에서 보이는 우측 하단 `Paste` CTA로 올렸다.
- CTA는 웹 버전의 brand action gradient(`#ff9568 -> #de81c1 -> #8c67ff`)를 그대로 따라가도록 `expo-linear-gradient`를 도입했다.
- `source-actions` modal은 유지하되, 진입 owner를 `SourceScreen`이 아니라 탭 셸 레벨 CTA로 이동시켰다.
- placeholder 성격의 긴 설명 카피는 걷어내고, Home/Explore/Recipes/My/Source 화면은 간단한 라벨 패널 중심으로 축약했다.
- `FeaturePreviewScreen`도 NativeWind 중심의 더 짧은 shell로 정리했다.

## 변경 파일
- `plans/20260412_parrotkit_app_global_source_cta.md`
- `context/context_20260412_parrotkit_app_global_source_cta.md`
- `parrotkit-app/package.json`
- `parrotkit-app/package-lock.json`
- `parrotkit-app/AGENT.md`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`
- `parrotkit-app/src/core/theme/colors.ts`
- `parrotkit-app/src/core/ui/feature-preview-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `parrotkit-app/src/features/profile/screens/profile-screen.tsx`

## 검증
- `cd parrotkit-app && npx expo install expo-linear-gradient`
  - 결과: SDK 54 호환 버전 설치 완료
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과
- `cd parrotkit-app && npx expo config --type public`
  - 결과: 통과

## 남은 리스크
- `expo-linear-gradient`가 새 native module이라, 기존 dev client에 포함돼 있지 않으면 실제 기기/시뮬레이터 확인 전에 `expo run:ios` 또는 `expo run:android` 재빌드가 필요할 수 있다.
- 현재 global CTA는 탭 셸 기준으로 항상 노출되고 `source-actions`에서만 숨긴다. 이후 detail/fullscreen route가 늘어나면 route별 visibility 정책을 한 번 더 정리해야 한다.

## 메모
- 앱 정보구조는 `Source` 탭 = inbox/destination, `Paste` CTA = global action으로 재정의됐다.
