# Expo 저널 샌드박스 부트스트랩 | Expo Journal Sandbox Bootstrap

## 범위

- `nomadcoders/nomad-diary`의 2021-09-26 커밋 `9e41fb5` (`4.0 Introduction`)를 현재 Expo / React Native 기준으로 다시 읽는다.
- 특히:
  - 이 앱의 출발점이 어떤 레거시 Expo 셸이었는지
  - 이후 local DB / ads / layout animation 예제로 자라기 전에 어떤 토대가 깔렸는지
  - 지금 새 프로젝트를 시작하면 무엇이 달라지는지
  를 함께 정리한다.

## 레거시 커밋이 실제로 한 것

- Expo 42 + React Native 0.63 기반의 기본 앱 셸을 만들었다.
- `App.js`에는:
  - 중앙 정렬된 `View`
  - 텍스트 하나
  - `expo-status-bar`
  만 있는 기본 화면이 들어 있다.
- `package.json`에는:
  - `expo`
  - `react-native`
  - `@react-navigation/native`
  - `@react-navigation/native-stack`
  - `styled-components`
  등이 미리 들어가 있다.

즉 아직 저널 앱이라기보다, "이제 여기서 화면과 기능을 쌓아 올릴 준비가 된 Expo 샌드박스" 단계다.

## 현재 대응 개념

- 지금 이 단계의 대응 개념은 "앱 셸 부트스트랩"이다.
- 2026 기준으로는 보통:
  - `create-expo-app`
  - TypeScript
  - Expo Router 또는 native stack
  - `expo-splash-screen`
  - local-first면 `expo-sqlite`
  같은 현재식 기본값을 더 빨리 고른다.
- 이 커밋이 보여주는 핵심은 기능이 아니라,
  "local data, navigation, ads 같은 native boundary가 결국 build-time choice가 된다"는 출발점이다.

## 현재 기준 베스트 프랙티스

### 1. 앱 셸 단계에서 storage 방향을 먼저 정한다

- 단순 key-value인지
- 온디바이스 query/transaction이 필요한지
- 나중에 sync 가능성까지 볼지

를 초기에 나누면 나중에 갈아엎는 비용이 줄어든다.

### 2. 시작점부터 TypeScript와 최신 Expo baseline을 쓰는 편이 낫다

- 이 레거시 커밋은 JavaScript + Expo 42 조합이다.
- 지금은 새 학습 프로젝트라도 TypeScript와 최신 Expo SDK를 기본값으로 잡는 편이 후속 문서화와 재사용에 유리하다.

### 3. launch gating은 `expo-app-loading`보다 splash control 흐름으로 읽는다

- 지금 Expo 기준으론 앱 준비 전 로딩 제어를
  [`expo-splash-screen`](https://docs.expo.dev/versions/latest/sdk/splash-screen/)
  으로 다루는 편이 기본이다.

## 스킬 추출 후보

- 트리거:
  - 새 RN/Expo 학습 샌드박스를 열 때
  - local-first 예제를 시작할 때
- 권장 기본값:
  - 최신 Expo
  - TypeScript
  - navigation / storage / splash strategy를 초기에 명시
- 레거시 안티패턴:
  - 기본 셸만 만들고 storage / native module 경계를 나중에 우연히 정하기
- 예외 / 선택 기준:
  - 진짜 한 파일 데모면 가볍게 시작해도 되지만,
    local data나 ads를 붙일 예정이면 초기에 native boundary를 결정하는 편이 낫다
- 현재식 코드 스케치:

```tsx
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  return null;
}
```

- 스킬 규칙 초안:
  - `local-first-or-native-sdk-projects-decide-storage-boundary-at-bootstrap`

## 관련 페이지

- [nomad-diary 로컬 데이터 학습 계획](nomad-diary-local-data-study-plan.md)
- [기기 로컬 객체 DB 부트스트랩](device-local-object-db-bootstrap-with-realm.md)

