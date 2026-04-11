# Pull-to-Refresh와 재사용 미디어 프리미티브 | Pull-to-Refresh and Reusable Media Primitives

## 범위

- `nomadcoders/noovies`의 2021-09-21 커밋 `0a93796` (`2.8 Refreshing`)를 현재 Expo / React Native 기준으로 다시 읽는다.
- 특히:
  - `RefreshControl`을 붙인 의도와 현재식 pull-to-refresh 구조
  - `HMedia`, `VMedia`, `Votes`로 반복 UI를 분리한 의미
  - item component 설계, 날짜 포맷, 이미지 처리, truthy rendering 관점
  - 현재 best practice에서 이 화면을 어떻게 재구성하는지
  를 함께 정리한다.

## 레거시 커밋이 실제로 한 것

- `components/HMedia.tsx`를 새로 만들어 세로형 media row를 분리했다.
  - poster
  - 제목
  - release date
  - votes
  - overview
- `components/VMedia.tsx`를 새로 만들어 가로 poster card를 분리했다.
- `components/Votes.tsx`를 새로 만들어 평점 표시 로직을 공용화했다.
- `Movies.tsx`에 `RefreshControl`을 추가하고:
  - `refreshing` state
  - `onRefresh`
  - `await getData()`
  - `setRefreshing(false)`
  흐름을 붙였다.
- 기존 inline markup을:
  - `<VMedia ... />`
  - `<HMedia ... />`
  로 치환했다.
- `ComingSoonTitle` margin을 `30`에서 `20`으로 줄였다.

즉 이 단계는:

- "화면 안에 반복 마크업이 다시 불어나기 시작한 시점"
- "새로고침까지 붙은 실제 피드 화면"

으로 읽을 수 있다.

## 이 커밋이 당시 설명하려던 것

- pull-to-refresh는 영화 홈 같은 피드 화면의 기본 UX라는 점
- 반복되는 media row/card는 별도 컴포넌트로 빼야 화면 파일이 덜 무거워진다는 점
- 평점, release date, overview 같은 메타데이터를 재사용 가능한 표시 조각으로 정리할 수 있다는 점

즉 "피드 화면을 조금 더 제품처럼 다듬는 단계"다.

## 지금 봐도 좋은 점

### 1. `RefreshControl` 도입 자체는 맞는 방향이다

- React Native 공식 문서도 `RefreshControl`은 `ScrollView`나 list에 pull-to-refresh를 붙일 때 쓰는 컴포넌트라고 설명한다.
- `refreshing`을 controlled state로 들고, `onRefresh`에서 `true`로 바꾸는 흐름도 공식 문서 방향과 맞다.

### 2. `HMedia`, `VMedia`, `Votes`로 반복 UI를 분리한 점

- 반복 마크업을 화면 파일에서 꺼낸 건 지금도 맞는 방향이다.
- 특히 `VMedia`, `HMedia`가 primitive props를 받는 구조는 현재 memoization 관점에서도 꽤 괜찮다.

### 3. display-only leaf component를 만들기 시작한 점

- `Votes`처럼 표시 규칙만 가진 작은 컴포넌트를 만든 건 좋은 신호다.
- 이런 leaf 분리는 이후 list item 최적화나 디자인 교체 때 도움이 된다.

## 지금 기준으로 바꿔 읽어야 할 점

### 1. 새로고침은 이제 `ScrollView + RefreshControl`보다 "virtualized list 위 refresh"가 기본값에 가깝다

- 이 커밋은 root `ScrollView`에 `refreshControl`을 붙였다.
- 당시엔 자연스러운 선택이지만, 지금 기준으로 이 화면은 이미:
  - hero swiper
  - horizontal trending row
  - vertical upcoming list
  구조를 가진다.

그래서 현재식이면 보통:

- root = `FlashList` 또는 `FlatList`
- hero = `ListHeaderComponent`
- `refreshing`
- `onRefresh`

를 list 자체에 두는 쪽이 더 자연스럽다.

즉 이 커밋은 "refresh UX를 붙인 단계"이지만, 현재식으론 그 refresh의 받침대가 `ScrollView`가 아니라 virtualized root list가 되는 편이다.

### 2. 서버 데이터 새로고침은 수동 `getData()`보다 query refetch가 더 기본값이다

- 레거시 구현은 `onRefresh -> getData()` 흐름이다.
- 지금 기준으론:
  - `useQuery`
  - `useQueries`
  - `queryClient.invalidateQueries`
  - `refetch`

를 써서 새로고침과 서버 상태를 연결하는 편이 더 자연스럽다.

즉 UX는 같고, data orchestration 계층이 바뀐 셈이다.

### 3. `HMedia` / `VMedia` 분리는 좋지만, 위치는 feature 안이 더 자연스럽다

- 레거시 구조는 `components/` 루트에 둔다.
- 지금 기준으론 이 컴포넌트들은 범용 공용 UI보다 `movies` feature 전용 UI에 가깝다.

예를 들면:

```text
features/
  movies/
    components/
      movie-v-media-card.tsx
      movie-h-media-row.tsx
      movie-votes.tsx
```

처럼 두는 편이 더 읽기 쉽다.

### 4. `voteAverage ? ... : null`은 현재 기준으론 조심해야 한다

- `HMedia`는 `{voteAverage ? <Votes votes={voteAverage} /> : null}`로 쓴다.
- 그런데 `0`은 falsy라서 이 경우 `Votes`가 아예 숨겨진다.
- `Votes` 컴포넌트 자체는 `0`일 때 `Coming soon`을 보여주게 되어 있어서, parent의 truthy check가 오히려 그 의도를 끊는다.

현재식이면:

- `voteAverage != null ? ... : null`
- 또는 아예 `Votes`에 그대로 넘기고 내부에서 처리

처럼 더 명시적으로 가는 편이 좋다.

이는 `vercel-react-native-skills`의 `rendering-no-falsy-and`와도 통하는 감각이다.

### 5. 날짜 포맷은 이제 render 안에서 반복 생성하지 않는 편이 좋다

- `HMedia` 안에서 `new Date(releaseDate).toLocaleDateString("ko", ...)`를 매번 직접 호출한다.
- 학습용으론 충분하지만, 현재식으론:
  - module-level formatter
  - 공용 `format-release-date`
  로 뽑아두는 편이 더 낫다.

### 6. 텍스트 truncation은 여전히 `slice()`보다 layout-aware가 낫다

- `VMedia`는 제목을 `slice(0, 13)`
- `HMedia`는 제목과 overview를 길이 기준으로 잘라낸다.

현재식이면:

- 제목: `numberOfLines={1}`
- overview: `numberOfLines={3}` 또는 `4`
- 필요하면 "더보기"

가 더 자연스럽다.

### 7. `Poster`는 이제 `expo-image`가 기본값에 가깝다

- 현재 `Poster`는 `styled.Image` 기반이다.
- 지금 기준으론:
  - `expo-image`
  - `placeholder`
  - `transition`
  - `cachePolicy`
  - 적정 크기 썸네일 URL

조합이 더 자연스럽다.

## `vercel-react-native-skills` 기준 해석

- 직접 연결되는 규칙:
  - [`list-performance-virtualize`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-virtualize.md)
  - [`list-performance-item-memo`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-item-memo.md)
  - [`list-performance-images`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-images.md)
  - [`ui-expo-image`](../../../../.agents/skills/vercel-react-native-skills/rules/ui-expo-image.md)
  - [`js-hoist-intl`](../../../../.agents/skills/vercel-react-native-skills/rules/js-hoist-intl.md)
  - [`rendering-no-falsy-and`](../../../../.agents/skills/vercel-react-native-skills/rules/rendering-no-falsy-and.md)

이 커밋을 현재식으로 다시 읽으면:

- refresh는 valid하지만 root list architecture가 더 중요하다
- `HMedia`, `VMedia`처럼 primitive props 기반 item 분리는 좋은 방향이다
- 이미지와 날짜 포맷은 지금 더 나은 기본 도구가 있다
- truthy 조건은 숫자/문자열에서는 더 명시적으로 써야 한다

## 2026 기본 추천

### 화면 구조

- root:
  - `FlashList`
- hero:
  - `ListHeaderComponent`
- trending:
  - horizontal `FlashList`
- upcoming:
  - vertical items
- refresh:
  - list의 `refreshing` / `onRefresh`

### 서버 상태

- 읽기:
  - `useQuery` / `useQueries`
- pull-to-refresh:
  - `refetch`
  - 또는 invalidate

### 컴포넌트 구조

```text
features/
  movies/
    components/
      movie-hero-swiper.tsx
      movie-trending-row.tsx
      movie-v-media-card.tsx
      movie-h-media-row.tsx
      movie-votes.tsx
    lib/
      format-release-date.ts
```

### item props

- `posterPath`
- `movieTitle`
- `overview`
- `releaseDate`
- `voteAverage`

처럼 role이 드러나는 primitive 위주로 넘긴다.

## 공식 문서 기준 짧은 메모

- React Native 공식 문서는 `RefreshControl`이 `ScrollView`나 list 안에서 pull-to-refresh를 제공한다고 설명하고, `refreshing`이 controlled prop이라 `onRefresh`에서 바로 `true`로 바꿔야 한다고 적는다.
- React Native `FlatList`는 header/footer/pull-to-refresh를 기본 지원한다.
- Expo `Image` 문서는 `expo-image`가 speed, memory/disk caching, placeholder, transition을 제공한다고 설명한다.
- FlashList 문서는 vertical list 안에 horizontal list를 중첩할 때, 바깥 vertical list도 FlashList인 편을 권장한다.

## 이전 단계들과의 연결

- `6b7e702`:
  - `Slide`, `Poster` 분리
- `246fa33`:
  - 첫 horizontal row
- `031d414`:
  - first vertical coming-soon section
- `0a93796`:
  - refresh UX + media item 분리

즉 이 커밋은:

- 구조 분리
- section 확장
- 새로고침 UX

가 처음 함께 만난 단계다.

## 현재 워크스페이스에 대한 결론

- 이 커밋은 "홈 피드가 실제 앱처럼 관리되기 시작한 첫 단계"라는 점에서 학습 가치가 크다.
- 현재식으로는:
  - `RefreshControl` 발상은 유지
  - root는 `FlashList`
  - 새로고침은 query refetch
  - media item은 feature-local + primitive props + memo-friendly 구조
  - 이미지와 날짜 포맷은 더 현대적인 도구로 교체

로 가져가는 편이 좋다.


## 스킬 추출 후보

### 트리거

- pull-to-refresh와 공용 media primitive를 같은 화면에서 정리해야 할 때

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

- "refresh indicator는 query state에서 파생하고, media primitive는 feed 전반에서 재사용 가능한 입력 contract를 가진다."

## 관련 페이지

- [혼합 홈 피드 섹션과 세로 개봉 예정 카드](mixed-home-feed-sections-and-vertical-upcoming-cards.md)
- [컴포넌트 추출과 병렬 fetch 리팩터링](component-extraction-and-parallel-fetch-refactoring.md)
- [스크롤, 캐싱, 업로드, 서버 상태 발전 흐름 | Scroll, Caching, Upload, and Server-State Evolution](rn-scroll-cache-upload-query-evolution.md)
