# social-coin Firebase 인증·차트 학습 계획 | social-coin Firebase Auth and Chart Study Plan

## 목표

- `raw/social-coin/`의 모든 커밋을 개념 중심 문서로 다시 읽는다.
- 특히 다음 축을 현재식으로 번역한다.
  - Firebase auth bootstrap과 SDK 선택
  - auth session이 navigation tree를 가르는 구조
  - public API query와 코인 목록 필터링
  - detail screen과 chart data pipeline
  - Firebase 관점과 Supabase 관점의 차이

## 왜 지금 이 소스를 읽는가

- `social-coin`은 `nomad-diary`의 local DB / ads 축, `noovies`의 query / navigation 축과는 다른 결을 준다.
- 여기서는:
  - mobile auth
  - BaaS 선택
  - remote market data
  - chart visualization
가 한 앱 안에 같이 나온다.

즉 "백엔드를 붙인 RN 앱을 어디서 끊어 읽을까"를 공부하기 좋은 샘플이다.

## 읽을 축

### 1. Auth and Backend Boundary

- Firebase를 왜 썼는가
- 지금이라면 RNFirebase를 그대로 쓸지, Firebase JS SDK로 갈지, Supabase로 바꿀지를 어떻게 판단할지

### 2. Auth-driven Navigation

- 세션 상태가 navigator tree를 어떻게 가르는지
- login/join shell과 session owner를 어디에 둘지

### 3. Public Data Query Flow

- coinpaprika 응답을 query cache와 화면 필터링으로 어떻게 다루는지
- 지금이라면 `react-query` v3에서 TanStack Query v5로 어떻게 옮겨 읽을지

### 4. Detail and Chart Pipeline

- detail screen의 preview seed, query key, header identity
- chart point array를 어디서 파생하는지

## 커밋별 문서 계획

- `233dbc7` → [암호화폐 트래커 샌드박스 부트스트랩](expo-crypto-tracker-sandbox-bootstrap.md)
- `93e8f38` → [Firebase auth SDK 선택과 네이티브 빌드 경계](firebase-auth-sdk-selection-and-native-build-boundary.md)
- `6a38862` → [auth state 기반 navigator gating과 엔트리 셸](auth-state-gated-navigation-and-entry-shell.md)
- `8940f90` → [email/password 회원가입 폼과 submit guard](email-password-signup-flow-with-submit-guard.md)
- `900965a` → [query 기반 코인 목록 fetch와 도메인 필터링](query-driven-coin-list-fetch-and-filtering.md)
- `8c161f3` → [애니메이션 코인 그리드 카드와 detail 진입](animated-coin-grid-cards-and-detail-entry.md)
- `f1568c0` → [coin detail 병렬 query와 header identity seed](coin-detail-query-branch-and-header-identity.md)
- `266bf1d` → [chart 데이터 파생과 Victory Native 현대화](historical-price-chart-data-and-victory-migration.md)

## 최신 비교 기준

- RN/Expo baseline:
  - [`vercel-react-native-skills`](/Users/junho/.agents/skills/vercel-react-native-skills/SKILL.md)
- Firebase:
  - [Using Firebase - Expo](https://docs.expo.dev/guides/using-firebase/)
  - [Authentication in Expo and React Native apps](https://docs.expo.dev/develop/authentication/)
- Supabase:
  - [Use Supabase Auth with React Native](https://supabase.com/docs/guides/auth/quickstarts/react-native)
- chart:
  - [victory-native - npm](https://www.npmjs.com/package/victory-native)
  - [victory - npm](https://www.npmjs.com/package/victory)

## 기대 산출물

- 커밋당 분석 문서 8개
- source summary 1개
- skill extraction seed 문서 1개
- `wiki/index.md`, `wiki/overview.md`, `wiki/log.md` 연결

## 현재 가설

- 이 프로젝트에서 가장 오래 남는 교훈은 Firebase 자체보다:
  - auth session owner
  - SDK/native boundary 선택
  - query 기반 remote list/detail 구조
  - chart data derivation
쪽에 있을 가능성이 높다.
- 사용자 성향을 고려하면 Firebase를 "정답"으로 읽기보다,
  "지금 Supabase를 좋아하는 사람이 이 강의를 어떻게 번역할까" 관점이 더 유용하다.

## 관련 페이지

- [social-coin 소스 개요](../sources/social-coin.md)
- [RN 저장소 선택 지도](../concepts/rn-storage-decision-map.md)
- [RN 스킬 승격 기준](../concepts/rn-skill-promotion-criteria.md)
