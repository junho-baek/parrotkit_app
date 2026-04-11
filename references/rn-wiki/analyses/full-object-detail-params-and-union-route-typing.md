# 상세 화면 전체 객체 파라미터와 유니온 라우트 타이핑 | Full-Object Detail Params and Union Route Typing

## 범위

- `nomadcoders/noovies`의 2021-09-23 커밋 `847e9f1` (`2.22 Detail Screen part Two`)를 계기로,
  React Native / React Navigation / TanStack Query 앱에서:
  - 리스트 item의 전체 데이터를 detail route params로 넘기는 방식
  - `Movie | TV` 같은 union route typing
  - list preview data를 detail screen의 첫 렌더에 어떻게 활용할지
를 현재 기준으로 다시 정리한다.

## 짧은 결론

- 이 커밋의 핵심은 "detail 화면이 title seed만 받는 단계를 넘어, list item의 실제 preview 데이터를 통째로 받아 바로 화면 일부를 그리기 시작했다"는 점이다.
- 동시에 `Detail: Movie | TV` 같은 union typing을 붙이며,
  detail route contract를 TypeScript로 처음 잡기 시작했다는 의미도 있다.
- 현재 기준으론:
  - full object params는 빠른 shell 구축엔 편하지만
  - 최종 구조로는 `id` / `mediaType` 같은 최소 식별자와
  - 선택적 preview seed를 분리하고
  - 실제 상세 데이터는 detail query에서 읽는 편이 더 current하다.
- 특히 list card에 `fullData` object prop을 계속 싣는 방식은,
  현재 RN 성능 기준에선 primitive props / memoization과 부딪히기 쉽다.

## 레거시 커밋이 실제로 한 것

- `Slide`, `HMedia`, `VMedia`가 `fullData` prop을 받기 시작했다.
- press 시 detail route로 이동할 때:
  - 이전엔 `originalTitle`만 넘겼고
  - 이제는 `params: { ...fullData }`
  처럼 리스트 item 전체 데이터를 route params로 보낸다.
- `Movies.tsx`와 `HList.tsx`는 공용 카드에 `fullData={item}`을 넘기기 시작한다.
- `Detail.tsx`는:
  - `RootStackParamList = { Detail: Movie | TV }`
  를 만들고
  - `NativeStackScreenProps`로 route param을 타입화한다.
- detail title은:
  - `"original_title" in params ? params.original_title : params.original_name`
  식으로 union narrowing을 통해 읽는다.
- 본문에도 `Poster path={params.poster_path || ""}`를 렌더해,
  detail screen이 placeholder에서 실제 미디어 preview 화면으로 넘어간다.

즉 이 커밋은 "route title seed" 단계에서 "full preview payload를 넘겨 즉시 detail UI를 구성하는 단계"로 넘어간 전환점이다.

## 이때의 핵심 개념

### 1. list preview data를 detail screen의 첫 화면에 재사용한다

- 상세 API를 아직 다시 부르지 않아도,
  목록 카드에서 이미 가지고 있던:
  - title
  - poster
  - overview 일부

를 detail route에 싣고 첫 렌더를 빠르게 만들 수 있다.

이건 학습 단계에선 매우 실용적인 발전이다.

### 2. detail route가 실제 데이터 shape를 타입으로 받기 시작한다

- `Detail: Movie | TV`
  선언은 "이 화면이 어떤 shape의 params를 기대하는가"를 코드로 드러낸다.

즉 이전의 `@ts-ignore` 중심 상태에서 조금씩 route contract를 타입 시스템으로 옮기기 시작한 단계다.

### 3. movie와 tv의 필드 차이를 union narrowing으로 처리한다

- `original_title`
- `original_name`

차이를 `"original_title" in params`로 구분한다.

이건 현재 기준으로도 유효한 TypeScript narrowing 기법이다.

### 4. 하지만 detail screen이 list item shape에 직접 묶이기 시작한다

- detail screen이 route params로 full object를 받기 시작하면,
  사실상 list item shape와 detail screen shape가 강하게 묶인다.

이건 빠른 전진이면서 동시에 구조적 결합이 생기는 지점이다.

## 지금 봐도 좋은 점

- detail screen이 즉시 그릴 수 있는 preview payload를 받은 점
- `Movie | TV` union typing을 붙인 점
- title을 union narrowing으로 안전하게 읽기 시작한 점
- placeholder detail에서 실제 content-bearing detail로 넘어간 점

이 네 가지는 지금 봐도 분명한 전진이다.

## 현재 기준으로 바꿔 읽어야 할 점

### 1. full object params는 quick win이지만, React Navigation 기준으론 최종 구조로 권장되진 않는다

- React Navigation 문서는 params에 화면을 식별하는 최소 정보만 넣고,
  실제 데이터 객체는 글로벌 캐시나 API에서 읽는 쪽을 권장한다.
- full object params는 편하지만:
  - stale data duplication
  - deep link / URL 의미 훼손
  - 여러 caller가 동일 object shape를 알아야 하는 결합

문제를 만든다.

즉 이 커밋의 방식은 "빠른 shell 단계"로는 이해되지만,
current best practice의 도착점은 아니다.

### 2. 지금은 identity params와 preview seed를 분리하는 편이 좋다

- 이 커밋은 `...fullData`를 통째로 넣는다.
- 현재식으론 보통:

```ts
type DetailParams = {
  mediaType: "movie" | "tv"
  id: number
  preview?: {
    title: string
    posterPath: string | null
  }
}
```

처럼 나눈다.

즉:

- `id`, `mediaType` = authoritative identity
- `preview` = 빠른 first paint용 seed

로 역할을 나누는 편이 더 오래간다.

### 3. list item preview는 route params보다 `placeholderData`로 옮겨 읽는 편이 더 current하다

- TanStack Query 문서는 partial preview data가 있을 때,
  그것을 detail query의 `placeholderData`로 쓰는 패턴을 설명한다.
- 이건 "진짜 상세 데이터가 오기 전까지 임시로 화면을 채운다"는 점에서
  이 커밋의 의도와 정확히 맞닿아 있다.
- 반대로 `initialData`는 cache에 남기기 때문에,
  partial / incomplete data엔 권장되지 않는다.

즉 현재식으론:

- route params는 최소 identity
- list query cache에서 preview item 찾기
- detail query의 `placeholderData`로 사용

이 더 자연스럽다.

### 4. `fullData` object prop은 list item memoization에 불리하다

- `vercel-react-native-skills`의 `list-performance-item-memo` 규칙은
  list item에 가능하면 primitive props만 넘기라고 권장한다.
- 이 커밋처럼 `fullData` 객체를 공용 카드 전체에 싣기 시작하면,
  shallow comparison이 어려워지고
  shared card의 재렌더 제어도 거칠어진다.

즉 detail이 richer data를 원하더라도,
list card 자체는 보통:
  - `id`
  - `mediaType`
  - `title`
  - `posterPath`
  - `voteAverage`

정도만 받는 편이 더 current하다.

### 5. union typing 자체는 좋지만, 속성 존재 체크보다 discriminant가 더 오래간다

- `"original_title" in params` narrowing은 지금도 유효하다.
- 하지만 화면이 커지면:
  - movie-specific fields
  - tv-specific fields
  - shared preview fields

이 섞이기 시작한다.

현재식으론 보통:

```ts
type DetailParams =
  | { mediaType: "movie"; id: number; preview?: MoviePreview }
  | { mediaType: "tv"; id: number; preview?: TvPreview }
```

처럼 `mediaType` 같은 discriminant를 먼저 두는 편이 더 읽기 쉽다.

### 6. `poster_path || ""`는 여전히 fallback 위치를 흐린다

- 이 커밋은 detail 본문에서 바로 `poster_path || ""`를 쓴다.
- 현재식으론 nullable을 숨기지 말고:
  - image component 내부
  - mapper
  - preview model

중 한 곳에서 fallback을 일원화하는 편이 좋다.

### 7. `TouchableOpacity`와 RN `Image` 계층은 지금 기준으론 더 current한 대안이 있다

- press interaction은 `TouchableOpacity`보다 `Pressable`
- 이미지 계층은 RN `Image`보다 `expo-image`

가 현재 기본값에 더 가깝다.

즉 이 커밋의 구조적 아이디어는 유지하되,
UI primitive는 현재식으로 교체해 읽는 편이 맞다.

## 현재의 핵심 개념

### 1. preview data와 authoritative detail data는 다른 층이다

- preview data:
  - 리스트에서 이미 가진 작은 조각
- authoritative detail data:
  - 상세 query가 가져오는 완전한 데이터

둘을 분리하는 것이 current detail architecture의 핵심이다.

### 2. route params는 identity 중심, preview는 선택적으로

- route params의 기본 책임은 "무엇을 보여줄지 식별"하는 것이다.
- preview는 있으면 first paint를 도와주지만,
  source of truth가 되어선 안 된다.

### 3. union typing은 좋은 시작이지만, domain model이 더 자라면 discriminated union이 낫다

- property existence check는 첫 단계로 충분하다.
- 하지만 장기적으로는 `mediaType` 기반 discriminated union이 더 견고하다.

### 4. shared media card는 detail route를 돕더라도 list-friendly해야 한다

- detail flow가 richer해질수록 card에 object prop을 얹고 싶어지지만,
  list performance 관점에선 오히려 card는 더 단순해야 한다.

## `vercel-react-native-skills` 기준 해석

- 이번 커밋은 특히 아래 규칙들과 잘 연결된다.
  - `list-performance-item-memo`
  - `ui-pressable`
  - `ui-expo-image`
  - `navigation-native-navigators`
- 현재식으로 번역하면:
  - detail identity는 primitive route payload
  - list card props도 가능한 primitive
  - press interaction은 `Pressable`
  - preview 이미지는 `expo-image`

조합이 가장 자연스럽다.

## 현재 워크스페이스에 대한 추천

- `nomad-diary`에서 detail로 갈 때는:
  - params에 `entryId`
  - 필요하면 `preview: { title, coverUri }`
  - 실제 상세 데이터는 query hook

구조가 좋다.
- list item 캐시가 이미 있다면,
  detail query에서 `placeholderData`로 preview를 채우는 쪽이 더 current하다.
- detail screen typing은:
  - minimal params
  - discriminated union
  - query result type

를 서로 분리해서 잡는 편이 좋다.

## 관련 문서

- [상세 화면 제목 파라미터와 네이티브 스택 헤더 테마](detail-title-params-and-native-stack-header-theming.md)
- [상세 화면 히어로 헤더와 최소 라우트 파라미터](detail-hero-header-and-minimal-route-params.md)
- [API 응답 타입과 Nullable 미디어 필드 처리](api-response-typing-and-nullable-media-fields.md)
- [검색 결과 섹션과 프레서블 미디어 카드 내비게이션](search-result-sections-and-pressable-media-card-navigation.md)

## 참고

- [React Navigation: Passing parameters to routes](https://reactnavigation.org/docs/params/)
- [React Navigation: Type checking with TypeScript](https://reactnavigation.org/docs/typescript/)
- [TanStack Query: Placeholder Query Data](https://tanstack.com/query/latest/docs/framework/react/guides/placeholder-query-data)
- [TanStack Query: Initial Query Data](https://tanstack.com/query/v5/docs/framework/react/guides/initial-query-data)
- [React Native: Pressable](https://reactnative.dev/docs/pressable)
- [Expo Image](https://docs.expo.dev/versions/latest/sdk/image/)

## 스킬 추출 후보

### 트리거

- preview object 전체를 detail route params로 넘기고 싶어질 때

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

- "preview 전체 객체 params는 임시 shell로만 쓰고, 현재 기본값은 최소 식별자 + detail query다."

