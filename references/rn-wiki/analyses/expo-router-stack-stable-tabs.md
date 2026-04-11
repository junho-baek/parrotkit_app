# Expo Router `Stack + Tabs` 임시 우회 메모

## 범위

- `nomad-diary`에서 잠깐 시도했던 stable `Tabs` 우회를 기록한다.
- 이 페이지는 "왜 다시 `NativeTabs`로 돌아갔는지"를 이해하기 위한 비교 메모다.

## 시도했던 구조

- 루트는 [`nomad-diary/app/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/_layout.js) 의 `Stack`
- 최상위 섹션은 stable `Tabs`
- 상세 화면은 [`nomad-diary/app/entry/[slug].js`](/Users/junho/project/RN_practice/nomad-diary/app/entry/[slug].js) 같은 동적 route

## 왜 이렇게 정했나

- iOS의 Liquid Glass 헤더 감각은 `Tabs`가 아니라 native `Stack` 쪽에서 체감된다.
- 그래서 상단 헤더만 보면 stable `Tabs`로도 충분해 보였다.
- 하지만 실제 사용감에서는 하단 탭바의 시스템 느낌이 약해져 현재 선택으로는 유지하지 않았다.

## 세 층 비교

- 레거시/실험:
  - `NativeTabs`를 붙여 시스템 탭바 느낌을 확인했다.
- 최신 권장 기준:
  - `Expo Router + Stack`은 좋은 기본값이다.
  - `NativeTabs`도 플랫폼스러운 옵션이지만 여전히 experimental 성격이 있다.
- 현재 사용자 선택:
  - 이 우회는 유지하지 않는다.
  - 탭은 다시 `NativeTabs`로 돌아간다.

## 현재 구조의 장점

- 상세 화면 push, large title, back gesture 같은 iOS 감각은 그대로 유지된다.
- 실험 import를 피하고 싶을 때 고려할 수 있는 대안이라는 점은 남는다.
- 다만 하단 탭바의 플랫폼 감각은 현재 선택 대비 약하다.

## 학습 포인트

- 상단 헤더의 네이티브 느낌과 하단 탭 구현 방식을 분리해서 생각할 수 있다.
- `NativeTabs`가 없어도 Liquid Glass 헤더는 stack에서 계속 확인된다.
- 하지만 하단 탭바 감각까지 중요하면 현재 샌드박스 기준으론 `NativeTabs` 쪽 만족도가 더 높다.


## 스킬 추출 후보

### 트리거

- NativeTabs 제약 때문에 stable `Tabs` 우회를 검토할 때

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

- "stable tabs 우회는 가능하지만, native 탭 감각이 중요하면 tradeoff를 명시하고 선택한다."

## 관련 페이지

- [expo-router-stack-native-tabs](expo-router-stack-native-tabs.md)

## 참고 링크

- [Expo file-based routing](https://docs.expo.dev/develop/file-based-routing/)
- [Expo Router Stack](https://docs.expo.dev/router/advanced/stack/)
- [Expo Router Native tabs](https://docs.expo.dev/router/advanced/native-tabs/)
