# 모바일 광고 SDK 설치와 빌드 경계 | Mobile Ads SDK Installation and Build Boundaries

## 범위

- `nomadcoders/nomad-diary`의 2021-09-27 커밋 `405a89e` (`4.8 Installing AdMob`)를 현재 RN 광고 SDK 기준으로 다시 읽는다.
- 특히:
  - 광고 기능이 왜 JS 코드 한 줄 추가가 아니라 native build boundary 문제인지
  - Expo 42 시절 `expo-ads-admob`와 현재 기준의 차이
  - 현재식 설치/설정 흐름
  를 정리한다.

## 레거시 커밋이 실제로 한 것

- `expo-ads-admob` 패키지를 설치했다.
- 코드 레벨 변화는 거의 없고,
  사실상 "이제 광고 native SDK를 이 앱에 붙일 수 있는 상태"로 간 단계다.

## 현재 대응 개념

- 이 커밋의 현재 대응 개념은 "ads are a native build-time integration"이다.
- 2026 기준 Expo / RN에서 AdMob을 붙일 때 보통 보는 기준은
  [`react-native-google-mobile-ads`](https://docs.page/invertase/react-native-google-mobile-ads)
  쪽이다.
- 이 문서는:
  - config plugin 필요
  - Expo Go 미지원
  - app id 설정
  - rebuild 필요

를 분명하게 설명한다.

## 현재 기준 베스트 프랙티스

### 1. 광고 SDK는 초기에 native boundary로 취급한다

- 앱 config
- Android / iOS app id
- ATT 문구
- consent flow
- rebuild 전략

이 같이 움직이기 때문이다.

### 2. Expo Go에서 안 되는지를 먼저 확인한다

- 현재 Ads 라이브러리는 custom native code를 포함하므로 Expo Go만으로는 끝나지 않는 경우가 많다.
- development build / prebuild / EAS build 경로를 초기에 정해야 한다.

### 3. 테스트 환경과 운영 환경을 분리한다

- 테스트 device id
- 테스트 ad unit id
- 운영 ad unit id

를 분리하지 않으면 계정 리스크가 생긴다.

### 4. ATT와 consent는 설치의 일부로 본다

- 광고는 단순 표시보다 규제 대응이 먼저다.
- iOS tracking transparency와 EEA consent는 "나중에 붙이는 옵션"이 아니라 설치 설계 일부다.

## 스킬 추출 후보

- 트리거:
  - Expo / RN 앱에 광고 SDK를 붙이려 할 때
- 권장 기본값:
  - native build boundary로 간주
  - config plugin
  - test ids / consent / ATT 선설계
- 레거시 안티패턴:
  - banner 컴포넌트 import만 하면 끝날 일처럼 보기
- 예외 / 선택 기준:
  - 앱이 정말 광고가 필요한지부터 다시 검토하는 product decision이 선행될 수 있다
- 현재식 코드 스케치:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-xxx~xxx",
          "iosAppId": "ca-app-pub-xxx~xxx"
        }
      ]
    ]
  }
}
```

- 스킬 규칙 초안:
  - `ads-sdk-is-a-native-build-boundary`
  - `test-ids-att-consent-before-real-ads`

## 관련 페이지

- [저널 플로우의 배너 광고와 리워드 게이트](banner-ads-and-rewarded-gates-in-journal-flow.md)
- [Tracking Transparency - Expo Docs](https://docs.expo.dev/versions/latest/sdk/tracking-transparency/)

