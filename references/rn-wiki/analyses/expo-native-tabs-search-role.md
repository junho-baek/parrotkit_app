# Expo Native Tabs Search Role 메모

## 범위

- Expo Router native tabs에서 `role="search"`를 가진 탭과 nested `Stack`의 `headerSearchBarOptions`를 함께 쓰는 현재식 search 흐름을 정리한다.
- 이 문서는 `nomadcoders/noovies`의 `Search` 탭을 현재 Expo Router 구조로 더 적극적으로 번역할 때 참고하는 메모다.

## 레거시 소스가 실제로 한 것

- noovies의 `Search`는 JS bottom tabs 안의 일반 탭 하나였다.
- `tabBarIcon`에 `search-outline` 아이콘을 붙여 의미를 드러냈다.
- 하지만 search를 native role로 다루거나, header search bar까지 시스템 경험으로 연결하지는 않았다.

## 최신 권장 방식

- Expo Router native tabs 문서는 separate search tab이 필요할 때 `NativeTabs.Trigger`에 `role="search"`를 줄 수 있다고 설명한다.
- 같은 문서는 tab bar search input을 쓰려면 해당 탭 안에 `Stack`을 두고 `headerSearchBarOptions`를 연결하라고 안내한다.
- React Navigation native stack 문서는 search bar가 보통 정적이지 않으므로 `headerSearchBarOptions`를 화면 body에서 제어하는 패턴을 권장한다.
- iOS에서는 `contentInsetAdjustmentBehavior="automatic"`를 같이 써야 scroll과 large title, search bar가 자연스럽게 맞는다.

## 현재 사용자가 선택한 방향

- [`nomad-diary/app/(tabs)/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/_layout.js)에 `NativeTabs.Trigger name="search" role="search"`를 추가했다.
- [`nomad-diary/app/(tabs)/search/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/search/_layout.js)에서 nested `Stack`을 열어 native header를 담당하게 했다.
- [`nomad-diary/app/(tabs)/search/index.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/search/index.js)에서 `headerSearchBarOptions`와 `useDeferredValue` 기반 필터를 연결해 위키 메모 검색 데모를 만들었다.

## 왜 이렇게 읽는 편이 좋은가

- 과거의 `Search` 탭은 "검색 섹션이 있다"를 보여주는 단계였다.
- 현재 native tabs에서는 search를 단순 아이콘 탭이 아니라 role과 header interaction까지 포함한 시스템 UI로 읽는 편이 더 맞다.
- 즉 search도 단순 route 하나가 아니라, tab role, header, content inset, filtering state를 같이 보는 쪽이 현재 학습 가치가 높다.

## 이번 구현에서 배울 점

- `role="search"`는 탭의 의미를 platform 쪽에 더 많이 넘기는 선택이다.
- nested `Stack`은 native tabs 안에서도 header와 push 흐름을 자연스럽게 복원하는 기본 도구다.
- 검색 state는 `useDeferredValue`로 화면 filtering을 조금 더 부드럽게 읽을 수 있다.
- 위키 결론을 search result로 다시 노출하면, 학습 메모와 앱 구현이 한 방향으로 축적된다.

## 열린 질문

- Expo SDK 55 이상으로 올린 뒤 `NativeTabs.Trigger.Icon`과 Android `md` prop으로 search tab 코드를 더 단순화할지 검토할 수 있다.
- search 결과를 현재의 정적 topic 목록에서 실제 wiki 파일 인덱스로 넓힐지 나중에 판단할 수 있다.


## 스킬 추출 후보

### 트리거

- 탭 하나를 단순 아이콘이 아니라 search 역할까지 가진 native 탭으로 만들 때

### 권장 기본값

- search는 단순 탭 하나가 아니라 tab role, native header search bar, content inset을 함께 본다.
- search 탭 안엔 nested `Stack`을 두고 header search bar를 owner로 삼는다.
- 검색 state는 route body에 두되, header chrome은 stack option이 담당한다.

### 레거시 안티패턴

- 검색 탭을 일반 아이콘 탭처럼만 두고 native search 역할을 잃기
- search bar를 body UI와 header UI 두 군데서 중복 구현하기

### 예외 / 선택 기준

- Android 커스텀 검색 UI가 제품 요구사항이면 role/search bar 대신 custom body search를 택할 수 있다.

### 현재식 코드 스케치

```tsx
<NativeTabs.Trigger name="search" role="search">
  <Label>Search</Label>
</NativeTabs.Trigger>

// app/(tabs)/search/_layout.tsx
<Stack screenOptions={{ headerSearchBarOptions: { placeholder: 'Search notes' } }} />
```

### 스킬 규칙 초안

- "search 탭은 `role="search"`와 nested stack search bar를 함께 설계한다."

## 관련 페이지

- [네이티브 탭 아이콘과 Router ThemeProvider](native-tab-icons-and-router-theme-provider.md)
- [expo-router-stack-native-tabs](expo-router-stack-native-tabs.md)
- [configuring-stack-navigation-best-practices](configuring-stack-navigation-best-practices.md)

## 참고 링크

- [Expo Router native tabs](https://docs.expo.dev/router/advanced/native-tabs/)
- [React Navigation native stack `headerSearchBarOptions`](https://reactnavigation.org/docs/native-stack-navigator/)
