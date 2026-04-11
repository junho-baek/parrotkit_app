# API 응답 타입과 Nullable 미디어 필드 처리 | API Response Typing and Nullable Media Fields

## 범위

- `nomadcoders/noovies`의 2021-09-22 커밋 `f93741c` (`2.15 Typescript`)를 계기로,
  React Query / TanStack Query 화면에서:
  - API 응답 타입을 어디에 둘지
  - query 결과 타입을 어디서 추론할지
  - `poster_path: string | null` 같은 nullable 필드를 어떻게 처리할지
를 현재 Expo / React Native 기준으로 다시 정리한다.

## 짧은 결론

- 이 커밋의 핵심은 "화면이 쓰는 서버 데이터 shape를 타입으로 명시하기 시작했다"는 점이다.
- 현재도 그 방향은 맞다.
- 다만 지금은:
  - 응답 타입을 API boundary에 두고
  - `useQuery<MovieResponse>`를 화면마다 반복하기보다 `queryFn` / `queryOptions`에서 타입을 흘리고
  - `poster_path || ""` 같은 빈 문자열 sentinel보다 nullable 필드를 명시적으로 처리
하는 편이 더 현재식이다.

## 레거시 커밋이 실제로 한 것

- `api.ts`에:
  - `Movie`
  - `BaseResponse`
  - `MovieResponse`
타입을 추가했다.
- `Movies.tsx`의 각 query에:
  - `useQuery<MovieResponse>(...)`
처럼 제네릭을 붙였다.
- `nowPlayingData?.results`
  `trendingData ? ... : null`
같이 data 존재 여부를 방어적으로 다뤘다.
- `backdrop_path || ""`
  `poster_path || ""`
처럼 nullable image path를 빈 문자열로 바꿔 넘겼다.

즉 이 커밋은 "query data는 unknown-ish하게 두지 말고, 응답 shape를 먼저 타입으로 잡자"는 단계였다.

## 이때의 핵심 개념

### 1. 화면이 쓰는 API 응답 shape를 타입으로 올린다

- 서버 응답이 어떤 필드를 주는지 타입으로 적기 시작했다.
- 이건 이후:
  - 자동완성
  - nullable 필드 인식
  - refactor 안정성
에 큰 도움을 준다.

### 2. query 결과 타입을 화면에서 명시한다

- `useQuery<MovieResponse>(...)`로,
  "이 query는 어떤 데이터를 돌려준다"를 screen에서 직접 적었다.
- 당시엔 가장 직관적인 TypeScript 도입 방식이었다.

### 3. nullable 미디어 필드를 우선 화면에서 막는다

- `poster_path: string | null`을 인정하고,
  실제 전달할 때는 `|| ""`로 비어 있는 문자열로 바꿨다.
- 즉 nullable 문제를 우선 UI 호출부에서 막기 시작했다.

### 4. data guard를 통해 크래시를 피한다

- `upcomingData ? <FlatList ... /> : null`
- `nowPlayingData?.results.map(...)`

같은 패턴으로 undefined 시점을 방어했다.

즉 이 커밋은 "타입을 추가하면서 undefined / null과 처음 정면으로 마주친 단계"라고 볼 수 있다.

## 지금 봐도 좋은 점

- 응답 타입을 `api.ts`로 올린 점
- `any` 대신 구체 응답 타입을 붙인 점
- nullable 필드를 무시하지 않고 타입에 반영한 점
- data가 없을 수 있는 시점을 코드로 드러낸 점

이 네 가지는 지금 봐도 좋다.

## 현재 기준으로 바꿔 읽어야 할 점

### 1. query 타입은 화면 제네릭보다 query function 쪽에서 더 자연스럽게 흐르게 한다

- 현재 TanStack Query 문서는 `queryOptions` helper를 통해:
  - `queryKey`
  - `queryFn`
을 한 곳에 두고,
  TypeScript inference를 같이 가져가는 패턴을 권장한다.
- 그래서 지금은:
  - 화면마다 `useQuery<MovieResponse>(...)`
를 반복하는 것보다
  - `moviesOptions.nowPlaying()`
  - `moviesOptions.trending()`
같은 옵션 함수에서 타입이 흘러가게 만드는 편이 더 좋다.

예:

```tsx
function nowPlayingOptions() {
  return queryOptions({
    queryKey: ['movies', 'nowPlaying'],
    queryFn: moviesApi.nowPlaying,
    staleTime: 60_000,
  })
}

const query = useQuery(nowPlayingOptions())
```

즉 현재식 핵심은 "타입을 화면에서 주입하기보다 API/query options에서 흘려보내기"다.

### 2. 응답 타입은 feature boundary에 더 가깝게 둔다

- 이 커밋은 `api.ts`에 response type을 둔다.
- 지금도 방향은 맞지만, 앱이 커지면 보통:
  - `features/movies/api/types.ts`
  - `features/movies/model/movie.ts`

처럼 feature-local domain에 더 가깝게 둔다.

즉 "전역 api.ts에 다 몰기"보다 "feature 안의 API contract"에 더 가깝게 둔다.

### 3. `poster_path || ""`는 현재 기준으론 조금 거칠다

- `string | null`을 억지로 `""`로 바꾸면,
  nullability 정보가 사라지고
  이미지 컴포넌트는 빈 문자열을 uri로 받게 된다.
- 현재식으론 보통 둘 중 하나가 더 낫다.
  - image prop 자체를 `string | null`로 받고 내부에서 placeholder/fallback 처리
  - API layer / mapper에서 "표시 가능한 view model"로 명시적으로 normalize

즉 빈 문자열 sentinel보다:
  - nullable을 유지
  - fallback 위치를 한 군데로 모으기

가 더 좋다.

### 4. screen에 data guard가 너무 많아지면 fallback boundary를 올린다

- `query.data?.results`
- `query.data ? ... : null`

같은 패턴이 많아지면 screen이 noisy해진다.
- 현재식으론 보통:
  - `if (loading) return <Loader />`
  - `if (!data) return <ErrorOrEmpty />`
같이 early boundary를 먼저 세우고,
  그 아래에선 data를 defined로 취급하는 편이 더 읽기 쉽다.

이건 `vercel-react-native-skills`의 fallback state 해석과도 잘 맞는다.

### 5. inline renderItem으로 되돌아간 건 현재식으론 다시 분리하는 편이 좋다

- 이 커밋은 타입을 붙이면서 `renderVMedia`, `renderHMedia`를 지우고 inline renderItem으로 돌아갔다.
- 하지만 현재 RN 성능 관점에선:
  - stable callback
  - primitive props
  - memo-friendly item
이 더 중요하다.

즉 지금 기준으론:
  타입 안정성과 renderer 안정성을 같이 챙기는 편이 좋다.

## 현재의 핵심 개념

### 1. 타입은 API boundary에서 시작한다

- `fetch` 결과를 화면에서 임시로 다루지 말고
- 응답 shape를 API/query layer에서 먼저 명시한다.

### 2. query result 타입은 가능하면 inference로 흘린다

- `queryFn`의 반환 타입
- `queryOptions`

을 통해 화면까지 타입이 따라오게 한다.

### 3. nullable은 숨기지 말고 처리 위치를 정한다

- `null`
- `undefined`
- 빈 문자열

을 서로 섞지 말고, 어디서 fallback할지를 정한다.

보통 선택지는:
  - image component 내부
  - mapper / select 함수
  - empty state component

중 하나다.

### 4. 화면은 타입 선언 장소보다 소비 장소에 가깝다

- screen에서 모든 제네릭과 null guard를 직접 떠안기보다
- feature hook / query options / mapper가 먼저 정리하고
- screen은 결과를 소비하는 편이 좋다.

## `vercel-react-native-skills` 기준 해석

- 이 스킬은 타입 전용 규칙집은 아니지만, 현재 해석과 잘 맞는 지점이 있다.
  - list item은 primitive props로 유지
  - renderItem callback은 안정화
  - 이미지 처리는 더 명시적으로
  - fallback state는 초기에 분기
- 즉 현재 RN 실무에선:
  - typed API response
  - query-driven data flow
  - memo-friendly item props
  - nullable media fallback 일원화

를 함께 잡는 편이 자연스럽다.

## 현재 워크스페이스에 대한 추천

- `nomad-diary`에 서버 데이터 타입을 붙인다면:
  - `features/.../api/types.ts`
  - `features/.../api/*.ts`
  - `features/.../hooks/use-xxx-query.ts`
로 나누는 편이 좋다.
- 이미지 path가 nullable이면:
  - route/screen에서 `|| ""`를 뿌리기보다
  - 공용 media component나 mapper 한 곳에서 fallback을 처리하는 편이 낫다.
- query는 가능하면:
  - `queryOptions`
  - typed queryFn
기반으로 타입이 흘러가게 두는 쪽이 좋다.

## 관련 문서

- [React Query와 현재 데이터 패칭 베스트 프랙티스](react-query-and-data-fetch-best-practices.md)
- [쿼리 기반 Pull-to-Refresh와 리패칭 상태](query-driven-pull-to-refresh.md)
- [Expo TypeScript 전환과 내비게이션 타이핑](expo-typescript-migration-and-navigation-typing.md)

## 참고

- [TanStack Query Query Options](https://tanstack.com/query/latest/docs/framework/react/guides/query-options)
- [TanStack Query queryOptions](https://tanstack.com/query/latest/docs/framework/react/reference/queryOptions)
- [Expo TypeScript guide](https://docs.expo.dev/guides/typescript/)
- [React Native FlatList](https://reactnative.dev/docs/flatlist)

## 스킬 추출 후보

### 트리거

- API 응답 타입, query 결과 타입, nullable media field fallback을 화면 경계에 붙일 때

### 권장 기본값

- 서버 상태는 TanStack Query key와 query function boundary에서 모델링한다.
- loading, refreshing, stale 상태는 query state에서 파생한다.
- 응답 타입, nullable 필드, mapper는 API boundary에서 먼저 정리한다.

### 레거시 안티패턴

- 화면마다 `useEffect + fetch + setState`를 반복하기
- query key 설계 없이 refetch만 호출해 흐름을 맞추기

### 예외 / 선택 기준

- 짧은 일회성 데모나 툴링 없는 스크립트라면 단순 fetch도 가능하다.

### 현재식 코드 스케치

```ts
const trendingOptions = queryOptions({
  queryKey: ['movies', 'trending'],
  queryFn: moviesApi.trending,
});

const trendingQuery = useQuery(trendingOptions);
```

### 스킬 규칙 초안

- "API 응답 타입은 API boundary에 두고, nullable 미디어 필드는 빈 문자열 sentinel 대신 명시적 mapper/fallback으로 처리한다."

