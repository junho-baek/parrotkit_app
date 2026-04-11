# Expo Prebuild 흐름

## 질문

`create-expo-app`에서 템플릿 옵션을 꼭 쓰지 않아도, 나중에 네이티브 디렉터리가 필요한 학습 흐름으로 갈 수 있을까?

## 답변

그렇다. `npx create-expo-app@latest`로 기본 Expo 앱을 만든 뒤, 네이티브 코드를 만지기 시작하는 시점에 `npx expo prebuild`를 실행하면 `ios/`, `android/` 디렉터리를 생성할 수 있다. 즉, `--template bare-minimum`은 "처음부터 native directories를 만들고 시작하는 편한 지름길"이고, `prebuild`는 "필요해진 시점에 native directories를 만들어서 Expo 관리 흐름에서 한 단계 내려오는 방식"에 가깝다.

## 실제로 정리된 흐름

### 기본 시작

- 프로젝트 생성:
  - `npx create-expo-app@latest nomad-diary`
- 개발 서버 시작:
  - `npm start`
- iOS 실행:
  - `npm run ios`

### 네이티브 코드 수정이 필요할 때

- 네이티브 디렉터리 생성 또는 갱신:
  - `npx expo prebuild`
- iOS 빌드 및 실행:
  - `npx expo run:ios`

### Watchman 에러가 날 때

- Watchman 서버 종료:
  - `watchman shutdown-server`
- 그 뒤 Metro 또는 iOS 실행 명령을 다시 시작한다.

## 비교

### `--template bare-minimum`

- 시작 직후부터 `ios/`, `android/`가 보인다.
- 강의가 처음부터 Xcode, Pods, Gradle을 직접 다루면 더 바로 맞는다.
- 네이티브 구조를 초반부터 눈으로 보기 쉽다.

### 기본 `create-expo-app`

- 더 단순한 Expo 시작점으로 들어가기 좋다.
- 네이티브 디렉터리가 꼭 처음부터 필요하지는 않다.
- 필요할 때 `prebuild`로 네이티브 프로젝트를 생성할 수 있다.

## 이 워크스페이스에서의 해석

- `AwesomeProject/`는 community CLI 기반 bare RN 샌드박스다.
- `nomad-diary/`는 Expo 흐름을 실험하는 샌드박스다.
- 둘을 따로 두면 "React Native CLI 흐름"과 "Expo에서 prebuild로 native 단계까지 내려가는 흐름"을 비교하며 공부하기 좋다.

## 선택한 방향

- UI, Expo 개발 경험, prebuild 타이밍을 보려면 `nomad-diary/`를 사용한다.
- Xcode, Pods, Metro, bare RN 빌드 흐름 자체를 보려면 `AwesomeProject/`를 사용한다.
- `raw/noovies/`는 여전히 미래 학습 소스로만 유지한다.

## 다음 단계

- `nomad-diary/`에서 `prebuild` 전과 후의 디렉터리 차이를 한 번 기록한다.
- Expo 샌드박스와 bare RN 샌드박스가 각각 어떤 질문에 답해주는지 위키에서 더 명확히 유지한다.
