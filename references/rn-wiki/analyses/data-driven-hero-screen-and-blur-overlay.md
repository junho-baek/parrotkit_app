# 데이터 기반 히어로 화면과 블러 오버레이 | Data-Driven Hero Screen and Blur Overlay

## 범위

- `nomadcoders/noovies`의 2021-09-20 커밋 `34d8eac` (`2.3 Movies Screen part Two`)를 현재 Expo / React Native 기준으로 다시 읽는다.
- 특히:
  - 실제 데이터 fetch
  - loading 처리
  - `makeImgPath` 유틸 추출
  - `expo-blur` overlay
  - 탭 scene background 처리
  를 현재 best practice와 함께 정리한다.

## 레거시 커밋이 실제로 한 것

- `expo-blur`를 dependency에 추가했다.
- `Movies.tsx`에서:
  - `useState`, `useEffect`로 `loading`과 `nowPlaying` 상태를 직접 관리
  - `fetch(...).json()`으로 TMDB `now_playing` 데이터를 받아와 `setNowPlaying(results)`
  - 로딩 중에는 `ActivityIndicator`
  - 로딩이 끝나면 `Swiper` 안에 실제 영화 데이터를 `map`
  - 각 slide에 backdrop `Image`
  - 그 위에 `BlurView`를 전체 overlay로 씌우고 영화 제목 표시
- `makeImgPath`를 [`utils.ts`](../../utils.ts)로 뽑아 image URL 조립을 분리했다.
- `Tabs.js`에서는 `sceneContainerStyle`에 다크/라이트 배경색을 넣어 navigator와 screen background를 맞췄다.
- `ios/Podfile.lock` 변화는 `expo-blur` iOS pod가 추가된 결과다.

즉 이 단계는:

- "실제 API 데이터를 붙인다"
- "hero swiper를 진짜 영화 배너로 바꾼다"
- "로딩/배경/overlay까지 한 번에 맞춘다"

는 의미가 크다.

## 이 커밋이 당시 설명하려던 것

- placeholder swiper에서 실제 now playing 데이터를 뿌린다
- 백드롭 이미지를 깔고, 제목 가독성을 위해 blur overlay를 씌운다
- 다크 모드/라이트 모드에서 화면 배경이 어색하지 않도록 scene background도 navigator 쪽에서 맞춘다

즉 "데이터가 들어온 첫 번째 진짜 홈 화면"에 가깝다.

## 지금 기준으로 유지할 만한 점

- image URL 조립을 `makeImgPath` 같은 util로 분리한 점
- loading / data / success를 단계적으로 나누어 본 점
- scene background와 screen background를 따로 챙긴 점
- hero banner에 텍스트 가독성 overlay를 두려는 의도

## 지금 기준으로 바꿔 읽어야 할 점

### 1. `useState + useEffect + fetch`보다 query layer가 기본값이다

- 레거시 구현은 학습용으로 단순하지만, 현재 기준으로는 읽기 데이터를 컴포넌트 안에서 직접 fetch하는 쪽이 기본값은 아니다.
- 지금은 보통:
  - `features/movies/api/get-now-playing.ts`
  - `features/movies/hooks/use-now-playing-query.ts`
  - `useQuery({ queryKey, queryFn })`
  구조로 분리한다.

이유:

- cache
- retry
- stale/fresh 관리
- refetch
- loading / error state 일관성

을 같이 얻기 쉽기 때문이다.

### 2. API key는 하드코딩 대신 env 또는 proxy가 기본값이다

- 레거시처럼 `const API_KEY = "..."`는 학습용으론 이해되지만, 현재 기본값으론 아니다.
- 지금은 보통:
  - `EXPO_PUBLIC_TMDB_API_KEY`
  - 또는 server/edge proxy
  로 옮긴다.

### 3. hero 이미지는 RN `Image`보다 `expo-image`가 더 자연스럽다

- `vercel-react-native-skills`는 이미지 기본값으로 `expo-image`를 권장한다.
- hero backdrop은 transition, caching, contentFit, priority 이점이 크다.

따라서 지금식이면:

- `styled.Image`보다 `expo-image` 기반 hero image component
- `cachePolicy="memory-disk"`
- `transition`

쪽이 더 자연스럽다.

### 4. full-screen `BlurView`는 지금도 가능하지만 "기본값"은 아니다

- 레거시 구현은 backdrop 전체 위에 `BlurView`를 덮었다.
- Expo 공식 문서 기준 `BlurView`는:
  - iOS / web에선 단순
  - Android도 SDK 55+에선 안정화됐지만 추가 설정이 필요
  - dynamic content보다 먼저 렌더되면 blur update 이슈가 있을 수 있다
  - Android는 `BlurTargetView`와 `blurMethod`를 고려해야 한다

즉 지금 기준으론:

- 작은 badge / nav bar / modal glass layer에는 `BlurView`가 좋다
- hero text contrast 확보 목적이라면
  - `LinearGradient`
  - tint overlay
  - shadow
  가 더 단순하고 일관된 기본값일 수 있다

현재식 해석:

- "제목 가독성"이 목적이라면 전체 blur보다 gradient overlay가 기본값
- "glass effect 자체"가 목적일 때만 `BlurView`를 더 적극적으로 고려

### 5. root `ScrollView`는 화면이 커질수록 구조를 다시 생각해야 한다

- 이 커밋 시점에는 상단 hero만 있어서 `ScrollView`가 단순했다.
- 하지만 영화 홈은 보통:
  - hero banner
  - now playing row
  - trending row
  - top rated row
  - infinite sections
  형태로 커지기 쉽다.

그래서 현재식으로는:

- vertical root를 `FlashList` / `FlatList`
- hero carousel은 `ListHeaderComponent`

로 두는 편이 더 자연스럽다.

이건 `vercel-react-native-skills`의 virtualization 기본 원칙과도 맞다.

### 6. `sceneContainerStyle` 자체의 의도는 좋지만, 현재 구조에선 위치가 바뀔 수 있다

- 레거시 `Tabs.js`는 `sceneContainerStyle`로 scene 배경을 맞췄다.
- React Navigation에서 이 접근 자체는 지금도 이해할 수 있다.
- 다만 현재 Expo Router 구조에선:
  - theme provider
  - root layout의 `contentStyle`
  - screen/container background token

쪽으로 책임을 나누는 편이 더 자연스럽다.

즉 요지는:

- "scene background를 navigator 차원에서도 맞춘다"는 생각은 유효
- 하지만 위치는 Expo Router 구조에 맞게 바뀐다

## `vercel-react-native-skills` 기준 해석

- 직접 대응되는 규칙:
  - [`ui-expo-image`](../../../../.agents/skills/vercel-react-native-skills/rules/ui-expo-image.md)
  - [`list-performance-virtualize`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-virtualize.md)
  - [`animation-gpu-properties`](../../../../.agents/skills/vercel-react-native-skills/rules/animation-gpu-properties.md)

이 커밋을 이 기준으로 다시 읽으면:

- backdrop는 `expo-image`
- row/section이 늘어날 화면은 더 빨리 virtualize
- hero animation이 붙는다면 `transform` / `opacity` 중심
- 전체 레이아웃 recalculation이 큰 애니메이션은 피함

## 2026 기본 추천

### 영화 hero 화면이라면

- query:
  - TanStack Query `useQuery`
- image:
  - `expo-image`
- hero carousel:
  - `react-native-reanimated-carousel`
- overlay:
  - 기본값은 `LinearGradient`
  - glass effect가 목적이면 `BlurView`
- screen structure:
  - 섹션이 늘어날 가능성이 높으면 root `FlashList`
  - hero는 `ListHeaderComponent`

### loading 처리

- full-screen spinner 하나로 막기보다:
  - hero skeleton / placeholder
  - 또는 배경 레이아웃 먼저 렌더 후 부분 loading
  가 더 현대적인 UX에 가깝다

### 타입과 구조

- `Movie` 타입 정의
- query 함수와 이미지 util 분리
- env 기반 API key

## 현재 워크스페이스에 대한 결론

- 이 레거시 구현은 "데이터가 붙은 첫 진짜 hero 화면"으로서 학습 가치가 높다.
- 하지만 지금 `nomad-diary`나 새 Expo 앱에 그대로 복사할 기본값은 아니다.
- 지금식으로 바꾸면:
  - `useQuery`
  - `expo-image`
  - 필요시 `react-native-reanimated-carousel`
  - gradient overlay 우선
  - root는 장기적으로 virtualized screen 구조

## 이전 페이지와의 연결

- `ee41a35`는 swiper scaffold 단계
- `34d8eac`는 실제 데이터를 붙이고 hero 시각 레이어를 만든 단계

즉:

- part one = container/scaffold
- part two = real data + visual treatment


## 스킬 추출 후보

### 트리거

- placeholder hero를 실제 API 데이터와 이미지 overlay로 바꿔야 할 때

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

- "실제 데이터 기반 hero는 image/overlay/text 구조를 유지하되 authoritative data는 query layer에서 공급한다."

## 관련 페이지

- [히어로 캐러셀 스캐폴딩과 라이브러리 선택](hero-carousel-scaffolding-and-library-selection.md)
- [스크롤, 캐싱, 업로드, 서버 상태 발전 흐름 | Scroll, Caching, Upload, and Server-State Evolution](rn-scroll-cache-upload-query-evolution.md)
- [색상 스킴 기반 내비게이션 테마](color-scheme-driven-navigation-theming.md)

## 참고 링크

- [Expo BlurView](https://docs.expo.dev/versions/latest/sdk/blur-view/)
- [Expo Image](https://docs.expo.dev/versions/latest/sdk/image/)
- [TanStack Query Overview](https://tanstack.com/query/latest/docs/framework/react/overview)
- [TanStack Query Important Defaults](https://tanstack.com/query/v5/docs/framework/react/guides/important-defaults)
- [React Native VirtualizedList](https://reactnative.dev/docs/virtualizedlist)
- [React Native Reanimated Carousel](https://rn-carousel.dev/)
