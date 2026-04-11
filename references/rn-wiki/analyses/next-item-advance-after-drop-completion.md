# 드롭 완료 후 다음 항목으로 진행하는 상태 전이 | Post-Drop State Transition to the Next Item

## 범위

- `nomadcoders/nomad-lang` 커밋 `dcd05db` (`3.19 Drag and Drop Project part Three`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 accepted drop 뒤에 다음 아이콘으로 넘어가는 `index` 상태 전이를 붙여,
  drag-and-drop demo를 실제 진행형 학습 흐름처럼 만든다.
- 즉 drop 성공은 animation 완료와 다음 item advance까지 포함한 전체 state transition이 된다.

## 레거시 커밋이 실제로 한 것

- `index` state를 추가한다.
- accepted drop sequence의 completion callback에서 `nextIcon`을 실행한다.
- `nextIcon`은:
  - `index`를 1 증가시키고
  - `scale`을 1로 복구하고
  - `opacity`를 1로 복구한다.
- 카드 아이콘도 고정 `beer`가 아니라 `icons[index]`를 읽는다.

## 이때의 핵심 개념

### 1. drop success는 단순 애니메이션 끝이 아니라 다음 데이터로의 진행이다

- motion completion이
  곧 content progression trigger가 된다.

### 2. animated value reset과 logical index advance는 함께 설계돼야 한다

- 하나만 바뀌면
  다음 카드가 비정상 상태로 보일 수 있다.

### 3. callback 기반 상태 전이는 작은 state machine의 시작점이다

- idle
- dragging
- accepted
- resetting
- next item

같은 단계가 암묵적으로 생긴다.

## 현재 대응 개념

### 1. current 구현에선 이런 흐름을 state machine처럼 읽는 편이 좋다

- gesture 상태, drop 결과, 다음 item advance를
  하나의 진행 모델로 보는 편이 덜 헷갈린다.

### 2. animation completion callback은 JS 상태 변경과의 경계다

- Reanimated를 쓸 때는 completion callback에서
  JS 상태 변경을 어떻게 연결할지 의식해야 한다.

### 3. end-of-list 처리도 같은 설계 범주다

- index만 계속 증가시키면
  eventually bounds 문제가 생긴다.

## 현재 베스트 프랙티스

- drag/drop flow는 단계별 state transition으로 문서화한다.
- animated value reset과 item advance를 한 경로에 모아둔다.
- end-of-list, loop 여부, direction payload를 함께 설계한다.
- 단순 demo를 실제 기능으로 키울 때는 `index` 하나보다 item id와 action result까지 함께 저장하는 편이 더 낫다.


## 스킬 추출 후보

### 트리거

- accepted drop 또는 dismiss 뒤 다음 항목으로 넘어가야 하는 진행형 interaction

### 권장 기본값

- animation reset과 data advance를 같은 전이 함수에서 처리한다.
- end-of-list, loop 여부, 방향 payload를 함께 설계한다.
- interaction flow를 작은 state machine처럼 본다.

### 레거시 안티패턴

- completion callback 여러 군데에서 index를 따로 증가시키기
- animated value reset과 item advance 순서를 일관되게 관리하지 않기

### 예외 / 선택 기준

- 완전 일회성 데모라면 단일 `index++`도 가능하지만, 재사용 가능한 스킬 규칙으로 남기기엔 약하다.

### 현재식 코드 스케치

```tsx
const commitDrop = (zoneId: ZoneId) => {
  setItems((prev) => prev.slice(1));
  translateX.value = 0;
  translateY.value = 0;
  opacity.value = 1;
};
```

### 스킬 규칙 초안

- "drop completion 뒤의 다음 항목 진행은 animation reset과 data advance를 하나의 상태 전이 함수에서 처리한다."

## 관련 페이지

- [드롭존 확대 피드백과 승인 드롭 시퀀스](drop-zone-scaling-and-accepted-drop-sequences.md)
- [카드 덱 순환과 데이터 기반 아이콘 시퀀스](card-deck-index-cycling-and-data-driven-icon-sequences.md)

## 참고 자료

- [React Native Animated](https://reactnative.dev/docs/animated)
- [React Native Reanimated withSpring](https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/)
