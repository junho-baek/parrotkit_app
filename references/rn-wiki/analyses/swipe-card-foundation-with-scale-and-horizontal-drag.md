# 스와이프 카드의 압축·수평 드래그 기초 | Swipe Card Foundation with Scale and Horizontal Drag

## 범위

- `nomadcoders/nomad-lang` 커밋 `5d83cb5` (`3.12 Card Project part One`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 자유로운 2D drag 예제를 "수평으로만 움직이는 카드" 문제로 축소하고, press scale과 `translateX`를 결합해 첫 swipe-card 감각을 만든다.
- 즉 gesture demo가 제품형 interaction의 최소 단위로 바뀌는 시작점이다.

## 레거시 커밋이 실제로 한 것

- `Animated.ValueXY` 대신 단일 `Animated.Value(0)`를 `position`으로 둔다.
- `onPanResponderMove`에서 `dx`만 받아 `position.setValue(dx)` 한다.
- 별도의 `scale` 값을 두고, press in 때 `0.95`, release 때 `1`로 spring을 건다.
- release 시에는 수평 드래그를 바로 dismiss하지 않고 중앙으로 복귀시키는 spring을 건다.
- 카드 UI도 단순 박스에서 실제 제품형 card처럼 보이게 바뀐다.

## 이때의 핵심 개념

### 1. interaction axis를 줄이면 제품 의도가 선명해진다

- 모든 방향으로 움직일 수 있는 drag보다,
  한 축만 허용하는 swipe card가 훨씬 읽기 쉽다.

### 2. gesture translation과 tactile feedback은 분리된 값일 수 있다

- `translateX`는 이동,
  `scale`은 손에 잡히는 느낌을 만든다.

### 3. "복귀형 swipe"가 먼저 있어야 "dismiss형 swipe"로 확장하기 쉽다

- 먼저 카드가 돌아오는 기본 동작을 만든 뒤,
  나중에 threshold를 추가하는 순서다.

## 현재 대응 개념

### 1. 지금의 기본 대응은 `Gesture.Pan()` + shared value다

- 현재식으로는 `PanResponder`보다
  Gesture Handler의 pan gesture와 Reanimated shared value 조합이 기본 비교 대상이다.

### 2. transform용 값은 하나의 gesture source에서 파생하는 편이 좋다

- `translateX`, `rotateZ`, overlay opacity 같은 값은
  보통 하나의 horizontal translation에서 파생한다.

### 3. press feedback은 `Pressable`과 gesture 책임을 구분해서 본다

- 버튼성 상호작용은 `Pressable`,
  drag는 gesture handler 쪽으로 두는 편이 현재식 구조에 가깝다.

## 현재 베스트 프랙티스

- swipe card의 기준 축을 먼저 정하고, 불필요한 자유도를 초반에 줄인다.
- gesture translation과 deck state를 섞지 않는다.
- 새 구현에서는 transform과 opacity 중심으로만 애니메이션을 설계한다.
- pressable action과 drag action은 같은 결과로 가더라도 입력 계층은 분리해서 본다.


## 스킬 추출 후보

### 트리거

- Tinder형 카드처럼 한 축으로만 넘기는 swipe card를 만들 때

### 권장 기본값

- 축을 먼저 수평 또는 수직 하나로 제한한다.
- `translationX`를 source value로 두고, scale/rotate/overlay는 파생값으로 계산한다.
- deck state와 gesture translation을 분리한다.

### 레거시 안티패턴

- 2D drag 예제를 그대로 들고 와서 제품용 swipe card에 쓰기
- 현재 카드의 움직임과 다음 카드 상태를 같은 값으로 섞기

### 예외 / 선택 기준

- 학습용 데모라면 press scale과 translate만으로도 충분하다.
- 실제 제품으로 가면 threshold, preview card, action buttons가 곧 필요해진다.

### 현재식 코드 스케치

```tsx
const translateX = useSharedValue(0);
const style = useAnimatedStyle(() => ({
  transform: [
    { translateX: translateX.value },
    { scale: interpolate(Math.abs(translateX.value), [0, 120], [1, 0.96]) },
  ],
}));
```

### 스킬 규칙 초안

- "스와이프 카드는 먼저 interaction axis를 하나로 제한하고, gesture translation과 deck state를 분리한다."

## 관련 페이지

- [드래그 누적을 위한 setOffset과 flattenOffset](drag-offset-accumulation-with-setoffset-and-flattenoffset.md)
- [회전 피드백과 스와이프 dismiss 임계값](swipe-dismiss-thresholds-and-rotation-feedback.md)

## 참고 자료

- [React Native Animated](https://reactnative.dev/docs/animated)
- [React Native PanResponder](https://reactnative.dev/docs/panresponder)
- [RNGH Pan gesture](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/gestures/pan-gesture/)
- [React Native Pressable](https://reactnative.dev/docs/pressable)
