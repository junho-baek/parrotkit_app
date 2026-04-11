# 상세 화면 제목 파라미터와 네이티브 스택 헤더 테마 | Detail Title Params and Native Stack Header Theming

## 범위

- `nomadcoders/noovies`의 2021-09-23 커밋 `3b5562e` (`2.21 Detail Screen part One`)를 계기로,
  React Native / React Navigation 앱에서:
  - detail route에 어떤 params를 싣기 시작하는지
  - screen 내부에서 header title을 어떻게 동기화하는지
  - native stack header 테마를 어디서 관리하는지
를 현재 기준으로 다시 정리한다.

## 짧은 결론

- 이 커밋의 핵심은 "detail 화면이 실제 route params를 받아 header chrome을 채우기 시작했다"는 점이다.
- 동시에 native stack header를 color scheme에 맞춰 조정하면서,
  detail screen이 앱의 실제 탐색 구조 안으로 들어오기 시작했다.
- 현재 기준으론:
  - `originalTitle` 하나만 params로 넘기는 건 첫 shell로는 이해되지만,
  - 보통은 `id` / `mediaType` 같은 최소 식별자에
  - 필요하면 `initialTitle` 같은 display seed를 덧붙이고,
  - title 동기화는 `options` callback 또는 필요 시 `setOptions`
  - header 색상은 `headerTintColor`와 theme token

조합으로 읽는 편이 더 current best practice에 가깝다.

## 레거시 커밋이 실제로 한 것

- `VMedia`, `HMedia`, `Slide`에서 `Detail`로 이동할 때:
  - 이전엔 screen name만 넘겼고
  - 이제는 `params: { originalTitle }`를 함께 넘긴다.
- `Detail.tsx`는:
  - `route.params.originalTitle`을 받고
  - `useEffect`에서 `setOptions({ title: originalTitle })`
  로 header title을 바꾼다.
- `Stack.js`는:
  - `useColorScheme()`를 읽고
  - `headerStyle.backgroundColor`
  - `headerTitleStyle.color`
  를 다크/라이트에 맞게 조정한다.
- `styled.d.ts`는 `styled-components.d.ts`로 이름만 정리된다.

즉 이 커밋은 "placeholder detail route"에서 "params를 받아 navigation chrome을 바꾸는 실제 detail route"로 넘어가는 첫 단계다.

## 이때의 핵심 개념

### 1. detail route에도 최소한의 payload가 필요하다

- 이전 단계에선 detail route가 존재만 했다.
- 이 커밋부터는 카드가 detail로 이동할 때 최소한:
  - `originalTitle`

같은 값을 route params로 실어 보내기 시작한다.

즉 detail screen이 처음으로 route contract를 갖기 시작한 단계다.

### 2. header title은 화면 body와 별개로 동기화할 수 있다

- `Detail.tsx`는 화면 본문을 거의 렌더하지 않아도,
  route params를 이용해 native header title을 먼저 세팅한다.

이건 "navigation chrome"과 "screen body"를 분리해서 다루기 시작한 신호다.

### 3. header도 theme layer에 속한다

- stack navigator 쪽에서 `useColorScheme()`를 읽고
  header 배경과 제목 색을 함께 바꾼다.

즉 다크 모드는 화면 내용뿐 아니라,
native navigation chrome까지 같이 봐야 한다는 개념이 드러난다.

### 4. `@ts-ignore`는 타입 계약이 아직 없다는 신호다

- 카드 컴포넌트들 안에서 `navigation.navigate(...)` 호출에
  `@ts-ignore`가 붙는다.

이건 "기능은 연결됐지만 route param typing은 아직 없다"는 뜻이다.

## 지금 봐도 좋은 점

- detail route에 실제 params를 싣기 시작한 점
- screen 내부에서 header title을 동기화한 점
- native stack header까지 다크/라이트를 고려한 점
- `styled-components.d.ts`로 ambient declaration 이름을 더 분명히 한 점

이 네 가지는 지금 봐도 좋은 전진이다.

## 현재 기준으로 바꿔 읽어야 할 점

### 1. `originalTitle`만 넘기는 건 display seed로는 괜찮지만, detail identity로는 부족하다

- React Navigation 문서는 params에 화면을 식별하는 최소 데이터만 넣으라고 설명한다.
- `title` 같은 값은 화면 chrome을 먼저 채우는 seed로는 쓸 수 있지만,
  그것만으로는 실제 상세 데이터를 식별하기 어렵다.

그래서 현재식으론 보통:

```ts
type DetailParams = {
  mediaType: "movie" | "tv"
  id: number
  initialTitle?: string
}
```

처럼 잡는다.

즉:

- `id`, `mediaType` = 실제 screen identity
- `initialTitle` = first paint용 display seed

로 역할을 나누는 편이 더 좋다.

### 2. params에서 바로 title을 읽을 수 있으면 `options` callback이 더 단순할 수 있다

- React Navigation 문서는 screen `options`를 함수로 받아 `route`를 이용할 수 있다고 설명한다.
- 이 커밋처럼 값이 이미 params에 있고 비동기 계산이 필요 없다면,
  screen component 내부 `useEffect(setOptions)`보다:

```tsx
<Stack.Screen
  name="Detail"
  component={Detail}
  options={({ route }) => ({
    title: route.params.initialTitle ?? "Detail",
  })}
/>
```

처럼 navigator 쪽에서 바로 읽는 방법도 자연스럽다.

다만 이건 현재식 inference다:

- title이 query 결과에 따라 뒤늦게 바뀌면 `setOptions`
- title이 params에서 즉시 결정되면 `options` callback

처럼 나누면 더 읽기 쉽다.

### 3. `useEffect`는 가능하지만, header flicker가 있으면 `useLayoutEffect`를 검토할 수 있다

- React Navigation 문서는 `navigation.setOptions`를 screen 내부에서 호출하는 방식을 지원한다.
- 값이 mount 직후 확정되고 첫 프레임 깜빡임이 신경 쓰이면,
  `useLayoutEffect`를 검토하는 편도 있다.

즉 이 커밋의 `useEffect`가 틀린 건 아니고,
현재식 polish 관점에선 한 단계 더 볼 수 있다는 뜻이다.

### 4. native stack header 색은 `headerTitleStyle.color`만이 아니라 `headerTintColor`까지 같이 보는 편이 좋다

- React Navigation native stack 문서는 `headerTintColor`가
  back button과 title tint에 영향을 준다고 설명한다.
- 이 커밋은 `headerTitleStyle.color`는 바꾸지만,
  back arrow / header action tint까지는 일관되게 맞추지 못할 수 있다.

현재식으론 보통:

```ts
screenOptions={{
  headerStyle: { backgroundColor: colors.headerBg },
  headerTintColor: colors.headerForeground,
  headerTitleStyle: { color: colors.headerForeground },
}}
```

처럼 같이 맞춘다.

### 5. navigator에서 `useColorScheme()`를 직접 써도 되지만, 앱 theme token과 합치는 편이 더 확장성 있다

- React Native의 `useColorScheme()`는 현재 시스템 선호 테마를 구독하는 정석 hook이다.
- 그래서 이 커밋 방향 자체는 맞다.
- 다만 화면이 늘어나면:
  - `useColorScheme()` 직접 분기
  - 상수 색상 직접 참조

가 여러 navigator에 퍼지기 쉽다.

현재식으론 보통:

- app theme context
- navigation theme
- design token

중 하나에서 header 색을 같이 읽는 편이 더 오래간다.

### 6. `@ts-ignore`는 없애고 route param contract를 먼저 타입화하는 편이 좋다

- React Navigation TypeScript 문서는 route param list와 screen props를 타입화하는 방식을 자세히 제공한다.
- 또한 `useNavigation` 수동 타입 지정은 완전히 type-safe하지 않으니,
  가능하면 root param list를 전역 기본 타입으로 잡는 편을 권한다.

즉 현재식으론:

- `RootStackParamList`
- nested navigator param typing
- screen props typing

을 먼저 만들고,
`@ts-ignore`는 치우는 편이 좋다.

### 7. 카드 안 `useNavigation()`은 가능하지만, card 책임이 커진다

- `useNavigation()` 문서는 깊은 자식에서 훅을 쓰는 걸 허용한다.
- 다만 현재식으로 보면 shared media card 안에 navigate 로직이 들어가면:
  - route name
  - nested navigator 구조
  - payload shape

를 카드가 직접 알게 된다.

그래서 card가 더 커질수록:

- presentational card
- navigation wrapper

로 나누는 쪽이 보통 더 오래간다.

이 부분은 문서 직접 진술이라기보다 현재식 해석이다.

## 현재의 핵심 개념

### 1. detail params는 body data보다 screen identity와 chrome seed를 담는다

- screen identity:
  - `id`
  - `mediaType`
- chrome seed:
  - `initialTitle`

처럼 역할을 분리하는 게 current하다.

### 2. header title 동기화는 data fetching과 다른 층의 문제다

- title은 navigation chrome
- detail body는 query result

다.

둘을 분리해서 설계해야 첫 화면도 빠르고,
상세 데이터 구조도 깔끔해진다.

### 3. native stack header 테마는 navigator boundary에서 다루는 편이 좋다

- screen 본문이 아니라 navigator의 `screenOptions`에서
  공통 header chrome을 다루는 쪽이 자연스럽다.

### 4. 타입 계약이 생겨야 route shell이 안정된다

- `@ts-ignore`는 shell이 만들어졌지만 contract가 없다는 뜻이다.
- route param typing이 생겨야 detail flow가 확장 가능해진다.

## `vercel-react-native-skills` 기준 해석

- 이번 커밋은 특히 아래 규칙들과 잘 연결된다.
  - `navigation-native-navigators`
  - `ui-pressable`
  - `ui-expo-image`
  - `list-performance-item-memo`
- 현재식으로 번역하면:
  - native stack 유지
  - card press는 `Pressable`
  - route payload는 primitive
  - detail header는 theme token 기반

조합이 가장 자연스럽다.

## 현재 워크스페이스에 대한 추천

- `nomad-diary`에서 detail flow를 더 다듬는다면:
  - params는 `entryId` + optional `initialTitle`
  - detail screen은 query hook으로 실제 데이터 fetch
  - header title은 params seed 또는 query 결과로 동기화
  - header 색은 theme token에서 공통 관리
  - navigation typing을 먼저 잡고 `@ts-ignore`는 쓰지 않기

가 기본값이다.

## 관련 문서

- [검색 결과 섹션과 프레서블 미디어 카드 내비게이션](search-result-sections-and-pressable-media-card-navigation.md)
- [상세 화면 히어로 헤더와 최소 라우트 파라미터](detail-hero-header-and-minimal-route-params.md)
- [API 응답 타입과 Nullable 미디어 필드 처리](api-response-typing-and-nullable-media-fields.md)

## 참고

- [React Navigation: Passing parameters to routes](https://reactnavigation.org/docs/params/)
- [React Navigation: Configuring the header bar](https://reactnavigation.org/docs/headers/)
- [React Navigation: Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator/)
- [React Navigation: Type checking with TypeScript](https://reactnavigation.org/docs/typescript/)
- [React Navigation: useNavigation](https://reactnavigation.org/docs/use-navigation/)
- [React Native: useColorScheme](https://reactnative.dev/docs/usecolorscheme)

## 스킬 추출 후보

### 트리거

- detail title seed와 native stack header chrome을 같이 설계할 때

### 권장 기본값

- detail route params는 최소 식별자와 optional preview seed만 넘긴다.
- authoritative detail data는 detail query가 읽고, header chrome은 theme token과 route metadata에서 파생한다.
- hero, share, watch 같은 detail action은 같은 query 결과를 body와 header에서 재사용한다.

### 레거시 안티패턴

- preview 전체 객체를 route params로 통째로 넘기기
- detail body와 header가 서로 다른 데이터 source를 보게 만들기

### 예외 / 선택 기준

- 초기 shell 단계나 offline preview가 정말 필요하면 preview object를 임시로 넘길 수 있다.

### 현재식 코드 스케치

```ts
type DetailParams = {
  id: number;
  mediaType: 'movie' | 'tv';
  initialTitle?: string;
};

const detailQuery = useQuery(detailOptions(params.id, params.mediaType));
```

### 스킬 규칙 초안

- "detail route는 `id`/`mediaType` 중심으로 두고, header title과 색상은 theme token과 optional preview seed에서 파생한다."

