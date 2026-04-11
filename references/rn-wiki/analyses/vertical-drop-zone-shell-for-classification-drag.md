# 분류형 드래그를 위한 세로 드롭존 셸 | Vertical Drop-Zone Shell for Classification Drag

## 범위

- `nomadcoders/nomad-lang` 커밋 `62e9c37` (`3.17 Drag and Drop Project part One`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 카드 덱 예제를 걷어내고, 위/아래 목표 영역과 중앙 아이콘 카드만 남긴 분류형 drag-and-drop 셸로 문제를 재정의한다.
- 즉 interaction의 핵심이 "좌우 swipe"에서 "세로 분류 드롭"으로 바뀐다.

## 레거시 커밋이 실제로 한 것

- 배경색, 상단/하단 edge, 중앙 center 영역을 다시 잡는다.
- 상단에는 `알아`, 하단에는 `몰라` 라벨을 둔다.
- 중앙에는 흰색 `IconCard`를 두고 `Animated.ValueXY` 기반 transform만 준비한다.
- 이전 카드 덱, 버튼, rotation, preview card, dismiss 로직은 대부분 제거한다.
- 이 시점에는 실제 pan responder도 붙지 않는다.

## 이때의 핵심 개념

### 1. interaction 설계는 gesture 코드보다 target model이 먼저다

- 어디에 놓을 수 있는지,
  어떤 의미를 가진 target인지가 먼저 정리된다.

### 2. drag-and-drop은 swipe와 다른 공간 모델을 가진다

- 방향성보다
  drop zone과 subject의 관계가 더 중요해진다.

### 3. 예제 전환기에는 일단 구조를 단순화하는 것이 유효하다

- 이전 복잡한 deck state를 잠시 버리고
  새 문제만 남긴다.

## 현재 대응 개념

### 1. 지금도 drop interaction은 layout shell을 먼저 세우는 편이 좋다

- target zone, draggable subject, empty state를 먼저 배치한 뒤
  gesture/hit-testing을 얹는 흐름은 여전히 합리적이다.

### 2. target은 나중에 측정 가능해야 한다

- current 구현이라면 각 zone의 layout 정보나 bounds를
  추후 acceptance 판단에 쓸 수 있게 설계한다.

### 3. 분류형 drag는 semantics가 먼저다

- "알아", "몰라"처럼 target 이름이 이미 도메인 action이다.
- 그래서 애니메이션 이전에 action model이 분명해야 한다.

## 현재 베스트 프랙티스

- drag-and-drop UI는 먼저 target shell과 도메인 액션 이름을 고정한다.
- 드롭존은 시각적으로 충분히 구분되고, 나중에 geometry 판단이 가능하도록 설계한다.
- 이전 interaction 예제의 animation state를 그대로 끌고 오지 말고 새 문제에 맞게 state model을 다시 짠다.
- draggable subject와 drop zone을 서로 다른 책임의 컴포넌트로 나누는 편이 장기적으로 낫다.


## 스킬 추출 후보

### 트리거

- 항목을 위/아래 또는 여러 카테고리로 분류하는 drag-and-drop 화면을 설계할 때

### 권장 기본값

- gesture 코드보다 먼저 drop zone 의미와 레이아웃 shell을 정의한다.
- target 이름 자체를 도메인 action으로 본다.

### 레거시 안티패턴

- target semantics 없이 모션 코드부터 만들기
- 드롭존 geometry를 나중에 전혀 측정할 수 없게 배치하기

### 예외 / 선택 기준

- purely visual mock이면 target bounds 측정을 생략할 수 있다.
- 실제 판정이 필요한 순간부터는 geometry 확보가 필요하다.

### 현재식 코드 스케치

```tsx
const zones = [
  { id: 'know', label: '알아' },
  { id: 'unknown', label: '몰라' },
] as const;

return zones.map((zone) => <DropZone key={zone.id} label={zone.label} />);
```

### 스킬 규칙 초안

- "분류형 drag-and-drop은 gesture 구현보다 먼저 drop zone shell과 도메인 action semantics를 고정한다."

## 관련 페이지

- [dismiss 전환을 위한 스프링 정지 임계값 튜닝](spring-rest-threshold-tuning-for-dismiss-transitions.md)
- [중앙 드래그 카드와 드롭 타깃 상호작용 기초](draggable-center-card-and-drop-target-interaction-foundation.md)

## 참고 자료

- [React Native Animated.ValueXY](https://reactnative.dev/docs/animatedvaluexy)
- [RNGH Pan gesture](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/gestures/pan-gesture/)
