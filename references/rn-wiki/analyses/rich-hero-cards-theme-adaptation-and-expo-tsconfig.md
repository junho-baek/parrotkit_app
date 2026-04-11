# 리치 히어로 카드와 테마 적응, Expo tsconfig | Rich Hero Cards, Theme Adaptation, and Expo tsconfig

## 범위

- `nomadcoders/noovies`의 2021-09-20 커밋 `9e2d5ec` (`2.4 Movies Screen part Three`)를 현재 Expo / React Native 기준으로 다시 읽는다.
- 특히:
  - `react-native-web-swiper`에서 `react-native-swiper`로 교체한 의미
  - hero slide를 poster + text column 레이아웃으로 확장한 점
  - `useColorScheme()` 기반 theme 대응
  - `tsconfig.json`에 `expo/tsconfig.base`를 붙인 변화
  를 현재 best practice와 비교한다.

## 레거시 커밋이 실제로 한 것

- swiper 라이브러리를 `react-native-web-swiper`에서 `react-native-swiper`로 교체했다.
- `Movies.tsx`에서:
  - `useColorScheme()`로 dark mode 여부를 읽음
  - `BlurView`에 `tint`와 더 높은 `intensity`를 적용
  - backdrop 위에 poster + title + vote + overview를 함께 보여주는 hero 레이아웃을 만듦
  - `showButtons={false}`, `showsPagination={false}`, `autoplay` 등 API에 맞게 swiper props를 재조정
  - `movie.overview.slice(0, 100)`로 설명을 잘라서 카드 밀도를 맞춤
- `Appearance`를 import 했지만 실제로 쓰진 않았다.
- `tsconfig.json`은 `expo/tsconfig.base`를 extend 하도록 바뀌었다.

즉 이 단계는:

- "hero 배너를 진짜 콘텐츠 카드로 다듬는다"
- "테마에 맞춰 blur/text 색을 조정한다"
- "TypeScript 설정도 Expo 쪽 기본값으로 한 발 옮긴다"

에 가깝다.

## 이 커밋이 당시 설명하려던 것

- swiper 안에 단순 제목만 두는 수준을 넘어서
- 영화 poster, 평점, overview를 같이 보여주는 richer hero layout을 만든다
- 다크/라이트 환경에 맞춰 텍스트 가독성과 blur tint를 조정한다

즉 "영화 화면의 상단 hero가 제품다운 모습"으로 바뀌는 단계다.

## 지금 봐도 좋은 방향

### 1. `useColorScheme()`로 UI를 분기한 점

- 현재도 아주 자연스러운 기본값이다.
- 다만 지금은 local boolean 하나로 텍스트 색을 직접 분기하기보다, theme token에서 파생시키는 편이 더 유지보수에 좋다.

### 2. hero에 poster + text column을 함께 둔 점

- 단순 backdrop-only보다 정보 밀도가 훨씬 좋아졌다.
- 영화/콘텐츠 앱 hero에서 지금도 흔히 쓰는 구조다.

### 3. `tsconfig.json`에서 `expo/tsconfig.base`를 extend 한 점

- 이건 현재 기준으로도 맞는 방향이다.
- 이전 레거시 `tsconfig.json`보다 지금식 Expo TypeScript 설정에 더 가까워진 변화다.

즉 이 커밋 안에서 가장 "현재식에 가까워진 부분" 중 하나가 이 설정 변경이다.

## 지금 기준으로 바꿔 읽어야 할 점

### 1. `react-native-swiper`도 지금 기본값이라기보다 옛 선택지에 가깝다

- npm metadata 기준 `react-native-swiper`는 마지막 publish가 5년 전이다.
- 즉 `react-native-web-swiper`에서 `react-native-swiper`로 바꾼 건 당시엔 현실적인 개선이었지만, 지금 새 Expo 앱의 기본 추천이라고 보기는 어렵다.

현재 기준 선택은 여전히:

- full-page onboarding: `react-native-pager-view`
- hero/card carousel: `react-native-reanimated-carousel`
- 단순 snap: horizontal `FlashList` / `FlatList`

### 2. fetch 구조는 여전히 컴포넌트 내부 수동 fetch다

- `part two`와 마찬가지로 읽기 데이터는 아직 `useState + useEffect + fetch` 구조다.
- 현재 기준으로는:
  - API layer
  - query hook
  - `useQuery`
  로 분리하는 편이 기본값이다.

### 3. 이미지 계층은 `styled.Image`보다 `expo-image`가 더 자연스럽다

- backdrop와 poster 둘 다 현재 기준으론 `expo-image`가 더 적합하다.
- 특히:
  - backdrop는 `contentFit="cover"`
  - poster는 적정 width의 compressed source
  - `transition`
  - `cachePolicy`
  를 주면 더 현재식이다.

`vercel-react-native-skills`도 image 기본값으로 `expo-image`를 권장한다.

### 4. blur는 "정보 가독성용 기본값"이라기보다 "스타일 옵션"에 가깝다

- 이 커밋은 poster와 텍스트 전체를 `BlurView` 위에 올렸다.
- 지금 기준으로는:
  - 텍스트 가독성 목적이면 `LinearGradient` / tint overlay / text shadow가 기본값
  - glass감이 제품 정체성에 중요하면 `BlurView`
  로 읽는 편이 자연스럽다.

특히 Expo BlurView 문서 기준으로:

- Android는 지금 안정화되었지만 추가 API가 있다
- dynamic content 렌더 순서에 따라 blur update 이슈가 있다

그래서 hero 전체 blur를 기본값으로 잡기보다는 선택형 효과로 두는 쪽이 안전하다.

### 5. 텍스트 잘라내기는 `slice()`보다 layout-aware 방식이 더 낫다

- `movie.overview.slice(0, 100)`는 단순하고 이해하기 쉽지만
- 지금 기준에선:
  - `numberOfLines`
  - `ellipsizeMode`
  - layout width에 맞춘 text component
  가 더 자연스럽다.

이유:

- 글자 수가 화면 폭과 항상 맞지 않음
- 언어별 줄바꿈과 자름 위치가 어색할 수 있음

### 6. `Appearance` unused import는 지금 기준으론 바로 정리 대상이다

- 레거시 학습 흐름에선 넘어가도 되지만
- 현재식으론 dead import는 바로 걷는 편이 맞다.

## `vercel-react-native-skills` 기준 해석

- 직접 연결되는 규칙:
  - [`ui-expo-image`](../../../../.agents/skills/vercel-react-native-skills/rules/ui-expo-image.md)
  - [`list-performance-images`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-images.md)
  - [`ui-safe-area-scroll`](../../../../.agents/skills/vercel-react-native-skills/rules/ui-safe-area-scroll.md)

이 커밋을 이 기준으로 다시 읽으면:

- backdrop/poster는 `expo-image`
- poster thumbnail은 표시 크기에 맞는 적정 해상도
- root scroll이 계속 살아 있다면 `contentInsetAdjustmentBehavior="automatic"` 검토
- hero 화면이 길어질수록 vertical root virtualization으로 갈 준비를 해야 함

## 2026 기본 추천

### 영화 hero card를 만든다면

- carousel:
  - `react-native-reanimated-carousel`
- data:
  - `useQuery`
- images:
  - `expo-image`
- overlay:
  - 기본값은 `LinearGradient`
  - 특별히 glass look이 중요하면 `BlurView`
- text:
  - `numberOfLines`
  - vote / subtitle는 token 기반 secondary color

### TypeScript 설정

- Expo 앱이라면 `expo/tsconfig.base` 상속은 계속 유지
- route / API / movie model 타입을 더 분리해나가는 것이 자연스럽다

### theme 처리

- `isDark` boolean을 화면마다 직접 뿌리기보다
- `theme.colors.text.primary`, `theme.colors.text.secondary` 같은 token으로 한 단계 추상화하는 편이 좋다

## 이전 단계들과의 연결

- `ee41a35`:
  - swiper scaffold
- `34d8eac`:
  - 실제 데이터 + blur overlay
- `9e2d5ec`:
  - hero card 정보를 poster/title/votes/overview까지 확장

즉:

- part one = 컨테이너
- part two = 데이터와 시각 레이어
- part three = 카드 정보 밀도와 테마 대응 강화

## 현재 워크스페이스에 대한 결론

- 이 커밋은 UI 밀도를 높이는 과정으로서 학습 가치가 높다.
- 특히 `expo/tsconfig.base`로 옮긴 부분은 현재식에 가깝다.
- 하지만 swiper 선택, 이미지 컴포넌트, fetch 구조, blur 기본값은 지금 다시 고쳐 읽는 편이 좋다.

지금식으로 요약하면:

- swiper는 `react-native-swiper`보다 `reanimated-carousel`
- image는 RN `Image`보다 `expo-image`
- fetch는 `useQuery`
- text 가독성은 blur보다 gradient가 우선 기본값
- theme는 boolean 직접 분기보다 token화


## 스킬 추출 후보

### 트리거

- hero card 밀도와 theme 적응, Expo tsconfig 정리를 같이 해야 할 때

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

- "hero card 강화와 theme 적응은 같은 design system 문제로 보고, TypeScript 기본 설정은 Expo baseline에 맞춘다."

## 관련 페이지

- [데이터 기반 히어로 화면과 블러 오버레이](data-driven-hero-screen-and-blur-overlay.md)
- [히어로 캐러셀 스캐폴딩과 라이브러리 선택](hero-carousel-scaffolding-and-library-selection.md)
- [Expo TypeScript 전환과 내비게이션 타이핑](expo-typescript-migration-and-navigation-typing.md)

## 참고 링크

- [react-native-swiper on npm](https://www.npmjs.com/package/react-native-swiper)
- [Expo Image](https://docs.expo.dev/versions/latest/sdk/image/)
- [Expo BlurView](https://docs.expo.dev/versions/latest/sdk/blur-view/)
- [Using TypeScript - Expo docs](https://docs.expo.dev/guides/typescript/)
- [React Native Reanimated Carousel](https://rn-carousel.dev/)
