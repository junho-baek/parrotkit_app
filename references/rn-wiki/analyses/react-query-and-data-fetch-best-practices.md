# React Query와 현재 데이터 패칭 베스트 프랙티스 | React Query and Current Data Fetching Best Practices

## 범위

- React Native / Expo 앱에서 "요즘 서버 데이터를 어떻게 가져오는가"를 현재 기준으로 다시 정리한다.
- 특히 다음을 함께 본다.
  - `useEffect + fetch`가 왜 기본값이 아니게 되었는지
  - `React Query`가 현재 왜 `TanStack Query`로 불리는지
  - 어떤 상황에 어떤 데이터 패칭 방식을 쓰는지
  - RN 앱에서의 실제 기본값이 무엇인지

## 한 줄 결론

- 2026 기준 React Native / Expo 앱의 기본 server-state 계층은 보통 `@tanstack/react-query`다.
- 화면 데이터, 목록, 상세, 검색 결과, 프로필, 서버 캐시가 필요한 값은 `useQuery` / `useInfiniteQuery` / `useMutation`으로 다루는 쪽이 기본값에 가깝다.
- `useEffect + fetch`는 "가능은 하지만 수동이고, 캐시/중복 제거/refetch/lifecycle 처리까지 직접 떠안는 방식"으로 본다.

## 이름 정리

- 예전 이름:
  - `React Query`
- 현재 이름:
  - `TanStack Query`
- 현재 새 앱이면 설치 패키지는:
  - `@tanstack/react-query`

즉 대화할 때는 아직 `React Query`라고 많이 부르지만, 실제 최신 패키지와 문서는 `TanStack Query` 기준으로 읽는 게 맞다.

## 왜 `useEffect + fetch`가 기본값이 아니게 되었나

- React 공식 문서는 데이터 fetch를 effect 안에서 직접 처리하는 방식이 매우 수동적이라고 설명한다.
- 대표 단점:
  - network waterfall 만들기 쉬움
  - 캐시가 없음
  - 다시 mount되면 다시 가져오기 쉬움
  - race condition 방어, loading/error/retry를 각 화면이 반복 작성
- React 문서는 프레임워크의 내장 data fetching을 쓰거나, 아니면 client-side cache 계층을 쓰는 쪽을 권장하며 예시로 TanStack Query, SWR, React Router 6.4+를 든다.

RN/Expo 앱은 Next.js 같은 서버 중심 프레임워크가 아니므로, 실무에선 이 비교군 중 보통 TanStack Query 쪽이 가장 자연스럽다.

## 현재 기준 데이터 패칭 방법 지도

| 상황 | 현재 기본 선택 | 이유 |
| --- | --- | --- |
| 로컬 상수 / 번들된 정적 데이터 | import / module constant | 네트워크와 cache 계층이 필요 없다 |
| 앱 시작 전에 한 번 준비할 값 | preload / bootstrap 로직 | splash, fonts, env, auth bootstrap은 screen query와 성격이 다르다 |
| 화면이 보여주는 서버 데이터 | `useQuery` | cache, loading, stale/fresh, refetch 기준을 표준화하기 좋다 |
| 길게 이어지는 피드 / 페이지네이션 | `useInfiniteQuery` | next page / cursor / append 흐름이 표준화된다 |
| 생성 / 수정 / 삭제 | `useMutation` | invalidation, optimistic update, rollback, pending 상태를 관리하기 쉽다 |
| query 개수가 고정인 병렬 fetch | `useQuery` 여러 개 | 현재 공식 문서가 side-by-side query를 직접 권장한다 |
| query 개수가 동적인 병렬 fetch | `useQueries` | hook 개수가 render마다 달라질 수 있을 때 안전하다 |
| 한 번 누를 때만 보내는 비공유 요청 | event handler 안 직접 호출 가능 | cache보다 즉시 실행이 본질인 경우가 있다 |

## RN / Expo에서의 현재 기본 패턴

### 1. 앱 루트에 `QueryClientProvider`

- `QueryClient`는 module scope singleton으로 둔다.
- 앱 루트에서 `QueryClientProvider`로 감싼다.
- 현재 quick start도 이 구조를 기본 예제로 보여준다.

### 2. 화면 데이터는 `useQuery`

- 홈 피드, 상세, 프로필, 알림 목록 같은 서버 데이터는 component local state보다 query cache에 두는 편이 자연스럽다.
- 기본 예:
  - `useQuery({ queryKey: ['movies', 'trending'], queryFn: moviesApi.trending, staleTime: 60_000 })`

### 3. 병렬 query는 개수에 따라 나눈다

- query 수가 고정:
  - `useQuery` 여러 개
- query 수가 동적:
  - `useQueries`

예를 들어 home 화면의 `nowPlaying`, `upcoming`, `trending`은 보통 고정 3개이므로 `useQueries`보다 `useQuery` 3개가 더 자연스럽다.

### 4. 쓰기 작업은 `useMutation`

- `POST`, `PATCH`, `DELETE`는 보통 `useMutation`으로 감싼다.
- 가장 기본적인 후처리는:
  - `onSuccess`에서 `queryClient.invalidateQueries(...)`
- 여러 화면이 동시에 즉시 맞아야 하면:
  - `setQueryData`
- optimistic update는:
  - 실패 rollback 규칙이 분명할 때만

### 5. `staleTime`을 의식적으로 준다

- TanStack Query 기본값은 cached data를 stale로 보고,
  mount / focus / reconnect 때 background refetch가 일어날 수 있다.
- 기본값 자체는 합리적이지만, 앱에서 의도를 분명히 하려면 `staleTime`을 명시하는 편이 좋다.
- 예:
  - 자주 바뀌지 않는 홈 목록: `60_000` ~ `300_000`
  - 거의 바뀌지 않는 프로필/설정 reference 데이터: 더 길게

### 6. RN lifecycle을 연결한다

- TanStack Query의 RN 문서는:
  - `focusManager`를 `AppState`와 연결
  - `onlineManager`를 `NetInfo` 또는 `expo-network`와 연결
하는 예시를 직접 보여준다.

즉 RN에서는 웹처럼 자동으로 끝난다고 생각하지 말고, foreground 복귀와 reconnect를 query lifecycle에 붙여주는 편이 현재식이다.

### 7. offline persistence는 선택적으로

- RN에선 `PersistQueryClientProvider`와 `createAsyncStoragePersister` 조합으로 query persistence를 붙일 수 있다.
- 다만 모든 query를 무조건 영구 저장하는 것보다:
  - 오프라인 가치가 큰 데이터
  - 재요청 비용이 큰 데이터
에만 신중하게 붙이는 쪽이 좋다.

## 지금 기준 "보통 이렇게 짠다"

### 읽기

1. `core/lib/query-client.ts`
2. `core/providers/query-provider.tsx`
3. `features/.../api/...`
4. `features/.../hooks/use-xxx-query.ts`
5. route/screen 파일에서는 hook 결과만 사용

즉 screen 파일에서:

- 직접 `fetch(...)`
- 직접 `loading` / `error` / `retry` 상태 조합
- mount/unmount race condition 방어

를 반복 작성하지 않는 쪽이 현재 기본값이다.

### 쓰기

1. `features/.../api/update-xxx.ts`
2. `features/.../hooks/use-update-xxx-mutation.ts`
3. 성공 후 invalidation 또는 cache patch
4. 필요하면 optimistic update

## `useEffect + fetch`가 아직 맞는 경우

- server-state cache가 필요 없는 아주 작은 프로토타입
- 한 번 눌렀을 때만 실행되는 imperative action
- query layer로 올리기엔 과한 일회성 요청
- 화면 렌더 결과가 아니라 외부 시스템 동기화가 본질인 effect

즉 `useEffect + fetch`가 "금지"는 아니다.
다만 앱의 핵심 화면 데이터를 장기간 그렇게 유지하는 건 현재 기준으론 보통 비추천이다.

## `vercel-react-native-skills` 기준 현재 해석

- 이 스킬은 data fetching 전용 규칙집은 아니지만, 방향은 다음과 잘 맞는다.
  - list 화면은 더 빨리 virtualize
  - 이미지엔 `expo-image`
  - item은 primitive props로 가볍게
  - callback / renderer reference를 안정화
- 이 원칙들은 query layer와 같이 갈 때 더 빛난다.
- 즉 현재 RN 앱 기본 조합은 보통:
  - `TanStack Query`
  - `FlashList` 또는 적절한 virtualized list
  - `expo-image`
  - feature-local API / hook 분리

쪽으로 읽는 게 자연스럽다.

## 현재 워크스페이스 기준 추천

- `nomad-diary`처럼 Expo Router 기반 앱이면:
  - route 파일은 얇게 유지
  - 실제 fetch / mutation은 `features/.../hooks`
  - API 함수는 `features/.../api`
  - 공통 provider는 `core/providers`
  - `QueryClient`는 `core/lib`

예시:

```text
src/
  app/
    (tabs)/
      index.tsx
      study.tsx
    entry/
      [entryId].tsx

  core/
    lib/
      query-client.ts
    providers/
      query-provider.tsx

  features/
    diary-entry/
      api/
        get-entry-list.ts
        get-entry-detail.ts
        update-entry.ts
      hooks/
        use-entry-list-query.ts
        use-entry-detail-query.ts
        use-update-entry-mutation.ts
```

## 짧은 결론

- 현재 RN 앱에서 화면 데이터 기본값은 `useEffect + fetch`보다 `TanStack Query`다.
- 읽기는 `useQuery`, 길게 이어지는 목록은 `useInfiniteQuery`, 쓰기는 `useMutation`이 기본 축이다.
- RN에서는 여기에 `AppState`, `onlineManager`, 적절한 `staleTime`, 필요 시 persistence까지 붙여야 modern best practice에 가깝다.

## 관련 문서

- [스크롤, 캐싱, 업로드, 서버 상태 발전 흐름](rn-scroll-cache-upload-query-evolution.md)
- [Query Provider 준비와 API 레이어 추출](query-provider-setup-and-api-layer-extraction.md)

## 참고

- [React docs: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React docs: rules-of-hooks troubleshooting](https://react.dev/reference/eslint-plugin-react-hooks/lints/rules-of-hooks)
- [TanStack Query Quick Start](https://tanstack.com/query/latest/docs/framework/react/quick-start)
- [TanStack Query React Native](https://tanstack.com/query/latest/docs/framework/react/react-native)
- [TanStack Query Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [TanStack Query Parallel Queries](https://tanstack.com/query/latest/docs/framework/react/guides/parallel-queries)
- [TanStack Query Invalidations from Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations)
- [TanStack Query createAsyncStoragePersister](https://tanstack.com/query/latest/docs/framework/react/plugins/createAsyncStoragePersister)

## 스킬 추출 후보

### 트리거

- 지금 기준 RN/Expo 앱의 서버 상태 기본값을 한 장으로 정리하고 싶을 때

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

- "RN 앱의 데이터 패칭 기본값은 `useEffect + fetch`보다 TanStack Query 같은 server-state layer다."

