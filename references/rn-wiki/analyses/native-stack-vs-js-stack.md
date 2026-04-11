# Native Stack vs JS Stack 현재 결론

## 질문

- 지금 워크스페이스에서 stack navigation은 네이티브와 JS 중 무엇을 쓰는가.
- 그리고 2026 기준으로 무엇을 기본 선택으로 보는 것이 좋은가.

## 짧은 답

- 지금 우리는 **native stack**을 쓴다.
- 그리고 현재 기준 기본 추천도 **native stack**이다.

## 현재 워크스페이스 사실

- [`nomad-diary/app/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/_layout.js)에서 Expo Router의 `Stack`를 쓰고 있다.
- `vercel-react-native-skills`는 Expo Router의 기본 `Stack`가 native stack이라고 본다.
- 따라서 지금 `nomad-diary`의 상세 화면 push, back gesture, header는 JS stack이 아니라 native stack 계열로 이해하면 된다.

## `vercel-react-native-skills` 기준

- 이 스킬은 navigation 항목에서 JS navigator보다 native navigator를 우선하라고 명시한다.
- stack에 대해서는:
  - `@react-navigation/native-stack`
  - Expo Router의 기본 `Stack`
  를 권장한다.
- 반대로 `@react-navigation/stack` 같은 JS stack은 피하라고 적는다.

## 왜 native stack이 기본값인가

- 전환과 제스처가 더 네이티브스럽다.
- iOS에서는 large title, back gesture, header 동작이 더 자연스럽다.
- 플랫폼 API를 직접 타므로 성능과 시스템 통합 면에서 유리하다.
- 지금 워크스페이스처럼 Expo Router를 쓰면 별도 우회 없이 기본 `Stack`만으로 그 방향을 가져갈 수 있다.

## JS stack은 언제 생각하나

- 기본 선택이라기보다 예외 선택에 가깝다.
- 헤더와 전환을 완전히 JS 레벨에서 세밀하게 통제해야 하거나, native stack이 제공하지 않는 특수 전환/구성이 꼭 필요할 때만 검토할 만하다.
- 즉 "특별한 이유가 있을 때만" 꺼내는 카드로 보는 편이 안전하다.

## 현재 워크스페이스에 대한 결론

- 지금 구조에서는 루트 [`nomad-diary/app/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/_layout.js#L62)의 `Stack`를 그대로 유지하는 것이 맞다.
- 탭은 별도로 `NativeTabs`/`Tabs` 논의가 있을 수 있지만, **stack 질문만 놓고 보면 답은 native stack**이다.
- 한 줄로 정리하면:
  - **우리 스택은 지금 native stack**
  - **그리고 현재 best default도 native stack**


## 스킬 추출 후보

### 트리거

- 새 화면 구조에서 JS stack과 native stack 중 기본값을 정해야 할 때

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

- "특별한 이유가 없으면 stack 기본값은 native stack이다."

## 관련 페이지

- [expo-router-stack-native-tabs](expo-router-stack-native-tabs.md)
- [네이티브 내비게이션의 공통 탭/헤더 옵션](shared-tab-and-header-options-in-native-navigation.md)

## 참고 링크

- [vercel-react-native-skills navigation-native-navigators](/Users/junho/.agents/skills/vercel-react-native-skills/rules/navigation-native-navigators.md)
