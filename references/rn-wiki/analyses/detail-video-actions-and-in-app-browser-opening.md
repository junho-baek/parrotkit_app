# 상세 화면 비디오 액션과 인앱 브라우저 열기 | Detail Video Actions and In-App Browser Opening

## 범위

- `nomadcoders/noovies`의 2021-09-23 커밋 `128e234` (`2.25 Detail Screen part Five`)를 계기로,
  React Native / Expo / TanStack Query 앱에서:
  - detail query 결과를 실제 사용자 액션으로 연결하는 방법
  - video metadata를 버튼 목록으로 노출하는 방식
  - 외부 링크를 system browser로 열지, in-app browser로 열지
를 현재 기준으로 다시 정리한다.

## 짧은 결론

- 이 커밋의 핵심은 "detail query가 이제 단순 로그용 데이터가 아니라, 화면 안의 실제 video action으로 연결되기 시작했다"는 점이다.
- 동시에 이전의 movie/tv 이중 query를 하나의 active query로 합치면서,
  detail screen 데이터 흐름도 한 단계 정리된다.
- 현재 기준으론:
  - media type과 id를 기준으로 detail query 하나를 여는 방향은 맞고
  - YouTube 버튼처럼 외부 액션을 만드는 것도 자연스럽다.
- 다만 지금은:
  - query는 object syntax와 명확한 key intent로 정리하고
  - `TouchableOpacity`보다 `Pressable`
  - video list는 render 전에 filtering/selecting
  - `Linking.openURL()`과 `WebBrowser.openBrowserAsync()`를 UX 의도에 따라 선택

하는 편이 더 current best practice에 가깝다.

## 레거시 커밋이 실제로 한 것

- `Detail.tsx`의 이중 query 구조를 단일 active query 구조로 바꿨다.
  - 이전:
    - movie query 하나
    - tv query 하나
    - 각각 `enabled`로 분기
  - 이후:
    - `isMovie` boolean
    - key는 `[isMovie ? "movies" : "tv", params.id]`
    - queryFn은 `isMovie ? moviesApi.detail : tvApi.detail`
- `Loader`를 실제 detail 화면 안에 붙여,
  query가 로딩 중일 때 보여준다.
- `data?.videos?.results`를 순회하며:
  - `video.site === "YouTube"`인 항목만 골라
  - YouTube 아이콘 + 비디오 이름 버튼을 렌더한다.
- 버튼을 누르면:
  - `https://m.youtube.com/watch?v=${videoID}`
  를
  - `WebBrowser.openBrowserAsync(...)`
  로 연다.
- `Linking.openURL(...)`는 import는 남아 있지만 실제 호출은 주석 처리돼 있다.

즉 이 커밋은 "상세 데이터를 받아오는 화면"에서 "상세 데이터가 실제 외부 액션 버튼으로 이어지는 화면"으로 넘어가는 단계다.

## 이때의 핵심 개념

### 1. detail query는 화면 정보뿐 아니라 행동의 근거가 된다

- 이전까지 detail query는 화면을 풍성하게 만드는 데이터였다.
- 이 커밋부터는:
  - 비디오 메타데이터
  - 외부 링크 액션

으로 이어진다.

즉 query 결과가 read-only 텍스트가 아니라,
사용자 행동을 유도하는 인터랙션 데이터가 된다.

### 2. media type 분기는 query 한 개로도 표현할 수 있다

- movie / tv 두 쿼리를 동시에 선언하지 않고,
  `isMovie` 분기를 통해 실제 필요한 detail query 하나만 연다.

이건 앞 단계보다 더 정돈된 방향이다.

### 3. detail 응답 중 일부만 골라 action list로 렌더한다

- 전체 detail 응답을 다 그리지 않고
  `videos.results` 중 YouTube 항목만 필터링해 보여준다.

즉 detail screen은 raw payload를 그대로 보여주는 화면이 아니라,
실제 화면 목적에 맞게 응답 일부를 선택해 쓰는 화면이 된다.

### 4. 외부 링크를 여는 정책이 detail UX 일부가 된다

- 비디오 버튼을 누르면 앱 내부에서 끝나는 게 아니라,
  웹 브라우저 맥락으로 이동한다.

즉 detail screen 설계에는 이제:
  - 데이터
  - 화면
  - 외부 이동 정책

까지 포함되기 시작한다.

## 지금 봐도 좋은 점

- 이중 detail query를 하나의 active query로 줄인 점
- detail data를 실제 action UI로 연결한 점
- YouTube만 필터링해 사용자에게 의미 있는 버튼만 노출한 점
- 인앱 브라우저를 써서 앱 흐름을 덜 끊는 선택을 한 점

이 네 가지는 지금 봐도 좋은 전진이다.

## 현재 기준으로 바꿔 읽어야 할 점

### 1. single active query 방향은 맞지만, 지금은 object syntax와 더 의도적인 key가 자연스럽다

- 이 커밋의 `isMovie ? moviesApi.detail : tvApi.detail` 구조는
  앞선 이중 query보다 낫다.
- 다만 현재 TanStack Query 기본값은 보통:

```ts
useQuery({
  queryKey: ["detail", mediaType, id],
  queryFn: () => fetchMediaDetail({ mediaType, id }),
})
```

처럼 object syntax와 key intent를 더 분명히 쓰는 쪽이다.

즉 "active query 하나"라는 개념은 유지하되,
표현은 더 선언형으로 가는 편이 current하다.

### 2. query key는 queryFn이 쓰는 모든 변수와 함께 가는 편이 좋다

- TanStack Query 문서는 query key를 dependency array처럼 보고,
  queryFn 안에서 쓰는 변수는 key에 포함하라고 설명한다.
- 이 커밋은 `isMovie`를 key의 첫 원소 문자열 분기로 반영하므로 방향은 맞다.

현재식으론 보통:
  - `["detail", "movie", id]`
  - `["detail", "tv", id]`

처럼 "이 query가 detail이다"가 바로 보이게 잡는 편도 많다.

### 3. `data?.videos?.results.map(...)` 전에 selector/filtering을 먼저 두는 편이 좋다

- 이 커밋은 render 중에:
  - optional chaining
  - site 검사
  - 버튼 생성

을 한 번에 한다.
- 현재식으론 보통:
  - `youtubeVideos`
  - `primaryTrailer`
  - `watchActions`

같은 파생값을 render 전에 만들고,
화면은 그것만 소비하는 편이 더 읽기 쉽다.

즉 detail response shape와 UI action model을 분리하는 편이 좋다.

### 4. `TouchableOpacity`보다 `Pressable`이 더 current하다

- `vercel-react-native-skills`는 `TouchableOpacity` 대신 `Pressable`을 기본값으로 권장한다.
- video button은 전형적인 action button이라,
  현재식으론 보통 `Pressable`로 둔다.

### 5. `Linking.openURL()`과 `WebBrowser.openBrowserAsync()`는 의도가 다르다

- Expo 문서는:
  - `expo-linking` / `Linking.openURL()`은 운영체제의 기본 브라우저 앱을 연다고 설명한다.
  - `expo-web-browser`는 인앱 브라우저를 연다고 설명한다.

즉 이 둘은 대체재라기보다 UX 선택지다.

현재식 해석은 보통 이렇다.

- 사용자를 앱 밖의 기본 브라우저 / 외부 앱으로 보내는 게 자연스러우면:
  - `Linking.openURL()`
- 앱 안 문맥을 유지한 채 짧게 외부 웹 콘텐츠를 보여주고 싶으면:
  - `WebBrowser.openBrowserAsync()`

YouTube처럼 실제 재생/앱 handoff를 기대하는 콘텐츠는
시스템 브라우저나 유튜브 앱으로 넘기는 편이 더 자연스러울 때도 있다.
이 문장은 문서 직접 표현이라기보다 현재식 inference다.

### 6. 모바일 웹 YouTube URL을 직접 구성하기보다 link policy를 한 곳에 모으는 편이 좋다

- 이 커밋은 `https://m.youtube.com/watch?v=...`를 직접 만든다.
- 현재식으론:
  - `buildYoutubeUrl(videoId)`
  - `openExternalVideo(video)`

같이 action policy를 util/hook으로 모으는 편이 좋다.

그래야 나중에:
  - web browser
  - system browser
  - youtube scheme

같은 선택을 한 곳에서 바꿀 수 있다.

### 7. detail query가 실제 UI에 들어오면 loading / empty / error 경계가 더 중요해진다

- 이 커밋은 `isLoading ? <Loader /> : null`은 생겼지만
  에러/빈 video 상태는 아직 없다.
- 현재식으론 보통:
  - query error
  - videos 없음
  - playable source 없음

을 따로 다룬다.

즉 action UI가 붙는 순간,
"데이터가 없을 때 무엇을 보여줄지"도 함께 설계해야 한다.

### 8. 이미지와 액션 버튼이 함께 있는 detail 화면일수록 `expo-image`와 presentational 분리가 더 유리하다

- `vercel-react-native-skills` 기준으로 image layer는 `expo-image`가 기본값에 가깝다.
- 화면이 커질수록:
  - hero preview
  - metadata section
  - watch actions

를 작은 presentational 조각으로 나누는 편이 더 유지보수하기 쉽다.

## 현재의 핵심 개념

### 1. detail query는 정보와 액션 둘 다 공급한다

- overview / poster 같은 정보
- watch trailer 같은 액션

을 함께 공급한다.

즉 detail screen은 단순 읽기 화면이 아니라,
콘텐츠 행동 화면으로 바뀐다.

### 2. 외부 링크 전략은 UX 정책이다

- 같은 URL이라도:
  - system browser
  - in-app browser
  - deep link

중 무엇을 택할지는 제품 의도에 따라 다르다.

### 3. raw API 응답과 action view model은 분리하는 편이 좋다

- raw `videos.results`
- UI가 실제로 쓸 `youtubeActions`

를 구분해야 render가 덜 지저분해진다.

### 4. detail screen은 query success만이 아니라 action availability도 상태다

- detail fetch 성공
- 비디오 존재 여부
- playable source 존재 여부

를 따로 봐야 실제 UX가 매끄럽다.

## `vercel-react-native-skills` 기준 해석

- 이번 커밋은 특히 아래 규칙들과 잘 연결된다.
  - `navigation-native-navigators`
  - `ui-pressable`
  - `ui-expo-image`
- 현재식으로 번역하면:
  - native stack 위의 detail screen 유지
  - action button은 `Pressable`
  - hero/poster는 `expo-image`
  - detail query 결과는 작은 UI section들로 분리

조합이 가장 자연스럽다.

## 현재 워크스페이스에 대한 추천

- `nomad-diary`에서 외부 링크 액션을 붙인다면:
  - detail query는 `useEntryDetailQuery()`처럼 한 곳으로 모으고
  - 외부 링크 오픈 정책은 `openExternalLink()` helper로 모으고
  - action button은 `Pressable`
  - video/document/link action은 list before render에서 먼저 정규화

하는 편이 좋다.

Expo Router 쪽에선 웹에서는 `Link`를 고려할 수도 있지만,
현재 native 중심 흐름에선 `Linking` 또는 `expo-web-browser`를 의도적으로 고르는 편이 더 중요하다.

## 관련 문서

- [프리뷰 파라미터에서 미디어 타입 분기 상세 쿼리로 전환](preview-params-to-media-type-detail-queries.md)
- [상세 화면 전체 객체 파라미터와 유니온 라우트 타이핑](full-object-detail-params-and-union-route-typing.md)
- [상세 화면 히어로 헤더와 최소 라우트 파라미터](detail-hero-header-and-minimal-route-params.md)
- [React Query와 현재 데이터 패칭 베스트 프랙티스](react-query-and-data-fetch-best-practices.md)

## 참고

- [Expo: Linking into other apps](https://docs.expo.dev/linking/into-other-apps/)
- [Expo WebBrowser](https://docs.expo.dev/versions/latest/sdk/webbrowser/)
- [TanStack Query: Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [React Native: Pressable](https://reactnative.dev/docs/pressable)

## 스킬 추출 후보

### 트리거

- detail 화면에서 trailer/video action을 외부 링크로 열어야 할 때

### 권장 기본값

- detail action은 query 결과를 기반으로 body와 header 둘 다에서 재사용한다.
- `Pressable`과 `useLayoutEffect` 기반 header option 설정을 우선 검토한다.
- 외부 링크, share payload, video filtering은 helper 계층으로 분리한다.

### 레거시 안티패턴

- body action과 header action이 서로 다른 payload builder를 갖게 두기
- raw query response를 render 안에서 매번 가공하기

### 예외 / 선택 기준

- 매우 작은 데모에선 screen 파일 안 helper 함수로도 충분하지만 제품 코드에선 분리하는 편이 낫다.

### 현재식 코드 스케치

```tsx
useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => <Pressable onPress={shareMedia} />,
  });
}, [navigation, shareMedia]);

const videos = data?.videos?.results?.filter((video) => video.site === 'YouTube') ?? [];
```

### 스킬 규칙 초안

- "detail video action은 filtered action model을 먼저 만들고, 브라우저 열기 정책은 UX 의도에 맞춰 helper로 고정한다."

