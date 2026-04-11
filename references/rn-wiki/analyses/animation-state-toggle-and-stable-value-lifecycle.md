# 애니메이션 상태 토글과 stable value 수명 | Animation State Toggle and Stable Value Lifecycle

## 범위

- `nomadcoders/nomad-lang` 커밋 `03db0dc` (`3.5 Animation and State`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 `Animated.Value`를 `useRef`로 고정하고, animation completion callback으로 React state를 토글하는 구조를 만든다.
- 즉 "animation value의 수명"과 "semantic state의 전환"이 처음 분리된다.

## 레거시 커밋이 실제로 한 것

- `const Y = useRef(new Animated.Value(0)).current`로 value 생명주기를 고정한다.
- `up` boolean state를 두고, `Animated.timing(...).start(toggleUp)`로 완료 후 상태를 바꾼다.
- `Easing.circle`을 써서 spring이 아닌 timing curve로 움직인다.

## 이때의 핵심 개념

### 1. animation value는 재렌더마다 새로 만들면 안 된다

- 이 커밋은 그 사실을 `useRef`로 처음 바로잡는다.

### 2. animation이 끝난 뒤 상태를 바꾸는 completion callback이 있다

- "애니메이션 중"과 "애니메이션 완료 후"를 분리해 다루기 시작한다.

## 현재 대응 개념

### 1. transient animation state와 semantic UI state를 나누는 발상은 여전히 중요하다

- 단, 지금은 animation progress 자체를 React state로 들기보다 shared value/derived value에 두는 편이 자연스럽다.

### 2. completion callback보다 snap rule/derived state가 더 현재식일 때가 많다

- 단순 토글 데모를 넘어서면 callback chaining보다 상태 기계나 snap condition이 더 읽기 쉽다.

## 현재 베스트 프랙티스

- animation source는 stable ref/shared value로 유지한다.
- React state는 실제 semantic mode 전환에만 쓰고, 프레임성 값은 넣지 않는다.
- `withTiming`/`withSpring`과 derived style을 조합해 React render 의존성을 줄인다.


## 스킬 추출 후보

### 트리거

- 애니메이션 진행값과 실제 UI 모드가 함께 등장할 때
- 완료 callback에서 React state를 바꾸는 코드를 볼 때

### 권장 기본값

- motion progress는 shared value/animated value에 둔다.
- React state는 열린/닫힌 상태 같은 semantic mode에만 쓴다.
- 필요하면 completion callback은 semantic transition의 경계에만 둔다.

### 레거시 안티패턴

- 애니메이션 프레임값을 React state에 넣기
- callback chaining으로 전체 interaction 로직을 이어붙이기

### 예외 / 선택 기준

- 단순 2상태 데모에선 completion callback 토글이 가장 읽기 쉬울 수 있다.
- 상태가 3단계 이상으로 늘어나면 state machine 쪽이 더 낫다.

### 현재식 코드 스케치

```tsx
const open = useSharedValue(0);
const [expanded, setExpanded] = useState(false);

const toggle = () => {
  const next = expanded ? 0 : 1;
  open.value = withTiming(next, {}, (finished) => {
    if (finished) runOnJS(setExpanded)(!expanded);
  });
};
```

### 스킬 규칙 초안

- "애니메이션 진행값과 semantic UI state는 분리하고, completion callback은 상태 전이의 경계에만 둔다."

## 관련 페이지

- [스프링 기반 첫 이동 애니메이션](spring-driven-first-motion.md)
- [단일 위치 값에서 여러 스타일 보간](single-value-to-multi-style-interpolation.md)

## 참고 자료

- [React Native Animated](https://reactnative.dev/docs/animated)
- [Reanimated withTiming](https://docs.swmansion.com/react-native-reanimated/docs/animations/withTiming/)
