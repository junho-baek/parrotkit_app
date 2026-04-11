# 네이티브 탭 아이콘과 Router ThemeProvider | Native Tab Icons and Router ThemeProvider

## 범위

- `nomadcoders/noovies`의 2021-09-15 커밋 `5d4b570` (`1.8 Tab Bar Icons`)가 실제로 무엇을 바꿨는지 좁게 해석한다.
- 이 문서는 레거시 `NavigationContainer theme + tabBarIcon` 예제를 현재 `nomad-diary`의 Expo Router 구조로 번역한 비교 메모다.
- 비교 기준은 2026-04-11에 확인한 Expo Router 공식 문서, React Navigation 공식 문서, [`vercel-react-native-skills`](/Users/junho/.agents/skills/vercel-react-native-skills/SKILL.md)다.

## 레거시 소스가 실제로 한 것

- `App.js`
  - `useColorScheme()`를 추가했다.
  - `NavigationContainer`에 `DarkTheme` 또는 `DefaultTheme`를 연결했다.
- `navigation/Tabs.js`
  - `Ionicons`를 import 했다.
  - `Movies`, `TV`, `Search` 각 `Tab.Screen`에 `tabBarIcon`을 추가했다.
  - 아이콘은 각각 `film-outline`, `tv-outline`, `search-outline`를 썼다.
- 즉 이 단계의 핵심은 "탭에 아이콘을 붙인다" 하나만이 아니라, "navigation container theme와 tab screen icon을 동시에 다듬는다"에 가깝다.

## 세 층 비교

| 항목 | 레거시 소스가 실제로 하는 방식 | 최신 권장 방식 | 현재 사용자가 선택한 방향 |
| --- | --- | --- | --- |
| root navigation theme | `NavigationContainer theme={...}` | Expo Router `app/`에서는 `ThemeProvider` 사용 | [`nomad-diary/app/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/_layout.js)에서 `ThemeProvider`로 `Stack` 감쌈 |
| theme source | `useColorScheme()` 결과를 바로 `DarkTheme` / `DefaultTheme`에 연결 | app token과 navigation theme를 같은 source에서 파생 | [`nomad-diary/core/theme.js`](/Users/junho/project/RN_practice/nomad-diary/core/theme.js)에서 app token과 navigation theme 둘 다 생성 |
| 탭 구현 | JS `@react-navigation/bottom-tabs` | native tabs 우선 | [`nomad-diary/app/(tabs)/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/_layout.js)에서 `NativeTabs` 사용 |
| 아이콘 선언 위치 | `Tab.Screen options.tabBarIcon` | `NativeTabs.Trigger` 안의 icon component | `Icon` + `VectorIcon` 조합으로 명시 |
| 아이콘 색 주입 | `tabBarIcon({ color, size })` 인자 사용 | native tabs `tintColor`, `iconColor`와 icon source 조합 | theme token으로 selected/default 색 지정 |
| header 구조 | bottom tabs가 헤더 느낌 일부를 같이 가짐 | native tabs 안쪽에 native stack을 같이 둠 | 루트 `Stack`이 header 담당 |
| SDK 최신 포인트 | 해당 없음 | SDK 55+는 `NativeTabs.Trigger.Icon`과 Android `md` prop 권장 | 현재 SDK 54라 기존 `Icon` API 유지 |

## 최신 문서와 스킬에서 배울 점

### 1. Expo Router에서는 `NavigationContainer` 대신 `ThemeProvider`

- Expo Router 공식 마이그레이션 문서는 React Navigation에서 `NavigationContainer`에 theme를 줬다면, Expo Router에서는 root container를 Router가 관리하므로 `ThemeProvider`를 직접 쓰라고 설명한다.
- 따라서 과거 `App.js`의 theme 연결은 사라진 것이 아니라 root layout provider로 자리를 옮긴 것이다.

### 2. native tabs는 JS tabs의 `tabBarIcon`을 그대로 복사하는 구조가 아니다

- `vercel-react-native-skills`는 JS navigator보다 native navigator를 우선하라고 권장한다.
- Expo native tabs 문서도 `Trigger` 기반으로 아이콘과 라벨을 구성하는 구조를 기본값으로 둔다.
- 그래서 과거의 `tabBarIcon` 콜백을 현재로 번역할 때는 "options prop"보다 "Trigger 안의 icon component"라는 위치 변화가 더 중요하다.

### 3. 현재 SDK 버전에 맞는 API를 선택해야 한다

- 최신 Expo native tabs 문서는 SDK 55+에서 `NativeTabs.Trigger.Icon`과 Android `md` prop을 권장한다.
- 하지만 현재 `nomad-diary`는 Expo SDK 54이므로, 지금은 `Icon`, `Label`, `VectorIcon` import 조합을 유지하는 것이 맞다.
- 즉 "최신 권장"과 "현재 프로젝트에서 당장 적용 가능한 것"을 분리해서 읽는 습관이 필요하다.

## 이번 구현

- [`nomad-diary/core/theme.js`](/Users/junho/project/RN_practice/nomad-diary/core/theme.js)
  - app token에서 파생된 React Navigation theme 생성 함수를 추가했다.
- [`nomad-diary/app/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/_layout.js)
  - `ThemeProvider`를 루트 layout에 추가해서 Expo Router 구조에서 navigation theme를 주입했다.
- [`nomad-diary/app/(tabs)/index.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/index.js)
  - `useTheme()`로 provider가 실제로 연결되었는지 보여주는 상태 pill을 추가했다.
  - 홈 화면의 비교 문구를 이번 커밋 기준으로 갱신했다.
- [`nomad-diary/app/(tabs)/study.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/study.js)
  - `ThemeProvider`, `NativeTabs`, icon API 차이를 중심으로 학습 포인트를 갱신했다.
- [`nomad-diary/core/noovies-dark-mode-study.js`](/Users/junho/project/RN_practice/nomad-diary/core/noovies-dark-mode-study.js)
  - `theme-provider-router`, `native-tab-icons` entry를 추가해 동적 상세 화면에서 읽을 수 있게 했다.

## 해석

- `5d4b570`에서 살아남는 개념은 두 가지다.
  - navigation 전체에 theme를 주입한다.
  - 각 탭의 의미를 아이콘으로 명확히 드러낸다.
- 바뀐 것은 구현 위치다.
  - `NavigationContainer` theme는 `ThemeProvider`
  - `tabBarIcon`은 `NativeTabs.Trigger` icon tree
- 그래서 이 커밋을 현재식으로 읽을 때는 "같은 아이디어가 Router 시대에 어디로 이동했는가"를 보는 편이 정확하다.

## 열린 질문

- Expo SDK 55 이상으로 올릴 때 `NativeTabs.Trigger.Icon`과 Android `md` prop으로 아이콘 코드를 단순화할지 검토할 수 있다.
- 이후 `Search` 같은 별도 탭을 추가할 때 native tabs의 `role="search"`나 badge를 학습 대상으로 이어갈 수 있다.


## 스킬 추출 후보

### 트리거

- tab icon 색과 Router ThemeProvider를 같은 theme source로 맞춰야 할 때

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

- "tab icon 색과 Router theme는 같은 color token source를 바라보게 만든다."

## 관련 페이지

- [색상 스킴 기반 내비게이션 테마](color-scheme-driven-navigation-theming.md)
- [expo-router-stack-native-tabs](expo-router-stack-native-tabs.md)
- [configuring-stack-navigation-best-practices](configuring-stack-navigation-best-practices.md)

## 참고 링크

- [noovies commit 5d4b570](https://github.com/nomadcoders/noovies/commit/5d4b570)
- [Expo Router migrate from React Navigation](https://docs.expo.dev/router/migrate/from-react-navigation/)
- [Expo Router native tabs](https://docs.expo.dev/router/advanced/native-tabs/)
- [React Navigation themes](https://reactnavigation.org/docs/themes/)
- [vercel-react-native-skills navigation-native-navigators](/Users/junho/.agents/skills/vercel-react-native-skills/rules/navigation-native-navigators.md)
