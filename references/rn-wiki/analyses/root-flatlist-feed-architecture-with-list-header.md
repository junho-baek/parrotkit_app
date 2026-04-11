# ListHeader 기반 루트 FlatList 피드 구조 | Root FlatList Feed Architecture with List Header

## 범위

- `nomadcoders/noovies`의 2021-09-22 커밋 `07516eb` (`2.11 FlatList part Two`)를 현재 Expo / React Native 기준으로 다시 읽는다.
- 특히:
  - root `ScrollView`를 `FlatList`로 바꾼 의미
  - `ListHeaderComponent`로 hero swiper와 horizontal row를 올린 구조
  - `onRefresh` / `refreshing`을 root list에 직접 붙인 흐름
  - 지금 기준 best practice에선 어디가 좋아졌고, 어디를 더 현대화할지
  를 함께 정리한다.

## 레거시 커밋이 실제로 한 것

- `Movies.tsx`의 root를 `Container` (`ScrollView`)에서 `FlatList`로 바꿨다.
- 이전에는:
  - root `ScrollView`
  - 내부 `RefreshControl`
  - hero swiper
  - horizontal `TrendingScroll`
  - 아래에서 `upcoming.map(...)`
  구조였다.
- 이번에는:
  - root `FlatList`
  - `onRefresh={onRefresh}`
  - `refreshing={refreshing}`
  - `ListHeaderComponent` 안에 hero swiper + `Trending Movies` horizontal list
  - `data={upcoming}`
  - `renderItem={({ item }) => <HMedia ... />}`
  로 옮겼다.
- `Coming soon` heading도 `ListHeaderComponent` 안으로 들어갔다.
- `upcoming` item 간 간격은 `ItemSeparatorComponent={() => <View style={{ height: 20 }} />}`로 처리했다.
- `HMedia.tsx`에 있던 `margin-bottom: 30px;`는 제거했다.

즉 이 단계는:

- "가로 row 하나만 list였던 상태"에서
- "화면 전체의 세로 스크롤 축이 진짜 `FlatList`가 된 상태"

로 넘어간 단계다.

## 이 커밋이 당시 설명하려던 것

- 화면 전체를 리스트 관점으로 다시 잡는 법
- vertical root list의 header로 hero와 다른 섹션을 구성하는 법
- pull-to-refresh를 root list에 직접 연결하는 법
- item spacing을 list API로 넘기는 법

즉 "화면 전체를 공식 list architecture로 재구성하는 단계"다.

## 지금 봐도 좋은 점

### 1. root를 `FlatList`로 바꾼 건 큰 진전이다

- 이건 `2.10`보다 한 단계 더 중요하다.
- 이제 세로 스크롤 축 자체가 virtualized list가 됐다.
- 홈 피드 화면을 "그냥 큰 스크롤 페이지"가 아니라 "목록 화면"으로 보기 시작한 순간이다.

### 2. `ListHeaderComponent`로 hero + trending row를 올린 구조가 좋다

- React Native 공식 문서도 `FlatList`가 `ListHeaderComponent`를 기본 지원한다고 설명한다.
- hero swiper와 horizontal row를 header에 넣고,
- 실제 vertical data는 `upcoming`
로 두는 구조는 지금 봐도 꽤 자연스럽다.

### 3. `onRefresh` / `refreshing`을 root list에 직접 붙인 점

- `RefreshControl`을 수동으로 집어넣는 것보다, root `FlatList`의 표준 pull-to-refresh API를 쓰기 시작했다.
- React Native 공식 문서도 `onRefresh`와 `refreshing`을 `FlatList` 기본 API로 안내한다.

### 4. vertical item spacing을 `ItemSeparatorComponent`로 옮긴 점

- `HMedia`에서 margin-bottom으로 spacing을 주는 대신,
- list가 item 사이 간격을 책임지게 만들었다.
- 이건 list 책임과 item 책임을 분리한 좋은 변화다.

### 5. `Coming soon`을 이제 "진짜 data-driven vertical list"로 바꾼 점

- 이전엔 `upcoming.map(...)`
- 이제는 root `FlatList data={upcoming}`

이다.

즉 vertical section도 드디어 공식 list API 안으로 들어온 셈이다.

## 지금 기준으로 바꿔 읽어야 할 점

### 1. 이 커밋은 공식 baseline으로는 꽤 좋지만, modern performance baseline으론 아직 중간 단계다

- React Native 공식 baseline으로 보면 이건 꽤 정석적이다.
- 하지만 `vercel-react-native-skills`는 여기서 한 단계 더 나아가:
  - `FlashList`
  - `LegendList`

같은 modern virtualizer를 더 빨리 검토하라고 본다.

특히 이 화면은:

- hero
- nested horizontal list
- vertical media list
- refresh
- 이미지 여러 장

을 동시에 가지므로, 실제 앱에선 성능 민감 화면이 되기 쉽다.

그래서 지금 기준으론:

- 공식 정석:
  - root `FlatList`
- 실무 최적화 기본값:
  - root `FlashList` / `LegendList`

로 나눠 읽는 게 맞다.

### 2. `ListHeaderComponent`를 큰 inline fragment로 두는 건 다음 단계에서 정리할 수 있다

- 이 커밋은 `ListHeaderComponent={<><Swiper ... /><ListContainer>...</ListContainer><ComingSoonTitle>...</ComingSoonTitle></>}`처럼 큰 JSX 블록을 inline으로 둔다.
- 학습용으론 충분하지만, 현재식이면:
  - `movie-home-header.tsx`
  - `movie-trending-section.tsx`

같이 분리하는 편이 더 좋다.

### 3. nested horizontal list는 괜찮지만, 바깥 list도 같은 계열 virtualizer인 편이 더 좋다

- 현재 커밋은 vertical root `FlatList` 안에 horizontal `FlatList`가 들어간다.
- 이 구조 자체는 흔하고 괜찮다.
- 다만 현재 FlashList 문서는 horizontal FlashList를 vertical list 안에 중첩할 때 바깥 vertical list도 FlashList인 편을 권장한다.

즉 이 커밋은 구조적으로 맞지만, modern performance 관점에선 "같은 계열 고성능 list로 통일" 여지가 있다.

### 4. `renderItem`, `ItemSeparatorComponent`, `ListHeaderComponent`가 모두 inline이라 reference 안정성이 아쉽다

- 현재식이면:
  - `renderUpcomingItem`
  - `renderUpcomingSeparator`
  - `renderTrendingItem`
  - `renderTrendingSeparator`
  - `ListHeaderComponent={MovieHomeHeader}`

처럼 더 안정적인 reference 구조를 선호한다.

이건 list parent re-render 시 item 재평가를 줄이는 데 도움이 된다.

### 5. 이 시점부터는 `SectionList` 가능성도 생긴다

- 지금 구조는:
  - hero + trending header
  - upcoming list

이라 `FlatList`가 자연스럽다.
- 하지만 이후:
  - upcoming
  - top rated
  - popular
  - recommended

처럼 vertical section이 더 생기면 `SectionList`나 더 커스텀한 sectioned virtualizer를 검토할 수 있다.

즉 이 커밋은 "아직 `FlatList`가 가장 맞는 단계"이지만, 섹션 수가 늘어나면 다음 선택지가 열린다.

## `vercel-react-native-skills` 기준 해석

- 직접 연결되는 규칙:
  - [`list-performance-virtualize`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-virtualize.md)
  - [`list-performance-item-memo`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-item-memo.md)
  - [`list-performance-callbacks`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-callbacks.md)
  - [`list-performance-inline-objects`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-inline-objects.md)

이 커밋을 현재식으로 다시 읽으면:

- root virtualization으로 간 건 좋은 진전이다
- `HMedia`처럼 primitive props item도 방향이 좋다
- 하지만 item/renderer/header reference 안정성과 modern virtualizer 선택은 아직 다음 단계로 남아 있다

## 공식 문서 기준 짧은 메모

- React Native 공식 문서는 `FlatList`가:
  - header support
  - separator support
  - pull to refresh
  - horizontal mode
를 기본 지원한다고 설명한다.
- 또한 `FlatList`는 `PureComponent`라서:
  - `data`
  - `extraData`
  - `keyExtractor`
  - render function이 참조하는 값
의 안정성이 중요하다고 설명한다.

즉 이 커밋은 공식 기준에선 "이제 꽤 정석적인 구조"라고 볼 수 있다.

## 2026 기본 추천

### 현재식으로 영화 홈을 만든다면

- root:
  - `FlashList` 또는 `LegendList`
- header:
  - `MovieHomeHeader`
- header 안:
  - hero carousel
  - trending horizontal row
- vertical data:
  - `upcoming`
- refresh:
  - root list의 `onRefresh` / `refreshing`

### item와 renderer

- `HMedia`, `VMedia`는 feature-local component
- props는 primitive 위주
- renderers / separators / header는 가능한 hoist

### 구조 선택

- 지금처럼 vertical data가 하나면:
  - `FlatList` 또는 `FlashList`
- vertical sections가 여러 개면:
  - `SectionList` 또는 section-capable virtualizer

## 이전 단계들과의 연결

- `97a2e43`:
  - horizontal row를 `FlatList`로 전환
- `07516eb`:
  - 화면 전체 root를 `FlatList`로 전환

즉:

- `2.10`은 부분 전환
- `2.11`은 구조 전환

이다.

## 현재 워크스페이스에 대한 결론

- 이 커밋은 레거시 noovies 안에서 홈 피드 구조가 가장 “리스트답게” 정리된 첫 지점이다.
- 현재식으로는:
  - 이 방향 자체는 맞고
  - 공식 baseline으로도 좋고
  - 다만 실무 성능 기준으론 `FlashList` / `LegendList`, stable render references, feature-local section components까지 더 가는 편이 좋다

한 줄로 줄이면:

- **당시엔 꽤 정석**
- **지금도 방향은 맞지만, 현대화 포인트가 몇 개 더 남아 있다**


## 스킬 추출 후보

### 트리거

- root `ScrollView`를 `FlatList + ListHeaderComponent` 구조로 바꿔야 할 때

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

- "복합 홈 화면은 root virtualized list를 기준으로 header와 item 영역을 나누는 구조를 우선 검토한다."

## 관련 페이지

- [가로 미디어 행을 위한 FlatList 기본형](horizontal-flatlist-baseline-for-media-rows.md)
- [Pull-to-Refresh와 재사용 미디어 프리미티브](pull-to-refresh-and-reusable-media-primitives.md)
- [스크롤뷰, 플랫리스트, 레전드리스트, 섹션리스트 정리 | ScrollView, FlatList, LegendList, and SectionList](scrollview-flatlist-legendlist-sectionlist.md)
