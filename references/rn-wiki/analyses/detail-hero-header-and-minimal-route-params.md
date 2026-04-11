# 상세 화면 히어로 헤더와 최소 라우트 파라미터 | Detail Hero Header and Minimal Route Params

## 범위

- `nomadcoders/noovies`의 2021-09-23 커밋 `d0a9aa2` (`2.23 Detail Screen part Three`)를 계기로,
  React Native 상세 화면에서:
  - 상단 hero 영역을 어떻게 구성하는지
  - gradient overlay를 왜 쓰는지
  - route params에 어느 정도 데이터를 실어야 하는지
를 현재 Expo / React Navigation / TanStack Query 기준으로 다시 정리한다.

## 짧은 결론

- 이 커밋의 핵심은 "상세 화면의 첫인상을 hero header로 끌어올렸다"는 점이다.
- 현재도:
  - backdrop + gradient + poster + title
구성 자체는 여전히 유효하다.
- 다만 지금은:
  - route params에 `Movie | TV` 전체 객체를 싣기보다 최소 식별자만 넘기고
  - detail query로 완전한 데이터를 읽으며
  - gradient는 유지하되 이미지/nullable/fallback 처리를 더 명시적으로 하는 편이 current best practice에 가깝다.

## 레거시 커밋이 실제로 한 것

- `expo-linear-gradient`를 추가했다.
- `Detail.tsx` 상단에 hero 영역을 만들었다.
  - backdrop image
  - 검은색으로 내려오는 `LinearGradient`
  - poster
  - 큰 제목
- `setOptions`에서 header title을 item 제목 대신:
  - `"Movie"`
  - `"TV Show"`
처럼 타입 레이블로 바꿨다.
- `params`는 여전히 `Movie | TV` 전체 객체를 route param으로 받는다.
- `poster_path || ""`, `backdrop_path || ""`처럼 nullable path를 빈 문자열로 바꿔 넘긴다.

즉 이 커밋은 "상세 화면을 단순 텍스트 페이지에서 hero-driven screen으로 올린 단계"다.

## 이때의 핵심 개념

### 1. 상세 화면도 상단 hero가 중요하다

- 목록 화면의 카드와 달리, 상세 화면은 첫 화면에서 세계관과 분위기를 강하게 보여줄 필요가 있다.
- backdrop + poster + title 조합은 그 역할을 한다.

즉 이 커밋은 상세 화면을 정보 페이지가 아니라 콘텐츠 페이지처럼 다루기 시작한 단계다.

### 2. blur보다 gradient로 가독성을 확보한다

- backdrop 위에 text를 바로 올리는 대신
  `LinearGradient`로 아래쪽을 어둡게 만들어 title 가독성을 높였다.

이건 지금 봐도 좋은 선택이다.

### 3. navigation header title과 화면 본문 title을 분리한다

- header에는 `"Movie"` / `"TV Show"`
- 화면 hero 안에는 실제 제목

을 둔다.

즉 "header는 navigator 맥락, body는 콘텐츠 맥락"으로 역할을 나누기 시작했다.

### 4. 상세 화면 데이터를 route params에 의존한다

- 상세 화면이 필요한 데이터를 대부분 route params에서 바로 받는다.
- 이건 당시엔 간단하고 편하지만,
  현재 기준으론 한계가 분명한 방식이다.

## 지금 봐도 좋은 점

- hero header를 만든 점
- gradient overlay를 쓴 점
- header title과 body title의 역할을 분리한 점
- poster/backdrop/title/overview를 구조적으로 묶은 점

이 네 가지는 지금 봐도 좋다.

## 현재 기준으로 바꿔 읽어야 할 점

### 1. route params엔 전체 객체보다 최소 식별자를 넣는 편이 좋다

- React Navigation 문서는 params에 화면을 식별하는 최소 데이터만 넣고,
  실제 데이터 객체는 global cache나 API에서 읽는 쪽을 권장한다.
- 즉 현재식으론:
  - `mediaType`
  - `id`

정도를 params로 넘기고,
  detail screen에서 query를 여는 쪽이 더 좋다.

예:

```ts
type DetailParams = {
  mediaType: 'movie' | 'tv'
  id: number
}
```

왜냐면 full object params는:

- stale data duplication
- deep link와 URL 의미 훼손
- 여러 화면이 같은 객체 구조를 알아야 하는 결합

문제를 만든다.

### 2. detail screen은 list item 데이터가 아니라 detail query를 기준으로 읽는 편이 좋다

- 목록 카드에 있던 데이터는 요약본일 때가 많다.
- 상세 화면은:
  - runtime
  - genres
  - credits
  - videos
  - recommendations

처럼 더 깊은 데이터를 원하게 된다.

그래서 현재식으론 보통:

- route params: 최소 식별자
- detail query: 실제 상세 데이터
- 필요하면 목록에서 넘겨준 요약 데이터는 `initialData` / `placeholderData` 성격으로 사용

하는 편이 자연스럽다.

### 3. `poster_path || ""`보다 nullable을 유지한 fallback이 낫다

- 빈 문자열로 바꾸면 nullability 정보가 사라지고,
  이미지 컴포넌트는 빈 uri를 받게 된다.
- 현재식으론 보통:
  - image component가 `string | null`을 받고 fallback 처리
  - mapper에서 `posterUri: string | null`로 명시 정리

가 더 낫다.

즉 "화면에서 억지 빈 문자열"보다 "fallback 위치를 한 군데로 모으기"가 좋다.

### 4. `expo-linear-gradient`는 지금도 유효하다

- Expo 문서는 `expo-linear-gradient`를 여전히 stable한 gradient view로 제공한다.
- 최근 RN에는 `backgroundImage` / `experimental_backgroundImage` 대안도 있지만,
  이것은 아직 실험적이다.

즉 현재도 상세 hero overlay엔 `expo-linear-gradient`가 충분히 자연스럽다.

### 5. header option 동기화는 `useEffect`도 가능하지만, 깜빡임이 신경 쓰이면 `useLayoutEffect`도 고려한다

- React Navigation 문서는 `setOptions`를 `useEffect` / `useLayoutEffect` 등에서 호출하라고 설명한다.
- 현재식으론 header title이 route data에 민감하게 바뀌고 첫 프레임 깜빡임이 신경 쓰이면,
  `useLayoutEffect`를 검토하는 편이 있다.

즉 이 커밋의 `useEffect`가 틀린 건 아니지만,
  시각적 polish를 더 챙길 때는 한 단계 더 볼 수 있다.

### 6. 이미지 계층은 지금 `expo-image` 쪽이 더 current하다

- background와 poster 모두 현재식으론 `expo-image`를 우선 검토하는 편이 좋다.
- 리스트뿐 아니라 상세 hero에서도:
  - transition
  - cache
  - placeholder

가 도움이 된다.

## 현재의 핵심 개념

### 1. hero header는 visual concept이고, detail data는 query concept이다

- hero header:
  - backdrop
  - gradient
  - poster
  - title
- detail data:
  - 식별자 기반 query
  - cache
  - stale/fresh 정책

이 둘을 분리해서 설계하는 게 current하다.

### 2. navigator title과 body title은 역할이 다르다

- navigator title:
  - 구조, back stack, context
- body title:
  - 콘텐츠 자체

둘을 꼭 같은 문자열로 둘 필요는 없다.

### 3. params는 최소화하고 cache/query를 신뢰한다

- 상세 화면이 이미 query layer를 가진다면,
  params는 "무엇을 보여줄지"만 알려주는 편이 좋다.

### 4. gradient overlay는 여전히 좋은 기본값이다

- text readability 목적이라면 blur보다 gradient가 더 가볍고 예측 가능하다.
- 특히 hero 영역에선 지금도 꽤 좋은 기본값이다.

## `vercel-react-native-skills` 기준 해석

- 이 스킬은 이미지와 list 쪽을 강하게 다루지만, 여기에도 적용되는 부분이 있다.
  - 이미지 계층은 `expo-image`
  - fallback state는 일찍 분기
  - native header와 화면 body 역할을 분리
- 현재식 detail screen이라면:
  - native stack header
  - `expo-image`
  - gradient overlay
  - query-driven detail data

조합이 가장 자연스럽다.

## 현재 워크스페이스에 대한 추천

- `nomad-diary` 상세 화면을 더 발전시킨다면:
  - route params는 `entryId` 같은 최소 식별자
  - 실제 상세 데이터는 query hook
  - hero 이미지가 있으면 `expo-image`
  - text 가독성은 gradient overlay
  - null media fallback은 media component에서 일원화

가 기본값이다.

## 관련 문서

- [API 응답 타입과 Nullable 미디어 필드 처리](api-response-typing-and-nullable-media-fields.md)
- [React Query와 현재 데이터 패칭 베스트 프랙티스](react-query-and-data-fetch-best-practices.md)
- [미디어 섹션 재사용과 화면 스캐폴딩](reusable-media-sections-and-screen-scaffolding.md)

## 참고

- [React Navigation: Passing parameters to routes](https://reactnavigation.org/docs/params/)
- [React Navigation: navigation object / setOptions](https://reactnavigation.org/docs/navigation-object/)
- [Expo LinearGradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)

## 스킬 추출 후보

### 트리거

- 상세 화면 상단 hero를 만들면서 route params 범위를 정해야 할 때

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

- "detail hero는 풍부하게 만들되 route params는 최소 식별자와 preview seed만 유지한다."

