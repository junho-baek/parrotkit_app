# 가로 미디어 행을 위한 FlatList 기본형 | Horizontal FlatList Baseline for Media Rows

## 범위

- `nomadcoders/noovies`의 2021-09-22 커밋 `97a2e43` (`2.10 FlatList`)를 현재 Expo / React Native 기준으로 다시 읽는다.
- 특히:
  - `Trending` row를 `ScrollView`에서 `FlatList`로 바꾼 의미
  - horizontal list에서 `data`, `keyExtractor`, `ItemSeparatorComponent`, `renderItem`을 쓰는 구조
  - 이 변화가 당시엔 왜 좋은 진전이었는지
  - 지금 기준 best practice에선 어디까지 더 가는지
  를 함께 정리한다.

## 레거시 커밋이 실제로 한 것

- `Movies.tsx`에서 `TrendingScroll`을 `styled.ScrollView`에서 `styled.FlatList`로 바꿨다.
- `Trending Movies` row를:
  - `data={trending}`
  - `horizontal`
  - `keyExtractor={(item) => item.id + ""}`
  - `ItemSeparatorComponent={() => <View style={{ width: 30 }} />}`
  - `renderItem={({ item }) => <VMedia ... />}`
  구조로 바꿨다.
- `contentContainerStyle`도 `paddingLeft: 30`에서 `paddingHorizontal: 30`으로 정리했다.
- `VMedia.tsx`에서는 제목 잘라내기를 `13`자에서 `12`자로 조금 줄였다.
- 하지만 화면 전체 구조는 여전히:
  - root `ScrollView`
  - hero swiper
  - horizontal `FlatList`
  - vertical `upcoming.map(...)`
  인 상태다.

즉 이 단계는:

- "가로 row 하나를 드디어 공식 list API로 옮긴 단계"
- "하지만 화면 전체는 아직 완전한 list architecture로 넘어가진 않은 단계"

라고 읽을 수 있다.

## 이 커밋이 당시 설명하려던 것

- 가로 스크롤 카드 row도 `FlatList`로 만드는 게 더 자연스럽다는 점
- `map(...)` 대신 `data / renderItem / keyExtractor` 패턴을 익히는 점
- separator와 padding을 list API로 다루는 흐름

즉 "리스트를 진짜 리스트답게 다루기 시작하는 단계"다.

## 지금 봐도 좋은 점

### 1. `ScrollView + map`에서 `FlatList`로 옮긴 건 분명한 진전이다

- React Native 공식 문서 기준으로도 긴 flat list의 기본값은 `FlatList`다.
- row 하나만 봐도, 이 커밋은 더 올바른 baseline으로 이동한 셈이다.

### 2. `keyExtractor`를 명시한 점

- item key를 list 레벨에서 관리하기 시작한 건 좋다.
- 현재 기준으로도 stable key는 virtualized list의 핵심이다.

### 3. `ItemSeparatorComponent`를 사용한 점

- 카드 사이 간격을 list API에서 처리한 건 좋은 방향이다.
- 이후 디자인 수정이나 spacing 통일에도 더 유리하다.

### 4. `renderItem`으로 `VMedia`를 분리한 점

- 이미 분리해 둔 leaf item을 list에 붙이는 구조는 지금 봐도 맞다.
- `posterPath`, `originalTitle`, `voteAverage` 같은 primitive props를 넘기는 방식도 현재 memoization 관점과 잘 맞는다.

## 지금 기준으로 바꿔 읽어야 할 점

### 1. 이건 좋은 변화지만 "부분 적용"에 가깝다

- `Trending` row만 `FlatList`가 됐고,
- root는 여전히 `ScrollView`,
- `Coming soon`은 여전히 `map(...)`
이다.

지금 기준으론 이쯤에서 보통:

- root 자체를 `FlatList` / `FlashList` / `LegendList`
- hero를 `ListHeaderComponent`
- row section을 nested horizontal list

로 묶는 쪽을 먼저 생각한다.

즉 이 커밋은 방향은 맞았지만, 화면 전체 재구성까지는 아직 가지 않은 과도기다.

### 2. 현재 best practice라면 `FlatList`보다 `FlashList` / `LegendList`를 더 빨리 검토한다

- React Native 공식 baseline으로는 `FlatList`가 맞다.
- 하지만 `vercel-react-native-skills`는 더 공격적으로:
  - `ScrollView + map` 대신
  - `LegendList` 또는 `FlashList`

를 기본값으로 올리라고 본다.

특히 홈 피드처럼:

- 이미지가 많고
- row가 여러 개 생기고
- vertical + horizontal nesting이 있고
- refresh / infinite scroll이 붙을 가능성이 크면

`FlatList`는 "공식 표준"이고,
`FlashList` / `LegendList`는 "현재 실무 최적화 기본값"에 더 가깝다.

### 3. `renderItem`과 separator를 inline으로 두는 건 다음 단계에서 정리할 수 있다

- 이 커밋은:
  - `ItemSeparatorComponent={() => <View style={{ width: 30 }} />}`
  - `renderItem={({ item }) => <VMedia ... />}`
  를 inline으로 둔다.

학습용으론 충분하지만, 현재식이면:

- `renderTrendingItem`
- `renderTrendingSeparator`

를 root에 hoist하거나 stable reference로 두는 편이 더 좋다.

이는 `vercel-react-native-skills`의 callback/reference 안정성 규칙과도 통한다.

### 4. `contentContainerStyle`와 spacing도 지금은 더 체계적으로 다루는 편이다

- `paddingHorizontal: 30` 자체는 괜찮다.
- 다만 지금 기준으론 spacing token이나 shared style로 빼서:
  - 섹션 padding
  - 카드 gap
  - header margin

을 더 일관되게 관리하는 편이 좋다.

### 5. 제목 truncation을 숫자로 맞추는 방식은 여전히 임시방편이다

- `13`자에서 `12`자로 줄인 건 실제 UI 폭에 맞춘 미세 조정으로 보인다.
- 하지만 현재 기준으론:
  - `numberOfLines={1}`
  - `ellipsizeMode="tail"`

이 더 자연스럽다.

즉 이 조정은 "레이아웃 문제를 문자열 길이로 맞춘 흔적"으로 읽을 수 있다.

## `vercel-react-native-skills` 기준 해석

- 직접 연결되는 규칙:
  - [`list-performance-virtualize`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-virtualize.md)
  - [`list-performance-item-memo`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-item-memo.md)
  - [`list-performance-callbacks`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-callbacks.md)
  - [`list-performance-inline-objects`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-inline-objects.md)

이 커밋을 현재식으로 다시 읽으면:

- `FlatList`로 옮긴 건 맞는 개선이다
- primitive props를 넘긴 점도 좋다
- 하지만 modern best practice는 여기서 한 단계 더 나아가
  - root virtualization
  - stable callbacks
  - 더 빠른 virtualizer
를 붙인다

## 공식 문서 기준 짧은 메모

- React Native 공식 문서는 `FlatList`를 "performant interface for rendering basic, flat lists"라고 설명하고:
  - `Pull to Refresh`
  - `Header support`
  - `Footer support`
  - `horizontal`
  - `scrollToIndex`
  를 기본 기능으로 안내한다.
- 또한 `FlatList`가 `PureComponent`이므로 `extraData`, stable references, `keyExtractor` 같은 감각이 중요하다고 설명한다.

즉 이 커밋은 공식 문서 기준으론 분명히 더 정석으로 가까워진 단계다.

## 2026 기본 추천

### 홈 피드라면

- root:
  - `FlashList` 또는 `LegendList`
- hero:
  - `ListHeaderComponent`
- trending row:
  - horizontal `FlashList`
- coming soon:
  - vertical item list

### 일반 가로 row 하나만 있다면

- 팀이 core-only를 선호하면:
  - horizontal `FlatList`
- 성능을 더 챙기면:
  - horizontal `FlashList`

### item 설계

- `movieId`
- `posterPath`
- `movieTitle`
- `voteAverage`

같은 primitive props 위주

### list 구현

- stable `keyExtractor`
- hoisted `renderItem`
- hoisted separator
- `numberOfLines` 기반 truncation

## 이전 단계들과의 연결

- `0a93796`:
  - refresh + `HMedia` / `VMedia` 분리
- `97a2e43`:
  - 그중 `Trending` row를 공식 list API로 이동

즉 이 커밋은:

- "리팩터된 item component"
- "실제 list API"

가 처음 제대로 만나는 단계다.

## 현재 워크스페이스에 대한 결론

- 이 커밋은 레거시 noovies 안에서 리스트 감각이 한 단계 성숙한 지점이다.
- 현재식으로는:
  - `FlatList` 전환 자체는 좋은 진전
  - 하지만 root도 같이 virtualize해야 더 자연스럽고
  - 실무 성능 기준으로는 `LegendList` / `FlashList`를 더 빨리 검토하는 편이 좋다

즉 한 줄로 줄이면:

- 당시엔 "더 정석"
- 지금은 "정석으로 가는 중간 단계"

이다.


## 스킬 추출 후보

### 트리거

- 가로 media row를 처음 `FlatList`로 옮길 때

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

- "horizontal media row는 `FlatList` baseline으로 시작하되 item primitive와 image 성능을 함께 정리한다."

## 관련 페이지

- [Pull-to-Refresh와 재사용 미디어 프리미티브](pull-to-refresh-and-reusable-media-primitives.md)
- [스크롤뷰, 플랫리스트, 레전드리스트, 섹션리스트 정리 | ScrollView, FlatList, LegendList, and SectionList](scrollview-flatlist-legendlist-sectionlist.md)
- [가로 미디어 행과 홈 피드 확장](horizontal-media-rows-and-home-feed-expansion.md)
