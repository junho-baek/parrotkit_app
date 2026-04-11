# 카드 덱 순환과 데이터 기반 아이콘 시퀀스 | Card Deck Cycling and Data-Driven Icon Sequences

## 범위

- `nomadcoders/nomad-lang` 커밋 `1284ef9` (`3.15 Card Project part Four`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 정적인 pizza/beer 카드 예제를 벗어나,
  `icons` 배열과 `index` 상태로 실제 deck progression을 붙인다.
- 즉 animation shell 위에 처음으로 "다음 카드로 넘어가는 데이터 흐름"이 생긴다.

## 레거시 커밋이 실제로 한 것

- `icons.js`에 큰 아이콘 이름 배열을 추가한다.
- `index` state를 두고 현재 카드와 다음 카드를 `icons[index]`, `icons[index + 1]`로 읽는다.
- dismiss animation의 completion callback에서 `onDismiss`를 실행해:
  - `scale`을 1로 되돌리고
  - `position`을 0으로 리셋하고
  - `index`를 1 증가시킨다.
- 버튼 dismiss와 gesture dismiss 모두 동일한 `onDismiss`를 거친다.

## 이때의 핵심 개념

### 1. 카드 interaction은 결국 collection state를 움직인다

- 카드 한 장의 motion만으론 제품이 되지 않고,
  "다음 항목으로 간다"는 상태 전이가 붙어야 한다.

### 2. animation completion callback이 logical progression을 여는 순간이 된다

- dismiss motion이 끝난 뒤에야
  다음 카드로 바꿀 수 있다.

### 3. front card와 next card preview는 서로 다른 data slot을 가진다

- 현재와 다음 아이템을 동시에 읽는 구조가 생긴다.

## 현재 대응 개념

### 1. 현재식으론 raw index보다 stable id 기반 deck state가 더 안전하다

- `index + 1` 방식은 빠르지만,
  끝에 도달했을 때 guard가 약하다.

### 2. animation state와 data state는 분리해서 다루는 편이 좋다

- 카드의 translate/scale과
  deck item pointer는 다른 종류의 상태다.

### 3. current UI에선 preview item도 명시적 model로 두는 편이 낫다

- `currentItem`, `nextItem`을 selector나 memo로 분리하면
  deck 종료 조건과 placeholder 처리도 더 명확해진다.

## 현재 베스트 프랙티스

- deck item은 stable id를 가진 데이터 구조로 둔다.
- animation 완료 후 상태 전이를 일으키는 callback 경로를 한 군데로 모은다.
- end-of-deck, loop 여부, empty state를 초기에 함께 설계한다.
- 큰 정적 데이터 파일은 예제 단계에서 가능하지만, 실제 앱에선 feature domain data로 옮기는 편이 좋다.


## 스킬 추출 후보

### 트리거

- dismiss 후 다음 카드나 다음 항목으로 넘어가는 deck progression 로직이 필요할 때

### 권장 기본값

- raw array index보다 stable id와 selector를 우선 검토한다.
- current item과 next item은 명시적으로 계산한다.
- animation completion 뒤 상태 전이를 한 경로로 모은다.

### 레거시 안티패턴

- `index + 1`에만 의존하고 end-of-deck guard를 두지 않기
- animation reset과 data advance를 다른 함수에 흩뿌리기

### 예외 / 선택 기준

- 아주 작은 finite demo에선 index 기반도 충분하다.
- 실제 앱으로 가면 loop, end, empty state를 바로 같이 설계하는 편이 낫다.

### 현재식 코드 스케치

```tsx
const [cursor, setCursor] = useState(0);
const currentItem = items[cursor] ?? null;
const nextItem = items[cursor + 1] ?? null;

const advance = () => {
  setCursor((prev) => Math.min(prev + 1, items.length));
};
```

### 스킬 규칙 초안

- "deck progression은 animation completion 뒤 한 경로에서 처리하고, current/next item 계산과 end-of-deck guard를 함께 둔다."

## 관련 페이지

- [스택형 카드 깊이감과 명시적 액션 버튼](stacked-card-depth-and-explicit-action-buttons.md)
- [dismiss 전환을 위한 스프링 정지 임계값 튜닝](spring-rest-threshold-tuning-for-dismiss-transitions.md)

## 참고 자료

- [React Native Animated](https://reactnative.dev/docs/animated)
- [React Native Reanimated withSpring](https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/)
