# `#2.11 Configuring Stack Navigation` 현재식 해석

## 질문

- stack navigation은 어떤 props/options를 중심으로 설정하는 것이 좋은가.
- 지금 Expo Router + native stack 기준으로는 무엇이 best practice에 가까운가.

## 짧은 답

- 기본은 **native stack**
- 설정 방식 기본값은 **options-based API**
- 공통값은 `screenOptions`, 화면별 값은 `Stack.Screen options`, params에 따라 바뀌는 값은 route 파일 안에서 동적으로 설정

## `vercel-react-native-skills` 기준

- 이 스킬은 stack에서 JS navigator보다 native navigator를 우선하라고 본다.
- 따라서 현재 기준 기본 선택은:
  - `@react-navigation/native-stack`
  - 또는 Expo Router의 기본 `Stack`
- 반대로 JS `@react-navigation/stack`은 기본값으로 보지 않는다.

## Expo Router 공식 문서 기준

- Expo Router `Stack`는 native stack navigator를 감싼다.
- Expo 문서는 stack 옵션을 설정하는 두 방식을 설명한다.
  - options-based API
  - composition components API
- 하지만 composition components API는 문서 기준 alpha다.
- 따라서 안정적인 기본값으로는 아직 options-based API가 더 무난하다.

## 지금 기준 best practice

### 1. 공통 기본값은 `_layout`의 `screenOptions`에 둔다

- 헤더 tint
- 헤더 title style
- shadow 표시 여부
- 기본 배경색
- 공통 back button 정책

즉 "앱 전체 또는 섹션 전체의 기본값"을 여기에 둔다.

## 2. 정적인 화면별 옵션은 `_layout` 안의 `Stack.Screen`에 둔다

- 특정 화면만 `headerShown: false`
- 특정 상세 화면만 `title`
- 특정 route만 `presentation`
- 특정 route만 `headerLargeTitle`

즉 "이 route는 항상 이렇게 보인다" 같은 건 layout의 `Stack.Screen name=... options=...`에 둔다.

## 3. 동적으로 바뀌는 값은 해당 route 파일 안에서 설정한다

- params에 따라 제목이 바뀔 때
- 로딩된 데이터 이름으로 header title을 바꿀 때
- 현재 화면 상태에 따라 `headerRight`를 바꿀 때

이 경우 route 파일 안에서 `<Stack.Screen options={{ ... }} />`로 설정하는 편이 자연스럽다.

## 4. 커스텀 header 전체 교체보다 native header options를 먼저 쓴다

- `headerTitleStyle`
- `headerRight`
- `headerLeft`
- `headerLargeTitle`
- `headerShadowVisible`
- `presentation`
- `animation`

이런 기본 옵션으로 해결 가능한데도 `header: () => <CustomHeader />`로 통째로 바꾸는 건 가능한 한 늦게 간다.

## 5. 화면 구조와 옵션 책임을 섞지 않는다

- route 파일은 navigation option과 화면 UI를 같이 가질 수는 있다.
- 하지만 앱 전체 공통 정책까지 route 파일 안에 우겨 넣지는 않는다.
- 즉:
  - 앱 공통 = root `_layout`
  - 섹션 공통 = nested `_layout`
  - 화면 전용 = 해당 route file

## 6. theme/background는 stack 배경과 맞춘다

- Expo 문서도 흰 화면 flash 문제를 따로 설명한다.
- 앱 배경과 stack 배경이 안 맞으면 화면 전환 때 흰 번쩍임이 보일 수 있다.
- 그래서 `contentStyle`이나 theme provider로 배경을 맞추는 편이 안전하다.

## props를 어떻게 읽으면 좋은가

### 자주 쓰는 공통 props

- `screenOptions`
- `contentStyle`
- `headerTintColor`
- `headerTitleStyle`
- `headerShadowVisible`
- `headerBackButtonDisplayMode`

### 자주 쓰는 화면별 props

- `title`
- `headerShown`
- `headerRight`
- `headerLeft`
- `headerLargeTitle`
- `presentation`
- `animation`

## 대표 옵션 치트시트

### 1. 헤더를 없애고 싶을 때

- `headerShown: false`
- 탭 루트 화면처럼 상단 바가 필요 없는 곳에서 가장 자주 쓴다.

### 2. 제목과 색을 바꾸고 싶을 때

- `title`
- `headerTitle`
- `headerTintColor`
- `headerTitleStyle`
- `headerStyle`
- `headerShadowVisible`

즉 "상단 바의 텍스트/아이콘/배경색"은 대부분 이 조합 안에서 해결된다.

### 3. 오른쪽 버튼이나 왼쪽 버튼을 넣고 싶을 때

- `headerRight`
- `headerLeft`

실무에서는 검색, 저장, 편집, 더보기 버튼을 여기서 많이 붙인다.

### 4. iOS스러운 큰 헤더를 쓰고 싶을 때

- `headerLargeTitle`
- `headerLargeTitleStyle`
- `headerLargeStyle`

다만 large title은 scroll과 같이 써야 느낌이 제대로 난다.

### 5. 화면을 모달처럼 띄우고 싶을 때

- `presentation: 'modal'`
- `presentation: 'transparentModal'`
- `presentation: 'fullScreenModal'`

즉 push 화면이 아니라 "덮어서 띄우는 화면"은 `presentation` 쪽으로 생각하면 된다.

### 6. 전환 애니메이션을 바꾸고 싶을 때

- `animation`
- `animationDuration`

기본값은 native stack이 플랫폼스러운 애니메이션을 쓰고, 특별한 이유가 있을 때만 바꾼다.

### 7. 화면 배경이나 전환 중 배경색을 맞추고 싶을 때

- `contentStyle`

흰 플래시를 줄이거나 앱 전체 톤을 맞출 때 중요하다.

### 8. 뒤로가기 버튼 느낌을 다듬고 싶을 때

- `headerBackButtonDisplayMode`
- `headerBackTitleStyle`

보통 iOS에서 back title을 얼마나 드러낼지 조정할 때 많이 본다.

### 9. search bar를 헤더에 붙이고 싶을 때

- `headerSearchBarOptions`

검색 화면이나 목록 화면에서 native search bar 느낌을 살리고 싶을 때 쓴다.

### 10. drawer를 쓰고 싶을 때

- drawer는 stack prop이 아니다.
- drawer는 별도 navigator/layout다.
- Expo Router에선 보통 `Stack` 대신 해당 구간에 `Drawer` layout을 둔다.

즉:
- `headerShown`, `title`, `presentation`, `animation`은 stack option
- `drawer`는 stack option이 아니라 navigator 구조 선택

## 우리 워크스페이스에 바로 대입하면

- 현재 공통 stack 설정은 [`nomad-diary/app/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/_layout.js#L62)에 있다.
- 여기서 이미:
  - `contentStyle`
  - `headerBackButtonDisplayMode`
  - `headerTintColor`
  - `headerShadowVisible`
  - `headerTitleStyle`
  를 공통값으로 두고 있다.
- 그리고 상세 route [`entry/[slug]`](/Users/junho/project/RN_practice/nomad-diary/app/_layout.js#L74)에는:
  - `title`
  - `headerLargeTitle`
  - `headerLargeTitleStyle`
  - `headerLargeStyle`
  - `headerStyle`
  를 route 전용으로 두고 있다.
- 즉 지금 구조는 이미 best practice 쪽에 꽤 가깝다.

## 한 줄 기준

- **전역 기본값은 `screenOptions`**
- **정적 route 옵션은 layout의 `Stack.Screen options`**
- **동적 옵션은 route file 안의 `<Stack.Screen options={...} />`**
- **기본 stack 선택은 native stack**

## 열린 질문

- 이후 실제 다이어리 상세 화면에 `headerRight` 액션 버튼을 붙일 때, static options로 둘지 dynamic options로 둘지 한번 더 정리할 수 있다.
- Expo SDK 55+의 composition components API를 언제 받아들일지 별도 판단이 필요하다.


## 스킬 추출 후보

### 트리거

- stack header와 공통 옵션을 어디에 둘지 정해야 할 때

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

- "stack 설정의 기본값은 native stack + layout-level `screenOptions` + 화면별 `options` 분리다."

## 관련 페이지

- [native-stack-vs-js-stack](native-stack-vs-js-stack.md)
- [expo-router-stack-native-tabs](expo-router-stack-native-tabs.md)

## 참고 링크

- [Expo Router Stack](https://docs.expo.dev/router/advanced/stack/)
- [React Navigation Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator/)
- [vercel-react-native-skills navigation-native-navigators](/Users/junho/.agents/skills/vercel-react-native-skills/rules/navigation-native-navigators.md)
