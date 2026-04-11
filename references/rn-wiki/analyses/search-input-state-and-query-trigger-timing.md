# 검색 입력 상태와 쿼리 실행 시점 분리 | Search Input State and Query Trigger Timing

## 범위

- `nomadcoders/noovies`의 2021-09-22 커밋 `b88e6ae` (`2.18 Search part One`)를 계기로,
  React Native / TanStack Query 앱에서:
  - 검색 입력 상태를 어떻게 들고 갈지
  - query를 언제 실행할지
  - 검색 입력과 refresh state를 왜 같은 local state 취급으로 보면 안 되는지
를 현재 기준으로 다시 정리한다.

## 짧은 결론

- 이 커밋의 핵심은 "검색 입력 문자열을 별도 상태로 분리하기 시작했다"는 점이다.
- 현재도 그 출발점은 맞다.
- 다만 지금은:
  - raw input state와 committed search term을 분리하고
  - query key에 search term을 포함하며
  - `enabled` / `skipToken` 또는 submit 기반 lazy query로 실행 시점을 제어하고
  - refresh indicator는 query state에서 파생
하는 편이 더 현재식이다.

## 레거시 커밋이 실제로 한 것

- `Search.tsx`에:
  - `query` state
  - `TextInput`
  - `onChangeText`
를 추가했다.
- `returnKeyType="search"`를 넣었다.
- 아직 실제 검색 query는 붙지 않았고, 입력값을 `console.log` 하는 단계다.
- 반면 `Movies.tsx`와 `Tv.tsx`에서는 refresh 로직을 다시:
  - `setRefreshing(true)`
  - `await queryClient.refetchQueries(...)`
  - `setRefreshing(false)`
처럼 local state로 관리하는 쪽으로 일부 되돌렸다.

즉 이 커밋은:

- 검색 입력 분리는 한 단계 전진
- refresh 상태 관리는 한 단계 회귀

가 동시에 보이는 과도기다.

## 이때의 핵심 개념

### 1. 검색어는 화면에 따로 존재하는 상태다

- `query` 문자열을 별도 state로 두면서,
  "사용자가 입력 중인 값"을 데이터 결과와 분리하기 시작했다.

이건 검색 화면에서 꼭 필요한 첫 단계다.

### 2. 검색 입력과 서버 요청은 아직 연결되지 않았다

- 이 커밋은 입력값을 받고만 있고,
  그 입력값으로 query key나 fetch를 만들진 않는다.
- 즉 search screen의 local UI state만 먼저 생긴 단계다.

### 3. `returnKeyType="search"`로 검색 intent를 UI에 반영한다

- 이건 지금 봐도 좋은 선택이다.
- 사용자가 이 입력이 단순 form field가 아니라 search field라는 걸 즉시 이해할 수 있다.

### 4. 하지만 refresh state는 query state에서 멀어졌다

- `Movies` / `Tv`에서 다시 `setRefreshing(true/false)`를 들고 가며,
  pull-to-refresh indicator를 query 상태가 아니라 local state로 관리하기 시작했다.
- 이건 앞선 refresh 단계보다 current best practice에선 덜 자연스럽다.

## 지금 봐도 좋은 점

- search input state를 결과 데이터와 분리한 점
- `returnKeyType="search"`를 사용한 점
- 검색 화면을 먼저 입력 shell부터 세운 점

이 세 가지는 지금 봐도 좋다.

## 현재 기준으로 바꿔 읽어야 할 점

### 1. 검색 입력은 보통 controlled input으로 둔다

- 현재 RN `TextInput` 문서 기준으로 controlled input으로 쓰려면:
  - `value`
  - `onChangeText`
를 함께 준다.
- 이 커밋은 `onChangeText`만 있고 `value={query}`는 없다.

즉 지금은 보통:

```tsx
<TextInput value={query} onChangeText={setQuery} />
```

처럼 두는 편이 더 자연스럽다.

### 2. raw input과 committed query를 분리하는 편이 좋다

- 사용자가 타이핑 중인 문자열과
- 실제 서버 검색을 날릴 문자열은 항상 같은 생명주기일 필요가 없다.

현재식으론 보통:

- `inputValue`
- `submittedQuery`

를 나누거나,

- `useDeferredValue`
- debounce

를 써서 타이핑과 query 실행 시점을 분리한다.

즉 "검색창 state"와 "실제 query dependency"를 같은 값으로 고정하지 않는 편이 많다.

### 3. query는 입력값이 준비된 뒤에만 실행한다

- TanStack Query 문서는 `enabled: false` 또는 lazy query 패턴을 필터 입력 예제로 설명한다.
- TypeScript에선 `skipToken`도 대안이다.

검색 화면에선 보통:

- 빈 문자열일 땐 실행 안 함
- 최소 글자 수 이상일 때만 실행
- submit 시점에만 실행

중 하나를 고른다.

즉 search query의 기본값은 보통:

```tsx
useQuery({
  queryKey: ['search', submittedQuery],
  queryFn: () => searchApi.movies(submittedQuery),
  enabled: submittedQuery.length > 0,
})
```

같은 형태다.

### 4. query key엔 search term이 들어가야 한다

- TanStack Query 문서는 query function이 의존하는 값이 있으면 query key에도 넣으라고 설명한다.
- search에선 검색어가 곧 query identity이므로:
  - `['search', query]`
  - `['search', 'movies', query]`

처럼 key에 포함하는 게 기본이다.

### 5. 입력은 빠르게, 결과는 느리게 갱신해도 된다

- React의 `useDeferredValue` 문서는 입력 반응성과 결과 렌더 비용을 분리하는 패턴을 설명한다.
- 검색 결과 리스트가 무거우면:
  - 입력은 즉시 바뀌고
  - 결과는 조금 늦게 따라와도 된다

는 발상이 유효하다.

이건 RN 검색 화면에도 그대로 잘 맞는다.

### 6. refresh indicator는 여전히 query state에서 파생하는 쪽이 더 낫다

- 이 커밋에서 `Movies` / `Tv`는 다시:
  - `setRefreshing(true)`
  - `await refetchQueries`
  - `setRefreshing(false)`
로 갔지만,
현재식으론:
  - trigger는 `refetchQueries`
  - indicator는 `isRefetching` / `useIsFetching`

이 더 자연스럽다.

즉 search input state와 refresh indicator state는 둘 다 local state처럼 보여도,
현재 기준으론:

- search input state는 local state일 수 있음
- refresh indicator는 query state에서 파생

으로 다르게 취급하는 편이 좋다.

## 현재의 핵심 개념

### 1. 검색은 "입력 상태"와 "쿼리 상태"가 다른 문제다

- 입력 상태:
  - 사용자가 지금 타이핑하는 값
- 쿼리 상태:
  - 서버에 실제로 보낸 검색어
  - 그 결과의 fetching / success / error 상태

이 둘을 분리해야 검색 UX가 매끄럽다.

### 2. 검색 query는 lazy하게 시작하는 편이 많다

- 첫 mount에서 바로 실행하지 않고
- 조건이 갖춰졌을 때만 실행한다.

즉 검색은 일반 홈 피드 query보다 declarative dependency가 더 뚜렷하다.

### 3. query key는 검색어와 함께 설계한다

- 같은 화면이라도 검색어가 바뀌면 다른 query다.
- 따라서 key 설계가 검색 경험과 cache 동작을 결정한다.

### 4. refresh state는 local state truth가 아니다

- local boolean로 직접 여닫기보다
- query fetching 상태에서 읽는 쪽이 더 current best practice다.

## `vercel-react-native-skills` 기준 해석

- 이 스킬은 검색 전용 규칙은 없지만, 현재 해석과 잘 맞는 지점이 있다.
  - list는 virtualized list 유지
  - callback / renderItem reference 안정화
  - image는 `expo-image`
  - fallback state를 먼저 분기
- 검색 결과를 붙이기 시작하면 이 규칙들이 바로 중요해진다.

즉 현재 RN 검색 화면 기본 조합은 보통:

- controlled input
- search term 기반 query key
- lazy query
- 결과는 virtualized list
- refresh / background fetch는 query state 기반

이다.

## 현재 워크스페이스에 대한 추천

- `nomad-diary` 검색을 붙인다면:
  - 입력 상태는 local state
  - 실제 검색어는 submit/debounce/deferred value로 분리
  - query key에 검색어 포함
  - 빈 검색어면 실행 안 함
  - 결과 화면은 `FlashList` 또는 적절한 virtualized list
  - native feel이 중요하면 nested stack의 `headerSearchBarOptions`도 후보

## 관련 문서

- [React Query와 현재 데이터 패칭 베스트 프랙티스](react-query-and-data-fetch-best-practices.md)
- [쿼리 기반 Pull-to-Refresh와 리패칭 상태](query-driven-pull-to-refresh.md)
- [탭 이탈 시 스택 초기화와 화면 새로고침](tab-blur-stack-reset-and-query-refresh.md)

## 참고

- [React Native TextInput](https://reactnative.dev/docs/textinput.html)
- [React `useDeferredValue`](https://react.dev/reference/react/useDeferredValue)
- [TanStack Query Disabling/Pausing Queries](https://tanstack.com/query/v5/docs/react/guides/disabling-queries)
- [TanStack Query Query Keys](https://tanstack.com/query/v4/docs/framework/react/guides/query-keys)

## 스킬 추출 후보

### 트리거

- 검색 입력 문자열과 실제 서버 요청 시점을 분리해야 할 때

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

- "검색은 raw input state와 committed query state를 분리한다."

