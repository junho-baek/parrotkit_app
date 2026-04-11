# 스프링 기반 첫 이동 애니메이션 | Spring-Driven First Motion

## 범위

- `nomadcoders/nomad-lang` 커밋 `e7e3283` (`3.4 Our First Animation`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 `Animated.spring()`으로 첫 실제 이동 애니메이션을 붙인다.
- 값의 존재를 넘어서, "터치 -> spring -> 이동"이라는 최소 상호작용 루프가 성립한다.

## 레거시 커밋이 실제로 한 것

- `TouchableOpacity`를 감싸 클릭 진입점을 만든다.
- `Animated.spring(Y, { toValue: -200, bounciness: 20, useNativeDriver: true })`를 호출한다.
- `Y.addListener()`로 값 변화를 로그로 확인한다.

## 이때의 핵심 개념

### 1. spring은 위치 값을 물리 모델로 이동시킨다

- 숫자를 즉시 바꾸지 않고, 시간에 걸쳐 부드럽게 이동한다.

### 2. 터치 진입점과 animatable view를 분리할 수 있다

- 눌리는 컴포넌트와 실제 움직이는 컴포넌트가 꼭 같을 필요는 없다.

## 현재 대응 개념

### 1. 지금의 spring 기본값은 `withSpring` 쪽이다

- Reanimated의 현재 대응 개념은 shared value를 `withSpring(...)`으로 갱신하는 구조다.

### 2. 터치 컴포넌트는 `TouchableOpacity`보다 `Pressable`이 더 현재식이다

- 애니메이션과는 별개로, 일반 탭 진입점은 `Pressable` 쪽이 더 current하다.

## 현재 베스트 프랙티스

- UI thread에서 안정적으로 움직여야 하는 상호작용은 Reanimated spring으로 옮겨 읽는 편이 좋다.
- spring config는 `bounciness` 감각만 볼 게 아니라, snap point와 목적 UX를 함께 본다.
- 디버깅용 `addListener`는 오래 남기지 않고 개발 중 확인용으로만 쓴다.


## 스킬 추출 후보

### 트리거

- 탭이나 버튼 입력 뒤 요소가 이동하거나 튕겨야 할 때

### 권장 기본값

- 입력은 `Pressable`, 모션은 `withSpring` 또는 `Animated.spring`으로 나눈다.
- spring은 이동 목적지와 UX 감각을 먼저 정하고 파라미터를 고른다.

### 레거시 안티패턴

- `TouchableOpacity`를 기본 touch primitive로 고정하기
- 디버깅용 listener/log를 production 코드에 남기기

### 예외 / 선택 기준

- 레거시 RN Animated 화면을 유지보수하는 중이라면 `Animated.spring`을 그대로 둘 수 있다.
- 새 gesture-heavy 화면이라면 Reanimated spring이 더 자연스럽다.

### 현재식 코드 스케치

```tsx
const offsetY = useSharedValue(0);
const style = useAnimatedStyle(() => ({
  transform: [{ translateY: offsetY.value }],
}));

const onPress = () => {
  offsetY.value = withSpring(-200);
};
```

### 스킬 규칙 초안

- "탭 이후의 물리적 이동은 press 입력과 spring 모션을 분리해 설계한다."

## 관련 페이지

- [Animated.Value와 animatable component의 기본 규칙](animated-value-and-create-animated-component-basics.md)
- [애니메이션 상태 토글과 stable value 수명](animation-state-toggle-and-stable-value-lifecycle.md)

## 참고 자료

- [React Native Animated](https://reactnative.dev/docs/animated)
- [Reanimated withSpring](https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/)
