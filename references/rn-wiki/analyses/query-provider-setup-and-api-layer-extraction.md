# Query Provider 준비와 API 레이어 추출 | Query Provider Setup and API Layer Extraction

## 범위

- `nomadcoders/noovies`의 2021-09-22 커밋 `a3be0bd` (`2.12 React Query part One`)를 현재 Expo / React Native 기준으로 다시 읽는다.
- 특히:
  - `QueryClientProvider`를 앱 루트에 붙인 의미
  - `api.ts`로 fetch 함수를 뽑아낸 구조
  - 이 커밋이 실제 query 사용인지, 준비 단계인지
  - 현재 TanStack Query 기준 best practice가 무엇인지
  를 함께 정리한다.

## 레거시 커밋이 실제로 한 것

- `App.js`에:
  - `QueryClient`
  - `QueryClientProvider`
를 추가했다.
- `const queryClient = new QueryClient();`를 module scope에 만들고,
  `QueryClientProvider`로 앱 루트를 감쌌다.
- `api.ts`를 새로 만들어:
  - `trending`
  - `upcoming`
  - `nowPlaying`
  fetch 함수를 한 파일로 모았다.
- `Movies.tsx`에서는:
  - `movieKeyExtractor`
  - `renderVMedia`
  - `renderHMedia`
  - `VSeparator`
  - `HSeparator`
처럼 list renderer / separator를 조금 더 분리했다.
- 하지만 이 커밋 시점의 `Movies.tsx`는 아직:
  - local state
  - 수동 fetch
  - `useEffect`
기반 흐름을 완전히 벗어나진 못했다.
- 즉 제목은 `React Query part One`이지만, 이 커밋은 실제 query hook 전환보다 **provider + api layer 준비 단계** 성격이 강하다.

## 이 커밋이 당시 설명하려던 것

- React Query를 쓰려면 먼저 provider를 앱 루트에 둬야 한다는 점
- API 호출 함수를 화면 밖으로 빼는 게 중요하다는 점
- 화면 안 inline renderer / separator를 줄여서 다음 단계 전환을 준비하는 점

즉 "React Query를 도입하기 위한 발판을 까는 단계"다.

## 지금 봐도 좋은 점

### 1. `QueryClientProvider`를 루트에 둔 건 맞는 방향이다

- 지금도 TanStack Query의 첫 단계는 `QueryClient`를 만들고 `QueryClientProvider`로 앱을 감싸는 것이다.
- provider 위치를 앱 루트에 둔 판단은 현재 기준으로도 맞다.

### 2. `queryClient`를 module scope singleton으로 둔 점

- `const queryClient = new QueryClient()`를 컴포넌트 바깥에 둔 건 좋다.
- 현재 TanStack Query 문서와 ESLint 규칙도 stable query client를 중요하게 본다.

### 3. `api.ts`로 fetch 함수를 뽑아낸 점

- 화면에서 네트워크 요청 함수를 분리한 건 좋은 방향이다.
- 현재식으로도:
  - `moviesApi.nowPlaying`
  - `moviesApi.upcoming`
  - `moviesApi.trending`

처럼 API layer를 만드는 쪽이 자연스럽다.

### 4. `renderItem`, separator, keyExtractor를 분리하기 시작한 점

- 이건 React Query 자체보다 list hygiene에 가까운 변화다.
- 하지만 실제로 query 도입 후에도 list renderer reference를 안정화하는 건 중요하므로 좋은 준비다.

## 지금 기준으로 바꿔 읽어야 할 점

### 1. 지금은 `react-query`가 아니라 `@tanstack/react-query`다

- 이 커밋은 v3 시절이라 `react-query` 패키지를 설치한다.
- 현재 공식 문서 기준으론:
  - `react-query`는 예전 이름
  - v4부터 `@tanstack/react-query`

로 바뀌었다.

즉 지금 새 앱을 시작하면 설치는:

```bash
npm install @tanstack/react-query
```

가 기본값이다.

### 2. 이 커밋은 아직 "진짜 query 사용"이 아니다

- provider는 붙었지만,
- `Movies.tsx`는 여전히 local state / `useEffect` / 수동 fetch 중심이다.

현재식으론 보통 이 다음 단계에서:

- `const nowPlayingQuery = useQuery({ queryKey: ['movies', 'now-playing'], queryFn: moviesApi.nowPlaying })`
- `const upcomingQuery = useQuery({ queryKey: ['movies', 'upcoming'], queryFn: moviesApi.upcoming })`
- `const trendingQuery = useQuery({ queryKey: ['movies', 'trending'], queryFn: moviesApi.trending })`

처럼 실제 hook 사용으로 넘어간다.

즉 이 커밋은 "도입"이라기보다 "준비 완료"에 더 가깝다.

### 3. 현재 문법은 object syntax가 기본값이다

- 지금 문서는:
  - `useQuery({ queryKey, queryFn })`
형태를 기본 예제로 쓴다.
- 예전 positional syntax보다 object syntax가 현재 기준이다.

### 4. 이 화면의 세 쿼리는 `useQueries`보다 "고정된 여러 `useQuery`"가 더 자연스럽다

- nowPlaying / upcoming / trending은 개수가 고정이다.
- 현재 TanStack Query 문서는 "parallel query 개수가 변하지 않으면 side-by-side `useQuery`로 충분하다"고 설명한다.
- `useQueries`는 query 개수가 동적으로 바뀔 때 더 적합하다.

즉 이 화면은 보통:

- `useQuery` 3개

로 시작하고,

- 필요하면 custom hooks로 감싸는 편이 자연스럽다.

### 5. RN에선 `focusManager` / `onlineManager`까지 챙겨야 완성도 높다

- 웹에선 focus/reconnect 동작이 비교적 자연스럽지만,
- React Native에선 TanStack Query 문서가:
  - `AppState`로 `focusManager`
  - `NetInfo` 또는 `expo-network`로 `onlineManager`

를 연결하는 예시를 따로 안내한다.

즉 지금 RN 기준 best practice는 provider만 붙이는 걸로 끝나지 않고:

- foreground 복귀
- 네트워크 재연결

시 refetch가 기대대로 동작하도록 manager 연동까지 보는 편이다.

### 6. devtools는 RN에선 웹과 같은 기본 패키지 흐름으로 보지 않는 편이 낫다

- 사용자 메모처럼 `@tanstack/react-query-devtools` 패키지가 존재하는 건 맞다.
- 다만 TanStack Query의 RN 문서는 현재 RN용 devtools 지원으로:
  - 3rd-party macOS app
  - Flipper plugin
  - Reactotron plugin

같은 경로를 직접 안내한다.

즉 RN/Expo 앱에서는 보통:

- 먼저 query 상태 설계
- 그다음 RN용 debugging 도구

순서로 보는 편이 자연스럽다.

### 7. `staleTime` 없이 바로 쓰면 기본 refetch가 꽤 공격적이다

- 현재 TanStack Query 기본값은:
  - cached data를 stale로 간주
  - mount / focus / reconnect 시 background refetch 가능
  - inactive query는 5분 뒤 GC
  - 실패 query는 3번 재시도

다.

처음 배울 때는 편하지만, 실제 앱에선 `staleTime`을 의도적으로 주는 게 중요하다.

예를 들어 영화 홈이면:

- `staleTime: 60_000` ~ `300_000`

같은 값으로 과도한 refetch를 줄이는 편이 많다.

## `vercel-react-native-skills` 기준 해석

- 이 스킬엔 TanStack Query 전용 규칙은 없지만,
  현재식 해석은 다음과 잘 맞는다:
  - list 화면은 더 일찍 virtualize
  - item component는 primitive props
  - renderer reference는 안정화
  - server state는 component local state에 오래 묶어두지 않기

즉 이 커밋을 RN 실무 관점으로 다시 읽으면:

- provider 위치는 맞다
- list hygiene 준비도 좋다
- 하지만 지금 기준 핵심은 그 다음 단계의 actual query hooks와 RN lifecycle 연동이다

## 공식 문서 기준 짧은 메모

- TanStack Query quick start는:
  - `const queryClient = new QueryClient()`
  - `<QueryClientProvider client={queryClient}>`
  - `useQuery({ queryKey, queryFn })`
를 기본 구조로 설명한다.
- Queries 문서는 `useQuery` 결과에서 현재 기준으로:
  - `isPending`
  - `isError`
  - `data`
를 중심으로 분기하는 예시를 보여준다.
- Parallel Queries 문서는 query 수가 고정이면 여러 `useQuery`를 나란히 써도 된다고 설명하고, 동적인 경우 `useQueries`를 권장한다.
- React Native 문서는:
  - `onlineManager`를 NetInfo / Expo Network와 연결
  - `focusManager`를 `AppState`와 연결
하는 예시를 제공한다.
- Important Defaults 문서는 기본값이 꽤 공격적이라고 설명하며 `staleTime` 조정을 권장한다.

## 2026 기본 추천

### 설치

```bash
npm install @tanstack/react-query
```

### 루트

- provider는 앱 루트에 둔다
- Expo Router면 보통 `app/_layout`
- React Navigation이면 루트 `App`

### API layer

- `api.ts` 하나로 시작해도 좋다
- 하지만 커지면:

```text
features/
  movies/
    api/
      movies-api.ts
    queries/
      use-now-playing-query.ts
      use-trending-query.ts
      use-upcoming-query.ts
```

처럼 나누는 편이 더 좋다.

### 화면

- 고정된 3개 쿼리:
  - `useQuery` 3개
- 동적인 병렬 쿼리:
  - `useQueries`
- mutation:
  - `useMutation`

### RN-specific

- `AppState` -> `focusManager`
- `NetInfo` 또는 `expo-network` -> `onlineManager`
- `staleTime` 명시
- pull-to-refresh는 `refetch`

## 이전 단계들과의 연결

- `07516eb`:
  - root `FlatList` 기반 홈 피드
- `a3be0bd`:
  - 그 위에 query provider와 API layer를 깔기 시작

즉 이 커밋은:

- list 구조 정리 뒤
- server-state 계층으로 넘어가기 직전의 bridge

역할을 한다.

## 현재 워크스페이스에 대한 결론

- 이 커밋은 "TanStack Query를 실제로 잘 쓰기 시작한 단계"라기보다,
  **잘 쓰기 위한 토대를 까는 단계**로 보는 게 가장 정확하다.
- 현재식으로는:
  - `@tanstack/react-query`
  - object syntax
  - fixed parallel `useQuery`
  - RN focus/network manager 연동
  - `staleTime` 조정
까지 같이 봐야 비로소 modern best practice에 가깝다.


## 스킬 추출 후보

### 트리거

- 앱 루트에 QueryClientProvider를 깔고 API layer를 화면 밖으로 빼야 할 때

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

- "Query provider는 앱 셸에 두고, query function은 API namespace나 options factory로 화면 밖에 둔다."

## 관련 페이지

- [스크롤, 캐싱, 업로드, 서버 상태 발전 흐름 | Scroll, Caching, Upload, and Server-State Evolution](rn-scroll-cache-upload-query-evolution.md)
- [ListHeader 기반 루트 FlatList 피드 구조](root-flatlist-feed-architecture-with-list-header.md)
- [스크롤뷰, 플랫리스트, 레전드리스트, 섹션리스트 정리 | ScrollView, FlatList, LegendList, and SectionList](scrollview-flatlist-legendlist-sectionlist.md)
