# 저널 플로우의 배너 광고와 리워드 게이트 | Banner Ads and Rewarded Gates in Journal Flow

## 범위

- `nomadcoders/nomad-diary`의 2021-09-27 커밋 `66e3af2` (`4.9 Showing Ads`)를 현재 광고 UX 관점으로 다시 읽는다.
- 특히:
  - 배너 광고와 reward ad를 각각 어디에 붙였는지
  - 왜 이 흐름이 학습용으론 재밌지만 제품 코드에선 민감한지
  - 현재 광고 SDK의 안전한 기본값이 무엇인지
  를 정리한다.

## 레거시 커밋이 실제로 한 것

- `App.js`에서 `setTestDeviceIDAsync("EMULATOR")`를 호출해 테스트 기기를 설정했다.
- `Home.js`에 `AdMobBanner`를 붙였다.
- `Write.js`에서는 submit 시:
  - realm에 저장
  - rewarded ad unit 설정
  - ad request
  - showAd

흐름을 넣었다.
- 즉 홈엔 banner, 작성 제출엔 rewarded ad를 넣은 구조다.

## 현재 대응 개념

- 이 커밋의 현재 대응 개념은 "광고 placement와 core flow gating"이다.
- 광고를 붙이는 것과 광고가 제품 플로우를 막는 것은 다른 문제다.
- 현재 광고 SDK 문서는:
  - SDK 초기화
  - request configuration
  - test ads
  - ATT / consent

를 먼저 다루고, placement 자체는 그 다음 문제로 본다.

## 현재 기준 베스트 프랙티스

### 1. banner는 레이아웃 슬롯을 고정해서 넣는다

- 배너가 로드되며 화면이 밀리면 UX가 나빠진다.
- fixed slot 또는 predictable container를 두는 편이 좋다.

### 2. reward ad는 "핵심 write 전 필수 통과"보다 "선택적 가치 교환"에 더 잘 맞는다

- journal 저장은 앱의 핵심 행동이다.
- 핵심 기록 저장을 reward ad 시청에 묶는 건 제품적으로는 꽤 공격적인 선택이다.
- 현재 기준으론 reward ad는:
  - 힌트 열기
  - 보너스 기능
  - 추가 콘텐츠

같은 optional gate에 더 잘 맞는다.

### 3. 테스트 설정은 SDK 초기화 설계 일부다

- 개발 중에는 test ids / test device 설정이 필수에 가깝다.

### 4. banner와 rewarded의 책임을 분리한다

- banner는 passive placement
- rewarded는 user-triggered flow

로 읽어야 하며, measurement와 UX 기준도 다르다.

## 스킬 추출 후보

- 트리거:
  - 배너 광고와 리워드 광고를 같은 앱에 붙이려 할 때
- 권장 기본값:
  - banner는 stable slot
  - rewarded는 optional action gate
  - test ids / initialize once
- 레거시 안티패턴:
  - 코어 CRUD 액션을 reward ad 뒤에 강제로 묶기
- 예외 / 선택 기준:
  - 제품이 광고 기반이더라도 핵심 creation flow를 어디까지 보호할지 product policy를 먼저 정한다
- 현재식 코드 스케치:

```tsx
<BannerAd unitId={TestIds.BANNER} />
```

- 스킬 규칙 초안:
  - `banner-needs-stable-layout-slot`
  - `rewarded-ads-should-gate-optional-value-not-core-crud`

## 관련 페이지

- [모바일 광고 SDK 설치와 빌드 경계](mobile-ads-sdk-installation-and-build-boundaries.md)
- [저장 전 리워드 광고 이벤트 시퀀싱](rewarded-ad-event-sequencing-before-persist.md)
