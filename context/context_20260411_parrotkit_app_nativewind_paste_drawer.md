# Context - Parrotkit App NativeWind Paste Drawer

## 작업 요약
- `parrotkit-app`의 Expo Router 구조를 루트 `app/`에서 `src/app/` 기준으로 옮기고, route-only 원칙에 맞게 `src/core`, `src/features` 구조를 도입했다.
- `Paste`를 네이티브 탭 하나로 두는 대신, 모든 탭 위에서 여는 floating action + 바텀 드로어형 modal route(`src/app/paste.tsx`)로 전환했다.
- 공용 placeholder UI를 `src/core/ui/feature-preview-screen.tsx`로 옮기고 NativeWind `className` 기반으로 재작성했다.
- `NativeTabs` 구성은 4개 destination(Home, Explore, Recipes, My)만 유지하고, 빠른 입력 액션은 `FloatingPasteButton`이 담당하도록 분리했다.
- `parrotkit-app/AGENT.md`를 추가하고 루트 `.gitignore`에 예외를 넣어 추적 가능하게 정리했다.

## 변경 파일
- `.gitignore`
- `plans/20260411_parrotkit_app_nativewind_paste_drawer.md`
- `parrotkit-app/AGENT.md`
- `parrotkit-app/app.json`
- `parrotkit-app/babel.config.js`
- `parrotkit-app/global.css`
- `parrotkit-app/metro.config.js`
- `parrotkit-app/nativewind-env.d.ts`
- `parrotkit-app/package.json`
- `parrotkit-app/package-lock.json`
- `parrotkit-app/tailwind.config.js`
- `parrotkit-app/tsconfig.json`
- `parrotkit-app/src/app/_layout.tsx`
- `parrotkit-app/src/app/paste.tsx`
- `parrotkit-app/src/app/(tabs)/_layout.tsx`
- `parrotkit-app/src/app/(tabs)/index.tsx`
- `parrotkit-app/src/app/(tabs)/explore.tsx`
- `parrotkit-app/src/app/(tabs)/recipes.tsx`
- `parrotkit-app/src/app/(tabs)/my.tsx`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/core/providers/app-theme-provider.tsx`
- `parrotkit-app/src/core/theme/colors.ts`
- `parrotkit-app/src/core/ui/feature-preview-screen.tsx`
- `parrotkit-app/src/core/ui/floating-paste-button.tsx`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `parrotkit-app/src/features/profile/screens/profile-screen.tsx`
- `parrotkit-app/src/features/paste/screens/paste-drawer-screen.tsx`
- 삭제: `parrotkit-app/app/**`, `parrotkit-app/src/components/native-tab-screen.tsx`

## 구조 메모
- route 파일은 이제 전부 `parrotkit-app/src/app`에만 둔다.
- 공용 기반은 `parrotkit-app/src/core`
  - `navigation/`: native tabs
  - `providers/`: 앱 루트 provider
  - `theme/`: 색상 토큰
  - `ui/`: reusable mobile UI
- 도메인 화면은 `parrotkit-app/src/features/<domain>/screens`
- `Paste`는 탭 destination이 아니라 action flow로 취급한다.

## NativeWind 메모
- 사용 버전
  - `nativewind@4.2.3`
  - `tailwindcss@3.4.19`
- 설정 파일
  - `babel.config.js`
  - `metro.config.js`
  - `tailwind.config.js`
  - `global.css`
  - `nativewind-env.d.ts`
- `app.json`의 web bundler를 `metro`로 맞췄다.

## 검증
- `cd parrotkit-app && npm install`
  - 통과
- `cd parrotkit-app && npx tsc --noEmit`
  - 통과
- `cd parrotkit-app && npx expo config --type public`
  - 통과
- `make cl`
  - AppleDouble `._*` 정리
- `cd parrotkit-app && npx expo prebuild --clean`
  - native directories 재생성 성공
  - 첫 `pod install`은 AppleDouble 메타파일 때문에 실패
- `cd parrotkit-app/ios && pod install --repo-update --ansi`
  - 통과
- `cd parrotkit-app && npx expo run:ios -d "iPhone 17" --port 8084 --no-build-cache`
  - 빌드 성공
  - `com.anonymous.parrotkitapp`를 `iPhone 17` simulator에 설치/오픈
  - `parrotkit-app://expo-development-client/?url=http%3A%2F%2F192.168.0.111%3A8084`로 dev client reopen

## 이슈 및 해결
- 문제: `react-native-reanimated@4.1.7`가 설치되면 패키지 내부에 `AnimatedSensorModule.cpp`, `CSSBoolean.cpp` 구현 파일이 빠져 있어 iOS 링크 단계에서 undefined symbols가 발생했다.
- 확인 방법
  - `find node_modules/react-native-reanimated/...`로 해당 파일 존재 여부 확인
  - `parrotkit-app/.expo/xcodebuild.log`에서 undefined symbol 이름 확인
- 해결
  - `react-native-reanimated`를 정확히 `4.1.1`로 pin
  - `react-native-worklets@0.5.1` 조합 유지
  - `pod install` 재실행 후 iOS build 재검증
- 문제: 외장 디스크 환경에서 `._*` AppleDouble 파일이 다시 생성되어 CocoaPods/Xcode 프로젝트 인식에 간섭했다.
- 해결
  - 수동 삭제 대신 프로젝트 표준 명령 `make cl`을 반복 사용
- 문제: `8081`은 다른 프로젝트(`nomad-diary`)가 점유하고 있었다.
- 해결
  - iOS run 명령에 `--port 8084` 사용

## 남은 메모
- bundle identifier / package는 아직 `com.anonymous.parrotkitapp` 기본값이다.
- Android 쪽은 이번 턴에서 별도 `run:android` 빌드까지는 하지 않았지만, 공용 route/native config는 동일하게 반영되어 있다.
