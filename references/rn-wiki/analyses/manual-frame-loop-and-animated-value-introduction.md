# 수동 프레임 루프와 Animated.Value의 도입 | Manual Frame Loops and Animated.Value Introduction

## 범위

- `nomadcoders/nomad-lang` 커밋 `74862f8` (`3.2 Manual Animations`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 "애니메이션 개념을 설명하기 위해, 가장 먼저 잘못된 방식에 가까운 수동 프레임 루프를 직접 만들어 본 단계"다.
- `setInterval`로 `y` state를 1ms마다 갱신해 `translateY`를 움직인다.
- 현재 기준으로는 학습용 대비는 좋지만, 실무 기본값은 아니다.

## 레거시 커밋이 실제로 한 것

- `Box`를 눌렀을 때 `setInterval`로 `y` 값을 계속 증가시킨다.
- `useEffect`에서 `y === 200`이면 interval을 정리한다.
- 스타일 `transform: [{ translateY: y }]`에 React state를 직접 연결한다.
- 같은 커밋에서 `@types/styled-components`도 추가해 타입 보조를 시작한다.

## 이때의 핵심 개념

### 1. 움직임은 결국 "시간에 따라 변하는 숫자"다

- 애니메이션 입문 단계에서는 먼저 숫자를 바꾸면 화면이 움직인다는 사실을 몸으로 익힌다.

### 2. React render loop와 animation loop는 다르다

- 이 커밋은 의도적으로 둘을 거의 섞어 본다.
- 그래서 왜 전용 animation value가 필요한지 다음 커밋으로 자연스럽게 이어진다.

## 현재 대응 개념

### 1. 지금의 대응 개념은 `Animated.Value` 또는 Reanimated `SharedValue`다

- 현재 React Native `Animated` 문서는 `Animated.Value`를 만들고, animatable component와 연결한 뒤 `Animated.timing()` 등으로 구동하는 흐름을 기본으로 설명한다.
- Reanimated 쪽 기준선은 `useSharedValue` + `useAnimatedStyle`이다.

### 2. 프레임마다 React state를 갱신하는 방식은 현재 기본값이 아니다

- JS timer와 React re-render에 기대는 방식은 gesture/animation이 복잡해질수록 흔들린다.
- 특히 상호작용 애니메이션은 JS thread 부담이 커진다.

## 현재 베스트 프랙티스

- 위치, scale, opacity 같은 animation state는 React state 대신 animation value에 둔다.
- 반복적인 frame update는 `setInterval`로 만들지 않는다.
- 단순 설명용 데모가 아니라면 시작부터 Reanimated shared value를 쓰는 편이 더 current하다.


## 스킬 추출 후보

### 트리거

- `setInterval`, `setTimeout`, `requestAnimationFrame`, React state로 위치나 opacity를 프레임 단위 갱신하려는 코드를 볼 때

### 권장 기본값

- 위치, scale, opacity 같은 고빈도 값은 `Animated.Value` 또는 Reanimated `shared value`에 둔다.
- 시간 기반 이동은 `withTiming`, 물리 기반 이동은 `withSpring`으로 읽는다.

### 레거시 안티패턴

- 프레임마다 `setState` 호출하기
- render loop와 animation loop를 같은 층에서 다루기

### 예외 / 선택 기준

- 애니메이션 원리를 설명하는 아주 짧은 교육용 데모에선 허용 가능하다.
- 실제 상호작용 UI나 gesture와 결합되는 순간 이 방식은 빨리 버리는 편이 좋다.

### 현재식 코드 스케치

```tsx
const translateY = useSharedValue(0);
const style = useAnimatedStyle(() => ({
  transform: [{ translateY: translateY.value }],
}));

const moveDown = () => {
  translateY.value = withTiming(200, { duration: 300 });
};
```

### 스킬 규칙 초안

- "프레임성 위치 변화는 React state가 아니라 animation value로 보관한다."

## 관련 페이지

- [Animated.Value와 animatable component의 기본 규칙](animated-value-and-create-animated-component-basics.md)
- [Expo 기반 애니메이션 샌드박스 부트스트랩](expo-based-animation-sandbox-bootstrap.md)

## 참고 자료

- [React Native Animated](https://reactnative.dev/docs/animated)
- [React Native Reanimated Getting Started](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)
