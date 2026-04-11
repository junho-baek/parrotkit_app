# Animated.Value와 animatable component의 기본 규칙 | Animated.Value and Animatable Component Basics

## 범위

- `nomadcoders/nomad-lang` 커밋 `543c325` (`3.3 The Rules of Animation`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 "애니메이션은 state를 직접 흔드는 것이 아니라 `Animated.Value`와 animatable component를 통해 구동한다"는 규칙을 소개한다.
- 즉 이전 커밋의 수동 루프를 전용 animation model로 바꾸는 전환점이다.

## 레거시 커밋이 실제로 한 것

- `useState`, `useEffect`, `setInterval`을 제거한다.
- `const Y = new Animated.Value(0)`를 만든다.
- `Animated.createAnimatedComponent(Box)`로 `AnimatedBox`를 만든다.
- `translateY`에 숫자 state 대신 `Animated.Value`를 연결한다.

## 이때의 핵심 개념

### 1. 애니메이션 값은 일반 state와 별도 모델이다

- 화면 렌더링용 state와 애니메이션 구동용 value가 분리되기 시작한다.

### 2. 모든 컴포넌트가 바로 animatable한 것은 아니다

- `Animated.View`나 `createAnimatedComponent()` 같은 감싼 형태가 필요하다.

## 현재 대응 개념

### 1. RN Animated의 대응 개념은 Reanimated `useSharedValue`다

- 현재 Reanimated 기준에선 `Animated.Value`보다 shared value와 animated style 조합이 더 현대적이다.

### 2. 생성 위치는 render body보다 stable ref/hook 쪽이 더 중요하다

- 이 커밋은 개념 소개라 render 안에 `new Animated.Value(0)`를 두지만,
  현재 RN Animated 문서는 `useRef`로 수명을 고정하라고 설명한다.

## 현재 베스트 프랙티스

- RN Animated를 쓸 때도 `useRef(new Animated.Value(0)).current`로 만든다.
- 새 프로젝트의 상호작용 애니메이션은 Reanimated `useSharedValue`를 우선 검토한다.
- animatable wrapper와 animation source를 초반부터 분리해서 본다.


## 스킬 추출 후보

### 트리거

- 숫자 값을 화면 이동이나 투명도에 연결하려는 초기 애니메이션 코드
- 일반 컴포넌트를 animatable하게 감싸려는 상황

### 권장 기본값

- RN Animated를 쓸 땐 `useRef(new Animated.Value(...)).current`로 수명을 고정한다.
- 새 제스처/상호작용 화면은 Reanimated `useSharedValue` + `useAnimatedStyle`을 우선 검토한다.

### 레거시 안티패턴

- render body에서 매번 `new Animated.Value()` 만들기
- 일반 `View`에 animated value를 바로 꽂으려 하기

### 예외 / 선택 기준

- 아주 짧은 개념 데모라면 render body 생성도 설명용으론 가능하지만, 문서/실무 기본값으로 남기진 않는다.

### 현재식 코드 스케치

```tsx
const opacity = useSharedValue(0);
const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));

return <Animated.View style={animatedStyle} />;
```

### 스킬 규칙 초안

- "애니메이션 소스 값은 안정적으로 유지하고, animatable wrapper 또는 animated style을 통해 화면에 연결한다."

## 관련 페이지

- [수동 프레임 루프와 Animated.Value의 도입](manual-frame-loop-and-animated-value-introduction.md)
- [스프링 기반 첫 이동 애니메이션](spring-driven-first-motion.md)

## 참고 자료

- [React Native Animated](https://reactnative.dev/docs/animated)
- [React Native Reanimated Getting Started](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)
