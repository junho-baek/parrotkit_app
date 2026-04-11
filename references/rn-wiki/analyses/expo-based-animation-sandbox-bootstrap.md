# Expo 기반 애니메이션 샌드박스 부트스트랩 | Expo-Based Animation Sandbox Bootstrap

## 범위

- `nomadcoders/nomad-lang`의 2021-09-24 커밋 `a1af7d8` (`3.1 Setup`)를 기준으로,
  React Native 애니메이션 학습 프로젝트가 어떤 식으로 첫 셸을 올렸는지 정리한다.
- 특히 다음을 현재 기준으로 다시 읽는다.
  - Expo 42 + React Native 0.63 조합의 의미
  - `react-native-reanimated` / `react-native-gesture-handler`를 초기에 함께 넣는 이유
  - native 디렉터리와 splash/icon/updates를 포함한 초기 앱 셸의 역할

## 짧은 결론

- 이 커밋의 핵심은 "애니메이션을 만들기 전에, 애니메이션을 실험할 수 있는 Expo 기반 네이티브 셸을 먼저 세팅했다"는 점이다.
- `App.js`는 아직 `null`을 반환하므로 화면 기능은 시작되지 않았다.
- 대신 이 시점에 이미:
  - Expo SDK
  - iOS / Android native directories
  - splash / icon assets
  - `react-native-reanimated`
  - `react-native-gesture-handler`
  - `react-native-screens`

가 한 번에 들어와 있다.
- 즉 첫 커밋의 진짜 주제는 "앱 UI"가 아니라
  "애니메이션 실습을 바로 시작할 수 있는 실행 환경"이다.

## 레거시 커밋이 실제로 한 것

- 저장소 전체를 새 프로젝트 스캐폴드로 생성한다.
- `package.json` 기준 의존성은 대체로:
  - `expo ~42`
  - `react-native ~0.63`
  - `react-native-reanimated ~2.2`
  - `react-native-gesture-handler`
  - `react-native-screens`
  - `styled-components`
  - `expo-splash-screen`
  - `expo-updates`

조합이다.
- `android/`, `ios/` 디렉터리가 이미 커밋되어 있고,
  splash/icon/native config가 함께 들어온다.
- 실행 스크립트는:
  - `react-native run-android`
  - `react-native run-ios`
  - `expo start --web`
  - `react-native start`

를 함께 둔다.
- `app.json`에는 최소 Expo config만 들어가고,
  실제 앱 코드 `App.js`는 아직 `return null` 상태다.

즉 이 커밋은 "기능이 없는 대신 실험 가능한 셸이 준비된 상태"를 만드는 커밋이다.

## 이때의 핵심 개념

### 1. 애니메이션 프로젝트는 UI보다 런타임 셸이 먼저다

- 애니메이션을 깊게 다룰 프로젝트에선
  시작부터 native 실행 환경이 안정적이어야 한다.
- Reanimated, gesture, splash, native build가 흔들리면
  이후의 애니메이션 코드 학습도 계속 막힌다.

즉 첫 커밋의 목적은 "보여줄 화면"이 아니라
"실험을 견딜 수 있는 토대"를 깔아두는 것이다.

### 2. 당시 Expo는 지금보다 더 "native를 동반한 setup 패키지"에 가까웠다

- 지금의 Expo는 `create-expo-app` + CNG / prebuild 흐름으로 더 정리돼 있다.
- 하지만 이 시기의 Expo 템플릿은
  native directories와 Expo unimodules를 함께 가진 형태가 자연스러웠다.

즉 이 커밋은 "managed vs bare"를 깔끔히 나눈 오늘 감각보다는,
"Expo 기능을 실은 RN 앱 셸"에 더 가깝다.

### 3. Reanimated와 Gesture Handler는 나중 추가가 아니라 기반 의존성이다

- 애니메이션 앱이라면 이 두 라이브러리는 화면이 생기기 전부터 들어간다.
- 특히 drag, pan, interpolation 중심 학습을 할 예정이라면
  애초에 runtime compatibility를 먼저 맞추는 편이 낫다.

### 4. splash, icon, updates도 앱 셸의 일부다

- 첫 화면이 아직 없더라도
  앱 아이콘, 스플래시, 업데이트 런타임은 제품 셸의 일부다.
- 이 커밋은 "실습 앱"이어도 그 셸을 꽤 초반에 확보한다.

## 현재 대응 개념

### 1. 지금의 기본 시작점은 `create-expo-app`이다

- 최신 Expo 문서는 새 프로젝트를 만들 때
  `create-expo-app` 기본 템플릿으로 시작하길 권한다.
- 즉 오늘 기준 "Setup"의 대응 개념은
  예전 템플릿 전체를 통째로 커밋하는 것보다,
  최신 Expo 스타터에서 출발하는 쪽에 더 가깝다.

### 2. 지금 Expo의 기본 철학은 CNG / prebuild 쪽이다

- 최신 Expo 문서는 기본적으로 native directories 없이 시작하고,
  필요할 때 `npx expo prebuild`로 native code를 생성하는 흐름을 설명한다.
- 그리고 native 설정은 가능하면 config plugin으로 관리하라고 권한다.

즉 예전의 "native 폴더를 시작부터 들고 있는 Expo 앱"은
현재의 기본값과는 다르다.

### 3. 현재 Reanimated의 대응 개념은 New Architecture + worklets다

- 최신 Reanimated 문서는
  Reanimated 4가 New Architecture에서 동작하고,
  Expo 프로젝트에서는 prebuild와 worklets 기반 설치 흐름을 설명한다.
- 즉 과거 커밋의 `react-native-reanimated@2.2` setup은
  오늘 기준으로는:
  - Reanimated 4
  - `react-native-worklets`
  - prebuild / rebuild

관점으로 번역된다.

### 4. gesture는 지금 더 직접적으로 Reanimated와 통합된다

- 최신 Gesture Handler 문서는
  gesture callbacks가 Reanimated와 결합돼 UI thread에서 처리될 수 있음을 설명한다.
- 따라서 지금의 대응 개념은
  단순히 "gesture 라이브러리를 설치해둔다"가 아니라,
  "gesture와 animation runtime을 같은 interaction engine으로 본다"에 더 가깝다.

### 5. `App.js`가 `null`인 셸은 가능하지만, 지금은 보통 더 얇은 visible scaffold를 둔다

- 학습상 `return null`은 나쁜 선택은 아니다.
- 다만 현재식으로는
  첫 커밋에서도 최소한:
  - 루트 컨테이너
  - 배경색
  - safe area
  - 임시 텍스트
  - 혹은 초기 route 구조

중 하나는 보이게 두는 편이 디버깅과 검증에 더 유리하다.

## 현재 베스트 프랙티스

### 1. 새 RN 애니메이션 앱은 최신 Expo 스타터에서 시작하는 편이 좋다

- `create-expo-app`으로 시작하고,
  앱이 필요로 하는 native dependency를 `expo install`로 추가하는 흐름이 기본값에 가깝다.

### 2. native customization이 필요할 때만 prebuild / dev build로 내려간다

- 지금은 처음부터 `ios/`, `android/`를 직접 들고 시작하기보다,
  정말 필요한 순간에 `expo prebuild` 또는 development build로 내려가는 편이 더 관리하기 쉽다.

### 3. Reanimated는 "설치"보다 "런타임 경로 정합성"이 중요하다

- worklets plugin, native rebuild, Metro cache, iOS pods 같은 설치 경로가 맞아야 한다.
- 애니메이션 학습 프로젝트라면 첫 커밋부터 이 runtime path를 확인하는 것이 중요하다.

### 4. gesture와 animation은 따로 배우더라도 셋업은 같이 보는 편이 좋다

- drag, pan, snap, threshold로 갈수록
  gesture와 animation은 거의 분리되지 않는다.
- 따라서 초반 셸부터 둘을 같이 올리는 방향은 지금도 합리적이다.

### 5. native 설정은 가능하면 선언적으로 남긴다

- 앱 config, config plugin, prebuild 정의처럼
  다시 생성 가능한 형태로 남기는 편이 좋다.
- 직접 수정한 native 파일은 현재식 기본값이 아니다.

## 현재의 핵심 개념

### 1. 첫 커밋의 본질은 "화면"이 아니라 "실험 가능한 앱 셸"이다

### 2. 과거의 Expo 셋업은 지금보다 native 디렉터리와 더 강하게 결합돼 있었다

### 3. 오늘의 대응 개념은 `create-expo-app` + CNG / prebuild + config plugin이다

### 4. 애니메이션 프로젝트에선 Reanimated와 gesture 런타임을 함께 준비하는 편이 좋다

## 추천 현재식 번역

- 새 프로젝트는 `create-expo-app`으로 시작한다.
- 애니메이션 학습용이면 Reanimated와 Gesture Handler를 초반에 함께 넣는다.
- custom native code가 실제로 필요해질 때 `expo prebuild` 또는 dev build를 연다.
- native 설정은 직접 수정 대신 config plugin / app config로 남긴다.
- 첫 커밋부터 최소한의 visible scaffold를 두어 런타임 확인 비용을 낮춘다.


## 스킬 추출 후보

### 트리거

- 새 Expo 기반 React Native 앱을 애니메이션/제스처 실험용 샌드박스로 시작할 때
- Reanimated, Gesture Handler 같은 native 의존성을 초반에 붙이려 할 때

### 권장 기본값

- `create-expo-app`으로 시작한다.
- `expo install`로 런타임 버전에 맞는 패키지를 붙인다.
- native customization이 실제로 필요해질 때만 `expo prebuild` 또는 dev build로 내려간다.
- 앱이 비어 있어도 최소 visible scaffold는 바로 둔다.

### 레거시 안티패턴

- 생성 직후의 `ios/` / `android/`를 당연한 기본값처럼 들고 가기
- `return null` 셸을 오래 유지하기
- config plugin으로 표현 가능한 설정을 native 파일 수동 수정으로 먼저 처리하기

### 예외 / 선택 기준

- 교육용 스냅샷 복원이나, 이미 native 디렉터리를 버전 관리해야 하는 프로젝트라면 예외가 가능하다.
- custom native module, build property, entitlement 조정이 실제 요구사항이면 prebuild를 빠르게 열어도 된다.

### 현재식 코드 스케치

```bash
npx create-expo-app my-animation-lab
cd my-animation-lab
npx expo install react-native-reanimated react-native-gesture-handler
# native customization이 실제로 필요할 때만
npx expo prebuild
```

```tsx
export default function App() {
  return <View style={{ flex: 1, backgroundColor: '#101418' }} />;
}
```

### 스킬 규칙 초안

- "애니메이션 중심 Expo 앱은 `create-expo-app`과 visible scaffold로 시작하고, native customization이 필요할 때만 prebuild를 연다."

## 관련 페이지

- [nomad-lang 애니메이션 학습 계획](nomad-lang-animation-study-plan.md)
- [Expo prebuild 흐름](expo-prebuild-flow.md)
- [RN 학습 워크플로우](../concepts/rn-study-workflow.md)

## 참고 자료

- [Expo - Create a project](https://docs.expo.dev/get-started/create-a-project/)
- [Expo - Add custom native code](https://docs.expo.dev/workflow/customizing/)
- [React Native Reanimated - Getting started](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)
- [React Native Gesture Handler - Integration with Reanimated](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/reanimated-interactions/)
- [React Native - Set Up Your Environment](https://reactnative.dev/docs/0.81/set-up-your-environment)
