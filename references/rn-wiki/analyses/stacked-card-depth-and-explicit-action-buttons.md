# 스택형 카드 깊이감과 명시적 액션 버튼 | Stacked Card Depth and Explicit Action Buttons

## 범위

- `nomadcoders/nomad-lang` 커밋 `ad5c3ca` (`3.14 Card Project part Three`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 "지금 보는 카드" 뒤에 "다음 카드"를 깔고,
  drag와 동일한 결과를 내는 explicit accept/reject 버튼을 추가한다.
- 즉 single card demo가 deck preview와 alternate action entry를 가진 제품 UI로 커진다.

## 레거시 커밋이 실제로 한 것

- 뒤 카드 하나를 absolute card로 추가한다.
- 앞 카드의 `position`에서 `secondScale`을 interpolate해,
  앞 카드를 움직일수록 뒤 카드가 커지게 만든다.
- 좌우 dismiss용 `goLeft`, `goRight` animation을 별도 정의한다.
- 하단에 `close` / `checkmark` 버튼을 두고, 버튼 press도 같은 dismiss animation을 실행한다.

## 이때의 핵심 개념

### 1. 다음 카드 미리보기는 interaction의 연속성을 만든다

- 현재 카드만 움직이는 것보다,
  뒤 카드가 살아 있으면 deck 구조가 더 분명해진다.

### 2. drag와 button은 서로 다른 입력이지만 같은 action model을 가질 수 있다

- 왼쪽으로 넘기기와 close 버튼은
  사실상 같은 의미를 공유한다.

### 3. 시각적 깊이감은 state가 아니라 파생 애니메이션으로 만들 수 있다

- 뒤 카드의 scale은 독립 상태가 아니라
  앞 카드 위치에서 계산된다.

## 현재 대응 개념

### 1. 지금은 secondary card feedback도 derived value로 읽는 편이 기본이다

- background card scale, opacity, translateY는
  앞 카드 translation에서 파생하는 편이 자연스럽다.

### 2. 명시적 액션 버튼은 `TouchableOpacity`보다 `Pressable` 쪽이 current하다

- React Native 공식 문서도
  touch handling의 기본 비교 대상으로 `Pressable`을 더 강하게 민다.

### 3. action source는 여러 개여도 transition pipeline은 하나여야 한다

- drag dismiss와 button dismiss가 서로 다른 animation code를 갖기 시작하면 금방 어긋난다.

## 현재 베스트 프랙티스

- gesture dismiss와 explicit action button은 같은 reducer/action handler로 연결한다.
- 미리보기 카드의 시각 피드백은 앞 카드 translation에서 파생한다.
- action button에는 충분한 hitSlop과 접근성 label을 둔다.
- touchable primitive는 새 구현에선 `Pressable`을 우선 검토한다.


## 스킬 추출 후보

### 트리거

- 다음 카드 preview와 explicit accept/reject 버튼이 함께 있는 deck UI

### 권장 기본값

- swipe dismiss와 button dismiss를 같은 action handler로 연결한다.
- 뒤 카드의 scale/opacity는 앞 카드 translation에서 파생한다.

### 레거시 안티패턴

- 버튼용 dismiss 로직과 gesture용 dismiss 로직을 따로 관리하기
- preview card 상태를 별도 setState로 따로 흔들기

### 예외 / 선택 기준

- 버튼이 전혀 없는 swipe-only 데모라면 pipeline 통합이 필요 없을 수 있다.

### 현재식 코드 스케치

```tsx
const dismiss = (direction: 'left' | 'right') => {
  translateX.value = withSpring(direction === 'left' ? -EXIT_X : EXIT_X, {}, finished => {
    if (finished) runOnJS(onDismiss)(direction);
  });
};

const nextCardStyle = useAnimatedStyle(() => ({
  transform: [{ scale: interpolate(Math.abs(translateX.value), [0, EXIT_X], [0.92, 1]) }],
}));
```

### 스킬 규칙 초안

- "스택형 카드 UI에선 swipe와 explicit 버튼을 같은 dismiss pipeline으로 묶고, 뒤 카드 깊이감은 파생 애니메이션으로 만든다."

## 관련 페이지

- [회전 피드백과 스와이프 dismiss 임계값](swipe-dismiss-thresholds-and-rotation-feedback.md)
- [카드 덱 순환과 데이터 기반 아이콘 시퀀스](card-deck-index-cycling-and-data-driven-icon-sequences.md)

## 참고 자료

- [React Native Pressable](https://reactnative.dev/docs/pressable)
- [React Native Animated](https://reactnative.dev/docs/animated)
- [React Native Reanimated interpolate](https://docs.swmansion.com/react-native-reanimated/docs/utilities/interpolate/)
