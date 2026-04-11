# 혼합 홈 피드 섹션과 세로 개봉 예정 카드 | Mixed Home Feed Sections and Vertical Upcoming Cards

## 범위

- `nomadcoders/noovies`의 2021-09-20 커밋 `031d414` (`2.7 Coming Soon`)를 현재 Expo / React Native 기준으로 다시 읽는다.
- 특히:
  - `Trending` 아래에 `Coming soon` 세로 섹션을 추가한 의미
  - 한 화면 안에 hero + horizontal row + vertical list가 섞이는 구조
  - 텍스트 truncation / 날짜 포맷 / poster fallback 의도
  - 현재 best practice에서 이 화면을 어떻게 재구성하는지
  를 함께 정리한다.

## 레거시 커밋이 실제로 한 것

- `Poster.tsx`에 `background-color: rgba(255, 255, 255, 0.5);`를 넣어 poster가 비었을 때의 빈칸 느낌을 완화했다.
- `Movies.tsx`에 세로 리스트용 styled-component를 추가했다.
  - `ListContainer`
  - `HMovie`
  - `HColumn`
  - `Overview`
  - `Release`
  - `ComingSoonTitle`
- `Trending Movies` row를 `ListContainer`로 감쌌다.
- 그 아래에 `Coming soon` 제목을 추가하고 `upcoming.map(...)`으로 세로 카드 리스트를 렌더링했다.
- 각 `Coming soon` item에는:
  - `Poster`
  - 영화 제목
  - `release_date`를 `toLocaleDateString("ko", ...)`로 포맷한 날짜
  - 잘라낸 overview
  가 들어간다.
- `upcoming` API에서 `region=KR`를 다시 제거했다.
- hero swiper 아래 간격을 `30`에서 `40`으로 늘렸다.

즉 이 단계는:

- "hero + trending row"에서
- "hero + row + vertical upcoming list"

로 홈 화면이 한 번 더 확장된 단계다.

## 이 커밋이 당시 설명하려던 것

- 영화 홈은 여러 종류의 section이 섞여 있는 화면이라는 점
- horizontal category row와 vertical content list를 한 화면에 함께 배치하는 법
- release date 같은 메타데이터와 긴 설명 텍스트를 보여주는 카드형 목록 구성

즉 "홈 피드의 섹션 다양성"을 보여주는 단계다.

## 지금 봐도 좋은 점

### 1. `Coming soon`을 별도 정보 구조로 다룬 점

- `Trending`은 가벼운 poster row
- `Coming soon`은 더 설명적인 vertical card

로 정보 밀도에 맞게 section 형태를 다르게 잡은 건 지금도 좋은 방향이다.

### 2. 날짜를 locale-aware하게 포맷한 점

- `toLocaleDateString("ko", ...)`를 쓴 점은 학습용 코드 치고 꽤 좋다.
- 현재도 기본 아이디어는 유효하다.

### 3. poster fallback 배경을 넣은 점

- 이미지가 늦게 뜨거나 비었을 때 레이아웃이 텅 빈 느낌이 덜 나게 하려는 의도는 좋다.
- placeholder를 챙긴다는 감각 자체는 현재식에도 중요하다.

## 지금 기준으로 바꿔 읽어야 할 점

### 1. 한 화면 전체를 `ScrollView`로 계속 키우는 방식은 빨리 한계가 온다

- 이제 화면은:
  - hero swiper
  - horizontal trending row
  - vertical upcoming list

를 모두 갖게 됐다.

이 시점부터는 현재식으로:

- vertical root = `FlashList`
- hero = header
- horizontal row = row section
- vertical upcoming = row item section

처럼 재구성하는 편이 더 자연스럽다.

즉 이 커밋은 "이제 root virtualization을 고민해야 하는 시점"으로 읽을 수 있다.

### 2. `upcoming.map(...)` 세로 렌더링도 지금은 list 관점으로 본다

- 레거시 구현은 단순 `map`
- 현재식이면 vertical section도 `FlashList` / `FlatList`로 옮긴다

특히 poster + text가 반복되는 리스트는 이미지 비용까지 커지기 쉬워서 virtualization 이점이 더 빨리 드러난다.

### 3. `toLocaleDateString("ko", ...)`는 괜찮지만, formatter hoist가 더 낫다

- 지금 코드처럼 item마다 직접 `new Date(...).toLocaleDateString(...)`를 돌리는 건 학습용으론 충분하다.
- 하지만 현재식으론:
  - formatter를 바깥으로 hoist
  - 공용 `format-release-date` util

로 빼는 편이 더 낫다.

`vercel-react-native-skills`의 `js-hoist-intl` 방향과도 통한다.

### 4. overview truncation은 여전히 `slice()`보다 layout-aware 방식이 낫다

- 이 커밋은 `movie.overview.length > 80 ? slice(0, 140) : movie.overview` 같은 혼합 로직을 쓴다.
- 현재 기준으론:
  - `numberOfLines`
  - `ellipsizeMode`
  - 필요하면 "더보기"

가 더 자연스럽다.

### 5. poster placeholder는 지금은 `expo-image` placeholder가 더 자연스럽다

- 레거시 구현은 배경색으로 fallback 느낌을 냈다.
- 현재식이면:
  - `expo-image`
  - `placeholder`
  - `transition`
  - `cachePolicy`

가 더 자연스럽다.

즉 감각은 맞았고, 구현 수단이 현대화된 셈이다.

### 6. section title / item UI는 이제 component화가 필요해진다

- 이 시점부터 `Movies.tsx` 안에 section markup이 다시 불어나기 시작한다.
- 현재 기준으론:
  - `movie-section-title`
  - `trending-movie-row`
  - `upcoming-movie-list-item`
  같은 단위로 나눠야 유지보수가 편하다.

## `vercel-react-native-skills` 기준 해석

- 직접 연결되는 규칙:
  - [`list-performance-virtualize`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-virtualize.md)
  - [`list-performance-images`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-images.md)
  - [`ui-safe-area-scroll`](../../../../.agents/skills/vercel-react-native-skills/rules/ui-safe-area-scroll.md)

이 커밋을 현재식으로 다시 읽으면:

- vertical/horizontal 모두 list다
- poster row와 vertical card list 모두 virtualization 후보다
- 이미지 placeholder와 적정 해상도 로딩을 같이 봐야 한다
- root가 아직 `ScrollView`라면 safe area handling도 같이 챙겨야 한다

## 2026 기본 추천

### 화면 구조

- root:
  - `FlashList`
- hero:
  - `ListHeaderComponent` 또는 첫 section
- trending:
  - horizontal `FlashList`
- coming soon:
  - vertical `FlashList` item section

### 컴포넌트 구조

```text
features/
  movies/
    components/
      movie-section-title.tsx
      trending-movie-row.tsx
      trending-movie-card.tsx
      upcoming-movie-list-item.tsx
```

### 텍스트/날짜

- 제목:
  - `numberOfLines={1}`
- overview:
  - `numberOfLines={3}` 또는 `4`
- 날짜:
  - formatter util 분리

### 이미지

- `Poster`는 `expo-image`
- placeholder / transition / cache 사용
- row/list에 맞는 크기의 썸네일 URL 사용

## 이전 단계들과의 연결

- `246fa33`:
  - 첫 horizontal row
- `031d414`:
  - vertical upcoming section까지 붙으며 다중 섹션 홈이 성립

즉:

- `Trending Movies`는 첫 번째 가로 섹션
- `Coming soon`은 첫 번째 세로 섹션
- 이 시점부터 화면 전체를 list architecture로 다시 생각해야 한다

## 현재 워크스페이스에 대한 결론

- 이 커밋은 홈 화면이 "여러 section이 섞인 진짜 피드"로 넘어가는 분기점이다.
- 현재식으로는:
  - root `ScrollView`를 계속 키우기보다 `FlashList` 중심으로 재구성
  - row와 vertical list를 둘 다 virtualization 대상으로 보기
  - 날짜 format과 텍스트 truncation을 util / component 단위로 정리
  - 포스터 fallback은 `expo-image` placeholder 쪽으로 옮기기


## 스킬 추출 후보

### 트리거

- 가로 row와 세로 upcoming cards를 함께 가진 혼합 홈 피드를 만들 때

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

- "혼합 피드는 root virtualized list를 기준으로 가로/세로 섹션을 header와 item 영역으로 분리한다."

## 관련 페이지

- [가로 미디어 행과 홈 피드 확장](horizontal-media-rows-and-home-feed-expansion.md)
- [스크롤, 캐싱, 업로드, 서버 상태 발전 흐름 | Scroll, Caching, Upload, and Server-State Evolution](rn-scroll-cache-upload-query-evolution.md)
- [컴포넌트 추출과 병렬 fetch 리팩터링](component-extraction-and-parallel-fetch-refactoring.md)

## 참고 링크

- [Use a List Virtualizer for Any List](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-virtualize.md)
- [Use Compressed Images in Lists](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-images.md)
- [Use contentInsetAdjustmentBehavior for Safe Areas](../../../../.agents/skills/vercel-react-native-skills/rules/ui-safe-area-scroll.md)
