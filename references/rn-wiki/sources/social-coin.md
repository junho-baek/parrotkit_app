# social-coin 소스 개요 | social-coin Source Summary

## 범위

- `raw/social-coin/` 저장소 전체를 현재 학습 대상 소스로 등록한다.
- 저장소는 2021년 9월 말 기준 8개 커밋으로 구성되어 있다.
- 핵심 학습 축은:
  - Firebase auth bootstrap
  - auth state 기반 navigation gating
  - public crypto market API와 query 계층
  - coin detail screen과 chart rendering
  - Firebase 관점과 Supabase 관점의 현재 대응 비교

## 저장소 개요

- 프로젝트 성격:
  - 간단한 crypto tracker / coin viewer
  - email/password 가입 흐름
  - public coin data fetch
  - coin detail chart 시각화
- 레거시 기술 스택:
  - Expo SDK 42
  - React Native 0.63
  - `@react-native-firebase/app`, `@react-native-firebase/auth`
  - `react-query` v3
  - `styled-components`
  - `victory-native`
- 외부 데이터 소스:
  - `coinpaprika` public API
  - `cryptoicon-api.vercel.app`

## 커밋 흐름

| 순서 | 커밋 | 원래 제목 | 현재식 개념 제목 |
| --- | --- | --- | --- |
| 1 | `233dbc7` | `5.0 Introduction` | 암호화폐 트래커 샌드박스 부트스트랩 |
| 2 | `93e8f38` | `5.3 Testing Setup` | Firebase auth SDK 선택과 네이티브 빌드 경계 |
| 3 | `6a38862` | `5.4 Join part One` | auth state 기반 navigator gating과 엔트리 셸 |
| 4 | `8940f90` | `5.4 Join part Two` | email/password 회원가입 폼과 submit guard |
| 5 | `900965a` | `5.6 Coins Screen` | query 기반 코인 목록 fetch와 도메인 필터링 |
| 6 | `8c161f3` | `5.7 Coins Screen part Two` | 애니메이션 코인 그리드 카드와 detail 진입 |
| 7 | `f1568c0` | `5.8 Coin Detail part One` | coin detail 병렬 query와 header identity seed |
| 8 | `266bf1d` | `5.9 Victory Charts` | chart 데이터 파생과 Victory Native 현대화 |

## 현재식으로 다시 읽을 핵심

### 1. 이 프로젝트의 Firebase는 auth 중심이다

- 이 저장소는 Firebase를 database보다 auth provider처럼 쓴다.
- 따라서 현재 비교의 핵심은:
  - Firebase JS SDK
  - React Native Firebase
  - Supabase Auth
중 어디가 지금 더 적절한가다.

### 2. public market data는 BaaS가 아니라 query 문제다

- 코인 목록과 상세는 `coinpaprika`에서 가져온다.
- 즉 "서버 데이터를 어디에 저장하나"보다
  "공개 API 응답을 화면 데이터로 어떻게 정제하고 캐시하나"가 더 중요하다.

### 3. Supabase 비교는 auth와 product backend 관점에서 읽는 편이 자연스럽다

- 이 앱의 코인 가격 데이터 자체는 Supabase가 없어도 된다.
- 하지만:
  - user profile
  - favorite coin
  - portfolio
  - watchlist
  - note
같은 product data가 붙는 순간
Firebase와 Supabase의 선택 차이가 커진다.

### 4. chart 부분은 라이브러리 이름보다 data pipeline이 더 중요하다

- 2021 코드의 `victory-native`는 지금 그대로 복사할 대상이라기보다,
  "query 결과를 chart-friendly point array로 바꾸는 법"을 보여주는 예제로 읽는 편이 더 낫다.

## 현재 비교 기준

- React Native / Expo baseline:
  - [`vercel-react-native-skills`](/Users/junho/.agents/skills/vercel-react-native-skills/SKILL.md)
- Firebase / Expo 현재 문서:
  - [Using Firebase - Expo](https://docs.expo.dev/guides/using-firebase/)
  - [Authentication in Expo and React Native apps](https://docs.expo.dev/develop/authentication/)
- Supabase 현재 문서:
  - [Use Supabase Auth with React Native](https://supabase.com/docs/guides/auth/quickstarts/react-native)
- chart 현재 기준:
  - [victory-native - npm](https://www.npmjs.com/package/victory-native)
  - [victory - npm](https://www.npmjs.com/package/victory)

## 열린 질문

- 이 프로젝트의 auth-only Firebase 선택을, 지금 새 Expo 앱에서는 Firebase JS SDK / RNFirebase / Supabase 중 어디로 기본화하는 것이 맞을까?
- `coinpaprika` 같은 외부 public API 데이터는 local DB보다 query cache로 충분한가?
- chart는 현재 `victory-native` 계열이 좋은 기본값인가, 아니면 chart 요구사항에 따라 다른 선택지가 더 낫나?
- product backend가 추가된다면 Firebase보다 Supabase 쪽이 더 자연스러운가?

## 관련 페이지

- [social-coin Firebase 인증·차트 학습 계획](../analyses/social-coin-firebase-auth-and-chart-study-plan.md)
- [social-coin 인증·백엔드·차트 스킬 추출 후보](../analyses/social-coin-auth-backend-and-chart-skill-extraction-seeds.md)
