# 드래그 누적을 위한 setOffset과 flattenOffset | Drag Offset Accumulation with setOffset and flattenOffset

## 범위

- `nomadcoders/nomad-lang` 커밋 `eed4b20` (`3.11 Offsets`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 `onPanResponderGrant`에서 `setOffset`, release에서 `flattenOffset`을 써서 드래그 위치를 누적한다.
- 즉 매번 원점으로 돌아가는 drag가 아니라, "현재 위치를 새 기준점으로 삼는 drag"가 된다.

## 레거시 커밋이 실제로 한 것

- `onPanResponderGrant`에서 현재 `POSITION.x._value`, `POSITION.y._value`를 offset으로 저장한다.
- `onPanResponderMove`에서는 다시 `dx`, `dy`를 setValue한다.
- release에서 spring 복귀 대신 `flattenOffset()`으로 offset을 실제 값에 합친다.

## 이때의 핵심 개념

### 1. gesture translation과 absolute position은 다르다

- 손가락 이동량은 그 자체로 누적 위치가 아니다.

### 2. offset은 "이전까지의 위치"를 기억하는 계층이다

- 이후 drag and drop, snapping, stacking에서 매우 중요한 발상이다.

## 현재 대응 개념

### 1. 지금은 `translationX/Y`와 accumulated position을 더 명시적으로 분리한다

- Gesture Handler의 pan event는 translation, velocity 등을 제공하므로,
  offset pattern을 더 구조적으로 표현할 수 있다.

### 2. `_value` 직접 접근은 현재식으로는 거친 편이다

- Reanimated에선 shared value와 gesture event를 통해 누적 위치를 더 직접적으로 계산한다.

## 현재 베스트 프랙티스

- drag model을 `gesture translation`과 `stored base position`으로 나눠 설계한다.
- private/internal field처럼 보이는 접근 패턴에 의존하지 않는 편이 좋다.
- 복귀형 drag인지, 누적형 drag인지 interaction 목적을 먼저 정한다.


## 스킬 추출 후보

### 트리거

- draggable 요소가 원점이 아니라 마지막 위치를 새 기준점으로 삼아야 할 때

### 권장 기본값

- `base position`과 `gesture translation`을 별도 값으로 나눈다.
- 실제 표시 위치는 `base + translation`으로 계산한다.

### 레거시 안티패턴

- `_value` 같은 내부 필드 직접 읽기
- absolute position과 translation을 하나의 값에 섞어 넣기

### 예외 / 선택 기준

- purely temporary drag라면 누적 offset이 필요 없고, 원점 복귀 모델이 더 단순하다.

### 현재식 코드 스케치

```tsx
const baseX = useSharedValue(0);
const dragX = useSharedValue(0);
const style = useAnimatedStyle(() => ({
  transform: [{ translateX: baseX.value + dragX.value }],
}));

const pan = Gesture.Pan()
  .onUpdate((e) => {
    dragX.value = e.translationX;
  })
  .onEnd(() => {
    baseX.value += dragX.value;
    dragX.value = 0;
  });
```

### 스킬 규칙 초안

- "누적형 drag는 base position과 current translation을 분리하고, 표시 위치는 둘의 합으로 계산한다."

## 관련 페이지

- [드래그 해제 후 스프링 복귀](spring-back-on-gesture-release.md)
- [스와이프 카드의 압축·이동 기초](swipe-card-foundation-with-scale-and-horizontal-drag.md)

## 참고 자료

- [React Native Animated.ValueXY](https://reactnative.dev/docs/animatedvaluexy)
- [React Native PanResponder](https://reactnative.dev/docs/panresponder)
