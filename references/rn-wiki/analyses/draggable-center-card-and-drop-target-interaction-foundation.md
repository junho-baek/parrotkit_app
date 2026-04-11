# 중앙 드래그 카드와 드롭 타깃 상호작용 기초 | Draggable Center Card and Drop Target Interaction Foundation

## 범위

- `nomadcoders/nomad-lang` 커밋 `2ca4700` (`3.17 Drag and Drop Project part One`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 세로 drop-zone 셸에 pan responder, scale feedback, 원위치 복귀를 붙여 실제 draggable subject를 다시 살린다.
- 즉 이제 중앙 카드는 움직일 수 있고, target은 아직 판정 전이지만 interaction stage에 올라온다.

## 레거시 커밋이 실제로 한 것

- `position`을 `Animated.ValueXY`로 유지하고, `scale` 값을 추가한다.
- `PanResponder`를 붙여 `dx`, `dy`를 카드 transform에 반영한다.
- grant 시 `scale`을 0.9로 줄이고, release 시 `scale`과 `position`을 원위치로 spring 시킨다.
- 상단/하단 target도 단순 텍스트가 아니라 원형 `WordContainer`로 바뀐다.

## 이때의 핵심 개념

### 1. draggable subject와 drop target이 같은 화면에 공존하기 시작한다

- 이제 화면은
  정적 레이아웃이 아니라 interaction field가 된다.

### 2. drag 중 tactile feedback은 계속 중요하다

- scale down은 사용자가 "지금 잡고 있다"는 감각을 준다.

### 3. 아직 accept/drop 판정이 없어도 release 복귀 루프가 필요하다

- 돌아오는 기본동작이 있어야
  이후 drop success 분기를 붙일 수 있다.

## 현재 대응 개념

### 1. 지금은 `PanResponder`보다 `Gesture.Pan()`이 기본 후보다

- drag-heavy UI에선 native-driven gesture와 shared value 조합이 더 자연스럽다.

### 2. hover state는 React state보다 파생 값으로 읽는 편이 좋다

- 어느 target에 가까운지, target scale이 얼마나 커져야 하는지는
  보통 gesture translation에서 파생한다.

### 3. target interaction을 위한 geometry 확보가 다음 단계다

- 단순 복귀 단계 다음엔
  target bounds와 현재 pointer/card 위치를 비교하게 된다.

## 현재 베스트 프랙티스

- drag translation은 shared value 같은 고빈도 animation state에 둔다.
- target highlight는 별도 state 토글보다 derived value를 우선 검토한다.
- 새 구현에선 import만 해두고 쓰지 않는 effect/state를 남기지 않는다.
- 중앙 카드, target zone, 판정 로직을 분리해 다음 단계 확장을 쉽게 만든다.


## 스킬 추출 후보

### 트리거

- 중앙 draggable subject가 여러 target 사이를 오가야 하는 drag-and-drop UI

### 권장 기본값

- draggable card와 drop zone을 서로 다른 책임의 컴포넌트로 나눈다.
- translation은 하나의 shared value source로 두고, hover 강조는 파생값으로 계산한다.

### 레거시 안티패턴

- 카드 로직과 target 판정 로직을 한 컴포넌트에 섞기
- hover state를 매 프레임 React state로 토글하기

### 예외 / 선택 기준

- 작은 학습용 예제에선 한 파일에 두어도 되지만, 스킬이나 제품 구조로 옮길 땐 분리하는 편이 좋다.

### 현재식 코드 스케치

```tsx
const tx = useSharedValue(0);
const ty = useSharedValue(0);
const cardStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: tx.value }, { translateY: ty.value }],
}));
```

### 스킬 규칙 초안

- "중앙 draggable subject와 drop zone은 컴포넌트 책임을 분리하고, hover 피드백은 translation에서 파생한다."

## 관련 페이지

- [분류형 드래그를 위한 세로 드롭존 셸](vertical-drop-zone-shell-for-classification-drag.md)
- [드롭존 확대 피드백과 승인 드롭 시퀀스](drop-zone-scaling-and-accepted-drop-sequences.md)

## 참고 자료

- [React Native PanResponder](https://reactnative.dev/docs/panresponder)
- [React Native Animated.ValueXY](https://reactnative.dev/docs/animatedvaluexy)
- [RNGH Pan gesture](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/gestures/pan-gesture/)
