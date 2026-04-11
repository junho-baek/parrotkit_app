# 중첩 탭/스택과 모달 경계 | Nested Tabs, Stacks, and Modal Boundaries

## 범위

- `nomadcoders/noovies`의 2021-09-15 커밋 `c08c9f1` (`1.12 Stacks and Tabs`)를 현재 React Navigation / Expo Router 기준으로 다시 해석한다.
- 이 문서는 레거시 nested navigator 예제를 최신 best practice와 실전 주의점으로 번역한 메모다.

## 레거시 소스가 실제로 한 것

- root navigator를 `createNativeStackNavigator()`로 만들고, 그 안에 `Tabs`와 `Stack`를 넣었다.
- root navigator에 `screenOptions={{ presentation: "modal", headerShown: false }}`를 줬다.
- `Movies` 화면에서 `navigate("Stack", { screen: "Three" })`로 modal stack 쪽으로 들어간다.
- `Stack` 안의 `Three` 화면에서는 다시 `navigate("Tabs", { screen: "Search" })`로 탭의 `Search` 화면으로 점프하려고 한다.

## 이 강의가 설명하려던 것

- tabs와 stack을 섞어서 nested navigator를 만드는 법
- 탭 안에서 별도 stack/modal 흐름으로 들어갔다가, 다시 다른 탭 화면으로 이동하는 법
- 즉 "navigator를 하나만 쓰지 않고 조합할 수 있다"는 개념 설명에 가깝다.

## 최신 문서 기준으로 다시 읽으면

### 1. `presentation: "modal"`은 root 전체보다 modal 대상 screen/group에만 주는 편이 맞다

- React Navigation 문서는 modal을 만들 때 modal screen group에만 `presentation: 'modal'`을 주는 예시를 보여준다.
- Expo Router 문서도 modal route 자체에 `presentation: 'modal'`을 주는 예시를 쓴다.
- 따라서 현재 기준으론 root navigator 전체에 modal presentation을 깔기보다, **정말 modal이어야 하는 screen/group에만 범위를 제한하는 쪽이 더 자연스럽다.**

### 2. nested navigator에서 `goBack()`은 현재 navigator부터 처리된다

- React Navigation 문서는 navigation action이 먼저 현재 navigator에서 처리되고, 못 처리하면 부모로 bubble up된다고 설명한다.
- 그래서 child stack 안에서 `navigation.goBack()`을 부르면 보통은 먼저 child stack history를 뒤로 간다.
- 지금 같은 구조에서 "modal로 열린 parent stack 자체를 닫고 싶다"면 parent navigator를 직접 잡아야 한다.

### 3. parent navigator를 조작해야 할 때는 `navigation.getParent()`를 쓴다

- React Navigation 문서는 parent navigator 접근에 `navigation.getParent()`를 안내한다.
- 따라서 `Stack/Three`에서 modal 컨테이너 자체를 닫고 싶다면 `navigation.getParent()?.goBack()` 같은 식으로 parent를 기준으로 닫는 쪽이 의도에 더 맞다.

## 현재식 권장 구조

### React Navigation v7 쪽으로 읽으면

```tsx
<Root.Navigator screenOptions={{ headerShown: false }}>
  <Root.Screen name="Tabs" component={Tabs} />
  <Root.Screen
    name="Stack"
    component={Stack}
    options={{ presentation: 'modal' }}
  />
</Root.Navigator>
```

- 즉 `presentation: 'modal'`은 root 전체 default가 아니라 `Stack` screen에만 둔다.
- 이렇게 해야 `Tabs` 쪽 일반 화면이 modal 컨텍스트처럼 취급되는 범위를 줄일 수 있다.

### `Three -> Search` 이동은 이렇게 읽는 편이 안전하다

```tsx
const parent = navigation.getParent();
parent?.goBack();
```

- 그다음 `Tabs`의 `Search`로 보내는 식이다.
- 핵심은 "현재 child stack만 뒤로 가는 것"과 "modal parent를 닫는 것"을 구분하는 데 있다.

## `requestAnimationFrame` 메모는 어떻게 봐야 하나

- 공식 문서는 `requestAnimationFrame`을 modal dismiss 후 navigate의 필수 규칙으로 적지는 않는다.
- 하지만 실전에서는 dismiss 애니메이션과 다음 navigation action이 같은 타이밍에 겹치며 컨텍스트가 꼬이는 경우가 있을 수 있다.
- 따라서 `requestAnimationFrame(() => parent.navigate(...))` 패턴은 **공식 API 규칙이라기보다, 타이밍 안정화를 위한 실전 workaround 메모**로 보는 편이 정확하다.
- 즉:
  - 공식적으로 확실한 것: modal screen 범위를 좁히기, parent navigator를 명시적으로 다루기
  - 실전 팁에 가까운 것: dismiss 직후 한 프레임 늦춰 navigate하기

## Expo Router로 번역하면

- root `_layout` 전체를 modal로 만들기보다, modal route에만 `presentation: 'modal'`을 준다.
- Expo 문서도 `modal.tsx` 같은 route를 stack에 등록하면서 그 route에만 `presentation: 'modal'`을 주는 예시를 보여준다.
- 즉 현재 Expo Router 기준으로도 "modal 범위는 route 단위로 제한"이 더 자연스럽다.

## `vercel-react-native-skills` 기준 해석

- 이 스킬은 JS navigator보다 native navigator를 우선한다.
- 따라서 이 커밋을 최신식으로 해석하면:
  - stack은 native stack 유지
  - tabs는 native tabs 쪽 우선
  - 다만 nested navigator는 최소화하고, modal 범위는 정확히 screen/group 단위로 잘라두는 쪽이 유지보수에 유리하다

## 현재 워크스페이스에 적용하면

- 지금 `nomad-diary`는 root [`nomad-diary/app/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/_layout.js)에서 `Stack`를 쓰고 있다.
- 현재 구조에 modal 화면을 추가한다면, root stack 전체 default를 modal로 바꾸기보다 **특정 route에만 `options={{ presentation: 'modal' }}`**를 주는 식으로 가는 편이 맞다.
- 즉 이 커밋에서 가져갈 핵심은 "stacks + tabs를 섞을 수 있다"이지, root 전체 modal default를 그대로 따라가는 것은 아니다.

## 최신 결론

- **좋은 개념**
  - tabs와 stack을 조합해 flow를 분리한다
  - nested screen navigation은 `navigate('Tabs', { screen: 'Search' })`처럼 간다
- **현재식 수정 포인트**
  - modal presentation은 root 전체가 아니라 modal 대상 screen/group에만 준다
  - modal parent를 닫아야 하면 `getParent()` 기준으로 다룬다
  - `requestAnimationFrame`은 문서상 필수 규칙이 아니라 실전 안정화 팁으로 본다


## 스킬 추출 후보

### 트리거

- 탭 안의 스택과 전역 modal 경계를 같이 설계할 때

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

- "탭 내부 push와 전역 modal presentation owner를 분리해서 nested boundary를 명확히 둔다."

## 관련 페이지

- [native-stack-vs-js-stack](native-stack-vs-js-stack.md)
- [configuring-stack-navigation-best-practices](configuring-stack-navigation-best-practices.md)

## 참고 링크

- [React Navigation native stack navigator](https://reactnavigation.org/docs/native-stack-navigator/)
- [React Navigation nesting navigators](https://reactnavigation.org/docs/nesting-navigators/)
- [React Navigation opening a modal](https://reactnavigation.org/docs/modal/)
- [Expo Router modals](https://docs.expo.dev/router/advanced/modals/)
