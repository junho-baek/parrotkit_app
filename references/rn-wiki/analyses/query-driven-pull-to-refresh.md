# 쿼리 기반 Pull-to-Refresh와 리패칭 상태 | Query-Driven Pull-to-Refresh and Refetch State

## 범위

- `nomadcoders/noovies`의 2021-09-22 커밋 `c263769` (`2.14 Refresh`)를 계기로,
  React Query / TanStack Query에서 pull-to-refresh와 refetch 상태를 어떻게 이해해야 하는지 현재 Expo / React Native 기준으로 다시 정리한다.
- 특히 다음을 함께 본다.
  - query key prefix 기반 refresh
  - `refetchQueries`와 `invalidateQueries`의 차이
  - `refreshing`을 local state로 둘지, query state에서 파생할지
  - refresh와 remount를 같은 문제로 보면 왜 꼬이는지

## 짧은 결론

- 이 커밋의 핵심은 "refresh를 local `refreshing` 토글이나 screen remount가 아니라 query cache에서 생각하기 시작했다"는 점이다.
- 현재도 그 방향은 맞다.
- 다만 지금은:
  - `@tanstack/react-query`
  - object syntax
  - `refetchQueries`와 `invalidateQueries`의 역할 분리
  - `refreshing`을 `isRefetching` / `useIsFetching`에서 파생
까지 같이 보는 편이 더 정확하다.

## 레거시 커밋이 실제로 한 것

- `Movies.tsx`에서 local `refreshing` state를 제거했다.
- `useQueryClient()`를 추가했다.
- query key를:
  - `["movies", "nowPlaying"]`
  - `["movies", "upcoming"]`
  - `["movies", "trending"]`
처럼 prefix를 공유하게 바꿨다.
- `onRefresh`에서:
  - `queryClient.refetchQueries(["movies"])`
를 호출했다.
- 각 query의 `isRefetching`을 합쳐 refresh indicator 상태를 계산했다.
- `navigation/Tabs.js`에서는:
  - `unmountOnBlur: true`
를 제거했다.

즉 이 커밋은 "refresh는 query key와 cache client로 설계하고, 화면 로딩 표시는 query 상태에서 읽는다"는 방향으로 넘어간 단계다.

## 이때의 핵심 개념

### 1. 새로고침은 query가 다시 가져오는 행위다

- 예전엔 보통:
  - `setRefreshing(true)`
  - fetch
  - `setRefreshing(false)`
처럼 직접 토글했다.
- 이 커밋은 그 대신:
  - `queryClient.refetchQueries(["movies"])`
로 grouped refetch를 시작했다.

즉 refresh가 "boolean 토글"에서 "query client 명령"으로 바뀌었다.

### 2. query key는 이름이 아니라 refresh 범위다

- `["movies", "nowPlaying"]`
- `["movies", "upcoming"]`
- `["movies", "trending"]`

처럼 prefix를 통일하면 `["movies"]` 단위로 한 번에 다시 불러올 수 있다.

즉 query key는 단순 식별자가 아니라, cache 묶음과 refresh 범위를 설계하는 축이다.

### 3. `refreshing`도 query state에서 읽는다

- 이 커밋은 local `refreshing` state를 버리고:
  - `isRefetchingNowPlaying`
  - `isRefetchingUpcoming`
  - `isRefetchingTrending`
를 합쳐 indicator를 만든다.

즉 refresh UI도 local UI truth보다 server-state 계층에서 파생시키기 시작했다.

### 4. remount를 refresh 해법으로 보지 않는다

- `unmountOnBlur`를 제거하면서,
  "화면을 내려서 다시 mount하면 새로고침처럼 보인다"
는 해법에서 멀어졌다.
- refresh는 remount보다 query invalidation / refetch 문제로 보는 쪽이 맞기 시작했다.

## 지금 봐도 좋은 점

- query key prefix를 공유 자원 단위로 설계한 점
- refresh trigger를 `useQueryClient()`에서 수행한 점
- `refreshing`을 query refetch 상태에서 파생한 점
- `unmountOnBlur`를 refresh 해법으로 보지 않게 된 점

이 네 가지는 지금 봐도 방향이 좋다.

## 현재 기준으로 바꿔 읽어야 할 점

### 1. 지금은 `react-query`가 아니라 `@tanstack/react-query`

- 현재 새 앱이면 패키지는 `@tanstack/react-query`다.
- hook 문법도 object syntax가 기본값이다.

예:

```tsx
const trendingQuery = useQuery({
  queryKey: ['movies', 'trending'],
  queryFn: moviesApi.trending,
  staleTime: 60_000,
})
```

### 2. `refetchQueries`는 promise를 반환하지만, RefreshControl을 그 promise로 직접 운영하진 않는 편이 자연스럽다

- 현재 TanStack Query 문서 기준 `queryClient.refetchQueries(...)`는 promise를 반환한다.
- 즉 기술적으로는 `await queryClient.refetchQueries(...)`가 가능하다.
- 하지만 pull-to-refresh UX에선 보통:
  - `onRefresh`는 refetch를 트리거하고
  - `RefreshControl.refreshing`은 query의 `isRefetching` 또는 `useIsFetching`에서 읽는다.

예:

```tsx
const onRefresh = () => {
  queryClient.refetchQueries({ queryKey: ['movies'], type: 'active' })
}
```

즉 더 정확한 현재식 표현은:

- `refetchQueries`는 "await 불가능한 함수"가 아니라
- "로딩 인디케이터를 직접 await로 제어할 필요가 없는 함수"

에 가깝다.

### 3. pull-to-refresh와 mutation 후 후처리는 다르게 본다

- user가 직접 당겨서 새로고침:
  - `refetch()`
  - `refetchQueries(...)`
- 수정/삭제/생성 후 데이터가 낡았음을 알게 됨:
  - `invalidateQueries(...)`

현재 TanStack Query 문서는 invalidation을 "stale로 mark하고, 활성 query면 background refetch"하는 흐름으로 설명한다.

### 4. `refreshing` 계산은 grouped query라면 `useIsFetching`도 좋다

- 이 커밋처럼 여러 `isRefetching`을 직접 OR로 묶어도 된다.
- 하지만 query key prefix가 잘 잡혀 있으면:
  - `useIsFetching({ queryKey: ['movies'] })`
로 grouped fetching 상태를 읽는 방법도 자연스럽다.

즉 현재식으론:
  - 작은 화면: 개별 `isRefetching`
  - 그룹 단위: `useIsFetching`

둘 다 가능하다.

### 5. refresh는 `staleTime`과 함께 설계한다

- 현재 TanStack Query 기본값은 cached data를 stale로 보고,
  mount / focus / reconnect 때 background refetch가 일어날 수 있다.
- 그래서 refresh UX는 단순히 `onRefresh` 하나만의 문제가 아니라:
  - `staleTime`
  - focus 복귀 refetch
  - reconnect 정책
까지 함께 설계해야 한다.

### 6. React Native에선 focus / foreground lifecycle도 query 계층에서 다룬다

- RN에선:
  - `focusManager`
  - `onlineManager`
  - 필요 시 `useIsFocused`
  - 필요 시 `subscribed: isFocused`

같은 도구가 중요하다.

즉 지금은 refresh를 "다시 mount할까?"보다
"query를 언제 구독하고 언제 refetch할까?"로 보는 쪽이 더 정확하다.

## 현재의 핵심 개념

### 1. refresh trigger와 refresh indicator를 분리한다

- trigger:
  - `refetch`
  - `refetchQueries`
- indicator:
  - `isRefetching`
  - `useIsFetching`

이 분리가 현재식 핵심이다.

### 2. query key는 cache 범위이자 refresh 범위다

- `['movies']`
- `['movies', 'trending']`
- `['movies', 'detail', movieId]`

처럼 계층적으로 설계해야 grouped refetch와 invalidation이 쉬워진다.

### 3. local `setRefreshing`은 기본값이 아니다

- TanStack Query 화면이면 보통:
  - refetch만 트리거하고
  - UI 로딩 상태는 query fetching 상태에서 파생
하는 쪽이 더 자연스럽다.

### 4. remount와 refresh를 섞지 않는다

- 화면을 일부러 내려서 다시 띄우는 것은 navigation/state 생명주기 문제다.
- 데이터 freshness는 query lifecycle 문제다.

## `vercel-react-native-skills` 기준 해석

- 이 스킬은 query 전용 규칙집은 아니지만, 다음 방향과 잘 맞는다.
  - list root는 virtualized list 유지
  - item은 primitive props 유지
  - callback / renderer reference 안정화
- query-driven refresh는 이런 list hygiene와 같이 갈 때 가장 자연스럽다.

즉 RN 실무 조합은 보통:

- `TanStack Query`
- virtualized list
- stable item component
- `expo-image`
- query state 기반 refresh indicator

로 읽는 편이 좋다.

## 현재 워크스페이스에 대한 추천

- `nomad-diary`에서 pull-to-refresh를 넣는다면:
  - `onRefresh`는 refetch trigger만 담당
  - `refreshing`은 query state에서 파생
  - mutation 후 후처리는 `invalidateQueries`
  - query key prefix는 처음부터 계층적으로 설계

가 기본값이다.

## 관련 문서

- [React Query와 현재 데이터 패칭 베스트 프랙티스](react-query-and-data-fetch-best-practices.md)
- [탭 이탈 시 스택 초기화와 화면 새로고침](tab-blur-stack-reset-and-query-refresh.md)

## 참고

- [TanStack Query QueryClient](https://tanstack.com/query/latest/docs/reference/QueryClient)
- [TanStack Query Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)
- [TanStack Query React Native](https://tanstack.com/query/latest/docs/framework/react/react-native)
- [TanStack Query useIsFetching](https://tanstack.com/query/latest/docs/framework/react/reference/useIsFetching)

## 스킬 추출 후보

### 트리거

- RefreshControl 로딩 표시를 query lifecycle에 맞추고 싶을 때

### 권장 기본값

- refresh indicator는 query의 `isRefetching` 또는 derived state에 맡긴다.
- 수동 refresh는 `invalidateQueries`나 query-level `refetch`로 trigger만 건다.
- local `refreshing` boolean은 query state와 중복되지 않게 최소화한다.

### 레거시 안티패턴

- `setRefreshing(true/false)`를 query lifecycle과 따로 관리하기
- refetch와 invalidate의 역할을 섞어서 쓰기

### 예외 / 선택 기준

- query layer가 아직 없는 화면이라면 임시 local refreshing도 가능하지만 곧 query state로 올리는 편이 좋다.

### 현재식 코드 스케치

```tsx
const refreshing = moviesQuery.isRefetching && !moviesQuery.isLoading;
const onRefresh = () =>
  queryClient.invalidateQueries({ queryKey: ['movies'] });
```

### 스킬 규칙 초안

- "RefreshControl의 `refreshing`은 local boolean보다 query `isRefetching`에서 파생한다."

