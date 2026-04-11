# dismiss 전환을 위한 스프링 정지 임계값 튜닝 | Spring Rest Threshold Tuning for Dismiss Transitions

## 범위

- `nomadcoders/nomad-lang` 커밋 `5206494` (`3.16 Treshholds`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 swipe card의 왼쪽 dismiss spring에 `restDisplacementThreshold`, `restSpeedThreshold`를 추가해,
  animation이 "언제 끝난 것으로 간주되는지"를 조정한다.
- 즉 threshold는 gesture 진입 조건만이 아니라 animation 종료 판정에도 존재한다는 점을 드러낸다.

## 레거시 커밋이 실제로 한 것

- `goLeft` spring에 `restDisplacementThreshold: 100`, `restSpeedThreshold: 100`을 추가한다.
- dismiss 완료 후 `onDismiss` callback에서 index를 올리고 position을 리셋하는 흐름은 유지한다.
- 결과적으로 왼쪽 dismiss의 정지 판정이 더 빨라지거나 거칠게 끝나도록 조정하려는 의도가 드러난다.

## 이때의 핵심 개념

### 1. "animation이 끝났다"는 것도 튜닝 가능한 정책이다

- logical callback이 언제 실행되는지는
  spring의 rest 판정과 연결된다.

### 2. interaction의 체감 속도는 단순 duration만으로 결정되지 않는다

- spring 파라미터는
  멈춤 시점의 감각을 크게 바꾼다.

### 3. completion timing이 deck progression과 직결된다

- 너무 늦게 끝나도 답답하고,
  너무 빨리 끊겨도 부자연스럽다.

## 현재 대응 개념

### 1. 지금 Reanimated `withSpring`의 비교 축은 `stiffness`, `damping`, `energyThreshold` 쪽이다

- 현재 Reanimated 4 문서는 physics-based spring에서
  `stiffness`, `damping`, `mass`, `velocity`, `overshootClamping`, `energyThreshold` 같은 설정을 제공한다.

### 2. rest tuning보다 interaction intent를 먼저 정하는 편이 current하다

- "빠르게 사라져야 하는 dismiss인지"
- "약간 튕기며 나가야 하는지"
- "overshoot를 허용할지"
  를 먼저 정한 뒤 파라미터를 잡는다.

### 3. 좌우 dismiss 설정은 대칭적으로 관리하는 편이 좋다

- 한쪽만 따로 다듬기 시작하면
  interaction consistency가 금방 흔들린다.

## 현재 베스트 프랙티스

- animation tuning은 감각 언어와 제품 의도부터 정하고 들어간다.
- spring completion이 business state transition과 묶일 때는 callback 타이밍을 특히 조심한다.
- 새 구현에선 opaque legacy threshold보다 `stiffness` / `damping` / `overshootClamping` / `energyThreshold` 조합을 우선 검토한다.
- dismiss left/right는 같은 motion family로 유지하되, 정말 필요한 차이만 따로 둔다.


## 스킬 추출 후보

### 트리거

- dismiss motion이 너무 늦게 끝나거나, state transition callback 타이밍이 어색할 때

### 권장 기본값

- spring을 감각 언어로 먼저 정의한다: 단단함, 반발, overshoot 허용 여부.
- Reanimated에선 `stiffness`, `damping`, `overshootClamping`, `energyThreshold` 계열을 우선 검토한다.

### 레거시 안티패턴

- 한쪽 방향 spring에만 임의 threshold를 더하고 이유를 남기지 않기
- completion timing 문제를 무작정 숫자 증가로만 해결하기

### 예외 / 선택 기준

- 레거시 RN Animated 유지보수라면 기존 threshold 파라미터를 당장 바꾸지 않을 수 있다.

### 현재식 코드 스케치

```tsx
const dismissConfig = {
  stiffness: 220,
  damping: 22,
  overshootClamping: true,
};

translateX.value = withSpring(EXIT_X, dismissConfig, finished => {
  if (finished) runOnJS(onDismiss)();
});
```

### 스킬 규칙 초안

- "spring completion이 상태 전이와 연결될 때는 감각 언어를 먼저 정하고, 현재식 파라미터로 한 motion family를 일관되게 튜닝한다."

## 관련 페이지

- [카드 덱 순환과 데이터 기반 아이콘 시퀀스](card-deck-index-cycling-and-data-driven-icon-sequences.md)
- [분류형 드래그를 위한 세로 드롭존 셸](vertical-drop-zone-shell-for-classification-drag.md)

## 참고 자료

- [React Native Animated](https://reactnative.dev/docs/animated)
- [React Native Reanimated withSpring](https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/)
