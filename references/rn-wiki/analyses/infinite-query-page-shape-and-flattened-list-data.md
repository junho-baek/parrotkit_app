# 무한 쿼리 페이지 구조와 평탄화된 리스트 데이터 | Infinite Query Page Shape and Flattened List Data

## 범위

- `nomadcoders/noovies`의 2021-09-23 커밋 `5e8e000` (`2.28 Infinite Scroll part One`)를 계기로,
  React Native / TanStack Query 앱에서:
  - `useInfiniteQuery`를 도입할 때 데이터 shape가 어떻게 바뀌는지
  - `data.results` 중심 화면이 왜 `data.pages` 중심 사고로 바뀌는지
  - virtualized list가 실제로 소비할 flat data를 어디서 만들지
를 현재 기준으로 다시 정리한다.

## 짧은 결론

- 이 커밋의 핵심은 "아직 다음 페이지를 실제로 가져오진 않지만, upcoming 목록의 데이터 모델을 single-page query에서 infinite query로 바꾸기 시작했다"는 점이다.
- 즉 이 시점부터 화면은 더 이상:
  - `upcomingData.results`

만 읽는 것이 아니라,

  - `upcomingData.pages`
  - 각 page 안의 `results`

를 합쳐서 list data를 만드는 구조로 넘어간다.
- 현재 기준으론 이 전환 자체가 중요하다.
- 다만 지금은:
  - `useInfiniteQuery` object syntax
  - `initialPageParam`
  - `getNextPageParam`
  - query boundary에서의 flat data derivation
  - 큰 피드에서의 `FlashList` / `LegendList`
  - 필요 시 `maxPages`

까지 같이 설계하는 편이 더 current best practice에 가깝다.

## 레거시 커밋이 실제로 한 것

- `Movies.tsx`에서 `upcoming`만 `useQuery`에서 `useInfiniteQuery`로 바뀐다.
- 아직 `moviesApi.upcoming`은 page 번호를 받지 않고, `page=1` 고정 fetch 상태다.
- 그럼에도 화면 데이터 소비 방식은 이미:

```ts
upcomingData.results
```

에서

```ts
upcomingData.pages.map((page) => page.results).flat()
```

으로 바뀐다.
- `FlatList`에는:
  - `onEndReached={loadMore}`
  - `onEndReachedThreshold={0.4}`

가 추가된다.
- 하지만 `loadMore`는 아직 `alert("load more!")`만 호출하므로,
  실제 pagination fetch는 다음 커밋에서 붙는다.
- 파일 맨 아래엔 `pageParams` / `pages` 구조를 확인한 debug output이 주석으로 남아 있다.

즉 이 커밋은 "무한 스크롤 동작"보다 먼저,
"무한 쿼리 데이터 구조를 화면이 받아들이기 시작한 단계"라고 읽는 편이 정확하다.

## 이때의 핵심 개념

### 1. `useInfiniteQuery`는 먼저 데이터 shape를 바꾼다

- 일반 query는 보통 "응답 하나"를 `data`로 받는다.
- infinite query는 같은 query key 아래에서 응답들을 누적해:
  - `data.pages`
  - `data.pageParams`

형태로 보관한다.
- 즉 infinite query의 첫 변화는 네트워크 호출 방식보다,
  cache 데이터 구조 변화다.

### 2. 화면은 더 이상 API page 하나를 직접 렌더하지 않는다

- 기존엔 `results` 하나만 있으면 곧바로 `FlatList.data`에 넣을 수 있었다.
- infinite query가 되면 화면은:
  - query cache는 paged structure로 유지하고
  - list에는 flat structure를 넘기는

중간 변환 단계를 갖게 된다.

즉 query data shape와 list consumption shape가 분리되기 시작한다.

### 3. 무한 스크롤은 동작보다 스캐폴딩이 먼저 들어올 수 있다

- 이 커밋은 `onEndReached`와 threshold를 먼저 붙이고,
  실제 `fetchNextPage()`는 아직 붙이지 않았다.
- 실무에서도 종종:
  - query shape 전환
  - list wiring
  - next-page fetch 연결

이 한 번에 끝나지 않고 단계적으로 진행된다.

### 4. `pages[]`를 flatten하는 위치가 새 설계 포인트가 된다

- infinite query 화면에선 항상:
  - `pages`를 그대로 쓸지
  - 화면에서 flat array를 만들지
  - hook / selector에서 미리 파생할지

를 정해야 한다.
- 이 커밋은 가장 직접적인 형태로 JSX 근처에서 평탄화를 시작한 단계다.

## 지금 봐도 좋은 점

- `upcoming`만 먼저 infinite query로 분리해 도입 폭을 작게 잡은 점
- `pages[]` 구조를 실제 로그로 확인한 점
- list data가 더 이상 single response가 아니라는 사실을 코드에 반영한 점
- `onEndReached` wiring을 미리 붙여 다음 단계로 자연스럽게 넘어갈 수 있게 한 점

이 네 가지는 지금 봐도 학습 흐름상 좋은 전진이다.

## 현재 기준으로 바꿔 읽어야 할 점

### 1. 지금의 `useInfiniteQuery`는 object syntax와 `initialPageParam`이 기본이다

- 최신 TanStack Query 문서에서 `useInfiniteQuery`는:
  - `initialPageParam`
  - `getNextPageParam`

을 명시하는 object syntax를 기본으로 설명한다.
- 따라서 현재식으론 보통:

```ts
const upcomingQuery = useInfiniteQuery({
  queryKey: ["movies", "upcoming"],
  queryFn: ({ pageParam }) => moviesApi.upcoming({ pageParam }),
  initialPageParam: 1,
  getNextPageParam: (lastPage) =>
    lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
})
```

처럼 시작한다.
- 이 커밋은 "shape 전환"만 먼저 일어난 과도기 단계라고 보면 된다.

### 2. flat data는 JSX 안에서 ad-hoc하게 만들기보다 query boundary에서 파생하는 편이 좋다

- `pages.map((page) => page.results).flat()`은 개념 설명엔 좋지만,
  화면이 다시 렌더될 때마다 list용 배열을 새로 만든다.
- React Native `FlatList` 문서는 `FlatList`가 `PureComponent`이며,
  `data` prop 변화와 바깥 의존성 변화를 얕은 비교로 본다고 설명한다.
- 현재식으론 보통:
  - custom hook
  - TanStack Query `select`
  - 안정적인 derived helper

중 한 곳에서 flat list data를 만든다.

핵심은 "페이지 cache는 paged shape로 유지하되, 화면 소비 shape는 한 곳에서 일관되게 파생한다"는 점이다.

### 3. item object를 다시 만들지 않는 flatten이 중요하다

- `pages.map(...).flat()`은 item reference 자체를 새로 만들진 않는다.
- 그래서 "page 안의 기존 item object를 그대로 펼친다"는 점에선 비교적 괜찮다.
- 하지만 현재 `vercel-react-native-skills` 기준으론:
  - list 직전에 object remap을 새로 만들지 말고
  - primitive props / stable references를 유지하는 편이 좋다.

즉 현재식 flatten은 가능하면:
  - 새 item object 생성 없이
  - 기존 API item reference를 유지한 채
  - list item component가 필요한 값만 읽게

설계하는 편이 좋다.

### 4. `onEndReachedThreshold`는 pagination logic이 아니라 trigger boundary다

- React Native `VirtualizedList` 문서는 `onEndReached`가
  리스트 끝에서 `onEndReachedThreshold`만큼 가까워졌을 때 호출된다고 설명한다.
- 즉 threshold는 "언제 시도할지"를 정하는 값이지,
  "실제로 다음 페이지를 가져올 수 있는지"를 판단하진 않는다.
- 그래서 현재식으론 이후 단계에서 반드시:

```ts
if (hasNextPage && !isFetchingNextPage) {
  fetchNextPage()
}
```

같은 query 상태 guard가 같이 붙어야 한다.

### 5. 무한 목록은 모바일 메모리 한계도 같이 본다

- 최신 TanStack Query 문서는 infinite query에 `maxPages` 옵션도 제공한다.
- 모바일에서 페이지를 끝없이 누적하면 cache 메모리와 list work가 같이 늘어나므로,
  현재식으론:
  - 정말 끝없는 피드인지
  - 최근 몇 페이지면 충분한지
  - 화면을 벗어나면 cache를 얼마나 오래 둘지

까지 함께 설계하는 편이 좋다.

### 6. 큰 피드라면 `FlatList`보다 더 공격적인 virtualizer도 빨리 검토한다

- React Native 공식 baseline으론 `FlatList`가 맞다.
- 다만 현재 `vercel-react-native-skills` 기준에선
  스크롤이 길어질 피드나 search result, infinite list에
  `FlashList` / `LegendList`를 더 빨리 검토하는 편이 current하다.
- 즉 infinite query 개념은 그대로 두되,
  받침대 virtualizer는 더 modern한 선택지로 바뀔 수 있다.

## 현재의 핵심 개념

### 1. infinite query 도입은 먼저 "데이터 구조 전환"이다

- 무한 스크롤은 `fetchNextPage()` 버튼 하나의 문제가 아니다.
- 먼저 응답이 single page에서 paged cache 구조로 바뀐다.

### 2. list는 flat data를 소비하고, query는 paged data를 보존한다

- 현재식 설계의 핵심은 이 둘을 섞지 않는 것이다.
- query cache는 `pages[]`를 유지하고,
  화면은 list-friendly data를 파생해 소비한다.

### 3. virtualized list 성능은 stable references에 달려 있다

- flatten은 가능하지만,
  item object remap, inline object creation, unstable render references는 줄이는 편이 좋다.
- 큰 목록일수록 이 원칙이 더 중요해진다.

### 4. infinite list는 UX 상태도 분리해서 본다

- 초기 진입 로딩
- pull-to-refresh
- next-page loading

은 서로 다른 상태다.
- 이 커밋은 아직 초기 shape 전환 단계지만,
  현재식으론 이 세 상태가 eventually 분리돼야 한다.

## 추천 현재식 번역

- `useInfiniteQuery`는 object syntax와 `initialPageParam`으로 시작한다.
- API fetcher는 `pageParam`을 받는다.
- `pages[]`를 list용 flat array로 파생하는 로직은 hook이나 `select` 쪽으로 모은다.
- `FlatList`를 계속 쓴다면 stable `renderItem`, `keyExtractor`, footer/loading state를 분리한다.
- 피드가 커지면 `FlashList` / `LegendList`를 검토한다.
- 메모리와 UX를 함께 보며 필요하면 `maxPages`를 건다.


## 스킬 추출 후보

### 트리거

- infinite query data를 `pages[]`에서 화면용 flat list data로 파생해야 할 때

### 권장 기본값

- infinite query는 `pages[]` shape를 먼저 모델링하고 화면용 flat data는 파생해서 쓴다.
- `initialPageParam`, `getNextPageParam`, `hasNextPage` guard를 함께 설계한다.
- next-page loading과 initial loading, refresh loading을 구분한다.

### 레거시 안티패턴

- `results` 단일 배열 감각으로 infinite data를 계속 다루기
- `onEndReached`마다 guard 없이 `fetchNextPage()`를 호출하기

### 예외 / 선택 기준

- 페이지가 2~3개뿐인 아주 작은 학습용 API에선 단순 누적 fetch도 가능하다.

### 현재식 코드 스케치

```ts
const upcomingQuery = useInfiniteQuery({
  queryKey: ['movies', 'upcoming'],
  initialPageParam: 1,
  queryFn: ({ pageParam }) => moviesApi.upcoming(pageParam),
  getNextPageParam: (lastPage) => lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
});
```

### 스킬 규칙 초안

- "infinite data는 원본 `pages[]`를 유지하고, 화면용 flat array는 selector나 memo에서 파생한다."

## 관련 페이지

- [페이지 파라미터 기반 무한 스크롤과 끝지점 페칭](page-param-infinite-scrolling-and-end-reached-fetching.md)
- [React Query와 현재 데이터 패칭 베스트 프랙티스](react-query-and-data-fetch-best-practices.md)
- [ScrollView, FlatList, LegendList, SectionList](scrollview-flatlist-legendlist-sectionlist.md)
- [쿼리 기반 Pull-to-Refresh와 리패칭 상태](query-driven-pull-to-refresh.md)

## 참고 자료

- [TanStack Query `useInfiniteQuery`](https://tanstack.com/query/latest/docs/framework/react/reference/useInfiniteQuery)
- [React Native `FlatList`](https://reactnative.dev/docs/flatlist)
- [React Native `VirtualizedList`](https://reactnative.dev/docs/virtualizedlist)
- [Vercel React Native Skills - Use a List Virtualizer for Any List](/Users/junho/.agents/skills/vercel-react-native-skills/rules/list-performance-virtualize.md)
- [Vercel React Native Skills - Optimize List Performance with Stable Object References](/Users/junho/.agents/skills/vercel-react-native-skills/rules/list-performance-function-references.md)
