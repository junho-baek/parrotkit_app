# RN Bare CLI 흐름

## 질문

왜 `npx @react-native-community/cli@latest init ...` 흐름이 이 학습 워크스페이스에 잘 맞을까?

## 답변

이 흐름은 실제 `ios/`, `android/` 폴더가 있는 bare React Native 프로젝트를 만들고, Metro 개발 서버와 네이티브 빌드 명령을 직접 다루게 해준다. 그래서 더 추상화된 시작 방식보다 React Native 구조, 툴체인, 예전 방식과 최신 방식의 차이를 이해하기 좋다.

## 근거

- 프로젝트 생성:
  - `npx @react-native-community/cli@latest init AwesomeProject`
- Metro 시작:
  - `npm start`
- 네이티브 실행 명령:
  - `npm run android`
  - `npm run ios`

## 왜 도움이 되는가

- 시작부터 네이티브 프로젝트 구조를 직접 볼 수 있다.
- Android Studio와 Xcode가 학습 루프 안으로 자연스럽게 들어온다.
- 예전 강의 코드와 현재 React Native 기본값을 비교하기 쉬워진다.
- 빌드 에러, 네이티브 설정, 라이브러리 연결을 이해하는 기반이 좋아진다.

## 트레이드오프

- Expo보다 초기 설정 마찰이 크다.
- 네이티브 툴링 문제를 더 빨리 만나게 된다.
- "UI만 빨리 만들기" 모드로 가는 속도는 더 느릴 수 있다.

## 이 워크스페이스와 잘 맞는 이유

- React Native 구조 자체를 이해하는 것
- 레거시 코스 패턴과 최신 가이드를 비교하는 것
- 네이티브 빌드와 실행 흐름을 배우는 것
- 반복되는 교훈을 개인용 스킬로 추출하는 것

## 다음 단계

- hands-on practice를 본격 시작하면 별도 프로젝트 디렉터리에서 첫 bare RN 앱을 계속 활용한다.
- 기본 템플릿에서 어떤 부분이 핵심이고 어떤 부분이 잡음인지 기록한다.
