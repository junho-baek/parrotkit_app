# 단일 위치 값에서 여러 스타일 보간 | Single Value to Multi-Style Interpolation

## 범위

- `nomadcoders/nomad-lang` 커밋 `e0872c4` (`3.6 Interpolation`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 하나의 위치 값(`Y_POSITION`)에서 `opacity`, `borderRadius`, `translateY`를 동시에 파생한다.
- 즉 "애니메이션 값 하나가 여러 스타일의 source가 될 수 있다"는 보간 개념의 출발점이다.

## 레거시 커밋이 실제로 한 것

- `Animated.Value(300)`을 기준으로 위아래 이동시킨다.
- 같은 값으로 `opacity`와 `borderRadius`를 `interpolate()`한다.
- 터치 진입점을 `Pressable`로 바꾼다.

## 이때의 핵심 개념

### 1. 하나의 motion source가 여러 시각 결과를 만든다

- 이동과 투명도, 모양 변화가 서로 따로 노는 것이 아니라 같은 값에서 나온다.

### 2. interpolation은 숫자 범위를 다른 스타일 범위로 매핑하는 도구다

- 이 아이디어가 이후 rotation, color, scale, threshold UI까지 이어진다.

## 현재 대응 개념

### 1. 현재식 대응은 Reanimated `interpolate`와 `useAnimatedStyle`이다

- 이제는 shared value에서 derived style을 만들고, 필요한 속성만 worklet 안에서 계산하는 편이 더 일반적이다.

### 2. gesture-heavy 화면에선 transform/opacity 중심이 더 안전하다

- borderRadius 같은 속성도 가능하지만, 의미 없는 속성 애니메이션 남발은 피하는 편이 좋다.

## 현재 베스트 프랙티스

- single source of motion을 먼저 정하고, 나머지 스타일은 파생값으로 계산한다.
- `interpolate`에는 `clamp` 같은 extrapolation 정책을 의식적으로 둔다.
- interaction-heavy 화면은 transform/opacity를 우선하고, 색상/shape 변화는 필요한 만큼만 추가한다.


## 스킬 추출 후보

### 트리거

- 하나의 드래그나 스크롤 값에서 opacity, scale, rotate, radius 등을 함께 만들고 싶을 때

### 권장 기본값

- single source value를 먼저 정하고, 나머지 시각 피드백은 모두 파생값으로 계산한다.
- `clamp` 같은 extrapolation 정책을 명시한다.

### 레거시 안티패턴

- 속성마다 별도 state/value를 따로 만들기
- 왜 필요한지 없는 장식용 속성 애니메이션을 과도하게 추가하기

### 예외 / 선택 기준

- 완전히 독립된 타이밍을 가진 속성이면 separate value가 필요할 수 있다.
- 그 외엔 source value 하나에서 파생하는 편이 더 단순하다.

### 현재식 코드 스케치

```tsx
const progress = useSharedValue(0);
const style = useAnimatedStyle(() => ({
  opacity: interpolate(progress.value, [0, 1], [0.4, 1], Extrapolation.CLAMP),
  transform: [{ translateY: interpolate(progress.value, [0, 1], [300, 0]) }],
  borderRadius: interpolate(progress.value, [0, 1], [0, 24]),
}));
```

### 스킬 규칙 초안

- "여러 시각 피드백이 같은 움직임을 설명한다면 source value는 하나로 두고 나머지는 interpolation으로 파생한다."

## 관련 페이지

- [애니메이션 상태 토글과 stable value 수명](animation-state-toggle-and-stable-value-lifecycle.md)
- [ValueXY와 다중 속성 보간](valuexy-and-multi-property-interpolation.md)

## 참고 자료

- [React Native Animated](https://reactnative.dev/docs/animated)
- [Reanimated interpolate](https://docs.swmansion.com/react-native-reanimated/docs/utilities/interpolate/)
