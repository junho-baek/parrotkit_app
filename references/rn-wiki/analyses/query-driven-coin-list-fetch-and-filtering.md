# query 기반 코인 목록 fetch와 도메인 필터링 | Query-driven Coin List Fetch and Domain Filtering

## 범위

- `nomadcoders/social-coin`의 2021-09-28 커밋 `900965a` (`5.6 Coins Screen`)를 현재 query/list 관점으로 다시 읽는다.
- 특히:
  - remote collection을 query로 읽는 구조
  - 화면 렌더 전 도메인 필터링
  - auth 앱에 public API 목록 화면이 붙는 방식
를 정리한다.

## 레거시 커밋이 실제로 한 것

- `react-query`를 설치하고 `QueryClientProvider`를 앱 루트에 추가했다.
- `api.js`에서 `coins()` fetcher를 분리했다.
- `Home` screen에서 `useQuery("coins", coins)`로 코인 목록을 읽는다.
- 응답을 `rank != 0`, `is_active`, `!is_new` 조건으로 필터링해 `cleanData` state에 넣는다.
- `FlatList`로 목록을 렌더한다.

즉 이 커밋은 "public coin API를 화면이 직접 때리는 구조"에서
"query 계층이 remote collection을 소유하는 구조"로 넘어가는 단계다.

## 현재 대응 개념

- 현재 대응 개념은 "query-driven remote list with derived domain filter"다.
- 핵심은 fetch와 filtering을 분리하고,
  query 결과를 화면 상태의 출발점으로 삼는 데 있다.

## 지금 기준으로 읽을 핵심

### 1. `useEffect + fetch`보다 query 계층으로 넘어가는 전환은 지금도 중요하다

- 이 커밋은 `react-query` v3를 썼지만,
  개념상으로는 지금도 맞는 전환이다.

### 2. `cleanData`는 파생값이라 local state 없이도 다룰 수 있다

- 레거시 코드는 `data`를 받아 `cleanData`라는 새 state로 복사한다.
- 현재식으론 보통:
  - query `select`
  - `useMemo`
중 하나로 파생한다.

즉 query 결과에서 바로 계산 가능한 값은
effect + state copy로 옮기지 않는 편이 더 current하다.

### 3. 이 데이터는 Supabase가 아니라 public API 문제다

- 코인 목록은 product-owned backend가 아니라 외부 public API다.
- 따라서 지금도 이 부분은 Supabase table로 옮기기보다
  query cache 문제로 읽는 편이 맞다.

## Supabase 기준으로 옮겨 읽으면

- 이 커밋은 "무조건 모든 서버 데이터를 Supabase로 넣는 게 아니다"라는 예시로도 읽을 수 있다.
- 현재식 Supabase 관점에선:
  - coin market list는 public API query
  - user favorites, portfolio, watchlist는 Supabase
처럼 source of truth를 나누는 편이 자연스럽다.

즉 Supabase를 좋아해도, 외부 시세 데이터까지 억지로 DB mirror로 만들 필요는 없다.

## 현재 기준 베스트 프랙티스

### 1. 지금은 TanStack Query v5 object syntax가 기본이다

```ts
useQuery({
  queryKey: ["coins"],
  queryFn: fetchCoins,
  select: filterVisibleCoins,
})
```

### 2. 필터링은 `select` 쪽으로 먼저 밀어본다

- 화면이 실제로 쓰는 데이터 shape를 query 단계에서 정리하는 편이 읽기 쉽다.

### 3. public market data는 typed boundary를 둔다

- `coinpaprika` raw shape를 바로 UI에 뿌리기보다
  화면이 쓰는 최소 필드만 명시하는 타입/mapper가 있으면 좋다.

### 4. 리스트 성능 기본값은 현재 더 엄격하다

- `vercel-react-native-skills` 기준으로
  큰 리스트는 virtualization, stable props, memoized item을 더 빨리 의식한다.

## 스킬 추출 후보

- 트리거:
  - public API collection을 RN 화면에 붙일 때
- 권장 기본값:
  - query가 fetch를 소유하고, 파생 필터는 `select`로 계산
- 레거시 안티패턴:
  - query 결과를 effect에서 다시 state로 복사하기
- 예외:
  - 사용자 인터랙션으로 일시 필터를 바꾸는 경우 local UI state가 추가로 필요할 수 있다
- 현재식 코드 스케치:

```ts
const { data: coins } = useQuery({
  queryKey: ["coins"],
  queryFn: fetchCoins,
  select: (rows) => rows.filter(isVisibleCoin),
});
```

- 스킬 규칙 초안:
  - `query-select-filters-remote-collections-before-ui`

## 관련 페이지

- [애니메이션 코인 그리드 카드와 detail 진입](animated-coin-grid-cards-and-detail-entry.md)
- [coin detail 병렬 query와 header identity seed](coin-detail-query-branch-and-header-identity.md)
