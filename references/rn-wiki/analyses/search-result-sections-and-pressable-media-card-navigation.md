# 검색 결과 섹션과 프레서블 미디어 카드 내비게이션 | Search Result Sections and Pressable Media Card Navigation

## 범위

- `nomadcoders/noovies`의 2021-09-22 커밋 `14928ee` (`2.20 Search part Three`)를 계기로,
  React Native / React Navigation / TanStack Query 앱에서:
  - 검색 결과를 화면 섹션으로 어떻게 보여주는지
  - 공용 미디어 카드를 어떻게 눌리게 만드는지
  - 검색 결과에서 detail screen으로 가는 내비게이션을 어디에 연결하는지
를 현재 기준으로 다시 정리한다.

## 짧은 결론

- 이 커밋의 핵심은 "검색 결과가 실제 화면 섹션이 되고, 공용 미디어 카드가 detail 진입점이 되기 시작했다"는 점이다.
- 현재도 이 방향은 맞다.
- 다만 지금은:
  - `TouchableOpacity` / `TouchableWithoutFeedback`보다 `Pressable`
  - `navigate("Stack", { screen: "Detail" })`만 하지 말고 최소 식별자 params까지 함께 전달
  - 재사용 카드 UI와 내비게이션 책임을 더 느슨하게 분리
  - 검색 결과가 커지면 `ScrollView + HList`보다 sectioned virtualized list

쪽으로 읽는 편이 더 current best practice에 가깝다.

## 레거시 커밋이 실제로 한 것

- `Search.tsx`가 실제 검색 결과를 렌더하기 시작했다.
  - 로딩 중엔 `Loader`
  - `moviesData`가 있으면 `HList title="Movie Results"`
  - `tvData`가 있으면 `HList title="TV Results"`
- `VMedia`, `HMedia`, `Slide`가 이제 눌리는 카드가 되었다.
  - `useNavigation()`을 내부에서 호출하고
  - press 시 `navigation.navigate("Stack", { screen: "Detail" })`
  를 호출한다.
- `navigation/Stack.js`는 실험용 더미 화면들을 걷어내고 `Detail` 화면만 남긴다.
- `Detail.tsx`는 일단 placeholder 텍스트만 둔다.

즉 이 커밋은:

- 검색 화면이 실제 결과 화면이 되고
- 카드가 detail 진입점이 되며
- detail route가 앱 구조 안에 실질적으로 연결되기 시작한 단계다.

## 이때의 핵심 개념

### 1. 검색 결과는 콘솔이 아니라 실제 화면 섹션이 된다

- 앞 단계까지 search는 input과 query trigger가 중심이었다.
- 이 커밋부터는:
  - movie results
  - tv results

를 실제 화면에 붙이며,
검색 화면이 진짜 feature screen처럼 보이기 시작한다.

### 2. 공용 미디어 카드는 단순 표시 컴포넌트에서 interaction entry point가 된다

- `VMedia`
- `HMedia`
- `Slide`

가 모두 pressable해지면서,
이 카드들이 앱 탐색의 핵심 진입점으로 승격된다.

즉 "카드 UI"가 "route entry" 역할까지 맡기 시작한다.

### 3. detail route는 검색/홈/hero 어디서든 갈 수 있어야 한다

- 카드가 여러 화면에서 재사용되기 시작하면,
  detail 화면은 특정 화면 내부가 아니라 앱 공용 route처럼 다뤄져야 한다.
- 이 커밋의 stack 정리도 그 방향으로 읽을 수 있다.

### 4. navigation shell을 먼저 연결할 수 있다

- 이 커밋 시점의 `Detail.tsx`는 placeholder다.
- 즉 detail data contract가 완성되기 전에라도,
  "어디서 눌렀을 때 어디로 가는가"라는 route shell을 먼저 세운 셈이다.

이건 학습 단계에선 자연스러운 전개다.

## 지금 봐도 좋은 점

- 검색 결과를 실제 섹션 UI로 만든 점
- 공용 카드가 어디서든 detail entry가 되도록 맞춘 점
- 더미 stack 화면을 걷어내고 실제 route 구조로 좁힌 점
- nested navigator를 통해 detail 이동을 연결한 점

이 네 가지는 지금 봐도 좋은 전진이다.

## 현재 기준으로 바꿔 읽어야 할 점

### 1. `TouchableOpacity` / `TouchableWithoutFeedback`보다 `Pressable`이 더 current하다

- React Native 문서는 `Pressable`을 현재 press interaction 기본 API로 제공한다.
- `TouchableOpacity` 문서도 더 future-proof한 방식으로 `Pressable`을 보라고 안내한다.

즉 이 커밋의 방향은 맞지만,
지금 기본값은 보통:

```tsx
<Pressable onPress={handlePress}>
  <MediaCardBody ... />
</Pressable>
```

다.

### 2. nested navigate 패턴 자체는 맞지만, params가 빠져 있으면 detail이 비어 있다

- React Navigation 문서 기준으로 중첩 navigator 안 특정 screen으로 가려면:
  `navigate(parent, { screen, params })`
  패턴이 맞다.
- 즉 `navigate("Stack", { screen: "Detail" })`
  구조 자체는 현재도 맞을 수 있다.
- 하지만 이 커밋은 `params`가 없다.

그래서 현재식으론 보통:

```ts
navigation.navigate("Stack", {
  screen: "Detail",
  params: { mediaType: "movie", id: 123 },
})
```

처럼 최소 식별자를 함께 넘긴다.

### 3. shared card 안에 `useNavigation()`을 직접 넣는 건 가능하지만, 결합이 생긴다

- React Navigation 문서는 `useNavigation()`이 깊은 자식에서 유용하다고 설명한다.
- 그래서 이 커밋의 방식이 틀린 건 아니다.
- 다만 현재식으로 보면, 공용 카드가:
  - 어떤 navigator 구조 안에 있어야 하는지
  - 어떤 route 이름을 알아야 하는지
를 직접 알게 된다.

이건 재사용성과 테스트성에 결합을 만든다.

여기서의 해석은 문서 기반 사실이 아니라 현재식 inference다:

- 프레젠테이션 카드 `MediaCardBody`
- navigation-aware wrapper `MediaCardLink`

를 나누거나,

- card는 `onPress`
- wrapper가 route payload를 만든다

처럼 나누면 더 오래가는 구조가 된다.

### 4. 재사용 카드일수록 route payload는 primitive로 드러나는 편이 좋다

- `list-performance-item-memo` 규칙 기준으로도,
  리스트 아이템은 primitive props를 받는 편이 memoization에 유리하다.
- 따라서 shared card가 detail로 가야 한다면,
  보통:
  - `id`
  - `mediaType`
  - `title`
  - `posterPath`

정도만 드러내는 편이 더 current하다.

즉 card가 전체 object나 숨은 navigation state보다,
작은 route payload와 primitive view props를 받는 쪽이 좋다.

### 5. `Search.tsx`의 `ScrollView + HList + HList`는 작은 결과엔 괜찮지만 확장성은 낮다

- movie 결과 한 섹션
- tv 결과 한 섹션

정도면 현재도 충분히 동작한다.
- 하지만 검색 결과가 길어지거나 pagination이 생기면,
  현재식으론:
  - `SectionList`
  - `FlashList`
  - 혹은 vertical result feed

로 더 빨리 넘어가는 편이 낫다.

즉 "검색 결과를 section으로 묶는다"는 개념은 좋고,
구현 받침대만 더 current하게 바뀌는 셈이다.

### 6. detail route shell과 detail data contract는 분리해서 봐야 한다

- 이 커밋은 route shell을 먼저 만들었고
- detail 데이터는 아직 placeholder다.

현재식으론 보통:

- search result card press
- minimal params 전달
- detail query open
- loading / error / success boundary

를 한 흐름으로 이어서 본다.

즉 "카드가 눌린다"와 "상세 데이터가 완성된다"는 서로 다른 단계다.

## 현재의 핵심 개념

### 1. 검색 결과 화면은 input 화면이 아니라 result orchestration 화면이다

- query를 트리거하는 것만으로 끝나는 게 아니라,
- 어떤 resource를 어떤 섹션으로 어떤 우선순위로 보여줄지 결정하는 화면이다.

### 2. 카드 press interaction, route payload, detail query는 서로 다른 책임이다

- press interaction:
  - `Pressable`
- route payload:
  - `id`, `mediaType`
- detail data:
  - query hook

으로 층을 나누는 편이 더 current하다.

### 3. shared card는 내비게이션을 알 수도 있지만, 덜 알수록 오래간다

- 깊은 자식에서 `useNavigation()`을 쓰는 건 가능하다.
- 하지만 카드 재사용 범위가 넓을수록
  route topology를 wrapper나 parent로 밀어내는 편이 더 안정적이다.

### 4. 검색 결과는 결국 list architecture 문제로 이어진다

- 결과가 붙는 순간부터:
  - virtualization
  - stable item props
  - image caching
  - section 구조

가 바로 중요해진다.

## `vercel-react-native-skills` 기준 해석

- 이번 커밋은 특히 아래 규칙들과 잘 연결된다.
  - `ui-pressable`
  - `navigation-native-navigators`
  - `list-performance-item-memo`
  - `list-performance-function-references`
  - `ui-expo-image`
- 현재식으론:
  - card press는 `Pressable`
  - image는 `expo-image`
  - list item props는 primitive
  - detail 이동 payload는 최소화

조합이 가장 자연스럽다.

## 현재 워크스페이스에 대한 추천

- `nomad-diary`에서 비슷한 흐름을 만든다면:
  - 검색 결과는 sectioned list 또는 작은 section feed
  - 카드 본체는 presentational component
  - detail 이동은 wrapper 또는 parent가 `entryId` 같은 최소 식별자 전달
  - detail 화면은 query-driven screen

으로 잡는 편이 좋다.

만약 Expo Router 쪽으로 번역한다면,
`useNavigation()` 대신 route segment / `Link` / `router.push` 기반으로도 같은 개념을 구현할 수 있다.

## 관련 문서

- [검색 제출 기반 지연 쿼리와 병렬 검색](search-submit-driven-lazy-queries-and-parallel-search.md)
- [미디어 섹션 재사용과 화면 스캐폴딩](reusable-media-sections-and-screen-scaffolding.md)
- [상세 화면 히어로 헤더와 최소 라우트 파라미터](detail-hero-header-and-minimal-route-params.md)

## 참고

- [React Native: Pressable](https://reactnative.dev/docs/pressable)
- [React Native: TouchableOpacity](https://reactnative.dev/docs/0.81/touchableopacity)
- [React Navigation: Passing parameters to routes](https://reactnavigation.org/docs/params/)
- [React Navigation: Nesting navigators](https://reactnavigation.org/docs/nesting-navigators/)
- [React Navigation: useNavigation](https://reactnavigation.org/docs/use-navigation/)

## 스킬 추출 후보

### 트리거

- 검색 결과 카드가 detail 진입점이 되는 UI를 만들 때

### 권장 기본값

- 검색 결과는 sectioned list나 명시적 결과 그룹으로 보여준다.
- result card는 `Pressable`을 우선 검토하고, route payload는 최소 식별자만 넘긴다.
- 카드 UI와 navigation 호출 책임은 느슨하게 분리한다.

### 레거시 안티패턴

- `TouchableOpacity`와 nested navigate 호출을 카드 primitive에 고정해두기
- 검색 결과를 단순 `ScrollView`에 무한히 쌓기

### 예외 / 선택 기준

- 결과 수가 매우 적고 학습 단계라면 `HList` 같은 간단한 섹션 뷰도 가능하다.

### 현재식 코드 스케치

```tsx
<SectionList
  sections={sections}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => (
    <Pressable onPress={() => router.push({ pathname: '/detail', params: { id: item.id, mediaType: item.mediaType } })} />
  )}
/>
```

### 스킬 규칙 초안

- "검색 결과는 sectioned list와 `Pressable` 카드, 최소 식별자 navigation payload 조합으로 설계한다."

