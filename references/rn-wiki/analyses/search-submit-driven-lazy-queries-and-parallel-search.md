# 검색 제출 기반 지연 쿼리와 병렬 검색 | Submit-Driven Lazy Queries and Parallel Search

## 범위

- `nomadcoders/noovies`의 2021-09-22 커밋 `91c9335` (`2.19 Search part Two`)를 계기로,
  React Native / TanStack Query 검색 화면에서:
  - 입력값을 query key와 어떻게 연결하는지
  - submit 기반 검색을 어떻게 트리거하는지
  - 영화/TV처럼 여러 검색을 병렬로 어떻게 다루는지
를 현재 기준으로 다시 정리한다.

## 짧은 결론

- 이 커밋의 핵심은 "검색 입력값이 실제 query layer에 연결되기 시작했다"는 점이다.
- 특히:
  - `["searchMovies", query]`
  - `["searchTv", query]`
  같은 key를 만들고,
  `enabled: false` + `refetch()`로 submit 시점 검색을 붙인 단계라는 점이 중요하다.
- 현재 기준으론 이 발상이 여전히 유효하지만,
  기본값은 보통:
  - `inputValue`와 `submittedQuery`를 분리하고
  - `submittedQuery`가 생기면 query가 자연스럽게 열리게 두며
  - movie/tv 병렬 검색은 `useQueries`나 object-syntax `useQuery` 여러 개로 선언형에 더 가깝게 풀어가는 편이다.

## 레거시 커밋이 실제로 한 것

- `moviesApi.search`, `tvApi.search`를 추가했다.
  - query function 안에서 `queryKey`를 받아 검색어를 꺼낸다.
- `Search.tsx`에서:
  - `query` local state
  - `useQuery(["searchMovies", query], ..., { enabled: false })`
  - `useQuery(["searchTv", query], ..., { enabled: false })`
  를 만들었다.
- `onSubmitEditing`에서:
  - 빈 문자열은 막고
  - `searchMovies()`
  - `searchTv()`
  를 직접 호출한다.

즉 이 커밋은 "입력만 있던 검색 화면"에서 "submit 시점에 실제 query를 두 개 동시에 트리거하는 검색 화면"으로 넘어간 단계다.

## 이때의 핵심 개념

### 1. 검색어가 query identity의 일부가 된다

- 앞 단계에서는 `query`가 단순 input state였다.
- 이 커밋부터는 검색어가 query key 안으로 들어오며,
  캐시와 요청 정체성 일부가 되기 시작한다.

즉 "입력값"이 처음으로 "서버 상태의 의존성"이 된다.

### 2. 검색은 mount 즉시가 아니라 submit 시점에 시작할 수 있다

- `enabled: false`를 두고
- `refetch()`를 submit에서 호출하는 방식으로,
  검색을 lazy query처럼 다룬다.

이건 검색 화면에서 꽤 자연스러운 패턴이다.

### 3. 서로 다른 리소스를 같은 검색어로 병렬 검색한다

- movie 검색
- tv 검색

을 같은 `query`로 동시에 실행한다.

즉 이 커밋은 "검색 결과는 한 API 하나"가 아니라 "같은 검색 intent에서 여러 리소스를 병렬 조회할 수 있다"는 방향도 보여준다.

### 4. queryFn이 `queryKey`로부터 의존값을 읽는다

- `moviesApi.search({ queryKey })`
- `tvApi.search({ queryKey })`

구조는 TanStack Query의 핵심 모델과 맞닿아 있다.

즉 query function이 외부 closure보다 query key를 기준으로 동작하게 만들려는 방향 자체는 나쁘지 않다.

## 지금 봐도 좋은 점

- 검색어를 query key에 넣은 점
- submit 기반 lazy query를 선택한 점
- movie / tv 검색을 병렬로 나눈 점
- 빈 검색어 submit을 막은 점

이 네 가지는 지금 봐도 의미 있는 전진이다.

## 현재 기준으로 바꿔 읽어야 할 점

### 1. `enabled: false + refetch()`는 가능하지만, 기본값은 점점 더 선언형 쪽이다

- TanStack Query 문서는 `enabled: false`를 지원하지만,
  "영구적으로 비활성화된 query는 idiomatic하지 않다"고 설명한다.
- 다만 수동 트리거가 필요하면 `enabled: false`는 여전히 유효하고,
  이 경우 `refetch()`가 동작한다.

즉 이 커밋의 방식은 틀린 게 아니라,
현재 기준으론 "submit 기반 search"라는 명확한 이유가 있을 때 선택하는 패턴에 가깝다.

### 2. 지금은 `inputValue`와 `submittedQuery`를 분리하는 편이 더 자연스럽다

- 사용자가 타이핑 중인 값
- 실제 서버 검색에 쓰는 값

은 생명주기가 다를 수 있다.

현재식으론 보통:

```ts
const [inputValue, setInputValue] = useState("")
const [submittedQuery, setSubmittedQuery] = useState("")
```

처럼 나눈 뒤,
submit에서 `setSubmittedQuery(inputValue.trim())`를 하고,
query는 `submittedQuery`를 기준으로 연다.

이렇게 하면 imperative `refetch()` 호출을 줄이고,
query identity도 더 분명해진다.

### 3. 병렬 검색은 `useQueries` 또는 object-syntax `useQuery` 여러 개로 정리하는 편이 좋다

- 이 커밋처럼 query 2개를 따로 두는 방식은 지금도 충분히 가능하다.
- 다만 현재식으론:
  - object syntax
  - shared query options helper
  - `useQueries`

중 하나로 병렬 검색 묶음을 더 명확히 드러내는 편이 많다.

예:

```ts
const results = useQueries({
  queries: [
    {
      queryKey: ["search", "movies", submittedQuery],
      queryFn: () => searchMovies(submittedQuery),
      enabled: submittedQuery.length > 0,
    },
    {
      queryKey: ["search", "tv", submittedQuery],
      queryFn: () => searchTv(submittedQuery),
      enabled: submittedQuery.length > 0,
    },
  ],
})
```

### 4. `skipToken`은 타입 안정적이지만, manual `refetch()`와는 맞지 않는다

- 현재 TanStack Query 문서는 TypeScript에서 `skipToken`을 대안으로 소개한다.
- 하지만 `skipToken`을 쓰면 `refetch()`는 동작하지 않는다.

즉:

- submit 시점에 직접 `refetch()`를 누를 계획이면 `enabled: false`
- 조건이 되면 자동으로 열리게 할 계획이면 `skipToken` 또는 `enabled`

처럼 선택하는 편이 더 정확하다.

### 5. 검색 URL은 문자열 보간보다 `URLSearchParams`나 인코딩을 거치는 편이 안전하다

- 이 커밋은 `&query=${query}`를 직접 붙인다.
- 현재식으론 공백, 특수문자, 한글 검색어를 고려해:
  - `encodeURIComponent`
  - `URLSearchParams`

를 쓰는 편이 더 안전하다.

즉 search API layer에선:

```ts
const params = new URLSearchParams({
  api_key: API_KEY,
  language: "en-US",
  page: "1",
  query,
})
```

처럼 만드는 쪽이 낫다.

### 6. `TextInput`은 controlled input으로 두는 편이 더 current하다

- React Native 문서는 `TextInput`이 `value` prop을 제공하면 controlled component로 동작한다고 설명한다.
- 이 커밋은 `onChangeText`와 `onSubmitEditing`은 있지만,
  `value={query}`는 없다.

현재식으론 보통:

```tsx
<TextInput
  value={inputValue}
  onChangeText={setInputValue}
  onSubmitEditing={handleSubmit}
/>
```

처럼 두는 편이 더 분명하다.

### 7. `useDeferredValue`는 렌더 부담 완화용이지, 네트워크 요청 자체를 줄여주진 않는다

- React 문서는 `useDeferredValue`가 결과 표시 업데이트를 늦출 수는 있어도,
  네트워크 요청 자체를 자동으로 줄여주진 않는다고 설명한다.

즉 현재 검색 화면에서:

- submit 기반 검색이면 `submittedQuery`
- 자동 검색이면 debounce
- 결과 렌더가 무거우면 `useDeferredValue`

를 서로 다른 도구로 구분해서 쓰는 편이 좋다.

## 현재의 핵심 개념

### 1. 검색 query는 "입력값"보다 "제출된 의도"에 붙는 편이 좋다

- raw input은 자주 바뀌고
- committed query는 검색 의도를 대표한다.

현재식으론 cache key와 fetch identity를 committed query에 붙이는 편이 더 안정적이다.

### 2. lazy search는 가능하지만, cache identity는 여전히 선언형이어야 한다

- 수동으로 `refetch()`를 누르더라도
- query key와 queryFn 관계는 분명해야 한다.

즉 imperative trigger를 써도 data identity는 declarative해야 한다.

### 3. 병렬 검색은 리소스별 query를 따로 두되, 실행 조건은 함께 설계한다

- movie
- tv
- people

같이 리소스를 나눌 수 있지만,
실행 조건과 검색어 생명주기는 일관되게 잡는 편이 좋다.

### 4. search UX는 "input responsiveness"와 "results freshness"를 따로 본다

- input은 빨라야 하고
- 결과는 캐시와 fetch 정책을 따라 움직인다.

이 둘을 섞지 않는 것이 현재 검색 화면 설계의 핵심이다.

## `vercel-react-native-skills` 기준 해석

- 검색 결과를 붙이기 시작하면 바로 중요해지는 규칙은 이쪽이다.
  - list는 virtualized list 유지
  - 결과 item은 memo-friendly primitive props
  - 이미지에는 `expo-image`
  - 비싼 계산과 formatter는 item 바깥으로 빼기
- 즉 검색 query 자체보다,
  결과를 어떤 list 구조로 렌더하느냐가 곧 다음 성능 이슈가 된다.

## 현재 워크스페이스에 대한 추천

- `nomad-diary` 검색을 붙인다면 기본값은:
  - `inputValue`
  - `submittedQuery`
  - `useQueries` 또는 query options factory
  - `["search", "movies", submittedQuery]` 같은 계층형 key
  - `URLSearchParams` 기반 search API 함수
  - 결과는 virtualized list + `expo-image`

조합이 가장 자연스럽다.

## 관련 문서

- [검색 입력 상태와 쿼리 실행 시점 분리](search-input-state-and-query-trigger-timing.md)
- [React Query와 현재 데이터 패칭 베스트 프랙티스](react-query-and-data-fetch-best-practices.md)
- [쿼리 기반 Pull-to-Refresh와 리패칭 상태](query-driven-pull-to-refresh.md)

## 참고

- [TanStack Query: Disabling/Pausing Queries](https://tanstack.com/query/latest/docs/react/guides/disabling-queries)
- [TanStack Query: Query Keys](https://tanstack.com/query/framework/react/guides/query-keys)
- [TanStack Query: Exhaustive dependencies for query keys](https://tanstack.com/query/latest/docs/eslint/exhaustive-deps)
- [React Native: TextInput](https://reactnative.dev/docs/textinput.html)
- [React: useDeferredValue](https://react.dev/reference/react/useDeferredValue)

## 스킬 추출 후보

### 트리거

- submit 시점에 movie/tv 검색 query를 병렬로 열고 싶을 때

### 권장 기본값

- `inputValue`와 실제 query key에 들어가는 committed search term을 분리한다.
- 검색 결과는 sectioned 또는 virtualized list로 보여주고, navigation payload는 최소 식별자로 제한한다.
- 여러 search query는 선언형으로 병렬 구성한다.

### 레거시 안티패턴

- 타이핑 중 값과 실제 서버 요청 값을 같은 state로 취급해 매번 의미를 섞기
- 카드 UI가 navigation topology를 직접 다 알아야만 검색 결과에서 작동하게 만들기

### 예외 / 선택 기준

- 작은 submit-only 데모에서는 `enabled: false` + manual refetch도 설명용으로 가능하다.

### 현재식 코드 스케치

```tsx
const [inputValue, setInputValue] = useState('');
const [submittedQuery, setSubmittedQuery] = useState('');

const movieQuery = useQuery({
  queryKey: ['search', 'movie', submittedQuery],
  queryFn: () => moviesApi.search(submittedQuery),
  enabled: submittedQuery.trim().length > 0,
});
```

### 스킬 규칙 초안

- "병렬 검색은 선언형 query 조합으로 유지하되, submit 시점에 committed search term만 query key로 올린다."

