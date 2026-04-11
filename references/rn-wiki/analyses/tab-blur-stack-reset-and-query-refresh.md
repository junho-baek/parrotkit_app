# 탭 이탈 시 스택 초기화와 화면 새로고침 | Stack Reset and Screen Refresh on Tab Blur

## 범위

- `nomadcoders/noovies`의 2021-09-22 커밋 `7cbbd1b` (`2.13 React Query part Two`)를 계기로,
  탭 화면을 벗어날 때:
  - 무엇이 초기화되는지
  - 무엇이 새로고침되는지
  - React Query / TanStack Query 화면 데이터는 어떤 개념으로 봐야 하는지
를 현재 React Navigation / Expo / TanStack Query 기준으로 다시 정리한다.
- 이 페이지는 커밋 자체보다, 그 커밋이 드러낸 **탭 blur, stack reset, screen refresh, query freshness** 개념을 남기는 데 목적이 있다.

## 짧은 결론

- 예전엔 `unmountOnBlur: true`로 탭 화면을 강제로 내려서 "돌아오면 새로고침되는 느낌"을 만들곤 했다.
- 지금은 그 발상보다:
  - 탭을 벗어날 때 stack을 어디까지 되돌릴지 (`popToTopOnBlur`)
  - 화면 데이터는 query lifecycle에서 어떻게 다시 가져올지 (`refetch`, `invalidateQueries`, focus handling)
를 분리해서 생각하는 편이 맞다.
- 즉 현재 핵심은 **navigator reset과 data refresh를 같은 문제로 보지 않는 것**이다.

## 레거시 커밋이 실제로 한 것

- `Movies.tsx`가 local `useEffect + fetch`에서 벗어나 실제 `useQuery`를 쓰기 시작했다.
- `moviesApi`를 export 하여 query function을 화면 밖으로 뺐다.
- 탭 navigator에 `unmountOnBlur: true`를 줬다.

즉 이 커밋은 두 축이 동시에 들어왔다.

- 화면 데이터는 React Query로 올리기 시작함
- 탭을 벗어나면 screen을 내려서 다시 들어올 때 새로 mount되게 함

그래서 당시 학습 체감상은 "query도 붙고, 탭을 오갈 때 화면도 새로고침되는 것처럼 보이는 단계"였다.

## 이때의 핵심 개념

### 1. 화면 데이터는 local state보다 query로 읽는다

- `useEffect + setState` 대신 `useQuery`로 now playing / upcoming / trending을 읽기 시작했다.
- 이건 "서버 상태를 화면 로컬 상태에서 분리한다"는 첫 실제 전환이다.

### 2. 탭 이탈 시 unmount를 refresh 수단으로 썼다

- `unmountOnBlur: true`는 탭을 벗어나면 화면을 내려버린다.
- 다시 돌아오면 mount가 다시 일어나므로,
  화면 안의 로컬 상태와 effect도 다시 시작된다.

즉 당시엔:

- "탭을 나갔다 오면 초기화된다"
- "그게 곧 새로고침처럼 느껴진다"

가 연결되어 있었다.

### 3. 하지만 navigator reset과 data freshness는 원래 다른 문제다

- 화면이 다시 mount되었다고 해서 항상 "올바른 refresh"인 건 아니다.
- 반대로 화면이 mount를 유지해도 query가 refetch되면 데이터는 최신일 수 있다.

이 둘이 뒤섞여 있던 과도기 단계라고 볼 수 있다.

## 현재 기준 핵심 개념

### 1. stack reset과 data refresh는 분리해서 본다

- stack reset:
  - 사용자가 탭을 다시 볼 때 어느 screen 깊이로 돌아와야 하는가
- data refresh:
  - 그 screen이 어떤 query freshness 정책으로 데이터를 다시 가져와야 하는가

이 둘은 서로 다른 층의 문제다.

### 2. `unmountOnBlur`는 현재 기본 해법이 아니다

- React Navigation은 `unmountOnBlur`를 제거했고,
  Bottom Tabs / Drawer에서는 `popToTopOnBlur`를 사용한다.
- `popToTopOnBlur`는 nested stack을 첫 화면으로 되돌리는 옵션이지,
  screen을 강제로 remount해서 데이터를 새로고침하는 옵션이 아니다.

즉 현재식 해석은:

- `popToTopOnBlur`
  - navigation stack reset
- `refetch` / `invalidateQueries`
  - data refresh

다.

### 3. 현재 data refresh의 기본값은 query lifecycle이다

- TanStack Query를 쓰는 화면이면 refresh는 보통:
  - `refetch()`
  - `queryClient.refetchQueries(...)`
  - `queryClient.invalidateQueries(...)`
로 처리한다.
- 따라서 화면을 일부러 unmount하지 않아도:
  - focus 복귀
  - user pull-to-refresh
  - mutation 성공 후
에 맞춰 데이터를 다시 가져올 수 있다.

### 4. focus 복귀는 navigation 상태보다 query state와 더 가깝다

- RN에선 focus 복귀 시 stale query를 refetch하는 예시를 TanStack Query 문서가 직접 보여준다.
- 또 out-of-focus screen에서 query subscription을 끊고 싶다면:
  - `useIsFocused`
  - `subscribed: isFocused`
같은 패턴이 있다.

즉 현재는:

- "이 screen을 없앨까?"
보다
- "이 screen이 focus 상태일 때 query를 어떻게 구독하고 refetch할까?"

를 먼저 생각하는 쪽이 맞다.

### 5. 그래도 강제 unmount가 아주 불가능한 건 아니다

- 사용자 메모처럼:

```tsx
const isFocused = useIsFocused()

if (!isFocused) {
  return null
}
```

같은 식으로 blur 시 사실상 화면을 비워 hard reset 비슷하게 만들 수는 있다.
- 하지만 이건 보통 권장 기본값이라기보다,
  정말 특정 화면의 메모리/상태 생명주기를 강하게 끊고 싶을 때 검토하는 편이 가깝다.

즉 "가능은 하지만 기본 해법은 아님"으로 보는 게 자연스럽다.

## 개념별 현재 추천

### 탭을 벗어났을 때 nested stack만 초기화하고 싶다

- `popToTopOnBlur: true`

이건:

- Movies 탭 안에서 detail로 깊게 들어갔다가
- 다른 탭으로 갔다 오면
- Movies 탭의 첫 stack screen으로 복귀

같은 UX를 원할 때 맞다.

### 탭으로 돌아왔을 때 데이터만 다시 확인하고 싶다

- TanStack Query에서:
  - 적절한 `staleTime`
  - screen focus 시 `refetchQueries`
  - 필요 시 `subscribed: isFocused`

를 조합하는 편이 낫다.

이건 navigator reset 문제와 별개다.

### 사용자가 직접 당겨서 새로고침하고 싶다

- pull-to-refresh에서 `refetch()` 또는 `refetchQueries(...)`

### mutation 이후 데이터가 낡았다

- `invalidateQueries(...)`

## `vercel-react-native-skills` 기준 해석

- 이 스킬은 navigation에서 native stack / native tabs를 기본값으로 보라고 권한다.
- 이 관점에선 더더욱:
  - navigator는 native behavior에 가깝게 두고
  - data freshness는 query 계층에서 다루는 쪽이 자연스럽다.

즉 현재 RN 실무 조합은 보통:

- native tabs / native stack
- screen state는 과도하게 remount하지 않음
- data freshness는 TanStack Query lifecycle에서 해결

이다.

## 현재 워크스페이스에 주는 의미

- `nomad-diary`처럼 Expo Router + native stack/native tabs를 쓰는 구조에선:
  - 탭 이동 시 화면을 억지로 내려서 refresh를 흉내 내기보다
  - route 구조는 route 구조대로 유지하고
  - server-state는 query key와 refetch policy로 제어하는 쪽이 맞다.
- 탭 복귀 시 stack 깊이를 정리하고 싶으면:
  - navigator 옵션
- 데이터가 낡았는지 다시 확인하고 싶으면:
  - query 옵션 / focus refetch

로 역할을 나누는 게 좋다.

## 관련 문서

- [React Query와 현재 데이터 패칭 베스트 프랙티스](react-query-and-data-fetch-best-practices.md)
- [중첩 탭/스택과 모달 경계](nested-tabs-stacks-and-modal-boundaries.md)
- [네이티브 스택 vs JS 스택](native-stack-vs-js-stack.md)

## 참고

- [React Navigation upgrade guide: `unmountOnBlur` removal](https://reactnavigation.org/docs/upgrading-from-6.x/#the-unmountonblur-option-is-removed-in-favor-of-poptotoponblur-in-bottom-tab-navigator-and-drawer-navigator)
- [React Navigation bottom tabs: `popToTopOnBlur`](https://reactnavigation.org/docs/bottom-tab-navigator/#poptotoponblur)
- [TanStack Query React Native](https://tanstack.com/query/latest/docs/framework/react/react-native)
- [TanStack Query QueryClient](https://tanstack.com/query/latest/docs/reference/QueryClient)
- [TanStack Query Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)

## 스킬 추출 후보

### 트리거

- 탭을 벗어날 때 stack reset과 화면 data refresh를 함께 고민할 때

### 권장 기본값

- navigator reset과 data refresh를 서로 다른 층으로 분리한다.
- 탭 blur 시 stack을 되돌릴지와 query freshness 정책을 따로 설계한다.
- refresh indicator는 query state에서 파생한다.

### 레거시 안티패턴

- `unmountOnBlur`로 화면 재마운트와 데이터 최신화를 한 번에 해결하려 하기
- refreshing local state를 query lifecycle과 따로 놀게 두기

### 예외 / 선택 기준

- 레거시 탭 구조에선 screen remount가 당장 가장 쉬운 해결책일 수 있지만 기본값으로 남기진 않는다.

### 현재식 코드 스케치

```tsx
<Tabs.Screen name="movies" options={{ popToTopOnBlur: true }} />

const onRefresh = () =>
  queryClient.invalidateQueries({ queryKey: ['movies'] });
```

### 스킬 규칙 초안

- "탭 blur의 stack reset과 query refresh는 같은 문제가 아니라 별도 정책으로 설계한다."

