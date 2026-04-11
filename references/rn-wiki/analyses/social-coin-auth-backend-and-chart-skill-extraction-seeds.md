# social-coin 인증·백엔드·차트 스킬 추출 후보 | social-coin Auth, Backend, and Chart Skill Extraction Seeds

## 범위

- `raw/social-coin/` 8개 커밋을 다시 훑으며,
  auth, backend choice, public data query, chart 관련 교훈을
  `oh-my-rn`으로 승격하기 쉬운 규칙 원재료로 압축한다.

## 짧은 결론

- `social-coin` 라운드의 가장 강한 원재료는 다섯 축으로 정리된다.
  - auth SDK는 기능 이름이 아니라 runtime/native boundary로 고른다
  - auth session owner가 navigation tree를 gate한다
  - 작은 auth form은 submit guard와 focus handoff가 핵심이다
  - public market data는 query 계층에서 필터링/파생한다
  - chart는 라이브러리보다 derived point pipeline이 더 중요하다

## 규칙 묶음

### 1. Auth SDK Choice

- 대표 문서:
  - [Firebase auth SDK 선택과 네이티브 빌드 경계](firebase-auth-sdk-selection-and-native-build-boundary.md)
- 추출 가능한 규칙:
  - Firebase JS SDK, RNFirebase, Supabase는 runtime boundary로 고른다.
  - auth-only 문제와 full backend 문제를 같은 선택처럼 다루지 않는다.

### 2. Auth Session Ownership

- 대표 문서:
  - [auth state 기반 navigator gating과 엔트리 셸](auth-state-gated-navigation-and-entry-shell.md)
- 추출 가능한 규칙:
  - session owner가 root navigator를 gate한다.
  - login/join screen은 session owner가 아니라 submit UI owner다.

### 3. Small Auth Forms

- 대표 문서:
  - [email/password 회원가입 폼과 submit guard](email-password-signup-flow-with-submit-guard.md)
- 추출 가능한 규칙:
  - 작은 auth form은 local state로 시작한다.
  - loading 중 duplicate submit을 막는다.
  - focus handoff와 keyboard submit을 같이 설계한다.

### 4. Public Market Data Queries

- 대표 문서:
  - [query 기반 코인 목록 fetch와 도메인 필터링](query-driven-coin-list-fetch-and-filtering.md)
  - [애니메이션 코인 그리드 카드와 detail 진입](animated-coin-grid-cards-and-detail-entry.md)
- 추출 가능한 규칙:
  - public API collection은 query가 소유한다.
  - UI용 필터/파생은 query `select`나 memo로 계산한다.
  - list item은 minimal detail seed만 넘긴다.

### 5. Detail and Chart Data Pipeline

- 대표 문서:
  - [coin detail 병렬 query와 header identity seed](coin-detail-query-branch-and-header-identity.md)
  - [chart 데이터 파생과 Victory Native 현대화](historical-price-chart-data-and-victory-migration.md)
- 추출 가능한 규칙:
  - detail shell은 preview seed와 authoritative query를 분리한다.
  - chart point는 query 결과에서 직접 파생한다.
  - chart library migration보다 data pipeline 안정화가 먼저다.

## 지금 기준 우선 승격 후보

### 1. `choose-auth-sdk-by-runtime-boundary`

- Firebase JS SDK / RNFirebase / Supabase를 기능 이름이 아니라 runtime/native build boundary로 고르는 규칙

### 2. `auth-session-owner-gates-navigation-tree`

- session truth가 root navigator branch를 가르는 규칙

### 3. `small-auth-forms-need-submit-guard-and-focus-handoff`

- email/password auth form에서 local state, focus handoff, submit guard를 기본값으로 두는 규칙

### 4. `query-select-filters-remote-collections-before-ui`

- public API list의 filtering/normalization을 화면 렌더 직전보다 query 파생값으로 올리는 규칙

### 5. `chart-data-is-derived-from-query-not-copied-in-effect`

- chart-ready points를 effect local state가 아니라 query/memo 파생값으로 다루는 규칙

## 추천 규칙명 초안

- `choose-auth-sdk-by-runtime-boundary`
- `auth-session-owner-gates-navigation-tree`
- `small-auth-forms-need-submit-guard-and-focus-handoff`
- `query-select-filters-remote-collections-before-ui`
- `detail-shell-uses-preview-seed-and-parallel-queries`
- `chart-data-is-derived-from-query-not-copied-in-effect`

## 현재 판단

- 이번 라운드 규칙은 아직 `seed`로 남겨두는 편이 낫다.
- 이유는:
  - auth/backend 쪽은 아직 비교 프로젝트 수가 적고
  - Supabase/Firebase/product backend 맥락에 따라 예외가 꽤 생길 수 있기 때문이다.
- 다만 `auth-session-owner-gates-navigation-tree`,
  `chart-data-is-derived-from-query-not-copied-in-effect`는 다음 반복이 나오면 빠르게 승격할 가치가 높다.

## 다음 액션

- 이후 auth나 backend가 붙는 다른 RN 소스를 읽을 때
  같은 축이 다시 나오면 `oh-my-rn` v1 규칙으로 올린다.
- 특히:
  - Supabase auth/session
  - favorites/portfolio 같은 user-owned data
  - current chart package choice
를 더 볼 필요가 있다.

## 관련 페이지

- [social-coin 소스 개요](../sources/social-coin.md)
- [RN 스킬 승격 기준](../concepts/rn-skill-promotion-criteria.md)
