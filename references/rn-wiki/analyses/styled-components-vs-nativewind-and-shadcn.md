# Styled Components vs NativeWind vs shadcn-style RN 메모

## 질문

- 레거시 RN 강의에서 `styled-components`를 쓰는데, 지금은 Tailwind나 shadcn 계열을 써도 되는가.

## 짧은 답

- `styled-components`를 지금도 쓸 수는 있다.
- 하지만 현재 기준으론 `vercel-react-native-skills`가 **`StyleSheet.create` 또는 `Nativewind`**를 더 기본값에 가깝게 본다.
- `shadcn/ui` 자체는 웹 React 쪽 개념에 더 가깝고, React Native에서는 보통 **NativeWind 기반의 shadcn-style 라이브러리/패턴**으로 받아들인다.

## `vercel-react-native-skills` 기준

- 이 스킬은 UI styling 항목에서 `StyleSheet.create or Nativewind`를 권장한다.
- 즉 최신 RN 실무 기본값을 아주 좁게 잡으면:
  - 저수준 기본기: `StyleSheet.create`
  - utility-class 생산성: `Nativewind`

## 최신 생태계 해석

- `styled-components`:
  - 여전히 가능
  - 다만 RN 최신 베스트 프랙티스의 "기본값"으로 보긴 애매하다
  - 레거시 강의에서는 CSS-like 문법을 가르치기 쉬워서 자주 등장했다
- Tailwind:
  - React Native에서는 보통 `NativeWind`로 쓴다
  - 즉 "Tailwind 안 되나?"에 대한 답은 **된다. 지금은 오히려 꽤 흔한 축이다**
- shadcn:
  - 웹의 `shadcn/ui`를 React Native에 그대로 가져오는 개념은 아니다
  - 대신 RN에서는 `react-native-reusables`처럼 **shadcn-style + NativeWind** 조합이 자주 언급된다


## 스킬 추출 후보

### 트리거

- 레거시 `styled-components` 강의를 현재 RN styling 선택지와 비교하고 싶을 때

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

- "현재 기본값 비교는 `styled-components`보다 `NativeWind`와 `StyleSheet.create` 혼합 쪽에 가깝다."

## 실무 감각으로 정리하면

- 순수 RN 기본기와 예측 가능성을 우선하면 `StyleSheet.create`
- 빠른 화면 조립과 utility-class 생산성을 원하면 `NativeWind`
- shadcn 같은 "복붙 가능한 디자인 시스템 컴포넌트" 감각을 원하면 RN에선 `NativeWind` 기반 재사용 컴포넌트 레이어를 올리는 쪽이 자연스럽다
- 따라서 React Native에서의 질문은 사실:
  - `styled-components vs NativeWind`
  - 또는 `NativeWind + reusable components`
  쪽으로 읽는 편이 더 정확하다

## 현재 워크스페이스에 대한 추천

- 지금 `nomad-diary`는 Expo Router + native navigation 학습 샌드박스라서:
  - 기본 학습용: `StyleSheet.create`
  - 현대식 실무 체험: `NativeWind`
- `shadcn/ui` 그 자체보다는, 나중에 필요하면 RN용 shadcn-style component layer를 따로 올리는 식이 더 자연스럽다

## 한 줄 결론

- `styled-components`: 가능하지만 지금의 기본 추천은 아님
- `NativeWind`: 지금 기준으로 충분히 좋은 선택지
- `shadcn`: RN에서는 "그대로"보다 "shadcn-style on NativeWind"로 이해하는 편이 맞다

## 참고 링크

- [vercel-react-native-skills SKILL.md](/Users/junho/.agents/skills/vercel-react-native-skills/SKILL.md)
- [NativeWind docs](https://www.nativewind.dev/docs)
- [React Native Reusables GitHub](https://github.com/mrzachnugent/react-native-reusables)
