# 회전 피드백과 스와이프 dismiss 임계값 | Rotation Feedback and Swipe Dismiss Thresholds

## 범위

- `nomadcoders/nomad-lang` 커밋 `301bf0a` (`3.13 Card Project part Two`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 단순 수평 drag에 rotation feedback과 dismiss threshold를 더해, 카드가 "판단 가능한 interaction"으로 바뀌는 순간이다.
- release 시점은 이제 "중앙 복귀"와 "화면 밖 dismiss" 중 하나를 고르는 의사결정 단계가 된다.

## 레거시 커밋이 실제로 한 것

- `position.interpolate(...)`로 `rotateZ` 값을 만든다.
- release 시 `dx < -320`, `dx > 320` 조건이면 좌우로 화면 밖까지 spring 시킨다.
- threshold를 넘지 않으면 `goCenter`와 `onPressOut`을 병렬로 실행한다.
- 즉 drag 도중에는 연속값 기반 피드백, release 때는 이산적 분기 로직이 들어간다.

## 이때의 핵심 개념

### 1. 하나의 gesture 값이 여러 시각 피드백을 만든다

- `translateX` 하나에서 rotation까지 파생되며,
  사용자는 같은 손동작을 더 의미 있게 느낀다.

### 2. release는 animation continuation이 아니라 decision point다

- threshold를 넘었는지에 따라
  카드가 돌아오거나 사라진다.

### 3. swipe interaction은 거리만이 아니라 의도 판별 문제다

- 이 커밋은 아직 `dx`만 보지만,
  실제로는 속도와 카드 크기도 중요해진다.

## 현재 대응 개념

### 1. 현재식으론 threshold를 절대값 magic number로 두지 않는 편이 좋다

- `320` 같은 고정 수치보다,
  카드 폭이나 화면 폭 비율로 읽는 편이 더 안정적이다.

### 2. dismissal feedback은 `interpolate`로 파생한다

- rotate, opacity, label 강조 같은 값은
  별도 state보다 translation에서 파생하는 구조가 current하다.

### 3. release 판단에는 velocity도 함께 보는 편이 좋다

- 짧은 거리라도 빠른 fling이면 dismiss,
  긴 거리라도 느리면 복귀시키는 식의 보정이 가능하다.

## 현재 베스트 프랙티스

- swipe dismiss는 거리와 속도를 함께 고려한다.
- rotation, overlay, background card scale은 source value 하나에서 파생한다.
- left/right dismiss 로직은 direction 인자를 받는 단일 함수로 모으는 편이 유지보수에 좋다.
- 애니메이션 threshold는 디자인 토큰처럼 관리하고, 하드코딩 숫자를 JSX 주변에 흩뿌리지 않는다.


## 스킬 추출 후보

### 트리거

- 카드가 일정 거리 또는 속도를 넘기면 dismiss되어야 하는 swipe interaction

### 권장 기본값

- threshold는 거리 비율과 velocity를 함께 본다.
- 회전과 overlay feedback은 `translateX` 하나에서 파생한다.

### 레거시 안티패턴

- `320px` 같은 고정 magic number만으로 판정하기
- dismiss 조건과 visual feedback source를 따로 두기

### 예외 / 선택 기준

- 완전히 고정 폭 카드 한 장만 있는 데모라면 절대값 threshold도 설명용으론 가능하다.

### 현재식 코드 스케치

```tsx
const shouldDismiss = (e: PanGestureHandlerEventPayload) => {
  return Math.abs(e.translationX) > CARD_WIDTH * 0.35 || Math.abs(e.velocityX) > 900;
};

const rotateZ = interpolate(translateX.value, [-CARD_WIDTH, 0, CARD_WIDTH], [-12, 0, 12]);
```

### 스킬 규칙 초안

- "swipe dismiss는 고정 픽셀 숫자보다 카드 폭 비율과 velocity를 함께 기준으로 잡는다."

## 관련 페이지

- [스와이프 카드의 압축·수평 드래그 기초](swipe-card-foundation-with-scale-and-horizontal-drag.md)
- [스택형 카드 깊이감과 명시적 액션 버튼](stacked-card-depth-and-explicit-action-buttons.md)

## 참고 자료

- [React Native Animated](https://reactnative.dev/docs/animated)
- [React Native Reanimated interpolate](https://docs.swmansion.com/react-native-reanimated/docs/utilities/interpolate/)
- [React Native Reanimated withSpring](https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/)
