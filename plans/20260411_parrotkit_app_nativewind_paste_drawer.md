# Plan - Parrotkit App NativeWind + Paste Drawer

## 배경
- `parrotkit-app`은 현재 Expo Router 네이티브 탭 기반 placeholder 앱으로 구성되어 있다.
- 가운데 `Paste`가 일반 탭처럼 동작하고 있어, 사용자가 원하는 빠른 입력 액션 진입점과는 성격이 다르다.
- 앞으로 Parrotkit 모바일 앱을 기능 단위로 확장하기 쉽게 하려면 `app`은 route-only, 실제 화면/로직은 `core`와 `features`로 분리하는 구조가 필요하다.
- 사용자는 이 앱에서 NativeWind를 기준 스타일링 방식으로 쓰기를 원한다.

## 목표
- `Paste`를 하단 탭이 아니라 드로어처럼 여는 액션 플로우로 전환한다.
- Expo Router 구조를 `src/app`, `src/core`, `src/features` 기준으로 재정리한다.
- NativeWind를 공식 설정대로 연결하고 공용 화면/UI를 `className` 기반으로 바꾼다.
- `parrotkit-app` 전용 `AGENT.md`를 추가해 이후 작업 기준을 앱 단위로 관리한다.

## 범위
- `parrotkit-app` 내부 Expo Router 경로와 화면 컴포넌트 재구성
- `Paste` 액션용 modal/drawer UI 추가
- NativeWind 의존성 및 설정 파일 추가
- 루트 `.gitignore` 예외 추가로 `parrotkit-app/AGENT.md` 추적 가능하게 조정

## 변경 파일
- `plans/20260411_parrotkit_app_nativewind_paste_drawer.md`
- `parrotkit-app/**`
- `.gitignore`
- `context/context_20260411_parrotkit_app_nativewind_paste_drawer.md`

## 테스트
- `cd parrotkit-app && npm install`
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx expo config --type public`
- 필요 시 `cd parrotkit-app && npx expo prebuild --clean`

## 롤백
- 네이티브 탭 placeholder 구조로 되돌리려면 `src/app/paste.tsx` modal route와 floating action button을 제거하고, `(tabs)/_layout.tsx`에 `paste` trigger를 복원한다.
- NativeWind 설정이 문제가 되면 `babel.config.js`, `metro.config.js`, `tailwind.config.js`, `global.css`와 관련 의존성을 제거하고 기존 StyleSheet 기반 컴포넌트로 복원한다.

## 리스크
- NativeWind 설정은 Expo/Metro/Babel 조합에 민감하므로 공식 문서와 현재 SDK 버전을 맞춰 확인해야 한다.
- `expo-router/unstable-native-tabs`와 overlay FAB 조합은 탭 바 위 절대 배치 타이밍에 따라 플랫폼 차이가 생길 수 있다.
- `src/app` 구조 전환 시 import 경로와 Expo Router route resolution을 함께 맞추지 않으면 런타임 route mismatch가 발생할 수 있다.

## 결과
- 완료
- 연결 context: `context/context_20260411_parrotkit_app_nativewind_paste_drawer.md`
