# Context - Parrotkit App Native Tabs Prebuild

## 작업 요약
- `parrotkit-app`을 blank Expo 앱에서 Expo Router 기반 앱으로 전환했다.
- 진입점을 `expo-router/entry`로 바꾸고 `app/` 라우트 구조를 추가했다.
- `expo-router/unstable-native-tabs`로 5개 탭(Home, Explore, Paste, Recipes, My)을 가진 네이티브 탭 바를 구성했다.
- 각 탭은 기본 placeholder 화면을 가지며, 스크롤/안전영역/탭 전환을 실제 네이티브 컨테이너에서 확인할 수 있게 했다.
- `expo prebuild` 후 iOS `pod install`과 `expo run:ios`까지 성공시켜 시뮬레이터에서 열 수 있는 상태를 만들었다.

## 변경 파일
- `plans/20260411_parrotkit_app_native_tabs_prebuild.md`
- `parrotkit-app/package.json`
- `parrotkit-app/package-lock.json`
- `parrotkit-app/app.json`
- `parrotkit-app/tsconfig.json`
- `parrotkit-app/expo-env.d.ts`
- `parrotkit-app/app/_layout.tsx`
- `parrotkit-app/app/(tabs)/_layout.tsx`
- `parrotkit-app/app/(tabs)/index.tsx`
- `parrotkit-app/app/(tabs)/explore.tsx`
- `parrotkit-app/app/(tabs)/paste.tsx`
- `parrotkit-app/app/(tabs)/recipes.tsx`
- `parrotkit-app/app/(tabs)/my.tsx`
- `parrotkit-app/src/components/native-tab-screen.tsx`
- `context/context_20260411_parrotkit_app_native_tabs_prebuild.md`

## 주요 메모
- 현재 진입 방식
  - `main`: `expo-router/entry`
  - `android` 스크립트: `expo run:android`
  - `ios` 스크립트: `expo run:ios`
  - `prebuild` 스크립트: `expo prebuild`
- 추가 의존성
  - `expo-router`
  - `expo-constants`
  - `expo-linking`
  - `expo-system-ui`
  - `react-native-safe-area-context`
  - `react-native-screens`
  - `@expo/vector-icons`
  - `react-dom`
  - `react-native-web`
- 현재 native 식별자 기본값
  - Android package: `com.anonymous.parrotkitapp`
  - Apple bundle identifier: `com.anonymous.parrotkitapp`

## 검증
- `cd parrotkit-app && npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants`
- `cd parrotkit-app && npx expo install react-dom react-native-web @expo/vector-icons`
- `cd parrotkit-app && npx expo install expo-system-ui`
- `cd parrotkit-app && npx tsc --noEmit`
  - 통과
- `cd parrotkit-app && npx expo config --type public`
  - 통과
- `cd parrotkit-app && npx expo prebuild --clean`
  - native directories 생성 성공
  - 첫 2회는 `node_modules/**/._*.podspec` 때문에 iOS `pod install` 실패
- `make cl`
  - AppleDouble 메타파일 제거
- `cd parrotkit-app/ios && pod install --repo-update --ansi`
  - 통과
- `cd parrotkit-app && npx expo run:ios -d "iPhone 17" --no-build-cache`
  - 빌드 성공
  - `com.anonymous.parrotkitapp`를 iPhone 17 simulator에 설치/오픈
- `cd parrotkit-app && npx expo start --port 8084 --dev-client`
  - Metro 실행 성공
  - `parrotkit-app://expo-development-client/?url=http%3A%2F%2F192.168.0.111%3A8084`로 iPhone 17 simulator reopen

## 이슈 및 해결
- 문제: CocoaPods가 `._EXConstants.podspec`, `._ExpoSystemUI.podspec` 같은 AppleDouble 메타파일을 podspec으로 오인해 실패했다.
- 해결: 수동 삭제 대신 프로젝트 표준 명령 `make cl`을 사용해 `._*`를 정리했고, 이후 `pod install`을 재실행했다.
- 문제: 로컬 `8081` 포트가 다른 React Native 프로젝트(`nomad-diary`)에서 사용 중이었다.
- 해결: Metro를 `8084`로 띄우고 dev client를 해당 포트 URL로 다시 열었다.

## 남은 리스크
- 실제 bundle identifier/package는 아직 anonymous 기본값이라 배포 전에는 프로젝트 전용 값으로 교체하는 것이 좋다.
- iOS simulator에서 앱 설치/오픈까지는 확인했지만, 이 턴에서는 시뮬레이터 스크린샷 산출물까지 남기지는 않았다.
- `expo-router/unstable-native-tabs`는 SDK 54 기준 experimental API라 SDK 업그레이드 시 API 재확인이 필요하다.

## 다음 액션 제안
- `parrotkit-app/app/(tabs)/*.tsx` placeholder 내용을 실제 Parrotkit 모바일 정보 구조로 교체
- `app.json`에 실제 iOS/Android 식별자 설정
- 시뮬레이터/에뮬레이터에서 탭별 스크린샷을 남겨 모바일 QA baseline 구성
