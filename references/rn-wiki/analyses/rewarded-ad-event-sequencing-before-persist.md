# 저장 전 리워드 광고 이벤트 시퀀싱 | Rewarded Ad Event Sequencing Before Persist

## 범위

- `nomadcoders/nomad-diary`의 2021-09-27 커밋 `2e99e6f` (`4.10 Events`)를 현재 event sequencing 관점으로 다시 읽는다.
- 특히:
  - reward ad를 본 뒤에만 저장이 열리는 구조를 어떻게 구현했는지
  - 이벤트 리스너를 어디서 등록해야 하는지
  - 현재식으로 side effect를 안전하게 직렬화하는 방법이 무엇인지
  를 정리한다.

## 레거시 커밋이 실제로 한 것

- `Write.js`의 submit 흐름을 바꿨다.
- 이제 save 버튼을 누르면 먼저 rewarded ad를 띄운다.
- 그리고:
  - `rewardedVideoUserDidEarnReward`
  - 그 안에서 다시 `rewardedVideoDidDismiss`

리스너를 중첩 등록한다.
- dismiss까지 끝나면 그제서야:
  - realm에 기록 생성
  - `goBack()`

을 수행한다.

즉 "광고 이벤트가 business side effect를 여는 gate"가 된 단계다.

## 현재 대응 개념

- 이 커밋의 현재 대응 개념은 "event-gated side effect sequencing"이다.
- 문제의 핵심은 광고 SDK가 아니라:
  - 이벤트를 언제 구독하느냐
  - side effect를 어느 이벤트에 걸 것이냐
  - cancel / dismiss / reward earned를 어떻게 구분하느냐

에 있다.

## 현재 기준 베스트 프랙티스

### 1. 리스너는 `show()` 이후가 아니라 그 전에 준비한다

- 레거시 코드는 광고를 띄운 뒤에 중첩 listener를 붙인다.
- 이러면 타이밍이 엇갈리거나 listener cleanup이 어려워진다.

### 2. nested listener보다 작은 상태 머신으로 읽는다

- `idle -> loading -> showing -> rewarded -> dismissed -> commit`

처럼 phase를 먼저 나누면 코드가 훨씬 안전해진다.

### 3. persistence와 navigation completion을 분리한다

- reward를 얻었을 때 저장을 확정할지
- dismiss 뒤에 화면만 닫을지

를 분리하면 의도가 더 분명해진다.

### 4. listener cleanup과 중복 submit 방지를 같이 둔다

- submit 연타
- unmount 후 stale callback
- listener 누적

을 막지 않으면 bug가 생기기 쉽다.

## 현재식 코드 스케치

```tsx
const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED);

useEffect(() => {
  const unsubscribeEarned = rewarded.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    () => setDidEarnReward(true)
  );

  const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
    if (didEarnRewardRef.current) {
      persistEntry();
      router.back();
    }
  });

  return () => {
    unsubscribeEarned();
    unsubscribeClosed();
  };
}, [rewarded]);
```

## 스킬 추출 후보

- 트리거:
  - 광고, 권한, 결제, biometric 같은 이벤트가 side effect를 여는 gate가 될 때
- 권장 기본값:
  - subscribe before show
  - phase 모델 명시
  - cleanup
  - 중복 submit guard
- 레거시 안티패턴:
  - `show()` 뒤 nested listener 등록
  - cleanup 없는 이벤트 누적
- 예외 / 선택 기준:
  - 매우 짧은 데모에선 단순화할 수 있지만,
    실제 저장/결제/권한 side effect가 걸리면 phase 분리가 필수다
- 스킬 규칙 초안:
  - `subscribe-before-show-for-event-gated-side-effects`
  - `rewarded-flow-track-phases-not-nested-callbacks`

## 관련 페이지

- [저널 플로우의 배너 광고와 리워드 게이트](banner-ads-and-rewarded-gates-in-journal-flow.md)
- [탭 삭제와 LayoutAnimation 리스트 전환](tap-to-delete-with-layout-animation.md)
