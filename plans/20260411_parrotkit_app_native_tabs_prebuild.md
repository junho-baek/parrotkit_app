# 20260411 Parrotkit App Native Tabs Prebuild

## 배경
- 사용자는 `parrotkit-app`에서 기존 웹 모양을 억지로 복제하기보다, 더 네이티브다운 하단 네비게이션 바를 원한다고 방향을 정리했다.
- 현재 `parrotkit-app`은 blank Expo TypeScript 템플릿 상태라 라우팅과 탭 네비게이션이 아직 없다.
- 이번 작업의 목표는 Expo 앱을 native tabs 기반 구조로 바꾸고, 실제 네이티브 프로젝트가 생성되도록 `prebuild`까지 마치는 것이다.

## 목표
- `parrotkit-app`에 Expo Router 기반 라우팅을 추가한다.
- `expo-router/unstable-native-tabs`로 5개 탭(Home, Explore, Paste, Recipes, My)을 가진 네이티브 탭 바를 구성한다.
- `npx expo prebuild`가 성공하는 상태까지 맞춘다.

## 범위
- Expo Router 및 필수 의존성 설치
- `app/` 라우트 구조 추가
- 네이티브 탭 레이아웃과 기본 탭 화면 구현
- Expo config / entrypoint 조정
- `prebuild` 및 기본 정합성 검증
- 결과를 남기는 신규 context 문서 작성

## 변경 파일
- `plans/20260411_parrotkit_app_native_tabs_prebuild.md`
- `parrotkit-app/package.json`
- `parrotkit-app/package-lock.json`
- `parrotkit-app/app.json`
- `parrotkit-app/tsconfig.json`
- `parrotkit-app/app/**/*`
- `parrotkit-app/src/**/*` (필요 시)
- `context/context_20260411_parrotkit_app_native_tabs_prebuild.md`

## 테스트
- `cd parrotkit-app && npx expo install ...`
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx expo config --type public`
- `cd parrotkit-app && npx expo prebuild --clean`

## 롤백
- `parrotkit-app`의 라우터/탭 관련 파일과 설정 변경을 되돌리고, 필요 시 blank Expo 템플릿 상태로 복귀한다.
- `ios/`, `android/` 생성물은 제거하면 prebuild 이전 상태로 되돌릴 수 있다.

## 리스크
- Expo native tabs는 SDK 54 기준 experimental API라 이후 SDK 업그레이드 시 마이그레이션이 필요할 수 있다.
- Android native tabs는 플랫폼 제한상 최대 5개 탭까지만 지원한다.
- native tabs는 시스템 동작 제약이 있어 JS/custom tabs보다 커스터마이징 자유도가 낮다.

## 결과
- 완료
- `parrotkit-app`을 Expo Router 진입점과 native tabs 구조로 전환했다.
- 5개 탭(Home, Explore, Paste, Recipes, My)을 `expo-router/unstable-native-tabs` 기반으로 구성했다.
- `npx expo prebuild --clean`으로 `ios/`, `android/` 네이티브 프로젝트를 생성했다.
- prebuild 중 AppleDouble `._*.podspec` 문제는 프로젝트 표준 명령 `make cl`로 정리한 뒤 `pod install`을 재실행해 해결했다.
- `npx expo run:ios -d "iPhone 17" --no-build-cache` 빌드가 성공했고, `npx expo start --port 8084 --dev-client`로 설치된 dev client를 다시 연결했다.

## 연결 context
- `context/context_20260411_parrotkit_app_native_tabs_prebuild.md`
