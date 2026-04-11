# 드롭존 확대 피드백과 승인 드롭 시퀀스 | Drop-Zone Scaling Feedback and Accepted Drop Sequences

## 범위

- `nomadcoders/nomad-lang` 커밋 `cd8a2f2` (`3.18 Drag and Drop Project part Two`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 드래그 중 target zone이 커지는 hover-like feedback과,
  drop이 받아들여졌을 때 카드가 사라지고 위치가 리셋되는 exit sequence를 만든다.
- 즉 drag interaction이 "움직임"에서 "판정과 결과" 단계로 넘어간다.

## 레거시 커밋이 실제로 한 것

- `opacity` 값을 추가해 drop success 시 카드를 fade out 할 수 있게 한다.
- `position.y`에서 interpolate한 `scaleOne`, `scaleTwo`를 상단/하단 target에 적용한다.
- release 시 `dy < -250 || dy > 250`이면 drop accepted로 간주한다.
- accepted drop이면:
  - `scale`을 0으로 줄이고
  - `opacity`를 0으로 만들고
  - `position`을 원점으로 되돌리는 sequence를 실행한다.
- threshold를 넘지 못하면 기존처럼 원위치 복귀를 실행한다.

## 이때의 핵심 개념

### 1. target은 drop 순간만 반응하는 것이 아니라 drag 도중에도 신호를 준다

- scale feedback이
  사용자의 현재 위치를 읽게 만든다.

### 2. accepted drop과 cancelled drag는 다른 종료 시퀀스를 가진다

- 성공했을 때는 사라지고,
  실패했을 때는 돌아온다.

### 3. drop acceptance는 animation 이전에 interaction policy다

- 여기서는 `dy` threshold로 처리하지만,
  본질은 "언제 성공으로 볼 것인가"의 정책이다.

## 현재 대응 개념

### 1. current drag-and-drop은 단순 `dy`보다 geometry 기반 acceptance를 선호한다

- 실제 target bounds 안에 들어왔는지,
  중심점이 겹쳤는지 같은 판정이 더 제품 친화적이다.

### 2. hover feedback은 translation에서 파생하는 것이 자연스럽다

- target 확대, 색 변화, label opacity는
  gesture 위치에서 파생하는 값으로 읽는 편이 좋다.

### 3. 성공 후 exit animation과 logical commit을 분리해서 생각한다

- 먼저 시각적으로 사라지고,
  그다음 데이터 상태를 바꾸는 흐름이 더 명확하다.

## 현재 베스트 프랙티스

- drop zone acceptance는 magic threshold보다 target geometry를 우선 검토한다.
- hover feedback, acceptance 판정, post-drop transition을 서로 다른 단계로 나눈다.
- 애니메이션 중 디버그 `console.log`는 오래 남기지 않는다.
- fade/scale/position reset 같은 종료 애니메이션은 한 함수나 시퀀스로 모아둔다.


## 스킬 추출 후보

### 트리거

- drag 도중 target이 강조되고, 성공 드롭 시 별도 exit animation이 필요한 UI

### 권장 기본값

- hover feedback, acceptance 판정, post-drop transition을 서로 다른 단계로 둔다.
- acceptance는 가능하면 geometry 기반으로 판단한다.
- 성공 시에는 exit animation과 logical commit을 분리한다.

### 레거시 안티패턴

- `dy` 같은 단일 축 threshold만으로 target acceptance를 결정하기
- 성공/실패 종료 시퀀스를 한 덩어리 if문에서 뒤섞기
- drag 중 `console.log`를 오래 남기기

### 예외 / 선택 기준

- 위/아래 두 target만 있는 아주 단순한 데모라면 축 기준 threshold도 설명용으론 가능하다.

### 현재식 코드 스케치

```tsx
const isOverTop = useDerivedValue(() => ty.value < topZoneBottom);
const isOverBottom = useDerivedValue(() => ty.value > bottomZoneTop);

const topStyle = useAnimatedStyle(() => ({
  transform: [{ scale: withTiming(isOverTop.value ? 1.12 : 1) }],
}));
```

### 스킬 규칙 초안

- "드롭존 UI는 hover 강조, acceptance 판정, 성공 후 exit transition을 분리해서 설계한다."

## 관련 페이지

- [중앙 드래그 카드와 드롭 타깃 상호작용 기초](draggable-center-card-and-drop-target-interaction-foundation.md)
- [드롭 완료 후 다음 항목으로 진행하는 상태 전이](next-item-advance-after-drop-completion.md)

## 참고 자료

- [React Native Animated](https://reactnative.dev/docs/animated)
- [React Native Reanimated interpolate](https://docs.swmansion.com/react-native-reanimated/docs/utilities/interpolate/)
- [RNGH Pan gesture](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/gestures/pan-gesture/)
