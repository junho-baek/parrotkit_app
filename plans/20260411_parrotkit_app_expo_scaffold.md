# 20260411 Parrotkit App Expo Scaffold

## 배경
- 사용자는 현재 Parrotkit 저장소 안에 `parrotkit-app`이라는 이름의 Expo 앱을 새로 만들어 달라고 요청했다.
- 현재 저장소는 Next.js 기반 웹앱 중심 구조이며, 모바일 앱용 별도 Expo 프로젝트는 아직 존재하지 않는다.
- 팀 운영 규칙상 코드 변경 전 작업 범위와 검증/롤백 계획을 `plans/`에 먼저 남겨야 한다.

## 목표
- 저장소 루트 하위에 `parrotkit-app/` Expo 앱을 생성한다.
- 기본적으로 바로 실행 가능한 TypeScript 기반 Expo 스캐폴드를 확보한다.
- 생성 결과와 검증 내용을 `context/` 문서에 기록한다.

## 범위
- `create-expo-app`을 사용한 `parrotkit-app/` 생성
- 생성된 기본 파일/설정 확인
- 작업 결과를 정리하는 신규 `context` 문서 작성

## 변경 파일
- `plans/20260411_parrotkit_app_expo_scaffold.md`
- `parrotkit-app/*`
- `context/context_20260411_parrotkit_app_expo_scaffold.md`

## 테스트
- `npx create-expo-app@latest parrotkit-app --template blank-typescript --yes` 실행 성공 여부 확인
- `cd parrotkit-app && npm run lint` 또는 생성 직후 기본 스크립트 점검
- 생성된 앱의 핵심 파일(`package.json`, `App.tsx`, Expo 설정 파일) 존재 여부 확인

## 롤백
- `parrotkit-app/` 디렉토리와 이번 작업으로 추가한 `context` 문서를 제거하면 작업 전 상태로 되돌릴 수 있다.
- 루트 앱 설정은 직접 수정하지 않으므로 롤백 범위를 신규 생성 파일로 제한한다.

## 리스크
- nested project 구조라 루트 저장소와 별도 `node_modules`가 생겨 디스크 사용량이 증가한다.
- Expo 기본 템플릿 버전은 실행 시점의 최신 `create-expo-app`에 따라 달라질 수 있다.
- 루트 `.gitignore`는 `/node_modules`만 직접 명시하므로, 필요 시 nested 앱의 의도치 않은 산출물 추적 여부를 추가 확인해야 한다.

## 결과
- 완료
- `npx create-expo-app@latest parrotkit-app --template blank-typescript --yes`로 루트 하위에 Expo 앱을 생성했다.
- 생성 직후 생긴 AppleDouble 메타파일은 프로젝트 표준 명령 `make cl`로 정리했다.
- `parrotkit-app`의 기본 TypeScript 타입 체크와 Expo public config 확인까지 마쳤다.

## 연결 context
- `context/context_20260411_parrotkit_app_expo_scaffold.md`
