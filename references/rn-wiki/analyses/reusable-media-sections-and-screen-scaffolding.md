# 미디어 섹션 재사용과 화면 스캐폴딩 | Reusable Media Sections and Screen Scaffolding

## 범위

- `nomadcoders/noovies`의 2021-09-22 커밋 `6e6f418` (`2.16 TV Screen part One`)을 계기로,
  React Native / TanStack Query 앱에서:
  - 가로 미디어 섹션을 어떻게 공용화하는지
  - screen skeleton을 어떤 조합으로 빠르게 세우는지
  - 공용 `Loader`, 공용 section list, API namespace 추출을 어디까지 재사용해야 하는지
를 현재 기준으로 다시 정리한다.

## 짧은 결론

- 이 커밋의 핵심은 "영화 화면에서 쓰던 패턴을 TV 화면으로 복제 가능하게 만드는 공용 조각이 생겼다"는 점이다.
- 현재도 그 방향은 맞다.
- 다만 지금은:
  - `HList` 같은 공용 section은 `any[]`보다 typed generic 또는 normalized media model을 받고
  - `original_title ?? original_name` 같은 필드 차이는 화면이 아니라 mapper / model에서 정리하며
  - root `ScrollView` + 내부 여러 horizontal `FlatList`보다, 더 이른 virtualized root 구조를 선호하는 편이 current best practice에 가깝다.

## 레거시 커밋이 실제로 한 것

- `api.ts`에서:
  - `moviesApi`
  - `tvApi`
처럼 도메인별 API namespace를 만들었다.
- `components/Loader.tsx`를 추출했다.
- `components/HList.tsx`를 새로 만들어:
  - 제목
  - horizontal `FlatList`
  - `VMedia`
렌더링을 공용화했다.
- `Movies.tsx`는 `Trending Movies` row를 `HList`로 치환했다.
- `Tv.tsx`는:
  - `today`
  - `top`
  - `trending`
세 query를 불러오고,
  세 개의 horizontal row를 빠르게 붙였다.

즉 이 커밋은 "새 카테고리 화면을 붙일 수 있는 공용 화면 부품"이 생긴 단계다.

## 이때의 핵심 개념

### 1. API를 화면별 함수가 아니라 도메인 namespace로 묶는다

- `moviesApi`
- `tvApi`

처럼 묶으면서, 화면이 fetch URL을 직접 알 필요가 없어졌다.

이건 query layer를 feature 단위로 읽기 시작하는 좋은 전환이다.

### 2. 로더를 공용 fallback으로 뽑는다

- `Loader.tsx`를 뽑으면서
  각 화면의 첫 loading branch가 단순해졌다.

즉 화면이:
  - 데이터 orchestration
  - fallback branching
  - actual section layout

로 조금 더 분리되기 시작했다.

### 3. horizontal 미디어 row를 공용 section으로 추출한다

- `HList`는:
  - title
  - horizontal list
  - poster/title/rating 카드
를 한 단위로 재사용하게 만든다.

즉 이 커밋은 "UI 반복을 복붙 대신 section abstraction으로 바꾼 단계"다.

### 4. Movies와 TV가 사실상 같은 화면 구조라는 걸 드러낸다

- hero / category rows / loading / query 조합은 그대로인데
- domain 데이터만 달라진다는 점이 보이기 시작했다.

이건 나중에:
  - media domain
  - shared list section
  - shared card

같은 구조로 더 정리할 수 있음을 보여준다.

## 지금 봐도 좋은 점

- `moviesApi`, `tvApi`로 도메인 API를 묶은 점
- 공용 `Loader`를 뽑은 점
- 반복되는 horizontal row를 `HList`로 추출한 점
- 영화/TV 화면이 같은 구조를 재사용할 수 있음을 드러낸 점

이 네 가지는 지금 봐도 좋다.

## 현재 기준으로 바꿔 읽어야 할 점

### 1. `HList`의 `data: any[]`는 현재식이 아니다

- 재사용 컴포넌트를 만든 방향은 맞다.
- 하지만 `any[]`는 공용화의 장점을 크게 깎는다.

현재식으론 보통 둘 중 하나다.

- `HList<T>` generic + `renderItem`
- `MediaListSection`이 `NormalizedMediaItem[]`를 받음

즉 "공용화"와 "타입 안전성"을 같이 가야 한다.

### 2. `original_title ?? original_name`는 model 정규화 신호다

- 영화는 `original_title`
- TV는 `original_name`

처럼 필드 이름이 다르다.
- `HList` 안에서 `??`로 처리한 건 당장 동작은 하지만,
  현재식으론 보통:
  - API mapper
  - domain model
  - select 함수

에서 `displayTitle` 같은 공통 필드로 먼저 정리한다.

즉 shared UI는 가능한 한:
  - `title`
  - `posterPath`
  - `voteAverage`

같이 이미 normalize된 값을 받는 편이 낫다.

### 3. `Loader` 추출은 맞지만, fallback boundary를 더 일찍 세우는 편이 좋다

- `Loader` 컴포넌트 자체는 좋다.
- 현재식으론 여기서 한 단계 더 가서:
  - `if (isPending) return <Loader />`
  - `if (isError) return <ErrorState />`
  - `if (!data) return <EmptyState />`

같이 boundary를 명확히 세우는 편이 좋다.

즉 `Loader`는 출발점이고, screen boundary 설계가 뒤따라야 한다.

### 4. root `ScrollView` + 내부 여러 horizontal `FlatList`는 과도기 구조다

- TV 화면에 row 3개 정도면 동작은 충분하다.
- 하지만 현재 `vercel-react-native-skills` 기준으로는,
  row도 list이고 root도 list로 보는 편이 더 current하다.

즉 현재식이면 보통:

- root vertical = `FlashList` 또는 적절한 root list
- 각 row = horizontal list section

쪽을 더 빨리 본다.

### 5. `react-native-gesture-handler`의 `FlatList` / `ScrollView`는 현재 기본값은 아니다

- 이 커밋은 `react-native-gesture-handler`에서 `FlatList`, `ScrollView`를 가져온다.
- Gesture Handler 문서는 이런 wrapped native components를 제공하지만,
  old API 문맥에 가깝고 별도 제스처 interop 이유가 있을 때 의미가 커진다.
- 현재 기본 list/scroll 시작점은 보통 core `react-native`의 `FlatList` / `ScrollView`다.

즉 지금 기준으론:
  - gesture-specific 이유가 없으면 core components
  - 스크롤 안 press interaction이 중요하면 RNGH `Pressable` 같은 선택지

로 읽는 편이 더 자연스럽다.

### 6. 공용 section은 "범용"보다 "도메인 aware shared"가 낫다

- `HList`는 편하지만 너무 generic하면 다시 `any`, `??`, ad-hoc field access가 쌓인다.
- 현재식으론:
  - `MediaHorizontalSection`
  - `MovieHorizontalSection`
  - `TvHorizontalSection`

처럼 이름만 봐도 책임이 보이는 abstraction이 더 낫다.

즉 "shared"는 필요하지만, "너무 generic"한 shared는 다시 부채가 된다.

## 현재의 핵심 개념

### 1. 화면 복제보다 section abstraction이 먼저다

- 비슷한 화면이 두 개 생기면
  route 전체를 generic하게 만들기보다
  반복 section부터 추출하는 편이 좋다.

### 2. shared UI는 normalize된 view model을 받는 편이 낫다

- 영화와 TV처럼 source shape가 다르면,
  shared component 내부에서 원본 필드를 직접 뒤섞기보다
  mapper 단계에서 공통 view model로 바꿔 넘기는 편이 좋다.

### 3. 공용 로더는 좋지만, boundary 컴포넌트 설계가 더 중요하다

- 로더 하나를 빼는 것보다:
  - loading
  - error
  - empty

의 세 갈래를 어디서 나눌지 먼저 정하는 게 더 current하다.

### 4. list는 row 하나도 list다

- horizontal row도 list 성능 설계 대상이다.
- 현재식에선 root와 row 둘 다 virtualization 관점으로 본다.

## `vercel-react-native-skills` 기준 해석

- 이 커밋은 다음 규칙들과 잘 연결된다.
  - `list-performance-virtualize`
  - `list-performance-item-memo`
  - `list-performance-callbacks`
  - `list-performance-images`
- shared section을 만든 방향은 좋지만,
  현재식으론:
  - stable renderItem
  - primitive props
  - 가벼운 이미지
  - root list virtualization

까지 함께 보는 편이 더 낫다.

## 현재 워크스페이스에 대한 추천

- `nomad-diary`에서 비슷한 media row를 공용화한다면:
  - `features/.../components/media-horizontal-section.tsx`
  - `features/.../model/normalized-media-item.ts`
같이 두는 편이 좋다.
- `HList` 같은 공용 컴포넌트는:
  - `any[]` 금지
  - normalize된 item shape 또는 generic + renderItem
  - image fallback 일원화
로 설계하는 편이 낫다.
- `Loader`는 계속 공용화해도 좋지만, 다음 단계는 `ErrorState` / `EmptyState`까지 세트로 보는 게 좋다.

## 관련 문서

- [가로 미디어 행과 홈 피드 확장](horizontal-media-rows-and-home-feed-expansion.md)
- [API 응답 타입과 Nullable 미디어 필드 처리](api-response-typing-and-nullable-media-fields.md)
- [React Query와 현재 데이터 패칭 베스트 프랙티스](react-query-and-data-fetch-best-practices.md)

## 참고

- [React Native FlatList](https://reactnative.dev/docs/flatlist.html)
- [React Native Gesture Handler About Handlers](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/gesture-handlers/about-handlers)
- [TanStack Query Query Options](https://tanstack.com/query/latest/docs/react/guides/query-options)

## 스킬 추출 후보

### 트리거

- 영화/TV처럼 비슷한 화면을 공용 section과 loader로 빠르게 세워야 할 때

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

- "공용 media section은 generic model을 받고, 화면 스캐폴딩은 root virtualization을 먼저 고려한다."

