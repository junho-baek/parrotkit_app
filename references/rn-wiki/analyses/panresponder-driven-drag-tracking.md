# PanResponder 기반 드래그 추적 | PanResponder-Driven Drag Tracking

## 범위

- `nomadcoders/nomad-lang` 커밋 `d88be38` (`3.9 Pan Responder`)를 기준으로 본다.

## 짧은 결론

- 이 커밋은 scripted path animation을 버리고, 손가락 이동량 `dx`, `dy`를 `POSITION.setValue`에 직접 연결한다.
- 즉 animation demo에서 gesture-driven interaction demo로 축이 바뀐다.

## 레거시 커밋이 실제로 한 것

- `PanResponder.create(...)`를 도입한다.
- `onPanResponderMove`에서 `{ dx, dy }`를 받아 `POSITION.setValue({ x: dx, y: dy })` 한다.
- 이전의 looped motion과 `Dimensions` 기반 경로는 제거된다.

## 이때의 핵심 개념

### 1. 사용자의 손가락이 곧 animation source가 된다

### 2. drag gesture는 2D translation model과 잘 맞는다

- 그래서 `ValueXY`가 자연스럽게 이어진다.

## 현재 대응 개념

### 1. `PanResponder`는 여전히 존재하지만 현재식 기본값은 아니다

- React Native 문서는 `PanResponder`를 계속 제공하지만,
  현재 gesture-heavy UI의 기본 비교 대상은 Gesture Handler의 Pan gesture다.

### 2. 지금의 대응 개념은 `Gesture.Pan()` + shared value update다

- Gesture Handler는 native touch system 기반이고, Reanimated와 직접 결합해 UI thread 처리로 이어진다.

## 현재 베스트 프랙티스

- 새 drag interaction은 `PanResponder`보다 `react-native-gesture-handler` Pan gesture를 우선 검토한다.
- drag translation은 React state가 아니라 shared value에 둔다.
- 추적 단계와 release/snap 단계를 분리해서 설계한다.


## 스킬 추출 후보

### 트리거

- 카드 드래그, 스와이프, 슬라이더처럼 손가락 translation을 직접 추적하는 UI

### 권장 기본값

- 새 구현은 `Gesture.Pan()` + shared value 조합을 우선 검토한다.
- 드래그 추적 단계와 release/snap 단계를 분리한다.

### 레거시 안티패턴

- 새 high-frequency drag UI에서 `PanResponder`를 기본값으로 고정하기
- translation을 React state로 들기

### 예외 / 선택 기준

- 레거시 유지보수, 의존성 추가가 불가능한 작은 데모라면 `PanResponder`도 허용 가능하다.

### 현재식 코드 스케치

```tsx
const tx = useSharedValue(0);
const ty = useSharedValue(0);
const pan = Gesture.Pan()
  .onUpdate((e) => {
    tx.value = e.translationX;
    ty.value = e.translationY;
  });
```

### 스킬 규칙 초안

- "새 drag interaction은 `PanResponder`보다 `Gesture.Pan()`과 shared value를 기본값으로 삼는다."

## 관련 페이지

- [ValueXY 기반 다중 좌표 경로와 반복 이동](valuexy-sequence-paths-and-looped-motion.md)
- [드래그 해제 후 스프링 복귀](spring-back-on-gesture-release.md)

## 참고 자료

- [React Native PanResponder](https://reactnative.dev/docs/panresponder)
- [RNGH Pan gesture](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/gestures/pan-gesture)
