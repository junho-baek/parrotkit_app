# Expo Router `Stack + NativeTabs` 현재 선택 메모

## 범위

- `nomad-diary`의 현재 내비게이션 선택을 기록한다.
- 목표는 "루트 stack + 최상위 native tabs + 동적 상세 route" 조합으로 하단 탭바까지 iOS 시스템 느낌을 살리는 것이다.

## 적용한 구조

- 진입점은 [`nomad-diary/index.js`](/Users/junho/project/RN_practice/nomad-diary/index.js)에서 `expo-router/entry`로 넘긴다.
- 루트 레이아웃은 [`nomad-diary/app/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/_layout.js)에 둔다.
- 최상위 섹션은 [`nomad-diary/app/(tabs)/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/_layout.js)에서 `NativeTabs`로 정의한다.
- 상세 화면은 [`nomad-diary/app/entry/[slug].js`](/Users/junho/project/RN_practice/nomad-diary/app/entry/[slug].js)처럼 파일 기반 동적 route로 만든다.

## 왜 이렇게 나눴나

- `Stack`은 push, modal, detail 같은 흐름을 맡기기 좋다.
- `NativeTabs`는 앱의 최상위 섹션을 시스템 탭바로 나누고 싶을 때 자연스럽다.
- 루트 `_layout`은 splash 제어, 폰트 preload, asset preload, provider 설치 같은 앱 셸 역할을 맡기기 좋다.
- 이번 선택에서는 하단 탭바의 시스템 느낌이 중요해서, stable `Tabs`로의 임시 회귀보다 `NativeTabs`를 우선했다.

## 최신 기준 해석

- Expo Router는 React Navigation 위에 올라간 파일 기반 라우터다.
- `Stack`는 native stack을 사용하므로 iOS에서는 `UINavigationController` 계열의 네이티브 헤더와 제스처 감각을 받는다.
- Expo 문서는 iOS 26부터 stack header가 시스템의 Liquid Glass 효과를 기본 채택한다고 설명한다.
- `NativeTabs`는 Expo Router의 alpha 기능이지만, 시스템 탭바를 직접 쓰고 싶을 때 현재 가장 "플랫폼스러운" 선택지다.
- 따라서 상단 헤더만이 아니라 하단 탭까지 iOS 감각을 밀어붙이고 싶다면, 현재 Expo Router에선 `NativeTabs`가 더 잘 맞는다.

## 현재 샌드박스에서 보는 포인트

- 홈 탭 [`nomad-diary/app/(tabs)/index.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/index.js)에서 상세 route를 push 한다.
- 상세 화면에서 보이는 헤더가 바로 Expo Router stack을 통한 네이티브 헤더 감각이다.
- 탭 이동은 파일명 기준으로 일어나고, 상세 path는 `/entry/[slug]` 패턴으로 읽힌다.
- 하단 탭바는 stable Tabs보다 더 시스템 탭바에 가까운 시각 감각을 준다.
- Android에서는 `md` glyph 이름만 넘기는 방식보다 `androidSrc`에 `VectorIcon`을 명시하는 쪽이 현재 샌드박스에서 더 예측 가능했다.
- 이 방식은 임시 땜질이라기보다, Expo NativeTabs가 공식적으로 제공하는 Android icon 입력 경로(`drawable`, `md`, `androidSrc`, `VectorIcon`) 중 하나를 선택한 것이다.
- 다만 선택 상태의 배경, 포커스 강조, 아이콘 두께감은 시스템 탭바 쪽 결정권이 커서 Android에서는 "정석적이지만 조금 덜 예쁜" 순간이 생길 수 있다.
- 그래서 현재 워크스페이스에서는 Android에 한해 default/selected 색, indicator, ripple 톤을 더 잔잔하게 분리해서 시스템 느낌은 유지하되 포커스된 인상을 부드럽게 다듬었다.

## 사용 추천 기준

- 앱의 top-level section이 뚜렷하다면 `NativeTabs`
- 상세 화면 push, modal, back gesture가 중요하다면 `Stack`
- 콘텐츠 id나 slug 기반 상세 화면이 많다면 동적 파일 route
- 앱 전체 preload와 splash 제어가 필요하면 루트 `_layout`

## 주의점

- `NativeTabs`는 아직 alpha라서 API 변화 가능성을 염두에 둔다.
- custom deep link scheme를 바꿨다면 네이티브 shell에 반영하려면 dev build 재생성이 필요할 수 있다.
- `App.js` 중심 사고에서 `app/` 폴더 중심 사고로 바뀌므로, 라우팅과 앱 셸 책임이 분리된다는 점을 의식한다.
- 기존 Expo 샌드박스에 Router를 나중에 붙일 때는 `babel.config.js`와 Metro cache가 꼬이면 `EXPO_ROUTER_APP_ROOT` 에러가 날 수 있다.
- 이 경우 Expo troubleshooting 문서 기준으로 Babel preset / router plugin을 맞추고 `npx expo start --clear`로 캐시를 지우는 쪽이 우선이다.
- 기존 native 디렉터리가 이미 있는 상태에서는 iOS와 Android dev client가 서로 다른 scheme를 들고 있을 수 있다.
- 이때는 개발 서버를 `expo start --dev-client --scheme <shared-scheme>`처럼 명시적으로 띄우면 자동 실행 혼선을 줄일 수 있다.
- 즉 현재 선택은 "안정성 최우선"보다 "플랫폼 감각 우선"에 조금 더 기운 결정이다.
- Android native tabs 아이콘이 비거나 어색하게 보이면 iOS와 Android의 아이콘 입력 방식을 분리해서 보는 편이 안전하다.
- 따라서 현재 워크스페이스에서는 `sf + androidSrc(<VectorIcon />)` 조합을 "공식 API 안에서 고른 실무적 해결"로 보는 편이 맞다.
- 반대로 선택 상태의 시각 완성도를 픽셀 단위로 통제하고 싶다면, 그 순간부터는 native tabs보다 JS tabs가 더 다루기 쉬울 수 있다.

## 참고 링크

- [Expo Router manual installation](https://docs.expo.dev/router/installation/)
- [Expo Router Stack](https://docs.expo.dev/router/advanced/stack/)
- [Expo Router Native tabs](https://docs.expo.dev/router/advanced/native-tabs/)
- [React Navigation Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator/)

## 스킬 추출 후보

### 트리거

- Expo Router에서 루트 stack과 native tabs owner를 잡아야 할 때

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

- "루트 navigation 구조는 stack이 outer shell, native tabs가 tab owner가 되는 구성을 기본값으로 삼는다."

