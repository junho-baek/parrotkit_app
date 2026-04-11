# ValueXY 기반 다중 좌표 경로와 반복 이동 | ValueXY Sequence Paths and Looped Motion

## 범위

- `nomadcoders/nomad-lang` 커밋 `432618c` (`3.8 ValueXY`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 `Dimensions`와 `Animated.sequence`, `Animated.loop`를 이용해 박스를 화면 네 모서리로 순환 이동시킨다.
- 즉 "절대 좌표 기반 경로 애니메이션"이 처음 등장한다.

## 레거시 커밋이 실제로 한 것

- 화면 크기를 읽어 네 모서리 좌표를 계산한다.
- `topLeft`, `bottomLeft`, `bottomRight`, `topRight` timing animation을 만든다.
- `Animated.sequence([...])`를 `Animated.loop(...)`로 반복시킨다.
- `POSITION.getTranslateTransform()`으로 2D 이동을 스타일에 연결한다.

## 이때의 핵심 개념

### 1. animation은 단일 목적지뿐 아니라 경로 sequence가 될 수 있다

### 2. `ValueXY`는 drag뿐 아니라 multi-step path animation에도 쓸 수 있다

## 현재 대응 개념

### 1. 지금의 대응 개념은 `withSequence` / `withRepeat` 또는 layout animation이다

- Reanimated에서는 sequence, repeat, delay modifier로 더 선언적으로 경로를 구성하는 편이 보편적이다.

### 2. 절대 화면 좌표 애니메이션은 반응형/rotation/measurement 문제를 같이 본다

- 지금은 `Dimensions.get` 고정값보다 레이아웃 측정, safe area, orientation 변화까지 함께 고려하는 편이 낫다.

## 현재 베스트 프랙티스

- 반복 경로 애니메이션은 imperative chain보다 declarative modifier를 우선 검토한다.
- 경로가 화면 크기에 의존하면 측정 시점과 orientation 변경을 함께 처리한다.
- 제품 UI라면 무한 반복보다 사용자 이벤트 기반 motion이 더 중요할 때가 많다.


## 스킬 추출 후보

### 트리거

- 튜토리얼, 온보딩, decorative motion처럼 scripted path를 반복 재생할 때

### 권장 기본값

- 반복 경로 애니메이션은 사용자 입력과 분리된 decorative layer로 둔다.
- cancel 가능 여부와 재생 조건을 먼저 정한다.

### 레거시 안티패턴

- 무한 loop를 실제 interaction layer와 섞기
- 사용자 제스처가 시작돼도 loop를 계속 돌리기

### 예외 / 선택 기준

- purely decorative motion이면 sequence/repeat가 적합하다.
- 사용자가 손대는 순간부터는 user-driven motion으로 전환하는 편이 낫다.

### 현재식 코드 스케치

```tsx
const progress = useSharedValue(0);
useEffect(() => {
  progress.value = withRepeat(
    withSequence(withTiming(1), withTiming(2), withTiming(3), withTiming(0)),
    -1,
    false,
  );
}, []);
```

### 스킬 규칙 초안

- "scripted loop motion은 decorative layer에만 두고, interactive motion과 state를 섞지 않는다."

## 관련 페이지

- [ValueXY와 다중 속성 보간](valuexy-and-multi-property-interpolation.md)
- [PanResponder 기반 드래그 추적](panresponder-driven-drag-tracking.md)

## 참고 자료

- [React Native Animated](https://reactnative.dev/docs/animated)
- [React Native Animated.ValueXY](https://reactnative.dev/docs/animatedvaluexy)
- [Reanimated Getting Started](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)
