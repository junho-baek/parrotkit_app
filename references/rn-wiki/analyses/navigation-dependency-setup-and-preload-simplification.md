# 내비게이션 의존성 준비와 preload 단순화 | Navigation Dependency Setup and Preload Simplification

## 범위

- `nomadcoders/noovies`의 2021-09-13 커밋 `e79282f` (`1.4 Navigation Introduction`)가 실제로 무엇을 바꿨는지 좁게 해석한다.
- 이 문서는 레거시 코스의 한 커밋을 현재 Expo / React Native 학습 맥락으로 번역하는 분석 메모다.

## 사실

- GitHub 커밋 화면 기준 이 커밋에서 바뀐 tracked file은 4개뿐이다.
  - `App.js`
  - `package.json`
  - `package-lock.json`
  - `ios/Podfile.lock`
- 즉, 이 커밋에서는 새로운 screen 파일이나 navigator 파일이 추가되지 않았다.
- `package.json`에서는 `@react-navigation/native`가 추가되고, `react-native-safe-area-context`가 dependency에 들어간다.
- `App.js`에서는 `useAssets` 기반 로컬 이미지 preload와 `Image.prefetch` 기반 원격 이미지 preload를 빼고, 폰트 preload만 남긴다.
- `ios/Podfile.lock` 변화는 `react-native-safe-area-context`가 iOS pod로 연결되었음을 보여준다.
- `package-lock.json` 변화는 위 dependency 추가에 따른 lockfile 갱신이다.

## 해석

- 커밋 제목은 "Navigation Introduction"이지만, 실제 내용은 "내비게이션을 쓰기 위한 의존성 준비 + 기존 preload 코드 단순화"에 가깝다.
- 즉 이 커밋은 navigator 구현 자체보다, 다음 커밋에서 내비게이션을 붙일 수 있도록 바닥을 까는 단계다.
- 이 단계에서 바뀐 레이어를 나누면 다음과 같다.
  - Expo / JS 레이어: `App.js`, `package.json`, `package-lock.json`
  - iOS 네이티브 레이어: `ios/Podfile.lock`
- Android 네이티브 파일이 안 보이는 이유는, 이 커밋에서 수동 Android 설정 파일을 건드리지 않았기 때문이다.
  - 하지만 `react-native-safe-area-context` 자체는 Android에서도 native dependency다.
  - 다만 이 커밋 화면에서는 Android 쪽 tracked config 변경이 없어서 diff에 드러나지 않는다.

## 왜 preload를 줄였나

- 이전 단계에서는 `expo-app-loading` 안에서 폰트, 로컬 이미지, 원격 이미지를 같이 preload했다.
- 그런데 내비게이션을 설명하는 단계에서는 첫 진입 로딩 복잡도를 줄이는 편이 이해가 쉽다.
- 그래서 이 커밋은 "이미지 preload 학습"에서 "navigation 준비"로 포커스를 옮기면서, `App.js`를 더 단순하게 만든 것으로 읽는 게 자연스럽다.

## 최신 기준 비교

- 2026 기준 Expo 문서는 새 Expo 프로젝트에 `Expo Router`를 기본 추천한다.
- 반면 React Navigation 문서는 여전히 유효하고, 특히 navigator 개념 자체를 배우기에는 직접적이다.
- React Native 성능/UX 관점에서는 JavaScript stack보다 native stack을 우선 고려하는 편이 좋다.

## 지금 기준으로 적용하면 좋은 방향

### 1. 코스 개념을 그대로 따라가며 배우고 싶을 때

- `React Navigation`을 쓰는 편이 좋다.
- 다만 2021식 조합 대신 최신 기본값으로 가져간다.
  - `@react-navigation/native`
  - `@react-navigation/native-stack`
  - `react-native-screens`
  - `react-native-safe-area-context`
- 이유:
  - 코스가 설명하는 `NavigationContainer`, stack, screen 등록 개념을 그대로 체감할 수 있다.
  - `native-stack`은 현재 React Navigation 쪽에서 더 네이티브스럽고 부드러운 전환을 제공한다.

### 2. 새 Expo 앱을 실제로 만들고 싶을 때

- `Expo Router`를 우선 고려하는 편이 좋다.
- 이유:
  - Expo 문서 기준 새 프로젝트 기본값이다.
  - 파일 기반 라우팅, 자동 deep link, Expo CLI 통합이 기본 제공된다.
  - React Navigation 위에 올라가므로, 나중에 React Navigation 개념과도 이어진다.

## 현재 워크스페이스에 추천하는 선택

- `nomad-diary`는 Expo 샌드박스이므로, "최신 Expo 방식"을 체험하려면 `Expo Router`가 자연스럽다.
- 하지만 지금처럼 코스 커밋을 하나씩 해설하며 배우는 단계에서는 `React Navigation + native-stack`이 더 학습 친화적이다.
- 정리하면:
  - 개념 학습: React Navigation
  - 새 Expo 앱 기본 뼈대: Expo Router

## 최신 React Navigation 적용 메모

- React Navigation 공식 시작 문서 기준:
  - `npm install @react-navigation/native`
  - `npx expo install react-native-screens react-native-safe-area-context`
- native stack은 별도로:
  - `npm install @react-navigation/native-stack`
- Android에서는 `react-native-screens` 관련 추가 설정이 필요할 수 있고, React Navigation 문서는 `MainActivity` 구성과 predictive back opt-out도 함께 안내한다.

## 열린 질문

- 다음 학습 단계에서 `nomad-diary`에 실제로 붙일 것은 `React Navigation`으로 할지, `Expo Router`로 할지 선택이 필요하다.
- 코스 흐름을 최대한 보존할지, 아니면 최신 Expo 기본 흐름으로 재해석할지에 따라 다음 파일 구조가 달라진다.


## 스킬 추출 후보

### 트리거

- 내비게이션 의존성을 준비하면서 preload 흐름도 함께 단순화해야 할 때

### 권장 기본값

- 공통 navigator 옵션은 layout의 `screenOptions`에 두고, 화면별 차이는 `options` 또는 route-level callback으로 분리한다.
- 기본 stack은 native stack을 우선 검토한다.
- stack, tabs, modal은 역할 단위로 owner를 나눈다.

### 레거시 안티패턴

- JS stack을 관성적으로 기본값처럼 유지하기
- 헤더 옵션을 각 화면 body에서 중복 선언하기

### 예외 / 선택 기준

- 강의 재현이나 레거시 유지보수에선 JS stack 조합도 설명용으론 허용된다.

### 현재식 코드 스케치

```tsx
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerBackTitleVisible: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="detail" options={{ presentation: 'card' }} />
    </Stack>
  );
}
```

### 스킬 규칙 초안

- "navigation setup과 preload는 분리하되, 앱 셸이 너무 무거워지기 전에 최소 visible scaffold로 검증한다."

## 관련 페이지

- [expo-preload-patterns](expo-preload-patterns.md)
- [expo-prebuild-flow](expo-prebuild-flow.md)
- [rn-setup-status](rn-setup-status.md)

## 참고 링크

- [noovies commit e79282f](https://github.com/nomadcoders/noovies/commit/e79282f)
- [React Navigation getting started](https://reactnavigation.org/docs/getting-started/)
- [Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator/)
- [Expo app navigation](https://docs.expo.dev/develop/app-navigation/)
