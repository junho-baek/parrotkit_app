# 색상 스킴 기반 내비게이션 테마 | Color-Scheme-Driven Navigation Theming

## 범위

- `nomadcoders/noovies`의 2021-09-15 커밋 `75bb483` (`1.7 Dark Mode`)가 실제로 무엇을 바꿨는지 좁게 해석한다.
- 이 문서는 레거시 `Tab.Navigator` 다크 모드 예제를 현재 `nomad-diary`의 Expo Router 구조로 번역한 비교 메모다.
- 비교 기준은 2026-04-11에 확인한 공식 React Native / Expo 문서와 [`vercel-react-native-skills`](/Users/junho/.agents/skills/vercel-react-native-skills/SKILL.md)다.

## 레거시 소스가 실제로 한 것

- GitHub 커밋 화면 기준으로 변경 파일은 `colors.js`와 `navigation/Tabs.js` 두 개다.
- `colors.js`에 네 가지 palette 상수를 추가했다.
  - `YELLOW_COLOR = "#ffa801"`
  - `BLACK_COLOR = "#1e272e"`
  - `DARK_GREY = "#d2dae2"`
  - `LIGHT_GREY = "#808e9b"`
- `navigation/Tabs.js`는 `useColorScheme()`로 dark 여부를 읽고, `Tab.Navigator` 수준에서 다음 옵션을 바꿨다.
  - `sceneContainerStyle.backgroundColor`
  - `tabBarStyle.backgroundColor`
  - `tabBarActiveTintColor`
  - `tabBarInactiveTintColor`
  - `headerStyle.backgroundColor`
  - `headerTitleStyle.color`
- 즉 이 단계의 핵심은 "다크 모드 전용 navigator를 새로 만든다"가 아니라 "기존 navigator 옵션을 시스템 색상 scheme에 연결한다"에 가깝다.

## 세 층 비교

| 항목 | 레거시 소스가 실제로 하는 방식 | 최신 권장 방식 | 현재 사용자가 선택한 방향 |
| --- | --- | --- | --- |
| navigator 종류 | JS `@react-navigation/bottom-tabs` | native stack / native tabs 우선 | [`nomad-diary/app/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/_layout.js) + [`nomad-diary/app/(tabs)/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/_layout.js) |
| dark mode 입력 | `useColorScheme()` 결과를 바로 navigator style에 연결 | `useColorScheme()`는 유지하되 공통 theme token으로 먼저 묶기 | [`nomad-diary/core/theme.js`](/Users/junho/project/RN_practice/nomad-diary/core/theme.js)에서 light/dark token 관리 |
| 색상 저장 위치 | `colors.js` 상수 4개 | design token 또는 theme object | `core/theme.js`의 `colors` 객체 |
| 헤더 owner | 같은 `Tab.Navigator` 안에서 헤더 색도 같이 조정 | native stack이 헤더 담당 | 루트 `Stack`이 header 색과 title 색 담당 |
| 탭 색 적용 위치 | `tabBarActiveTintColor`, `tabBarInactiveTintColor` | native tabs의 `tintColor`, `iconColor`, `labelStyle` | `NativeTabs`에 token 기반 색 연결 |
| 다크 모드 범위 | 탭바, scene background, header 중심 | screen surface, CTA, text hierarchy까지 함께 보기 | 홈/스터디/상세 화면 카드와 버튼까지 다 같이 전환 |
| 학습 콘텐츠 배치 | navigation 파일 안에 설명이 암묵적으로 섞임 | route와 content/data 분리 선호 | [`nomad-diary/core/noovies-dark-mode-study.js`](/Users/junho/project/RN_practice/nomad-diary/core/noovies-dark-mode-study.js)로 학습 내용을 route 밖에 둠 |

## 최신 문서와 스킬에서 배울 점

### 1. `useColorScheme()` 자체는 아직도 현재식이다

- React Native 공식 문서는 여전히 `useColorScheme()`를 현재 사용자 선호 테마를 읽는 표준 훅으로 둔다.
- 따라서 `75bb483`의 출발점 자체가 낡은 것은 아니다.
- 다만 지금은 hook 결과를 개별 style에 직접 흩뿌리기보다 공통 token 레이어로 한번 모아두는 편이 유지보수에 유리하다.

### 2. 탭과 헤더는 native navigator로 책임을 나누는 편이 더 자연스럽다

- Expo Router native tabs 문서는 `expo-router/unstable-native-tabs`를 플랫폼 native system tabs를 그리는 수단으로 설명한다.
- `vercel-react-native-skills`도 JS navigator보다 native navigator를 우선하라고 명시한다.
- 그래서 2021식 `Tab.Navigator` 한 곳에서 탭과 헤더를 같이 꾸미는 방식보다, 2026식 `Stack + NativeTabs` 분리가 더 잘 맞는다.

### 3. safe area와 scroll inset은 native 동작을 믿는 편이 좋다

- Expo native tabs 문서는 iOS에서 첫 `ScrollView`에 automatic content inset adjustment가 적용된다고 설명한다.
- `vercel-react-native-skills`도 root `ScrollView`에 `contentInsetAdjustmentBehavior="automatic"`를 쓰라고 권장한다.
- 현재 `nomad-diary`의 각 screen이 이미 이 패턴을 쓰고 있어서, 이번 다크 모드 번역은 색만 바꾸는 실습이 아니라 native layout 습관을 유지하는 실습이기도 하다.

## 이번 구현

- [`nomad-diary/core/theme.js`](/Users/junho/project/RN_practice/nomad-diary/core/theme.js)
  - light/dark token을 한 파일에 모았다.
  - dark theme는 레거시 `BLACK_COLOR`, `YELLOW_COLOR`, `DARK_GREY`, `LIGHT_GREY` 의도를 현재 palette로 다시 배치했다.
- [`nomad-diary/app/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/_layout.js)
  - `Stack` header, large title, background, `StatusBar`가 theme token을 공유하도록 바꿨다.
- [`nomad-diary/app/(tabs)/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/_layout.js)
  - `NativeTabs`가 탭 background, selected/default tint, ripple을 token 기반으로 읽도록 정리했다.
- [`nomad-diary/app/(tabs)/index.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/index.js)
  - 이번 비교의 핵심 차이와 entry 링크를 홈 화면 콘텐츠로 넣었다.
- [`nomad-diary/app/(tabs)/study.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/study.js)
  - 최신 코드에서 무엇을 배워야 하는지 학습 카드로 정리했다.
- [`nomad-diary/app/entry/[slug].js`](/Users/junho/project/RN_practice/nomad-diary/app/entry/[slug].js)
  - 비교 메모를 동적 entry 상세 화면에서 읽을 수 있게 만들었다.
- [`nomad-diary/core/noovies-dark-mode-study.js`](/Users/junho/project/RN_practice/nomad-diary/core/noovies-dark-mode-study.js)
  - route 밖에서 study content를 관리하도록 분리했다.

## 해석

- `75bb483`가 알려주는 가장 중요한 개념은 "시스템 theme를 앱 chrome에 연결한다"는 생각이다.
- 최신 코드가 추가로 요구하는 것은 "연결 지점을 한 navigator 옵션에 몰지 말고, app shell 전체가 공유하는 token 레이어를 둔다"는 구조적 선택이다.
- 즉 개념은 그대로 살아 있고, 구현 수단만 바뀌었다고 보는 편이 정확하다.

## 열린 질문

- 다음 단계에서 `expo-image`를 붙여 이미지 계층까지 현재식으로 현대화할지 결정이 필요하다.
- `study content`가 더 늘어나면 `core/`에서 `features/study/`로 옮겨도 좋을지 검토할 수 있다.


## 스킬 추출 후보

### 트리거

- 시스템 다크 모드에 맞춰 탭/헤더/scene background를 함께 바꿔야 할 때

### 권장 기본값

- 색상 스킴은 `useColorScheme()`에서 읽되, 실제 navigator option에는 공통 theme token을 통해 넣는다.
- header, tab, scene background 책임을 분리한다.
- 새 구조에선 Expo Router `Stack` + `NativeTabs`를 우선 검토한다.

### 레거시 안티패턴

- 탭 navigator 하나가 header와 theme까지 전부 떠안게 두기
- 색상 상수를 screen 파일마다 흩뿌리기

### 예외 / 선택 기준

- 작은 학습용 navigator 데모에선 JS tabs 옵션만으로 보여줘도 된다.

### 현재식 코드 스케치

```tsx
const scheme = useColorScheme();
const colors = theme[scheme ?? 'light'];

return (
  <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
    <Stack
      screenOptions={{
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.bg },
      }}
    />
  </ThemeProvider>
);
```

### 스킬 규칙 초안

- "내비게이션 테마는 `useColorScheme()` 입력을 공통 theme token으로 변환해 stack과 tabs에 나눠 적용한다."

## 관련 페이지

- [네이티브 내비게이션의 공통 탭/헤더 옵션](shared-tab-and-header-options-in-native-navigation.md)
- [expo-router-stack-native-tabs](expo-router-stack-native-tabs.md)
- [expo-router-domain-file-organization](expo-router-domain-file-organization.md)

## 참고 링크

- [noovies commit 75bb483](https://github.com/nomadcoders/noovies/commit/75bb483)
- [React Native `useColorScheme`](https://reactnative.dev/docs/next/usecolorscheme)
- [React Native `ScrollView`](https://reactnative.dev/docs/next/scrollview)
- [Expo Router native tabs](https://docs.expo.dev/versions/latest/sdk/router-native-tabs/)
- [vercel-react-native-skills navigation-native-navigators](/Users/junho/.agents/skills/vercel-react-native-skills/rules/navigation-native-navigators.md)
- [vercel-react-native-skills ui-safe-area-scroll](/Users/junho/.agents/skills/vercel-react-native-skills/rules/ui-safe-area-scroll.md)
