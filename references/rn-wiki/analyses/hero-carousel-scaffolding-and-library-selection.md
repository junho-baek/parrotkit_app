# 히어로 캐러셀 스캐폴딩과 라이브러리 선택 | Hero Carousel Scaffolding and Library Selection

## 범위

- `nomadcoders/noovies`의 2021-09-20 커밋 `ee41a35` (`2.2 Movies Screen part One`)를 현재 Expo / React Native 기준으로 다시 읽는다.
- 특히:
  - 당시 `react-native-web-swiper`를 왜 썼는지
  - 지금 swiper / carousel / pager를 어떤 기준으로 고르는지
  - 현재 best practice는 무엇인지
  를 함께 정리한다.

## 레거시 커밋이 실제로 한 것

- `react-native-web-swiper`를 dependency에 추가했다.
- `Movies.tsx` 안에서:
  - `styled.ScrollView`를 root container로 뒀다
  - `Dimensions.get("window")`로 screen height를 읽었다
  - `Swiper`를 autoplay(`timeout={3.5}`), loop, custom height와 함께 붙였다
  - slide 안에는 실제 영화 카드 대신 빨강/파랑 placeholder view를 넣었다
- `getNowPlaying()`라는 fetch 함수와 API key를 컴포넌트 안에 적었지만, 아직 실제 데이터 연결은 하지 않았다.

즉 이 단계는:

- "영화 화면 상단에 hero swiper를 먼저 꽂아둔다"
- "실제 데이터 연결은 다음 단계로 미룬다"

에 가까운 scaffold 커밋이다.

## 이 커밋이 당시 설명하려던 것

- 영화 앱 메인 화면에 흔한 "상단 hero banner slider"를 먼저 배치한다
- autoplay와 loop가 되는 swiper를 손쉽게 올린다
- 나중에 TMDB now playing 데이터를 여기에 연결할 준비를 한다

## 지금 기준으로 바꿔 읽어야 할 부분

### 1. `react-native-web-swiper`는 현재 기본값이라기보다 옛 선택지에 가깝다

- npm 페이지 기준 `react-native-web-swiper`는 7개월 전 크롤링 시점에 마지막 publish가 3년 전으로 보인다.
- 당시에는 Expo / React Native Web까지 함께 염두에 둔 단순 swiper로 쓸만했지만, 지금 RN 모바일 앱의 기본 추천이라고 보긴 어렵다.

이 문장은 npm package metadata를 기반으로 한 해석이다.

### 2. 데이터 fetch를 컴포넌트 안 수동 함수로 두는 건 현재식이 아니다

- 레거시 코드는 `getNowPlaying()`를 컴포넌트 안에 두고 inline `fetch`를 했다.
- 지금은 보통:
  - API 함수는 `features/.../api`
  - 읽기는 TanStack Query `useQuery`
  - API key는 env 또는 서버 프록시
  로 나눈다.

### 3. hard-coded API key는 학습용으론 이해되지만 현재 기본값은 아니다

- 학습용 public movie API 예제에선 흔하지만
- 지금 실무 기준에선:
  - `EXPO_PUBLIC_*` 환경 변수
  - 또는 서버/edge route를 통한 proxy
  가 더 자연스럽다.

## 현재 swiper / carousel / pager를 고르는 기준

이제는 "swiper 하나"로 다 풀기보다, 용도별로 나눠 고르는 편이 좋다.

### A. 온보딩처럼 페이지 단위 전체 화면 이동

- 추천:
  - `react-native-pager-view`
- 이유:
  - Android는 `ViewPager`
  - iOS는 `UIPageViewController`
  기반이라서 "페이지 넘김" 자체를 네이티브 구현으로 탄다.

즉:

- full-screen pages
- step-based onboarding
- 탭과 비슷한 page container

에는 pager가 더 자연스럽다.

### B. 영화/상품 hero 배너처럼 카드형 carousel

- 추천:
  - `react-native-reanimated-carousel`
- 이유:
  - Expo 호환
  - Reanimated 기반
  - snapping, gesture, custom animation, autoplay를 비교적 부드럽게 제공

즉:

- 상단 hero banner
- poster carousel
- card slider
- parallax / stack / scale 애니메이션

에는 현재 가장 자연스러운 기본값에 가깝다.

### C. 아주 단순한 수평 스냅 목록

- 추천:
  - horizontal `FlatList` 또는 `FlashList`
  - 필요하면 `pagingEnabled`, `snapToInterval`
- 이유:
  - 의존성이 적다
  - 데이터 목록과 virtualization을 자연스럽게 함께 가져간다

즉:

- 진짜 "carousel library"가 필요한지 먼저 따져보고
- 단순 slider면 list 기반 snapping으로 끝내는 편이 더 단순할 수 있다.

## `vercel-react-native-skills` 기준 해석

- 이 스킬에는 swiper 전용 규칙은 없지만, 관련 원칙은 분명하다.
- 핵심은:
  - 긴 리스트는 virtualize
  - 애니메이션은 GPU-friendly property 중심
  - 이미지엔 `expo-image`

현재 swiper/carousel에 대입하면:

- 배너가 실제 목록 데이터라면 `FlashList` 기반 수평 스냅도 충분히 좋은 선택
- richer animation이 필요하면 Reanimated 기반 carousel이 더 잘 맞음
- 슬라이드 안 이미지도 RN `Image`보다 `expo-image`가 자연스럽다

관련 규칙:

- [`list-performance-virtualize`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-virtualize.md)
- [`animation-gpu-properties`](../../../../.agents/skills/vercel-react-native-skills/rules/animation-gpu-properties.md)
- [`ui-expo-image`](../../../../.agents/skills/vercel-react-native-skills/rules/ui-expo-image.md)

## 2026 기본 추천

### 영화 앱 상단 hero 배너를 만든다면

- 데이터:
  - TanStack Query로 `now playing` query
- 이미지:
  - `expo-image`
- carousel:
  - `react-native-reanimated-carousel`
- slide content:
  - backdrop image + gradient overlay + title + CTA

### 단순 onboarding이라면

- `react-native-pager-view`

### 의존성을 늘리기 싫고 단순 snap이면

- horizontal `FlashList`
- `pagingEnabled` 또는 `snapToInterval`

## 현재 워크스페이스에 대한 결론

- 레거시 `ee41a35` 커밋의 핵심 의도인 "상단 영화 swiper를 먼저 깐다"는 흐름은 지금도 이해하기 쉽다.
- 하지만 현재 `nomad-diary` 같은 Expo 앱에 그대로 복사할 기본값은 아니다.
- 지금식으로 바꾸면:
  - data fetch는 query layer로 분리
  - 이미지엔 `expo-image`
  - hero carousel이면 `react-native-reanimated-carousel`
  - full-page swiper면 `react-native-pager-view`
  - 정말 단순하면 list snapping

## 한 줄 판단 기준

- page 전환이냐 -> `PagerView`
- hero/card carousel이냐 -> `react-native-reanimated-carousel`
- 단순 snap list냐 -> `FlashList` / `FlatList`


## 스킬 추출 후보

### 트리거

- 홈 상단 hero carousel 라이브러리와 구조를 고를 때

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

- "hero carousel은 제품 요구에 맞는 라이브러리를 고르되 root feed virtualization과 분리해서 본다."

## 관련 페이지

- [스크롤, 캐싱, 업로드, 서버 상태 발전 흐름 | Scroll, Caching, Upload, and Server-State Evolution](rn-scroll-cache-upload-query-evolution.md)
- [Expo TypeScript 전환과 내비게이션 타이핑](expo-typescript-migration-and-navigation-typing.md)

## 참고 링크

- [react-native-web-swiper on npm](https://www.npmjs.com/package/react-native-web-swiper)
- [React Native Reanimated Carousel](https://rn-carousel.dev/)
- [react-native-pager-view](https://github.com/callstack/react-native-pager-view)
- [React Native ScrollView](https://reactnative.dev/docs/scrollview)
- [React Native FlatList](https://reactnative.dev/docs/flatlist)
