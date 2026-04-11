# ValueXY와 다중 속성 보간 | ValueXY and Multi-Property Interpolation

## 범위

- `nomadcoders/nomad-lang` 커밋 `618ee19` (`3.7 More Interpolations`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 단일 값에서 `Animated.ValueXY`로 넘어가며, 회전과 색상까지 보간 범위를 확장한다.
- 즉 "2차원 위치 + 여러 파생 스타일" 패턴이 성립한다.

## 레거시 커밋이 실제로 한 것

- `Animated.ValueXY({ x: 0, y: 300 })`로 바꾼다.
- `POSITION.y`에서 `rotation`, `borderRadius`, `backgroundColor`를 보간한다.
- `useNativeDriver: false`로 색상 보간을 처리한다.

## 이때의 핵심 개념

### 1. 2차원 위치는 gesture와 이동 경로의 기반 모델이 된다

- 이후 pan/drag 패턴으로 가기 위한 데이터 구조가 여기서 준비된다.

### 2. 보간은 위치뿐 아니라 rotation, color 같은 의미를 함께 실을 수 있다

- 시각적 피드백을 richer하게 만드는 출발점이다.

## 현재 대응 개념

### 1. 지금의 대응 개념은 shared value object 또는 separate shared values다

- Reanimated에선 보통 `translateX`, `translateY`를 shared value로 분리하거나 객체/derived value로 다룬다.

### 2. 색상 보간은 `interpolateColor`가 더 현재식이다

- 예전 RN Animated에서는 color 때문에 `useNativeDriver: false`로 내려가는 경우가 많았지만,
  지금은 Reanimated의 color interpolation이 더 자연스럽다.

## 현재 베스트 프랙티스

- 2D 이동 모델은 이후 gesture event의 translation과 맞물리도록 설계한다.
- color/rotation/scale은 base motion에서 파생한다.
- JS thread 스타일 애니메이션보다 Reanimated UI thread 스타일을 우선 검토한다.


## 스킬 추출 후보

### 트리거

- 2D translation을 기반으로 회전, 색상, scale 같은 추가 피드백을 만들 때

### 권장 기본값

- `x`, `y` translation을 하나의 gesture source로 보고, 나머지 스타일은 이 값에서 파생한다.
- 새 구현에선 Reanimated shared value 두 개 또는 vector-like model을 쓴다.

### 레거시 안티패턴

- `x`, `y`를 React state로 들고 개별 속성도 따로 state로 두기
- translation과 feedback을 서로 다른 source에서 계산하기

### 예외 / 선택 기준

- 색상 변화처럼 native-driver 제약이 있는 속성은 RN Animated보다 Reanimated 쪽이 더 자연스럽다.

### 현재식 코드 스케치

```tsx
const tx = useSharedValue(0);
const ty = useSharedValue(0);
const style = useAnimatedStyle(() => ({
  transform: [
    { translateX: tx.value },
    { translateY: ty.value },
    { rotateZ: `${interpolate(tx.value, [-200, 200], [-12, 12])}deg` },
  ],
}));
```

### 스킬 규칙 초안

- "2D gesture UI는 translation을 원본 데이터로 두고 회전·강조 같은 피드백은 파생 속성으로 계산한다."

## 관련 페이지

- [단일 위치 값에서 여러 스타일 보간](single-value-to-multi-style-interpolation.md)
- [ValueXY 기반 다중 좌표 경로와 반복 이동](valuexy-sequence-paths-and-looped-motion.md)

## 참고 자료

- [React Native Animated.ValueXY](https://reactnative.dev/docs/animatedvaluexy)
- [Reanimated interpolate](https://docs.swmansion.com/react-native-reanimated/docs/utilities/interpolate/)
