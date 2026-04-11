# 프리뷰 파라미터에서 미디어 타입 분기 상세 쿼리로 전환 | Preview Params to Media-Type-Switched Detail Queries

## 범위

- `nomadcoders/noovies`의 2021-09-23 커밋 `ade5797` (`2.24 Detail Screen part Four`)를 계기로,
  React Native / React Navigation / TanStack Query 앱에서:
  - preview route params만으로 detail screen을 세우던 흐름이
  - 실제 detail query를 여는 흐름으로 어떻게 넘어가는지
  - movie / tv 같은 미디어 타입 분기를 query layer에서 어떻게 다룰지
를 현재 기준으로 다시 정리한다.

## 짧은 결론

- 이 커밋의 핵심은 "detail 화면이 route params만 소비하던 단계에서, 실제 서버의 detail endpoint를 background query로 붙이기 시작했다"는 점이다.
- 즉 이제 detail screen은:
  - preview params
  - 정식 detail query

를 동시에 가지는 hybrid 단계로 넘어간다.
- 현재 기준으론 이 방향은 맞다.
- 다만 지금은:
  - `Movie | TV` union을 discriminant route params로 더 명확히 잡고
  - `useQuery` 두 개를 `enabled`로 갈라 두기보다
  - media type과 id를 기준으로 detail query 하나를 열거나 custom hook으로 감싸며
  - preview payload는 `placeholderData` 같은 개념으로 읽는 편이 더 current best practice에 가깝다.

## 레거시 커밋이 실제로 한 것

- `api.ts`에:
  - `moviesApi.detail`
  - `tvApi.detail`
  를 추가했다.
- 두 fetcher 모두 `append_to_response=videos,images`를 붙여,
  상세 화면에서 필요한 확장 데이터까지 함께 요청한다.
- `Detail.tsx`는:
  - `["movies", params.id]`
  - `["tv", params.id]`
  query 두 개를 만든다.
- 그리고:
  - `"original_title" in params`면 movie query만 활성화
  - `"original_name" in params`면 tv query만 활성화
  하는 방식으로 `enabled`를 사용한다.
- 현재 화면은 아직 query 결과를 실제 UI에 많이 쓰진 않고,
  우선 `console.log`로 detail 응답이 들어오는 걸 확인하는 단계다.
- 동시에 route params 기반 header/title/hero 구조도 그대로 유지한다.

즉 이 커밋은 "route params만으로 detail을 흉내내는 단계"에서 "preview 화면 위에 진짜 detail query를 얹는 단계"로 넘어가는 전환점이다.

## 이때의 핵심 개념

### 1. preview params와 detail query가 동시에 존재할 수 있다

- 이전 단계까지는 route params가 사실상 detail의 전부였다.
- 이 커밋부터는:
  - params는 first paint용 preview
  - query는 authoritative detail data

역할을 나눌 가능성이 열리기 시작한다.

이건 현재식 detail screen 구조로 가는 중요한 중간 단계다.

### 2. 미디어 타입에 따라 다른 detail endpoint를 열어야 한다

- movie detail endpoint
- tv detail endpoint

가 다르기 때문에,
detail screen은 media type 분기를 query layer에서도 처리해야 한다.

이 커밋은 그 분기를 `enabled`로 구현한다.

### 3. detail screen은 list data보다 더 풍부한 응답을 원한다

- `append_to_response=videos,images`
  를 붙인 건, 목록 카드에서 보던 preview data보다
  detail 화면이 더 많은 payload를 필요로 한다는 신호다.

즉 detail query는 단순 재조회가 아니라,
"화면 등급에 맞는 richer response"를 열기 시작한 단계다.

### 4. route union narrowing이 query enable 조건으로 이어진다

- `"original_title" in params`
- `"original_name" in params`

를 title 읽기에만 쓰지 않고,
이제는 어떤 query를 켤지 결정하는 데까지 사용한다.

즉 타입 분기가 data orchestration 분기로 이어지기 시작한다.

## 지금 봐도 좋은 점

- detail endpoint를 별도 query로 만들기 시작한 점
- preview params와 detail fetch를 분리하기 시작한 점
- movie / tv detail을 서로 다른 endpoint로 인식한 점
- detail 화면이 richer payload를 필요로 한다는 걸 `append_to_response`로 드러낸 점

이 네 가지는 지금 봐도 중요한 전진이다.

## 현재 기준으로 바꿔 읽어야 할 점

### 1. `enabled`로 갈린 query 두 개보다, 실제로 필요한 detail query 하나가 더 자연스럽다

- TanStack Query 문서는 `enabled`를 통해 lazy query를 열 수 있다고 설명하지만,
  영구적으로 비활성화된 query 패턴은 그다지 idiomatic하지 않다고도 말한다.
- 이 커밋은 정확히 lazy query 문제라기보다,
  "둘 중 하나만 실제로 필요"한 상황이다.

현재식으론 보통:

```ts
useQuery({
  queryKey: ["detail", mediaType, id],
  queryFn: () => mediaType === "movie" ? getMovieDetail(id) : getTvDetail(id),
})
```

처럼 detail query 하나를 여는 편이 더 자연스럽다.

즉 두 query를 나란히 두고 `enabled`로 갈라 쓰는 건 transitional pattern에 가깝다.

### 2. route params는 여전히 최소 identity 중심이 더 좋다

- React Navigation 문서는 params에 화면을 식별하는 최소 정보만 넣으라고 설명한다.
- 이 커밋은 이미 full object params를 쓰는 흐름 위에 detail query를 얹는다.
- 현재식으론 보통:
  - `id`
  - `mediaType`
  - optional `preview`

만 params로 두고,
실제 detail 데이터는 query로 읽는다.

즉 detail query가 붙는 순간부터,
full object params를 계속 유지할 이유는 더 줄어든다.

### 3. preview data를 진짜 detail data처럼 cache에 넣기보다 `placeholderData`가 더 맞다

- TanStack Query 문서는 partial preview data가 있을 때,
  `placeholderData`를 써서 실제 데이터가 오는 동안 UI를 채우는 패턴을 권장한다.
- 반대로 `initialData`는 cache에 persisted되므로,
  incomplete data엔 권장되지 않는다.

즉 현재식 detail screen은 보통:

- route params 또는 list cache에서 preview 추출
- detail query는 별도 호출
- preview는 `placeholderData`

로 읽는 편이 더 정확하다.

### 4. `enabled: false` query는 invalidate/refetch 동작도 달라진다

- TanStack Query 문서는 `enabled = false`일 때:
  - mount 자동 fetch 없음
  - background refetch 없음
  - `invalidateQueries` / `refetchQueries`도 무시
한다고 설명한다.

이 커밋에선 둘 중 하나만 active라 당장 큰 문제는 없지만,
구조가 복잡해질수록 "비활성 query가 query client lifecycle에서 빠진다"는 사실을 신경 써야 한다.

그래서 detail 타입이 하나로 확정될 수 있는 화면에선,
single active query가 보통 더 단순하다.

### 5. query key는 `["movies", id]`보다 detail 목적이 더 드러나게 잡는 편이 좋다

- 이 커밋 키는:
  - `["movies", params.id]`
  - `["tv", params.id]`

다.
- 동작은 충분하지만,
현재식으론 보통:
  - `["movies", "detail", id]`
  - `["detail", "movie", id]`

처럼 resource와 query intent가 함께 보이게 잡는 편이 더 읽기 쉽다.

이건 팀 규약 문제지만, detail/list/search가 공존하는 앱에선 꽤 도움이 된다.

### 6. detail query가 붙으면 loading / error / placeholder 경계도 같이 와야 한다

- 이 커밋은 아직 `console.log` 단계라 UI 경계가 없다.
- 하지만 현재식으론 detail query가 붙는 순간:
  - preview shell
  - loading skeleton or placeholder
  - error state
  - success state

경계를 함께 설계하는 편이 좋다.

즉 query를 붙이는 것만으로 끝나지 않고,
screen state machine이 같이 생긴다.

### 7. 상세 응답이 richer해질수록 route param과 screen model 분리가 더 중요해진다

- `videos`, `images`까지 붙이기 시작하면,
  preview payload와 detail payload 차이가 더 커진다.
- 이 시점부터는:
  - route params shape
  - list preview shape
  - detail response shape

를 분리해서 보는 편이 current architecture에 가깝다.

## 현재의 핵심 개념

### 1. detail screen은 preview-first, query-authoritative 구조가 자연스럽다

- 첫 프레임은 preview로 빠르게 세우고
- source of truth는 detail query가 가진다.

이 구조가 current detail UX의 기본값에 가깝다.

### 2. media type 분기는 route discriminant와 query function에서 한 번만 드러나는 편이 좋다

- 타입 분기
- API 분기
- UI 분기

가 따로 흩어지기보다,
route discriminant 하나로 묶이는 편이 읽기 쉽다.

### 3. detail query는 list query보다 payload가 커질 가능성이 높다

- summary list data
- rich detail data

는 역할이 다르다.

따라서 detail query는 별도의 key, 별도의 response type, 별도의 loading policy를 갖는 편이 자연스럽다.

### 4. query를 붙인 순간부터 detail screen도 state machine이다

- preview only
- fetching
- placeholder
- success
- error

를 함께 설계해야 진짜 current screen이 된다.

## `vercel-react-native-skills` 기준 해석

- 이번 커밋은 특히 아래 규칙들과 잘 연결된다.
  - `navigation-native-navigators`
  - `list-performance-item-memo`
  - `ui-pressable`
  - `ui-expo-image`
- 현재식으로 번역하면:
  - detail identity는 primitive route params
  - preview card props도 가능한 primitive
  - detail screen은 single active query
  - 이미지 계층은 `expo-image`

조합이 가장 자연스럽다.

## 현재 워크스페이스에 대한 추천

- `nomad-diary`에서 detail query를 붙인다면:
  - params는 `entryId`, optional `preview`
  - `useEntryDetailQuery({ entryId })`
  - preview가 있으면 `placeholderData`
  - detail key는 list/search와 구분되는 계층형 key

구조가 좋다.
- movie/tv처럼 resource 종류가 둘 이상이면,
  `useMediaDetailQuery({ mediaType, id })`
  같은 custom hook으로 route discriminant와 API 분기를 한 곳에 모으는 편이 좋다.

## 관련 문서

- [상세 화면 전체 객체 파라미터와 유니온 라우트 타이핑](full-object-detail-params-and-union-route-typing.md)
- [상세 화면 제목 파라미터와 네이티브 스택 헤더 테마](detail-title-params-and-native-stack-header-theming.md)
- [상세 화면 히어로 헤더와 최소 라우트 파라미터](detail-hero-header-and-minimal-route-params.md)
- [React Query와 현재 데이터 패칭 베스트 프랙티스](react-query-and-data-fetch-best-practices.md)

## 참고

- [React Navigation: Passing parameters to routes](https://reactnavigation.org/docs/params/)
- [TanStack Query: Disabling/Pausing Queries](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries)
- [TanStack Query: Placeholder Query Data](https://tanstack.com/query/latest/docs/framework/react/guides/placeholder-query-data)
- [TanStack Query: Initial Query Data](https://tanstack.com/query/v5/docs/framework/react/guides/initial-query-data)

## 스킬 추출 후보

### 트리거

- preview route params 위에 media-type detail query를 얹어 authoritative data를 읽을 때

### 권장 기본값

- detail route params는 최소 식별자와 optional preview seed만 넘긴다.
- authoritative detail data는 detail query가 읽고, header chrome은 theme token과 route metadata에서 파생한다.
- hero, share, watch 같은 detail action은 같은 query 결과를 body와 header에서 재사용한다.

### 레거시 안티패턴

- preview 전체 객체를 route params로 통째로 넘기기
- detail body와 header가 서로 다른 데이터 source를 보게 만들기

### 예외 / 선택 기준

- 초기 shell 단계나 offline preview가 정말 필요하면 preview object를 임시로 넘길 수 있다.

### 현재식 코드 스케치

```ts
type DetailParams = {
  id: number;
  mediaType: 'movie' | 'tv';
  initialTitle?: string;
};

const detailQuery = useQuery(detailOptions(params.id, params.mediaType));
```

### 스킬 규칙 초안

- "preview params는 seed로만 읽고, 실제 detail 데이터는 mediaType + id 기반 단일 query가 읽는다."

