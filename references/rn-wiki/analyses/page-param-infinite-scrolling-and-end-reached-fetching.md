# 페이지 파라미터 기반 무한 스크롤과 끝지점 페칭 | Page-Param Infinite Scrolling and End-Reached Fetching

## 범위

- `nomadcoders/noovies`의 2021-09-23 커밋 `7aea416` (`2.29 Infinite Scroll part Two`)를 계기로,
  React Native / TanStack Query 앱에서:
  - `useInfiniteQuery`가 페이지 번호를 어떻게 넘겨받는지
  - `FlatList.onEndReached`와 `fetchNextPage()`를 어떻게 연결하는지
  - 무한 스크롤 화면에서 초기 로딩, 다음 페이지 로딩, 새로고침을 어떻게 구분하는지
를 현재 기준으로 다시 정리한다.

## 짧은 결론

- 이 커밋의 핵심은 "upcoming 목록이 단순 1페이지 query에서, pageParam을 받는 infinite query로 바뀌고 실제 end-reached 기반 추가 페칭이 연결됐다"는 점이다.
- 즉 이 시점부터 `upcoming`은:
  - `useQuery`
  - page=1 고정 fetch

에서 벗어나,
  - `useInfiniteQuery`
  - `fetchNextPage`
  - `hasNextPage`

를 가진 진짜 infinite data source가 된다.
- 현재 기준으론 방향은 맞다.
- 다만 지금은:
  - `useInfiniteQuery` object syntax
  - `initialPageParam`
  - `hasNextPage && !isFetchingNextPage` guard
  - next-page spinner와 refresh state 분리
  - 필요하면 `FlashList`

까지 함께 보는 편이 더 current best practice에 가깝다.

## 레거시 커밋이 실제로 한 것

- `moviesApi.upcoming`이 이제 `({ pageParam })`를 받아,
  `page=${pageParam}`로 요청한다.
- `Movies.tsx`의 `upcoming` 데이터 소스는:
  - `useQuery`
  에서
  - `useInfiniteQuery`
  로 바뀐다.
- `getNextPageParam`에서:
  - 현재 페이지 + 1
  - 총 페이지 수 초과 시 `null`
  로 다음 페이지 존재 여부를 계산한다.
- 화면에서는:
  - `hasNextPage`
  - `fetchNextPage`
  를 받아오고
  - `FlatList.onEndReached={loadMore}`
  로 스크롤 끝 지점과 연결한다.
- `loadMore`는 더 이상 `alert("load more!")`가 아니라,
  `hasNextPage`일 때 실제 `fetchNextPage()`를 호출한다.

즉 이 커밋은 "무한 스크롤 개념을 설명하는 단계"에서 "스크롤 끝에서 실제 다음 페이지를 가져오는 단계"로 넘어간다.

## 이때의 핵심 개념

### 1. next page는 query key가 아니라 `pageParam`으로 흐른다

- 일반 query는 보통 query key 변화로 다른 데이터를 요청한다.
- infinite query는 같은 key 아래에서,
  다음 페이지 정보를 `pageParam`으로 흘린다.

즉 "다음 페이지"는 새로운 query identity라기보다,
같은 infinite query 안의 연속 데이터다.

### 2. infinite query는 next-page 계산 규칙이 필요하다

- `getNextPageParam`이 있어야
  다음 요청에 무엇을 넘길지 알 수 있다.
- 이 커밋은 `page + 1 <= total_pages` 규칙으로 그걸 구현한다.

즉 infinite scroll은 단순히 `fetchMore()`가 아니라,
"다음 값이 무엇인가"를 계산하는 규칙이 함께 있어야 한다.

### 3. 스크롤 끝과 네트워크 요청이 연결된다

- `onEndReached`
- `fetchNextPage`

가 연결되면서,
리스트 스크롤이 곧 데이터 fetch trigger가 된다.

이건 RN 리스트 UX에서 매우 중요한 전환이다.

### 4. initial loading과 next-page loading은 다른 상태다

- `useInfiniteQuery`는:
  - 처음 화면 진입 시 로딩
  - 다음 페이지를 붙일 때 로딩

을 구분해 다뤄야 한다.
- 이 커밋은 아직 `isFetchingNextPage`를 쓰진 않지만,
  그 필요성이 생긴 단계다.

## 지금 봐도 좋은 점

- `upcoming`을 infinite query로 올린 점
- `pageParam`을 fetcher가 실제로 받기 시작한 점
- `getNextPageParam`으로 다음 페이지 규칙을 명시한 점
- `onEndReached`가 실제 `fetchNextPage()`를 호출하도록 바뀐 점

이 네 가지는 지금 봐도 중요한 전진이다.

## 현재 기준으로 바꿔 읽어야 할 점

### 1. 현재 `useInfiniteQuery`는 `initialPageParam`이 필수다

- 최신 TanStack Query 문서는 `useInfiniteQuery`에서:
  - `initialPageParam`
  - `getNextPageParam`
이 모두 필수라고 설명한다.
- 이 커밋은 v3 문맥이라 넘어갔지만,
  현재식으론 보통:

```ts
useInfiniteQuery({
  queryKey: ["movies", "upcoming"],
  queryFn: ({ pageParam }) => moviesApi.upcoming({ pageParam }),
  initialPageParam: 1,
  getNextPageParam: (lastPage) =>
    lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
})
```

처럼 시작 페이지를 분명히 적는다.

### 2. `pageParam` 첫 값이 불분명하면 첫 페이지 요청이 흔들릴 수 있다

- 이 커밋의 fetcher는 `page=${pageParam}`를 바로 쓴다.
- 그런데 첫 `pageParam` 기본값이 명시돼 있지 않으면,
  버전이나 구현 문맥에 따라 첫 페이지가 불분명해질 수 있다.

현재식으론:
  - `initialPageParam: 1`
  - 혹은 queryFn에서 `({ pageParam = 1 })`

중 최소 하나는 분명히 두는 편이 좋다.

### 3. `fetchNextPage()`는 `hasNextPage && !isFetchingNextPage`로 감싸는 편이 좋다

- 최신 TanStack Query 문서는 imperative fetch인 `fetchNextPage`가
  기본 refetch 동작과 간섭할 수 있으니,
  user action에만 호출하거나 `hasNextPage && !isFetching` 같은 조건을 두라고 설명한다.

즉 현재식으론 보통:

```ts
const loadMore = () => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage()
  }
}
```

처럼 중복 호출을 막는다.

### 4. `FlatList.onEndReached`는 반복 호출 가능성을 염두에 둬야 한다

- React Native `VirtualizedList` 문서는 `onEndReached`가
  list 끝에 가까워졌을 때 호출된다고 설명한다.
- FlashList 문서도 `onEndReached`가 threshold 안으로 들어오면 호출된다고 설명한다.
- 실무에선 빠른 스크롤이나 레이아웃 변화로 여러 번 불릴 수 있으므로,
  list 콜백만 믿지 말고 query 상태 가드를 같이 두는 편이 좋다.

즉 infinite scroll은:
  - list threshold
  - query guard

를 같이 설계해야 한다.

### 5. 무한 스크롤에선 `refreshing`과 `isFetchingNextPage`를 구분하는 편이 좋다

- 이 커밋은 refresh는 여전히 `refreshing` local state로 다루고,
  next-page loading은 아직 별도로 드러내지 않는다.
- 현재식으론 보통:
  - pull-to-refresh indicator
  - footer spinner
  - initial fullscreen loader

를 분리한다.

즉:

- 처음 로딩: `isPending`
- 새로고침: `isRefetching`
- 다음 페이지: `isFetchingNextPage`

를 다르게 보여주는 편이 더 자연스럽다.

### 6. `FlatList`는 공식 baseline, 큰 피드에선 `FlashList`가 더 current하다

- React Native 문서는 `FlatList`를 기본 flat list로 제공한다.
- 현재 `vercel-react-native-skills` 기준에선 큰 피드나 성능 민감 화면에
  `FlashList`를 더 빨리 검토하는 편이 current하다.
- FlashList도 `onEndReached` / `onRefresh`를 지원하므로,
  infinite query 패턴 자체는 거의 그대로 옮길 수 있다.

즉 개념은 유지되고,
받침대 list가 더 modern해지는 셈이다.

### 7. infinite data는 결국 `pages`를 어떻게 flatten해 소비할지까지 설계해야 한다

- 이 커밋은 아직 `upcomingData?.pages`를 `console.log` 하는 단계다.
- 현재식으론 결국:
  - `pages`
  - `pageParams`
를 실제 list data로 어떻게 평탄화할지 정해야 한다.

여기서도 화면마다 ad-hoc하게 처리하기보다:
  - custom hook
  - `select`
  - memoized flatten

중 한 곳에 두는 편이 좋다.

## 현재의 핵심 개념

### 1. infinite query는 같은 key 아래에서 pageParam이 움직이는 구조다

- 다음 페이지는 새로운 화면 query가 아니라,
  기존 query의 연속 데이터다.

### 2. 무한 스크롤은 list 이벤트와 query 상태를 함께 설계해야 한다

- `onEndReached`만으로는 부족하고
- `hasNextPage`
- `isFetchingNextPage`

같은 query 상태와 함께 봐야 안전하다.

### 3. initial loading, refresh, append loading은 다른 UX다

- infinite list가 되면 로딩 상태도 한 종류가 아니다.
- 이 셋을 분리하는 것이 current infinite list UX의 핵심이다.

### 4. infinite list는 data structure도 바뀐다

- 단일 `results[]`
- 가 아니라
- `pages[]`

구조가 되므로,
screen은 이를 어떻게 소비할지 별도 설계가 필요하다.

## `vercel-react-native-skills` 기준 해석

- 이번 커밋은 특히 아래 규칙들과 잘 연결된다.
  - `list-performance-virtualize`
  - `list-performance-item-memo`
  - `list-performance-function-references`
  - `ui-expo-image`
- 현재식으로 번역하면:
  - infinite source는 `useInfiniteQuery`
  - 큰 피드는 `FlashList`
  - end-reached는 guarded callback
  - list item은 primitive props 유지

조합이 가장 자연스럽다.

## 현재 워크스페이스에 대한 추천

- `nomad-diary`에서 무한 스크롤을 붙인다면:
  - `useInfiniteQuery` object syntax
  - `initialPageParam: 1`
  - `getNextPageParam`
  - `hasNextPage && !isFetchingNextPage` guard
  - `FlashList`의 `onEndReached`
  - footer loading indicator 분리

구조가 기본값이다.

## 관련 문서

- [React Query와 현재 데이터 패칭 베스트 프랙티스](react-query-and-data-fetch-best-practices.md)
- [쿼리 기반 Pull-to-Refresh와 리패칭 상태](query-driven-pull-to-refresh.md)
- [스크롤, 캐싱, 업로드, 서버 상태 발전 흐름](rn-scroll-cache-upload-query-evolution.md)

## 참고

- [TanStack Query: useInfiniteQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useInfiniteQuery)
- [React Native: VirtualizedList](https://reactnative.dev/docs/virtualizedlist)
- [React Native: FlatList](https://reactnative.dev/docs/flatlist)
- [FlashList Usage](https://shopify.github.io/flash-list/docs/usage/)

## 스킬 추출 후보

### 트리거

- pageParam과 `onEndReached`를 연결해 무한 스크롤을 붙일 때

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

- "`onEndReached`는 `hasNextPage && !isFetchingNextPage` guard와 함께 쓴다."

