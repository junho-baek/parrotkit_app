# 스크롤뷰, 플랫리스트, 레전드리스트, 섹션리스트 정리 | ScrollView, FlatList, LegendList, and SectionList

## 범위

- React Native / Expo 앱에서 가장 자주 비교하게 되는 네 가지 스크롤 계층을 한 장으로 정리한다.
  - `ScrollView`
  - `FlatList`
  - `LegendList`
  - `SectionList`
- 목표는:
  - 각각이 무엇을 위한 도구인지
  - 언제 선택하는지
  - 현재 공식 baseline과 `vercel-react-native-skills` 기준의 차이
  - 2026 기준 best practice
  를 빠르게 판단할 수 있게 만드는 것이다.

## 한 줄 요약

- `ScrollView`:
  - 작은 정적 화면
- `FlatList`:
  - React Native 공식 기본 flat list
- `SectionList`:
  - 그룹화된 목록의 공식 기본값
- `LegendList`:
  - 더 공격적인 성능과 스크롤 안정성이 필요한 modern virtualizer

즉:

- 공식 baseline:
  - `ScrollView` / `FlatList` / `SectionList`
- 성능 우선 modern baseline:
  - `LegendList` 또는 `FlashList`

## 1. `ScrollView`

### 무엇인가

- 가장 단순한 스크롤 컨테이너다.
- children을 그대로 감싸서 세로 또는 가로로 스크롤하게 만든다.

### 장점

- 가장 단순하다
- layout을 자유롭게 구성하기 쉽다
- 리스트가 아니라 "문서형 화면"을 만들기 좋다
- `refreshControl`도 붙일 수 있다

### 한계

- React Native 공식 문서도 `ScrollView`는 children을 한 번에 전부 렌더링한다고 설명한다.
- 길어진 목록에서는:
  - mount cost 증가
  - 메모리 증가
  - 이미지 많은 화면에서 jank 가능성
  이 빨리 드러난다.

### 언제 쓰나

- 설정 화면
- 약관 / 소개 / 상세 설명
- 입력 폼
- child 개수가 작고 거의 고정된 화면
- "리스트"보다 "페이지"에 가까운 화면

### 현재식 메모

- root `ScrollView`라면 iOS에선 `contentInsetAdjustmentBehavior="automatic"`를 우선 본다.
- `ScrollView + items.map(...)`가 보이면, 그게 정말 정적 페이지인지 먼저 의심하는 습관이 좋다.

## 2. `FlatList`

### 무엇인가

- React Native 공식 기본 flat list다.
- `VirtualizedList` 기반이라, 화면에 보이는 아이템 중심으로 windowed rendering을 한다.

### 장점

- 공식 기본값이라 문서와 사례가 많다
- 다음 기능을 기본 지원한다:
  - `onRefresh`
  - `refreshing`
  - `onEndReached`
  - `ListHeaderComponent`
  - `ListFooterComponent`
  - `ItemSeparatorComponent`
  - `horizontal`
  - `numColumns`
  - `scrollToIndex`
- "평범한 리스트"는 대부분 이것만으로 충분하다

### 한계

- 아주 큰 피드나 복잡한 row에서 더 공격적인 최적화가 필요할 수 있다
- `PureComponent`라서:
  - `extraData`
  - stable `keyExtractor`
  - item memoization
  을 잘 챙겨야 한다
- heterogeneous list가 복잡해질수록 구조를 더 신경 써야 한다

### 언제 쓰나

- 일반적인 서버 목록
- 검색 결과
- 기록 목록
- 카드 리스트
- 공식 baseline을 따르고 싶을 때

### 현재식 메모

- React Native 공식 기준으로는 "긴 목록이면 `FlatList`"가 아직 가장 표준적인 설명이다.
- `getItemLayout`은 아이템 크기를 알고 있을 때 아주 유용하다.

## 3. `SectionList`

### 무엇인가

- React Native 공식 기본 grouped list다.
- section header / section footer / item renderer를 한 리스트 안에서 다룬다.

### 장점

- 날짜별, 카테고리별, 알파벳별처럼 그룹화된 목록에 딱 맞다
- `renderSectionHeader`
- `renderSectionFooter`
- `stickySectionHeadersEnabled`
- `scrollToLocation`
를 기본 제공한다
- `onRefresh` / `refreshing`도 붙일 수 있다

### 한계

- flat feed보다 data shape가 더 엄격하다
- section 수와 item 수가 커지면 여전히 virtualization / memoization 감각이 필요하다
- 복잡한 heterogeneous feed를 억지로 section으로만 푸는 건 오히려 읽기 어려울 수 있다

### 언제 쓰나

- 달력 날짜별 기록
- 채널/카테고리별 그룹
- 연락처 알파벳 섹션
- "섹션 헤더가 실제 UX 의미를 가진다"는 구조

### 현재식 메모

- "그룹화된 목록"이면 여전히 가장 자연스러운 공식 기본값이다.
- iOS에서 section header sticky가 기본 동작에 가깝고, Android는 명시적으로 챙겨야 한다.

## 4. `LegendList`

### 무엇인가

- `@legendapp/list`의 고성능 virtualizer다.
- React Native core는 아니고 서드파티다.
- 최근 기준으로는 `FlashList`와 함께 modern high-performance list 후보로 자주 언급된다.

### 장점

- 큰 리스트, 복잡한 리스트, chat/infinite scroll 같은 use case에 강하다
- `keyExtractor`를 잘 주면 레이아웃 정보를 더 잘 재사용한다
- `estimatedItemSize`, `getEstimatedItemSize`, `getFixedItemSize`
- `getItemType`
- `recycleItems`
- `maintainVisibleContentPosition`
같은 성능/정확도 관련 API가 강하다

### 한계

- 공식 RN core는 아니라 팀 합의가 필요하다
- `recycleItems`는 성능상 이점이 크지만 local state 재사용 부작용을 이해해야 한다
- 잘못 쓰면 오히려 디버깅 난이도가 올라간다

### 언제 쓰나

- 긴 피드
- 성능 민감한 검색 결과
- 복잡한 heterogeneous list
- chat / timeline / AI thread
- nested virtualized list가 필요한 화면

### 현재식 메모

- `vercel-react-native-skills`는 `ScrollView + map`보다 `LegendList`나 `FlashList`를 기본값으로 더 빨리 올리라고 본다.
- 특히 `getItemType`과 size estimation을 적극 쓰는 쪽이 현재식 해석에 가깝다.

## 비교 표

| 컴포넌트 | 핵심 역할 | 강점 | 약점 | 지금 추천 위치 |
| --- | --- | --- | --- | --- |
| `ScrollView` | 정적 페이지형 스크롤 | 단순함, 자유로운 layout | 전부 한 번에 렌더 | 작은 상세/설정/폼 |
| `FlatList` | 일반 flat list | 공식 baseline, 기능 풍부 | 초대형/복잡 feed는 아쉬울 수 있음 | 보편적인 리스트 기본값 |
| `SectionList` | 그룹화된 list | section header, sticky, grouped data | flat feed보다 data shape가 더 무거움 | 날짜/카테고리 그룹 목록 |
| `LegendList` | 고성능 modern virtualizer | 큰 리스트, recycle, item types, scroll stability | 서드파티, 설계 감각 필요 | 성능 민감한 실제 피드/채팅 |

## 공식 baseline과 `vercel-react-native-skills`의 차이

### React Native 공식 baseline

- `ScrollView`:
  - children을 전부 렌더
- `FlatList`:
  - 긴 flat list의 기본값
- `SectionList`:
  - grouped list의 기본값

즉:

- 공식 문서는 우선 core component 위주로 설명한다.

### `vercel-react-native-skills` 기준

- `ScrollView + map`를 더 빨리 경계한다
- virtualizer를 더 일찍 기본값으로 올린다
- `LegendList` / `FlashList`를 modern default처럼 다룬다
- item component는 primitive props와 memoization을 전제로 본다

즉:

- 공식 문서 = 최소 공통 baseline
- Vercel RN 스킬 = 실무 최적화 default

## 2026 기준 베스트 프랙티스

### 1. 먼저 화면을 "페이지"인지 "리스트"인지 구분한다

- 페이지면:
  - `ScrollView`
- 리스트면:
  - 처음부터 virtualizer를 검토

이 판단이 제일 중요하다.

### 2. 정말 일반적인 목록이면 `FlatList`도 여전히 좋다

- 팀이 core-only를 선호하거나
- 규모가 아주 크지 않거나
- RN 기본 패턴으로 시작하고 싶으면
  - `FlatList`

는 여전히 충분히 좋은 선택이다.

### 3. 그룹 개념이 UX 핵심이면 `SectionList`

- 날짜별
- 카테고리별
- 알파벳별
- sticky section header가 의미 있을 때

는 `SectionList`가 가장 자연스럽다.

### 4. 성능 민감 피드라면 `LegendList` 또는 `FlashList`

- 검색 결과가 길다
- 카드가 무겁다
- 이미지가 많다
- nested horizontal rows가 있다
- chat/timeline처럼 스크롤 안정성이 중요하다

면 modern virtualizer를 우선 본다.

### 5. 어떤 리스트를 쓰든 공통으로 지킬 것

- stable `keyExtractor`
- item component 분리
- primitive props 위주 전달
- inline object / inline callback 최소화
- 적정 해상도 이미지 사용
- `expo-image` 사용
- refresh는 list 자체의 `onRefresh` / `refreshing`에 붙이기

## 현재 워크스페이스 기준 추천

### `nomad-diary`에서

- 홈 피드 / 검색 결과 / 기록 목록:
  - `LegendList` 또는 `FlashList` 우선 검토
- 단순한 일반 목록:
  - `FlatList`
- 날짜/카테고리 그룹 목록:
  - `SectionList`
- 설정 / 소개 / 폼 / 상세 설명:
  - `ScrollView`

### 실전 선택 규칙

1. item 수가 늘어날 가능성이 있나?
2. 이미지가 많은가?
3. 섹션 개념이 UX 핵심인가?
4. nested row가 생기나?

이 네 질문 중 둘 이상이 "예"면 `ScrollView`보다 list를 먼저 본다.

## 빠른 의사결정 표

- 약관 / 프로필 상세 / 설정:
  - `ScrollView`
- 평범한 알림 목록 / 검색 목록:
  - `FlatList`
- 월별 기록 / 카테고리 grouped history:
  - `SectionList`
- 홈 피드 / 카드 피드 / 긴 타임라인 / AI thread:
  - `LegendList` 또는 `FlashList`

## 관련 규칙

- [`list-performance-virtualize`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-virtualize.md)
- [`list-performance-item-memo`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-item-memo.md)
- [`list-performance-item-types`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-item-types.md)
- [`ui-safe-area-scroll`](../../../../.agents/skills/vercel-react-native-skills/rules/ui-safe-area-scroll.md)


## 스킬 추출 후보

### 트리거

- 화면에 어떤 스크롤 primitive를 써야 할지 빠르게 고르고 싶을 때

### 권장 기본값

- 작은 정적 화면은 `ScrollView`, 일반 flat feed는 `FlatList`, 그룹화된 데이터는 `SectionList`를 기본 baseline으로 본다.
- 아이템 수와 스크롤 성능 요구가 크면 `LegendList`나 `FlashList`도 함께 검토한다.
- 한 화면의 주된 스크롤 primitive는 하나를 먼저 고정한다.

### 레거시 안티패턴

- 데이터 shape와 성능 요구를 보지 않고 무조건 `ScrollView`로 시작하기
- virtualized list 안에 또 큰 virtualized list를 무심코 중첩하기

### 예외 / 선택 기준

- 가로 media row 같은 작은 보조 리스트는 root list 안의 nested horizontal list로 허용될 수 있다.

### 현재식 코드 스케치

```tsx
if (isGrouped) return <SectionList sections={sections} />;
if (isHugeFeed) return <FlashList data={items} renderItem={renderItem} />;
return <FlatList data={items} renderItem={renderItem} />;
```

### 스킬 규칙 초안

- "스크롤 primitive는 데이터 shape와 성능 요구에 따라 `ScrollView`, `FlatList`, `SectionList`, `LegendList/FlashList`를 구분해 고른다."

## 관련 페이지

- [스크롤, 캐싱, 업로드, 서버 상태 발전 흐름 | Scroll, Caching, Upload, and Server-State Evolution](rn-scroll-cache-upload-query-evolution.md)
- [native safe area in tabs](native-safe-area-in-tabs.md)
