# 탭 삭제와 LayoutAnimation 리스트 전환 | Tap-to-delete with LayoutAnimation

## 범위

- `nomadcoders/nomad-diary`의 2021-09-26 커밋 `81d2078` (`4.6 Deleting Objects`)를 현재 삭제 UX와 layout animation 관점으로 다시 읽는다.
- 특히:
  - row tap으로 삭제하는 흐름이 어떤 단순화를 했는지
  - `LayoutAnimation.spring()`이 맡은 역할이 무엇인지
  - 현재 기준으론 어떤 부분이 유지되고 어떤 부분이 바뀌는지
  를 정리한다.

## 레거시 커밋이 실제로 한 것

- `Home.js`에 row tap 삭제를 넣었다.
- `TouchableOpacity`로 row를 감싸고,
  press 시:
  - primary key로 object 조회
  - `realm.delete(feeling)`
  를 수행한다.
- Realm collection listener 안에서 `LayoutAnimation.spring()`을 호출하고,
  최신순 정렬(`sorted("_id", true)`) 결과를 상태에 넣는다.

즉 삭제 자체보다도 "삭제 직후 리스트 재배치가 한 번에 부드럽게 바뀌는 감각"을 보여주는 커밋이다.

## 현재 대응 개념

- 이 커밋의 현재 대응 개념은 "destructive local mutation + global layout transaction"이다.
- React Native 공식 문서는
  [`Animated`와 `LayoutAnimation`이 상호보완적](https://reactnative.dev/docs/animations)
  이라고 설명한다.
- `LayoutAnimation`은 다음 layout cycle 전체에 create/update animation을 거는 도구라,
  단순 list reflow에는 지금도 유효하다.

## 현재 기준 베스트 프랙티스

### 1. `LayoutAnimation`은 simple reflow에 여전히 쓸 수 있다

- 항목이 하나 사라지고 주변이 정렬되는 정도면 아직도 괜찮은 선택이다.

### 2. 하지만 삭제 UX는 탭 즉시 삭제보다 더 안전하게 간다

- 코어 기록 삭제를 plain tap 하나에 매다는 건 너무 공격적이다.
- 지금은 보통:
  - long press
  - trailing actions
  - confirm dialog
  - undo snackbar

같은 완충 장치를 둔다.

### 3. item-level animation 제어가 중요하면 Reanimated layout animation이 더 강하다

- `LayoutAnimation`은 전역 layout transaction이라 간단한 대신 제어 폭이 작다.
- entering / exiting / shared element 같은 요구가 생기면 Reanimated 쪽이 더 자연스럽다.

### 4. Android 지원 플래그를 잊지 않는다

- React Native 문서는 Android에서 `UIManager.setLayoutAnimationEnabledExperimental(true)` 설정이 필요하다고 안내한다.

## 스킬 추출 후보

- 트리거:
  - local list mutation 후 부드러운 재배치가 필요할 때
- 권장 기본값:
  - 간단한 reflow는 `LayoutAnimation`
  - 복잡한 item animation은 Reanimated layout animation
  - destructive action은 confirm/undo
- 레거시 안티패턴:
  - plain tap 하나에 영구 삭제를 묶기
- 예외 / 선택 기준:
  - 학습용 데모는 단순 tap delete도 가능하지만,
    제품 코드에선 accidental delete risk를 먼저 본다
- 현재식 코드 스케치:

```tsx
LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
removeEntry(id);
```

- 스킬 규칙 초안:
  - `layoutanimation-for-simple-list-reflow-only`
  - `destructive-list-actions-need-confirm-or-undo`

## 관련 페이지

- [반응형 Realm 컬렉션 읽기와 리스트 렌더링](reactive-realm-collection-reading-and-list-rendering.md)
- [저장 전 리워드 광고 이벤트 시퀀싱](rewarded-ad-event-sequencing-before-persist.md)

