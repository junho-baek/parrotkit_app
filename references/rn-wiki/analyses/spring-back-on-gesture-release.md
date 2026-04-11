# 드래그 해제 후 스프링 복귀 | Spring Back on Gesture Release

## 범위

- `nomadcoders/nomad-lang` 커밋 `4a5e62f` (`3.10 Pan Responder part Two`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 release 시점에 `Animated.spring(POSITION, { toValue: {x:0,y:0} })`를 붙여, 드래그 뒤 원위치 복귀를 만든다.
- tracking만 하던 gesture가 이제 complete interaction cycle을 갖는다.

## 레거시 커밋이 실제로 한 것

- `onPanResponderRelease`를 추가한다.
- release 후 스프링으로 `{x:0, y:0}`에 복귀시킨다.
- transform 표현도 `POSITION.getTranslateTransform()`로 단순화한다.

## 이때의 핵심 개념

### 1. interaction은 move뿐 아니라 release 이후 행동까지 포함한다

### 2. drag와 snap-back은 별도 애니메이션 단계다

## 현재 대응 개념

### 1. 현재 대응 개념은 `onEnd` + `withSpring` snap이다

- Gesture Handler + Reanimated 조합에선 release velocity와 target snap point를 기준으로 `withSpring`을 거는 식으로 옮겨 읽는다.

### 2. 복귀는 고정 원점이 아니라 snap point 집합일 때가 많다

- 카드, 바텀시트, draggable token처럼 실무 UI는 원점 복귀보다 nearest snap target이 더 흔하다.

## 현재 베스트 프랙티스

- release 시점 애니메이션은 velocity, threshold, snap point를 함께 본다.
- `withSpring` config는 UX 목적에 맞춰 조정한다.
- gesture update와 release logic을 한 파일 안에서도 명확히 분리한다.


## 스킬 추출 후보

### 트리거

- 드래그가 취소되거나 threshold를 넘지 못했을 때 원위치로 돌아와야 하는 UI

### 권장 기본값

- `onEnd`에서 commit 여부를 먼저 판단하고, 실패하면 home/snap point로 spring 복귀시킨다.
- track, decide, settle 세 단계를 명시적으로 나눈다.

### 레거시 안티패턴

- move 단계와 release 복귀 로직을 섞기
- 매번 새 spring 객체를 흩어져 정의하기

### 예외 / 선택 기준

- 카드가 마지막 드롭 위치에 남아야 하는 누적형 drag라면 복귀 대신 base position 갱신이 맞다.

### 현재식 코드 스케치

```tsx
const homeX = 0;
const pan = Gesture.Pan()
  .onUpdate((e) => {
    tx.value = e.translationX;
  })
  .onEnd((e) => {
    tx.value = withSpring(shouldCommit(e) ? snapPoint : homeX);
  });
```

### 스킬 규칙 초안

- "gesture release는 추적 단계와 분리하고, commit 실패 시 명시된 home 또는 snap point로 복귀시킨다."

## 관련 페이지

- [PanResponder 기반 드래그 추적](panresponder-driven-drag-tracking.md)
- [드래그 누적을 위한 setOffset과 flattenOffset](drag-offset-accumulation-with-setoffset-and-flattenoffset.md)

## 참고 자료

- [React Native PanResponder](https://reactnative.dev/docs/panresponder)
- [Reanimated withSpring](https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/)
