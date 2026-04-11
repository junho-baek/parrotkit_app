# 네이티브 내비게이션의 공통 탭/헤더 옵션 | Shared Tab and Header Options in Native Navigation

## 범위

- `nomadcoders/noovies`의 2021-09-15 커밋 `3489af6` (`1.6 Configuring the Navigation`)가 무엇을 설명하고 구현했는지 좁게 해석한다.
- 이 문서는 레거시 React Navigation 탭 설정 예제를 현재 `Expo Router + Stack + NativeTabs` 학습 맥락으로 번역하는 비교 메모다.

## 레거시 소스가 실제로 한 것

- GitHub 커밋 화면 기준 이 커밋에서 바뀐 tracked file은 `navigation/Tabs.js` 하나뿐이다.
- `Tab.Navigator`에 `screenOptions`를 추가해서 공통 탭/헤더 스타일을 넣었다.
- 추가된 설정은 다음 다섯 가지다.
  - `tabBarStyle`
  - `tabBarActiveTintColor`
  - `tabBarInactiveTintColor`
  - `headerTitleStyle`
  - `headerRight`
- `Movies`, `Tv`, `Search` 세 화면 구성 자체는 그대로고, 이 단계에서는 화면 이동 구조보다 navigator 옵션을 어디에 주는지가 핵심이다.

## 이 강의가 설명한 개념

- 이미 만들어진 bottom tabs navigator를 "공통 옵션"으로 꾸미는 법을 보여준다.
- 즉 이 강의의 핵심은 "탭을 만든다"가 아니라 "`screenOptions`로 navigator 전체 기본값을 준다"에 가깝다.
- `tomato`, `red`, `purple`, `Hello` 같은 눈에 띄는 값은 예쁘게 만들기 위한 선택이라기보다, 어떤 옵션이 어디에 반영되는지 바로 확인시키기 위한 데모 값으로 읽는 편이 자연스럽다.

## 세 층 비교

| 항목 | 레거시 소스가 실제로 하는 방식 | `vercel-react-native-skills` 기준 최신 권장 | 현재 사용자가 선택한 방향 |
| --- | --- | --- | --- |
| 탭 navigator | `@react-navigation/bottom-tabs`의 JS `Tab.Navigator` | native tabs 우선. Expo라면 `expo-router` native tabs 쪽이 더 권장된다. | [`nomad-diary/app/(tabs)/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/_layout.js)에서 `NativeTabs` 사용 |
| 헤더 owner | 탭 navigator가 헤더까지 같이 관리 | native stack / Expo Router `Stack`이 헤더를 맡는 편이 좋다. | [`nomad-diary/app/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/_layout.js)에서 루트 `Stack`이 헤더 담당 |
| 공통 탭 스타일 위치 | `Tab.Navigator screenOptions` | 공통 옵션 자체는 여전히 유효하지만, 탭과 헤더 책임을 분리한다. | 탭 쪽은 [`app/(tabs)/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/_layout.js), 헤더 쪽은 [`app/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/_layout.js) |
| 활성/비활성 색 | `tabBarActiveTintColor`, `tabBarInactiveTintColor` | native tabs에선 `tintColor`, `iconColor`, `labelStyle` 조합으로 대응 | 현재 Android는 default/selected 색을 분리해서 보정했고, iOS는 시스템 tint를 따른다 |
| 헤더 제목 스타일 | `headerTitleStyle` | native header option으로 주는 것이 좋다 | [`app/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/_layout.js#L63)에서 `headerTitleStyle` 사용 |
| 헤더 오른쪽 UI | `headerRight` | custom header 전체 교체보다 native header option(`headerRight`, `headerSearchBarOptions` 등)을 선호 | 아직 실제 버튼은 안 넣었지만, 넣는다면 `Stack.Screen options.headerRight`가 대응 위치다 |

## 지금 식으로 다시 설명하면

### 레거시 강의의 핵심 문장

- "탭 navigator에는 전체 화면에 공통으로 적용되는 기본 옵션을 줄 수 있다."

### 2026식으로 번역한 핵심 문장

- "공통 옵션을 주는 생각 자체는 그대로지만, 탭과 헤더를 같은 navigator에서 한꺼번에 다루기보다 `NativeTabs`와 `Stack`으로 책임을 나눠서 관리한다."

## 1:1 대응으로 보면

- `tabBarStyle.backgroundColor`
  - 지금은 `NativeTabs backgroundColor`
- `tabBarActiveTintColor`
  - 지금은 `tintColor`, `iconColor.selected`, `labelStyle.selected`
- `tabBarInactiveTintColor`
  - 지금은 `iconColor.default`, `labelStyle.default`
- `headerTitleStyle`
  - 지금은 `Stack screenOptions.headerTitleStyle`
- `headerRight`
  - 지금은 `Stack.Screen options.headerRight`

## `vercel-react-native-skills` 기준 해석

- 이 스킬은 navigation 항목에서 JS navigator보다 native navigator를 우선하라고 명시한다.
- stack은 `@react-navigation/native-stack` 또는 Expo Router `Stack`
- tabs는 native bottom tabs 또는 Expo Router native tabs
- 또한 header는 커스텀 전체 컴포넌트보다 native header options를 선호한다.
- 따라서 `3489af6`가 설명한 "옵션을 어디에 주는가"라는 개념은 여전히 유효하지만, 구현 수단은 2021식 JS bottom tabs보다 현재의 native stack/native tabs 쪽으로 옮겨가는 편이 이 스킬과 더 잘 맞는다.

## 현재 워크스페이스에 적용해서 이해하면 좋은 점

- 레거시 강의가 알려주는 건 "옵션을 navigator 레벨에 모아둔다"는 사고방식이다.
- 지금 워크스페이스가 실제로 택한 건 "그 사고방식은 유지하되, 탭 옵션은 `NativeTabs`, 헤더 옵션은 `Stack`에 나눠 둔다"는 구조다.
- 그래서 이 커밋은 그대로 복사하기보다, "옛날엔 한 군데서 하던 일을 지금은 역할별로 나눠서 한다"라고 이해하는 편이 정확하다.

## 열린 질문

- 이후 noovies 커밋에서 `tabBarIcon`과 화면별 `options`가 붙을 때, 이를 현재 `NativeTabs.Trigger` 구조와 어떻게 대응시킬지 별도 정리가 필요하다.


## 스킬 추출 후보

### 트리거

- 탭과 헤더의 공통 옵션을 한곳에서 관리하고 싶을 때

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

- "공통 옵션은 owner navigator의 `screenOptions`로 모으되, tab과 header 책임은 나눠 둔다."

## 관련 페이지

- [내비게이션 의존성 준비와 preload 단순화](navigation-dependency-setup-and-preload-simplification.md)
- [expo-router-stack-native-tabs](expo-router-stack-native-tabs.md)

## 참고 링크

- [noovies commit 3489af6](https://github.com/nomadcoders/noovies/commit/3489af6135bc9db248cb59b7694c68e4e251039c)
- [vercel-react-native-skills navigation-native-navigators](/Users/junho/.agents/skills/vercel-react-native-skills/rules/navigation-native-navigators.md)
