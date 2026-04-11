# 가로 미디어 행과 홈 피드 확장 | Horizontal Media Rows and Home Feed Expansion

## 범위

- `nomadcoders/noovies`의 2021-09-20 커밋 `246fa33` (`2.6 Trending Movies`)를 현재 Expo / React Native 기준으로 다시 읽는다.
- 특히:
  - hero swiper 아래에 horizontal trending row를 추가한 의미
  - `ScrollView` 기반 horizontal row 패턴
  - title truncation과 poster card 표시 방식
  - 현재 best practice에서 horizontal content row를 어떻게 다루는지
  를 함께 정리한다.

## 레거시 커밋이 실제로 한 것

- `Movies.tsx`에 `Poster`를 직접 import해서 trending item에 재사용했다.
- swiper 아래에:
  - `ListTitle`
  - `TrendingScroll`
  - `Movie`
  - `Title`
  - `Votes`
  styled-component를 추가했다.
- `TrendingScroll`은 horizontal `ScrollView`로 만들고:
  - `contentContainerStyle={{ paddingLeft: 30 }}`
  - `showsHorizontalScrollIndicator={false}`
  를 줬다.
- `trending.map(...)`으로 각 영화 포스터/제목/평점을 렌더링했다.
- `movie.original_title.slice(0, 13)`로 제목을 강제로 잘랐다.
- `upcoming` API에 `region=KR`를 추가했다.
- hero swiper에는 `marginBottom: 30`을 줘서 아래 row와 간격을 벌렸다.

즉 이 단계는:

- "상단 hero 한 장"에서
- "hero + category row"가 있는 진짜 홈 피드 구조

로 넘어가는 단계다.

## 이 커밋이 당시 설명하려던 것

- 영화 홈 화면은 단일 hero만으로 끝나지 않는다
- 상단 hero 아래에 가로 스크롤 row를 붙이면 홈다운 구조가 생긴다
- poster, title, rating을 반복 카드 패턴으로 보여주면 category UI가 성립한다

즉 "피드형 영화 홈"의 첫 번째 section을 붙인 단계다.

## 지금 봐도 좋은 점

### 1. hero 아래에 가로 row를 추가한 정보 구조

- 이건 지금도 콘텐츠 앱 홈의 전형적인 구조다.
- hero + 여러 horizontal category row는 여전히 매우 일반적인 패턴이다.

### 2. `Poster` 재사용

- 이미 만든 leaf UI를 재사용한 점은 좋다.
- 이건 part five의 refactor가 실제로 payoff를 만든 순간이다.

### 3. `showsHorizontalScrollIndicator={false}` 같은 디테일

- 콘텐츠 row에선 지금도 흔한 선택이다.
- 모바일에서는 indicator를 숨기고 카드 자체에 집중시키는 편이 보통 더 자연스럽다.

## 지금 기준으로 바꿔 읽어야 할 점

### 1. horizontal `ScrollView + map`은 레거시 baseline에 가깝다

- 레거시 구현은 horizontal `ScrollView`에 직접 `map`한다.
- 학습용으론 단순하고 이해하기 쉽지만, 현재 기준으로는 horizontal row도 더 빨리 virtualize하는 편이 좋다.

`vercel-react-native-skills`는 아예 "리스트면 virtualizer를 기본값으로" 보라고 한다.

현재식이면 보통:

- horizontal `FlashList`
- 또는 horizontal `FlatList`

를 먼저 본다.

### 2. vertical root가 `ScrollView`인 구조는 row가 늘수록 빨리 한계가 온다

- 지금은 hero + trending 한 줄이라 괜찮다.
- 하지만 영화 홈은 곧:
  - trending
  - upcoming
  - top rated
  - popular
  - recommended
  로 늘어난다.

그렇게 되면:

- vertical `ScrollView`
- 내부 horizontal `ScrollView`

가 중첩된 구조가 커지고, mount cost와 메모리 비용이 커지기 쉽다.

현재식으론 보통:

- vertical root = `FlashList`
- 각 category section = `ListHeaderComponent` 또는 section item
- horizontal row도 필요시 `FlashList`

로 간다.

### 3. 제목 잘라내기는 `slice()`보다 layout-aware가 낫다

- `slice(0, 13)`는 학습용으론 단순하지만
- 화면 폭, 언어, 폰트, 다크 모드, dynamic type을 고려하면 어색해질 수 있다.

현재식이면:

- `numberOfLines={1}`
- `ellipsizeMode="tail"`

가 더 기본값이다.

### 4. 리스트 아이템은 컴포넌트로 빼는 편이 더 좋다

- 이 커밋은 `Movie` 카드 markup을 `Movies.tsx` 안에 계속 둔다.
- 현재 기준으론:
  - `TrendingMovieCard`
  - `MoviePosterCard`
  같은 item component로 분리하는 편이 더 낫다.

이유:

- memoization
- prop typing
- title/rating formatting 분리
- horizontal list 재사용

### 5. 포스터 이미지도 지금은 `expo-image`가 기본값에 가깝다

- `Poster` 컴포넌트가 현재는 `styled.Image` 기반이다.
- horizontal row에서 이미지 수가 늘기 시작하면 캐싱과 적정 해상도 로드가 더 중요해진다.

`vercel-react-native-skills` 기준으로는:

- `expo-image`
- 적정 썸네일 해상도
- compressed source

가 더 현재식이다.

## `vercel-react-native-skills` 기준 해석

- 직접 연결되는 규칙:
  - [`list-performance-virtualize`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-virtualize.md)
  - [`list-performance-item-memo`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-item-memo.md)
  - [`list-performance-images`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-images.md)

이 커밋을 이 기준으로 다시 읽으면:

- row 하나도 list라는 관점으로 본다
- item은 primitive props 기반으로 memoization-friendly하게 만든다
- poster는 표시 크기에 맞는 해상도와 캐시를 생각한다

즉 "가로 스크롤 카드 row"도 현재 기준에선 본격적인 list/perf 설계 대상이다.

## 2026 기본 추천

### 영화 홈의 category row를 만든다면

- vertical screen:
  - `FlashList`
- hero:
  - `ListHeaderComponent` 또는 첫 section
- trending row:
  - horizontal `FlashList`
- item:
  - `TrendingMovieCard`
- image:
  - `expo-image`
- title:
  - `numberOfLines={1}`
- subtitle/votes:
  - secondary text token

### item props

- `movieId`
- `posterPath`
- `movieTitle`
- `voteAverage`

처럼 primitive 위주로 넘기는 편이 좋다.

### spacing

- `contentContainerStyle`에 inline object를 남기기보다
- style/token으로 빼는 편이 더 유지보수에 좋다

## 이전 단계들과의 연결

- `6b7e702`:
  - hero UI 분리 + 병렬 fetch
- `246fa33`:
  - home screen에 첫 horizontal category row 추가

즉:

- refactor가 구조를 만들었고
- 이번 커밋이 그 구조를 실제 feed layout으로 확장한 셈이다.

## 현재 워크스페이스에 대한 결론

- 이 커밋은 "영화 홈을 피드형 홈으로 확장하는 첫 순간"으로서 학습 가치가 크다.
- 현재식으로는:
  - horizontal `ScrollView`보다 horizontal list
  - `slice()`보다 layout-aware truncation
  - image는 `expo-image`
  - item은 분리 + primitive props
  로 한 단계 더 가는 편이 좋다.


## 스킬 추출 후보

### 트리거

- 홈 화면에 첫 horizontal media row를 붙여 feed를 확장할 때

### 권장 기본값

- root scroll 축은 가능한 한 하나의 virtualized list로 통합한다.
- hero, row, upcoming section 같은 조각은 header나 section 단위로 조립한다.
- 이미지, title fallback, spacing 규칙은 공용 primitive나 mapper로 정리한다.

### 레거시 안티패턴

- root `ScrollView` 안에 큰 목록과 가로 리스트를 계속 중첩하기
- nullable media field와 title fallback을 item render마다 ad-hoc하게 처리하기

### 예외 / 선택 기준

- 아주 작은 정적 화면이라면 ScrollView 기반 조립도 설명용으로는 충분하다.

### 현재식 코드 스케치

```tsx
<FlatList
  data={upcoming}
  keyExtractor={(item) => String(item.id)}
  ListHeaderComponent={<HeroAndRows />}
  renderItem={renderUpcomingCard}
/>
```

### 스킬 규칙 초안

- "새 row를 붙일 땐 공용 media primitive, key extractor, image fallback 규칙을 먼저 정한다."

## 관련 페이지

- [컴포넌트 추출과 병렬 fetch 리팩터링](component-extraction-and-parallel-fetch-refactoring.md)
- [스크롤, 캐싱, 업로드, 서버 상태 발전 흐름 | Scroll, Caching, Upload, and Server-State Evolution](rn-scroll-cache-upload-query-evolution.md)
- [리치 히어로 카드와 테마 적응, Expo tsconfig](rich-hero-cards-theme-adaptation-and-expo-tsconfig.md)

## 참고 링크

- [Use a List Virtualizer for Any List](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-virtualize.md)
- [Pass Primitives to List Items for Memoization](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-item-memo.md)
- [Use Compressed Images in Lists](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-images.md)
