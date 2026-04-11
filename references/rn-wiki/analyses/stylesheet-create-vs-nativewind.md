# `StyleSheet.create` vs `NativeWind` 선택 메모

## 질문

- React Native에서 `StyleSheet.create`와 `NativeWind`는 무엇이 다르고, 현재 워크스페이스와 사용자 취향에는 무엇이 더 잘 맞는가.

## 짧은 답

- 둘 다 좋은 선택지다.
- 하지만 지금 사용자 감각과 학습 흐름을 같이 보면 **`NativeWind` 쪽이 더 잘 맞을 가능성이 크다.**
- 다만 가장 안정적인 실무 운용은 보통 **`NativeWind + 필요할 때 StyleSheet.create` 혼합**이다.

## 공식/스킬 기준

- React Native 공식 문서는 `StyleSheet.create()`의 실질적 장점으로 **native style property에 대한 static type checking**을 말한다.
- `NativeWind` 공식 문서는 React Native에서 `className`으로 Tailwind 스타일을 쓰게 해주고, media/container query 같은 현대식 styling 기능을 강조한다.
- `vercel-react-native-skills`는 styling 기본값을 `StyleSheet.create or Nativewind`로 둔다.

## `StyleSheet.create`의 장점

- React Native 기본기와 가장 가깝다.
- 타입 체크와 속성 유효성 면에서 안정적이다.
- 복잡한 동적 스타일, animation style, platform-specific style을 세밀하게 만지기 좋다.
- 외부 설정 의존이 적고, 디버깅이 단순하다.

## `StyleSheet.create`의 단점

- 화면을 빠르게 조립할 때 반복이 많아질 수 있다.
- spacing, color, typography 조합을 자주 만들다 보면 장황해지기 쉽다.
- 웹의 Tailwind 경험이 있는 사람에겐 템포가 느리게 느껴질 수 있다.

## `NativeWind`의 장점

- `className` 기반이라 화면을 빠르게 조립하기 쉽다.
- spacing, flex, radius, colors, typography를 눈으로 훑기 좋다.
- Tailwind 경험이 있으면 생산성이 빨리 올라간다.
- shadcn-style component layer를 얹기 쉬운 편이다.

## `NativeWind`의 단점

- 설정과 빌드 파이프라인 이해가 필요하다.
- 모든 상황이 utility class만으로 예쁘게 끝나지는 않는다.
- animation, 계산형 style, 일부 third-party component styling은 결국 style object 쪽이 더 편할 때가 있다.
- 장기적으로 class 문자열이 너무 길어지면 오히려 읽기 어려워질 수 있다.

## 어떤 사람에게 뭐가 맞나

### `StyleSheet.create`가 더 맞는 경우

- RN 기본기를 먼저 단단히 익히고 싶다.
- animation, dynamic style, platform edge case를 세밀하게 다룰 일이 많다.
- utility class보다 명시적인 style object가 더 편하다.

### `NativeWind`가 더 맞는 경우

- Tailwind 문법이 이미 편하다.
- 화면을 빠르게 만들고 싶다.
- spacing, color, layout을 className으로 바로 읽는 쪽이 더 직관적이다.
- 나중에 shadcn-style component layer까지 염두에 두고 있다.

## 현재 사용자에게 추천

- 지금 사용자 반응은 "윈드가 편할 것 같다"에 가깝다.
- 현재 워크스페이스도 Expo Router 샌드박스라서 화면 조립 실험이 많다.
- 따라서 현재 추천은:
  - **주 스타일링 기본값은 `NativeWind`**
  - 복잡한 계산형/동적 스타일은 `StyleSheet.create` 보조 사용

즉 완전 이분법보다 아래 방식이 현실적이다:

- layout / spacing / color / typography: `NativeWind`
- animation / measured layout / complex computed style: `StyleSheet.create`

## 한 줄 결론

- "무엇이 더 정석이냐"보다 "무엇이 더 빨리 읽히고 계속 쓰게 되느냐"가 중요하다.
- 지금 사용자 감각에는 **`NativeWind`를 메인으로 두고, `StyleSheet.create`를 보조로 쓰는 혼합형**이 가장 잘 맞아 보인다.


## 스킬 추출 후보

### 트리거

- 현재 워크스페이스에서 `StyleSheet.create`와 `NativeWind` 중 기본 선택을 정할 때

### 권장 기본값

- 현재 기본 선택은 `NativeWind` 또는 `StyleSheet.create` 혼합이다.
- design token, utility class, low-level animation style 책임을 분리한다.
- 재사용 컴포넌트 계층은 styling 선택 위에 얹는다.

### 레거시 안티패턴

- 레거시 `styled-components` 감각만을 이유로 현재 기본값처럼 전파하기
- 프로젝트 안에서 styling 체계를 목적 없이 여러 개 섞기

### 예외 / 선택 기준

- 기존 styled-components 코드베이스 유지보수는 자연스러운 예외다.

### 현재식 코드 스케치

```tsx
<View className="flex-1 bg-background px-5">
  <Text className="text-foreground text-lg font-semibold" />
</View>

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 20 },
});
```

### 스킬 규칙 초안

- "현재식 기본값은 `NativeWind + 필요할 때 StyleSheet.create` 혼합이다."

## 관련 페이지

- [styled-components-vs-nativewind-and-shadcn](styled-components-vs-nativewind-and-shadcn.md)
- [expo-router-domain-file-organization](expo-router-domain-file-organization.md)

## 참고 링크

- [React Native StyleSheet docs](https://reactnative.dev/docs/stylesheet.html)
- [NativeWind docs](https://www.nativewind.dev/docs)
- [vercel-react-native-skills SKILL.md](/Users/junho/.agents/skills/vercel-react-native-skills/SKILL.md)
