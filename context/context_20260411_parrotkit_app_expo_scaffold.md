# Context - Parrotkit App Expo Scaffold

## 작업 요약
- 루트 저장소 하위에 새 Expo 앱 `parrotkit-app/`을 생성했다.
- 생성 명령은 `npx create-expo-app@latest parrotkit-app --template blank-typescript --yes`를 사용했다.
- 결과물은 Expo SDK 54 기반 blank TypeScript 템플릿이며, 기본 `App.tsx`, `app.json`, `tsconfig.json`, `package.json`, `assets/` 구성이 포함된다.
- 생성 과정에서 함께 생긴 macOS AppleDouble `._*` 파일은 프로젝트 표준 정리 명령 `make cl`로 제거했다.

## 변경 파일
- `plans/20260411_parrotkit_app_expo_scaffold.md`
- `parrotkit-app/*`
- `context/context_20260411_parrotkit_app_expo_scaffold.md`

## 생성된 앱 메모
- 앱 이름/slug: `parrotkit-app`
- 템플릿: `blank-typescript`
- 주요 버전
  - `expo`: `~54.0.33`
  - `react`: `19.1.0`
  - `react-native`: `0.81.5`
  - `typescript`: `~5.9.2`
- 기본 스크립트
  - `npm run start`
  - `npm run android`
  - `npm run ios`
  - `npm run web`

## 검증
- `git fetch origin dev`
- `npx create-expo-app@latest --help`
- `npx create-expo-app@latest parrotkit-app --template blank-typescript --yes`
- `make cl`
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx expo config --type public`
- 확인 결과
  - `parrotkit-app/App.tsx`, `parrotkit-app/app.json`, `parrotkit-app/tsconfig.json`, `parrotkit-app/.gitignore` 존재 확인
  - `find parrotkit-app -name '._*'` 결과 없음
  - Expo public config에서 `ios/android/web` 플랫폼이 모두 노출되는 것 확인

## 남은 리스크
- 현재는 Expo 기본 템플릿 그대로라 Parrotkit 브랜드/기능 연결은 아직 반영되지 않았다.
- nested 앱 구조이므로 추후 루트 웹앱과 디자인 토큰, API 계약, 공용 타입을 공유할지 별도 아키텍처 결정이 필요하다.
- 실제 디바이스/시뮬레이터 실행 검증은 아직 하지 않았다. 이번 턴에서는 생성과 기본 정합성 확인까지만 수행했다.

## 다음 액션 제안
- `cd parrotkit-app && npm run ios` 또는 `npm run android`로 시뮬레이터 실행 확인
- 필요하면 Parrotkit 웹앱과 공유할 패키지 구조(예: 공용 타입/상수)를 별도 설계
- 기본 `App.tsx`를 Parrotkit 온보딩/홈 화면 목업으로 교체
