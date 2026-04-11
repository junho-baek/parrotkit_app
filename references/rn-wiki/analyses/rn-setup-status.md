# RN 설정 상태

## 질문

지금까지 이 React Native 워크스페이스에서 무엇이 이미 설정되었고, 무엇을 배웠을까?

## 답변

이 워크스페이스는 순수 계획 단계는 이미 넘겼다. 기본 개발 환경은 대부분 준비됐고, `AwesomeProject`라는 bare React Native 0.85 앱과 `nomad-diary`라는 Expo 앱이 각각 샌드박스로 만들어졌다. Android 실행과 iOS 기본 빌드 흐름은 확인됐고, Expo 기본 생성, `prebuild`, `run:ios` 관계도 정리됐다.

## 환경 상태

### 확인 완료

- Android Studio 설치 완료
- Android Emulator 설치 및 부팅 확인
- Xcode 26.4 설치 완료 및 `xcode-select` 연결 확인
- iOS Simulator 부팅 확인
- Java 17 설치 완료
- `~/.zshrc`에 `JAVA_HOME`, `ANDROID_HOME` 추가 완료
- 셸에서 `adb`, `emulator` 사용 가능
- 이 학습 저장소를 Git 저장소로 초기화하고 `origin`에 연결함

### 진행 중이거나 최근 논의된 항목

- `AwesomeProject`의 첫 iOS 빌드는 `pod install` 이후 성공했고, 시뮬레이터 실행도 확인됐다.
- 다만 앱 실행 직후 빨간 화면이 뜨면 보통 Metro packager 미실행 문제일 가능성이 크다.
- Expo 쪽은 `create-expo-app` 기본 흐름과 `prebuild` 기반 네이티브 디렉터리 생성 흐름을 함께 시험 중이다.
- `noovies`는 여전히 미래 학습 소스로 staged 상태이며 깊게 ingest 하지는 않았다.

## 실습 앱 상태

- 프로젝트 경로: `AwesomeProject/`
- 생성 명령:
  - `npx @react-native-community/cli@latest init AwesomeProject`
- 실행 모델:
  - Metro는 `npm start`
  - Android 빌드는 `npm run android`
  - iOS 빌드는 `npm run ios`

## Expo 샌드박스 상태

- 프로젝트 경로: `nomad-diary/`
- 생성 명령:
  - `npx create-expo-app@latest nomad-diary`
- 실행 모델:
  - 개발 서버는 `npm start`
  - iOS 실행은 `npm run ios`
  - 네이티브 코드 변경 시 `npx expo prebuild`
  - prebuild 뒤 iOS 실행은 `npx expo run:ios`

## 실제로 확인된 점

- bare React Native 앱은 community CLI로 바로 만들 수 있다.
- Android Emulator는 `adb`를 통해 앱 빌드 흐름과 정상 연결된다.
- Android 첫 실행은 Gradle과 NDK 설치가 함께 돌기 때문에 시간이 오래 걸릴 수 있다.
- `run-android`가 성공하면 보통 빌드, 설치, 실행까지 자동으로 이어진다.
- bare RN iOS 첫 실행은 CocoaPods가 빠지면 바로 막히고, `pod install`이 완료되면 다시 진행된다.
- Expo 앱은 템플릿 옵션 없이 시작해도, 나중에 `npx expo prebuild`로 네이티브 디렉터리를 생성할 수 있다.
- Watchman 관련 실행 에러가 날 때는 `watchman shutdown-server` 후 명령을 재시작하는 복구 루틴이 유효하다.

## Expo와 Bare React Native 차이

### Bare React Native

- 실제 `ios/`, `android/` 프로젝트 구조가 그대로 보인다.
- Gradle, CocoaPods, Xcode, Android SDK 문제를 더 직접적으로 만나게 된다.
- React Native가 실제로 어떻게 빌드되고 실행되는지 배우는 데 더 적합하다.

### Expo

- 더 빨리 시작할 수 있고 네이티브 툴링 복잡도를 많이 가린다.
- 설정 마찰이 적어서 기능 구현을 빠르게 시작하기 좋다.
- 여전히 React Native 위에 있지만, 더 안내된 개발 경험을 얹어준다.
- 필요해질 때 `prebuild`를 통해 네이티브 프로젝트를 생성하는 흐름도 가능하다.

## 왜 여기서는 Bare RN이 유용한가

- 이 워크스페이스의 목적은 React Native 개념 이해, 빌드 이해, 레거시와 최신 방식 비교에 있다.
- 그래서 빠른 프로토타이핑에는 Expo가 편하더라도, 학습용 샌드박스로는 bare React Native가 더 잘 맞는다.

## 관련 근거

- [rn-study-plan](rn-study-plan.md)
- [rn-bare-cli-flow](rn-bare-cli-flow.md)
- [expo-prebuild-flow](expo-prebuild-flow.md)

## 다음 단계

- `nomad-diary`에서 `prebuild` 전후 차이를 짧게 남긴다.
- `AwesomeProject`와 `nomad-diary`를 각각 어떤 질문에 쓰는지 더 명확히 정한다.
- 준비가 되면 `noovies`에서 첫 실제 학습 범위를 시작한다.
