# noovies UI·데이터 스킬 추출 후보 | Noovies UI and Data Skill Extraction Seeds

## 범위

- `raw/noovies/`를 바탕으로 만든 UI, 내비게이션, 리스트, 서버 상태, 검색, 상세 화면, 스타일링 분석 문서를 다시 훑으며,
  `oh-my-rn`으로 승격하기 쉬운 규칙 원재료를 한 장으로 정리한다.
- 이번 라운드에서 44개 noovies 관련 분석 문서에 `## 스킬 추출 후보` 섹션을 추가했다.

## 짧은 결론

- noovies 라운드에서 가장 강한 스킬 원재료는 다섯 축으로 정리된다.
  - native navigation owner 분리
  - root virtualized feed 우선
  - query state를 local loading boolean보다 우선
  - 최소 detail route params + authoritative detail query
  - input state와 committed query state 분리
- 즉 noovies는 "옛날 React Native 강의를 현재식으로 번역하는 법"보다,
  "현재 RN 앱의 기본 구조를 어디서 끊어 읽을지"를 알려주는 원재료가 더 많다.

## 규칙 묶음

### 1. 내비게이션 구조와 테마

- 대표 문서:
  - [색상 스킴 기반 내비게이션 테마](color-scheme-driven-navigation-theming.md)
  - [Expo Router stack + native tabs 메모](expo-router-stack-native-tabs.md)
  - [중첩 탭/스택과 모달 경계](nested-tabs-stacks-and-modal-boundaries.md)
  - [탭 이탈 시 스택 초기화와 화면 새로고침](tab-blur-stack-reset-and-query-refresh.md)
- 추출 가능한 규칙:
  - stack, tabs, modal owner를 분리한다.
  - header와 tab theme는 공통 token source에서 파생한다.
  - navigator reset과 data refresh를 한 문제로 다루지 않는다.
  - search는 단순 탭 하나가 아니라 role, header search bar, inset까지 같이 본다.

### 2. 피드, 리스트, 미디어 섹션

- 대표 문서:
  - [가로 미디어 행을 위한 FlatList 기본형](horizontal-flatlist-baseline-for-media-rows.md)
  - [ListHeader 기반 루트 FlatList 피드 구조](root-flatlist-feed-architecture-with-list-header.md)
  - [미디어 섹션 재사용과 화면 스캐폴딩](reusable-media-sections-and-screen-scaffolding.md)
  - [스크롤뷰, 플랫리스트, 레전드리스트, 섹션리스트 정리](scrollview-flatlist-legendlist-sectionlist.md)
- 추출 가능한 규칙:
  - root scroll 축은 가능한 한 하나의 virtualized list로 통합한다.
  - hero, row, vertical section은 header와 item 영역으로 나눠 조립한다.
  - media primitive와 fallback 규칙은 공용 contract로 정리한다.
  - `ScrollView`, `FlatList`, `SectionList`, `LegendList/FlashList`는 데이터 shape와 성능 요구로 고른다.

### 3. 서버 상태와 API 경계

- 대표 문서:
  - [React Query와 현재의 데이터 패치 베스트 프랙티스](react-query-and-data-fetch-best-practices.md)
  - [Query Provider 준비와 API 레이어 추출](query-provider-setup-and-api-layer-extraction.md)
  - [query-driven-pull-to-refresh](query-driven-pull-to-refresh.md)
  - [무한 쿼리 페이지 구조와 평탄화된 리스트 데이터](infinite-query-page-shape-and-flattened-list-data.md)
- 추출 가능한 규칙:
  - 서버 상태는 query key와 query function 경계에서 모델링한다.
  - loading / refreshing / stale 상태는 query state에서 파생한다.
  - infinite query는 `pages[]` shape를 유지하고 화면용 flat data를 파생한다.
  - refresh trigger와 refresh indicator를 분리한다.

### 4. 검색과 상세 화면 데이터 흐름

- 대표 문서:
  - [검색 입력 상태와 쿼리 실행 시점 분리](search-input-state-and-query-trigger-timing.md)
  - [검색 제출 기반 지연 쿼리와 병렬 검색](search-submit-driven-lazy-queries-and-parallel-search.md)
  - [상세 화면 히어로 헤더와 최소 라우트 파라미터](detail-hero-header-and-minimal-route-params.md)
  - [프리뷰 파라미터에서 미디어 타입 분기 상세 쿼리로 전환](preview-params-to-media-type-detail-queries.md)
- 추출 가능한 규칙:
  - `inputValue`와 committed search term을 분리한다.
  - 검색 결과 카드는 최소 식별자 payload로 detail route에 진입한다.
  - detail route params는 최소화하고 authoritative data는 detail query가 읽는다.
  - header action, share, video action도 같은 detail query 결과를 재사용한다.

### 5. 스타일링과 현재 RN UI 기본값

- 대표 문서:
  - [Styled Components vs NativeWind vs shadcn-style RN 메모](styled-components-vs-nativewind-and-shadcn.md)
  - [`StyleSheet.create` vs `NativeWind` 선택 메모](stylesheet-create-vs-nativewind.md)
- 추출 가능한 규칙:
  - 현재 기본 선택은 `NativeWind` 또는 `StyleSheet.create` 혼합이다.
  - design token, utility class, low-level animation style 책임을 분리한다.
  - 레거시 `styled-components`는 유지보수 예외로 보고, 새 기본값처럼 전파하지 않는다.

## 지금 기준 우선 승격 후보

### 1. `native-navigation-owner-split`

- stack, tabs, modal, header owner를 분리하는 규칙

### 2. `root-virtualized-feed-first`

- 복합 홈 화면을 만들 때 root scroll 축을 하나의 virtualized list로 통합하는 규칙

### 3. `query-state-over-local-loading-booleans`

- loading, refreshing, stale 상태를 local boolean보다 query state에서 파생하는 규칙

### 4. `minimal-detail-route-params`

- detail route에는 `id`, `mediaType`, optional preview seed만 넘기고 authoritative data는 query가 읽게 하는 규칙

### 5. `input-vs-committed-search-state`

- 검색 입력값과 실제 query key에 들어가는 committed term을 분리하는 규칙

### 6. `nativewind-plus-stylesheet-mix`

- 현재 RN 스타일링 기본값을 `NativeWind + 필요할 때 StyleSheet.create` 혼합으로 보는 규칙

## 추천 규칙명 초안

- `native-navigation-owner-split`
- `navigation-theme-from-shared-tokens`
- `root-virtualized-feed-first`
- `media-primitive-contract-before-screen-growth`
- `query-state-over-local-loading-booleans`
- `refresh-indicator-derived-not-manual`
- `infinite-query-pages-then-flatten`
- `input-vs-committed-search-state`
- `minimal-detail-route-params`
- `detail-query-as-authoritative-source`
- `nativewind-plus-stylesheet-mix`

## 현재 v1로 먼저 승격한 규칙

- `native-navigation-owner-split`
- `root-virtualized-feed-first`
- `query-state-over-local-loading-booleans`
- `refresh-indicator-derived-not-manual`
- `input-vs-committed-search-state`
- `minimal-detail-route-params`

## 다음 액션

- 이 문서와 [애니메이션·제스처 스킬 추출 후보](animation-and-gesture-skill-extraction-seeds.md)를 바탕으로
  `oh-my-rn`의 1차 초안을 만들었다.
- 상위 규칙은 `~/.codex/skills/oh-my-rn/references/v1-rules.md`로 먼저 승격해
  rule / why / avoid / exceptions / example 형태로 더 단단하게 고정했다.
- 다음 단계는:
  - 아직 승격하지 않은 후보를 실제 사용 빈도 기준으로 재정렬
  - 겹치는 규칙 통합
  - `Pressable`, `expo-image`, `NativeWind + StyleSheet.create` 쪽 UI 기본값도 v1 규칙으로 추가 승격

## 관련 페이지

- [React Query와 현재의 데이터 패치 베스트 프랙티스](react-query-and-data-fetch-best-practices.md)
- [스크롤뷰, 플랫리스트, 레전드리스트, 섹션리스트 정리](scrollview-flatlist-legendlist-sectionlist.md)
- [상세 화면 히어로 헤더와 최소 라우트 파라미터](detail-hero-header-and-minimal-route-params.md)
- [애니메이션·제스처 스킬 추출 후보](animation-and-gesture-skill-extraction-seeds.md)
