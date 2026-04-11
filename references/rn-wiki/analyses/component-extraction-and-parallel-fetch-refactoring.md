# 컴포넌트 추출과 병렬 fetch 리팩터링 | Component Extraction and Parallel Fetch Refactoring

## 범위

- `nomadcoders/noovies`의 2021-09-20 커밋 `6b7e702` (`2.5 Refactor`)를 현재 Expo / React Native 기준으로 다시 읽는다.
- 특히:
  - `Poster.tsx`, `Slide.tsx` 컴포넌트 분리
  - `Movies.tsx`에서 다중 fetch를 묶은 점
  - props 이름과 React Native의 text rendering 에러 맥락
  - 지금 기준의 더 나은 분리 방향
  를 함께 정리한다.

## 레거시 커밋이 실제로 한 것

- `components/Poster.tsx`를 새로 만들어 poster 이미지를 분리했다.
- `components/Slide.tsx`를 새로 만들어:
  - backdrop
  - blur overlay
  - poster
  - title / votes / overview
  를 한 컴포넌트로 묶었다.
- `Movies.tsx`에서는 반복되던 hero slide markup을 제거하고 `<Slide ... />`로 치환했다.
- `Movies.tsx` 안에서:
  - `getTrending`
  - `getUpcoming`
  - `getNowPlaying`
  세 함수를 만들고,
  - `Promise.all([...])`로 한 번에 받아오게 바꿨다.

즉 이 단계는:

- "화면 안에 뭉쳐 있던 hero UI를 재사용 가능한 조각으로 나눈다"
- "여러 API 요청을 동시에 보낸다"

라는 리팩터링 단계다.

## 이 커밋이 당시 설명하려던 것

- 커지는 `Movies.tsx`를 조금 더 읽기 쉬운 형태로 나눈다
- slide UI를 독립 컴포넌트로 빼서 재사용성과 가독성을 높인다
- 한 화면에서 여러 movie category를 동시에 준비할 기반을 만든다

즉 "기능 추가보다 구조 정리"가 핵심인 커밋이다.

## 지금 봐도 좋은 점

### 1. `Slide`와 `Poster`로 UI를 분리한 점

- 역할 단위 분리는 지금도 맞는 방향이다.
- 특히 slide 전체를 한 컴포넌트로 분리하면서 `Movies.tsx`가 훨씬 읽기 쉬워졌다.

### 2. 병렬 fetch를 도입한 점

- `Promise.all`로 독립 API 요청을 동시에 보내는 생각은 지금도 유효하다.
- 순차 fetch보다 초기 표시 시간이 짧아질 수 있다.

### 3. 데이터 전달을 명시적 props로 바꾼 점

- `Slide`에 필요한 값을 props로 넘기는 방식 자체는 좋은 방향이다.
- 지금 기준으로도 "화면 컨테이너는 데이터 orchestration, 자식은 표시" 분리는 맞다.

## 지금 기준으로 바꿔 읽어야 할 점

### 1. 분리는 맞지만 위치가 더 도메인화되어야 한다

- 레거시 구조는 `components/Poster.tsx`, `components/Slide.tsx`처럼 app-wide common처럼 보이는 위치에 둔다.
- 지금 기준으론 이 둘은 범용 UI가 아니라 "movies hero feature"에 가까운 컴포넌트다.

즉 현재식이면 보통:

```text
features/
  movies-hero/
    components/
      movie-hero-slide.tsx
      movie-poster.tsx
```

처럼 feature 안으로 넣는 편이 더 자연스럽다.

### 2. `Slide`는 아직 너무 많은 책임을 가진다

- backdrop
- blur
- layout
- poster image
- title formatting
- vote formatting
- overview truncation

을 한 파일이 다 맡고 있다.

현재식으로는 보통:

- `movie-hero-slide`
- `movie-poster`
- `movie-rating`
- `movie-overview`

까지 무조건 쪼개진 않더라도, 최소한 image layer와 text content layer 정도는 나눌 여지가 있다.

### 3. 다중 fetch는 `Promise.all + useEffect`보다 query 병렬 조합이 기본값이다

- 레거시 구현은:
  - 함수 3개
  - `Promise.all`
  - `setLoading(false)`
  구조다.
- 현재 기준으로는:
  - `useNowPlayingQuery`
  - `useTrendingMoviesQuery`
  - `useUpcomingMoviesQuery`
  - 또는 `useQueries`
  로 읽는 편이 더 자연스럽다.

즉 병렬화의 의도는 좋지만, 관리 계층은 지금 달라졌다.

### 4. `Slide` props는 primitive 중심으로 유지하는 편이 좋다

- 이 커밋은 실제로 primitive props를 넘기고 있어서 오히려 지금 기준에 더 가까운 편이다.
- `vercel-react-native-skills`도 list/item 컴포넌트엔 object 전체보다 primitive props를 권장한다.

즉 이 커밋은:

- 리팩터링 위치는 더 feature-oriented로 바꿔야 하지만
- props shape는 의외로 좋은 방향이었다

라고 읽을 수 있다.

### 5. `title` prop 이름 충돌 메모는 충분히 실전적이다

사용자 메모:

- `Slide` 컴포넌트에 `title` prop을 줄 때
- `Text strings must be rendered within a component.` 에러가 났고
- `movieTitle`로 바꾸니 해결됐다고 했다

현재 관점에서 보면:

- React Native의 그 에러 자체는 "문자열이 `<Text>` 밖에 직접 렌더됨"일 때 나는 에러다.
- `vercel-react-native-skills`에도 [`rendering-text-in-text-component`](../../../../.agents/skills/vercel-react-native-skills/rules/rendering-text-in-text-component.md) 규칙이 있다.
- `title`이라는 prop 이름이 무조건 문제라는 뜻은 아니다.
- 다만 styled-components, navigator options, 또는 다른 곳의 `title`과 겹치면서 실수로 문자열이 잘못 흘러간 상황일 가능성은 충분히 있다.

현재식 해석:

- `movieTitle`처럼 더 구체적인 prop 이름으로 바꾸는 건 오히려 좋은 습관이다
- 특히 LLM과 사람 모두가 읽기 쉽게 하려면 `title`보다 `movieTitle`, `posterPath`, `backdropPath`가 더 낫다

즉 "우연히 고쳐졌다"기보다, naming 명확화가 구조적으로도 더 좋은 방향으로 이어진 셈이다.

## `vercel-react-native-skills` 기준 해석

- 직접 연결되는 규칙:
  - [`rendering-text-in-text-component`](../../../../.agents/skills/vercel-react-native-skills/rules/rendering-text-in-text-component.md)
  - [`list-performance-item-memo`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-item-memo.md)
  - [`list-performance-callbacks`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-callbacks.md)

이 커밋을 현재식으로 다시 읽으면:

- 분리 자체는 맞음
- props는 primitive가 더 유리
- naming은 더 구체적으로 갈수록 좋음
- 나중에 carousel/list item으로 확장되면 memoization-friendly 구조가 된다

## 2026 기본 추천

### 구조

- route file:
  - query orchestration
  - loading/error branching
- feature component:
  - hero section
  - slide
  - poster

즉:

- route -> feature section -> leaf UI

3단계로 나누는 편이 자연스럽다.

### 파일 배치

```text
features/
  movies/
    api/
      get-now-playing.ts
      get-trending-movies.ts
      get-upcoming-movies.ts
    hooks/
      use-now-playing-query.ts
      use-trending-movies-query.ts
      use-upcoming-movies-query.ts
    components/
      movie-hero-section.tsx
      movie-hero-slide.tsx
      movie-poster.tsx
```

### props naming

- `title`보다 `movieTitle`
- `path`보다 `posterPath`
- `voteAverage`, `overview`, `backdropPath`처럼 role이 드러나는 이름

이 naming은 LLM과 사람 둘 다 읽기 쉽다.

### fetch

- `Promise.all`보다 query 병렬 조합
- query key 분리
- 각 category loading/error를 독립 제어

## 이전 단계들과의 연결

- `34d8eac`:
  - 실제 데이터와 blur overlay를 붙인 단계
- `9e2d5ec`:
  - hero 내용을 richer card로 확장
- `6b7e702`:
  - 그 hero 구조를 컴포넌트 단위로 분리하고, category fetch를 병렬화

즉:

- part two/three는 UI 밀도 증가
- refactor는 구조 분해와 데이터 orchestration 정리

## 현재 워크스페이스에 대한 결론

- 이 커밋의 핵심 리팩터링 의도는 지금도 유효하다.
- 특히:
  - 컴포넌트 분리
  - primitive props
  - 구체적인 prop naming
  는 현재식에도 잘 맞는다.
- 다만 현재 기준으로는:
  - `components/`보단 `features/.../components/`
  - `Promise.all + setState`보단 query layer
  - `Poster`, `Slide`도 domain-aware naming
  으로 한 단계 더 가는 편이 좋다.


## 스킬 추출 후보

### 트리거

- 커지는 홈 화면에서 hero UI와 fetch 로직을 동시에 정리해야 할 때

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

- "반복 hero UI는 공용 primitive로 추출하고, 여러 초기 fetch는 query layer나 병렬 API 경계에서 묶는다."

## 관련 페이지

- [리치 히어로 카드와 테마 적응, Expo tsconfig](rich-hero-cards-theme-adaptation-and-expo-tsconfig.md)
- [Expo Router 도메인 중심 파일 구조 메모 | Expo Router Domain File Organization](expo-router-domain-file-organization.md)
- [데이터 기반 히어로 화면과 블러 오버레이](data-driven-hero-screen-and-blur-overlay.md)

## 참고 링크

- [Wrap Strings in Text Components](../../../../.agents/skills/vercel-react-native-skills/rules/rendering-text-in-text-component.md)
- [Pass Primitives to List Items for Memoization](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-item-memo.md)
