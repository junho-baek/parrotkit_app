# 상세 화면 공유 액션과 동적 헤더 버튼 | Detail Share Actions and Dynamic Header Buttons

## 범위

- `nomadcoders/noovies`의 2021-09-23 커밋 `79bec8b` (`2.26 Sharing`)를 계기로,
  React Native / React Navigation / Expo 앱에서:
  - detail 화면에 native share sheet를 어떻게 붙이는지
  - query 결과가 준비된 뒤 `headerRight`를 어떻게 동적으로 넣는지
  - iOS / Android에서 share payload를 어떻게 다르게 다뤄야 하는지
를 현재 기준으로 다시 정리한다.

## 짧은 결론

- 이 커밋의 핵심은 "detail query 결과가 이제 watch action뿐 아니라 native share action으로도 연결되기 시작했다"는 점이다.
- 동시에 공유 버튼을 screen body가 아니라 `headerRight`에 붙이면서,
  action affordance를 navigation chrome까지 확장한 단계이기도 하다.
- 현재 기준으론:
  - `Share.share()` 자체는 여전히 정석이고
  - query data가 준비된 뒤 `navigation.setOptions({ headerRight })`로 버튼을 붙이는 방식도 유효하다.
- 다만 지금은:
  - `TouchableOpacity`보다 `Pressable`
  - share payload builder 분리
  - `useEffect`보다 `useLayoutEffect` 검토
  - placeholder header button으로 layout shift 최소화
  - share 결과(`sharedAction`, `dismissedAction`)까지 필요 시 해석

하는 편이 더 current best practice에 가깝다.

## 레거시 커밋이 실제로 한 것

- `Detail.tsx`에 `Share`와 `Platform`을 추가했다.
- `shareMedia` 함수를 만들고:
  - Android에선 `message + title`
  - iOS에선 `url + title`
  로 payload를 다르게 만든다.
- share 대상 URL은:
  - 영화면 `https://www.imdb.com/title/${data.imdb_id}/`
  - TV면 `data.homepage`
  로 계산한다.
- `ShareButton` 컴포넌트를 만들고,
  query `data`가 준비되면 `setOptions({ headerRight: () => <ShareButton /> })`
  로 헤더 오른쪽에 붙인다.
- 화면 본문에서는 기존 video action list도 계속 유지된다.

즉 이 커밋은 detail screen이 "콘텐츠 읽기 + watch action" 단계에서
"읽기 + watch + share" 단계로 확장된 순간이다.

## 이때의 핵심 개념

### 1. detail query 결과는 외부 공유 payload의 재료가 된다

- 이제 detail data는:
  - 화면에 보여줄 텍스트
  - 외부 링크
  - 공유 메시지

를 함께 공급한다.

즉 서버 데이터가 단순 렌더용이 아니라,
외부 플랫폼과의 인터랙션 재료가 되기 시작한다.

### 2. action button이 body가 아니라 header chrome으로 올라간다

- video button은 body 안 action list였다.
- share button은 `headerRight`로 들어간다.

즉 action affordance가 screen content 안팎으로 나뉘기 시작한 단계다.

### 3. share payload는 플랫폼별로 다르게 맞출 수 있다

- 이 커밋은 Android와 iOS에서 share payload 모양을 분기한다.
- 이는 RN `Share.share()` API가 플랫폼별로 다르게 보이는 특성과 연결된다.

### 4. query 준비 이후에만 header action을 붙인다

- `data`가 없을 때는 공유 대상 URL이 불완전하므로,
  query가 준비된 뒤에만 `headerRight`를 세팅한다.

이건 header action도 screen state의 일부라는 걸 보여준다.

## 지금 봐도 좋은 점

- native share sheet를 detail 화면에 붙인 점
- query 결과가 준비된 뒤에만 share action을 노출한 점
- 플랫폼별 share payload 차이를 의식한 점
- body action(video)과 header action(share)을 역할별로 나눈 점

이 네 가지는 지금 봐도 좋은 전진이다.

## 현재 기준으로 바꿔 읽어야 할 점

### 1. `Share.share()`는 지금도 맞지만, payload 규칙을 helper로 분리하는 편이 좋다

- React Native 문서는 `Share.share(content, options?)`를 제공하고,
  `message`, `url`, `title`을 플랫폼별로 다르게 취급한다고 설명한다.
- 이 커밋처럼 branch를 직접 써도 되지만,
  현재식으론 보통:
  - `buildShareContent(detail, platform)`
  - `getShareUrl(detail)`

같이 policy를 helper로 분리하는 편이 읽기 쉽다.

그러면:
  - Android message 조합
  - iOS url 조합
  - fallback URL 전략

을 한 군데서 관리할 수 있다.

### 2. share 결과를 필요하면 해석할 수 있다

- React Native 문서는:
  - iOS에선 `dismissedAction`이 있고
  - Android에선 항상 `sharedAction`으로 resolve된다고 설명한다.

즉 현재식으론 단순 fire-and-forget도 가능하지만,
analytics나 UX 피드백이 필요하면 결과를 해석할 수 있다.

예를 들어:
  - 공유 완료 추적
  - iOS에서 dismiss 구분

같은 요구가 생기면 이 반환값이 의미를 가진다.

### 3. `headerRight`를 query 준비 후 `setOptions`로 붙이는 건 맞지만, placeholder를 두면 덜 흔들린다

- React Navigation 문서는 screen state와 상호작용하는 header button을 만들 때
  `navigation.setOptions`를 screen 안에서 쓰라고 설명한다.
- 같은 문서에서 layout shift를 줄이기 위해 placeholder button을 먼저 두는 패턴도 보여준다.

즉 이 커밋의 방향은 맞고,
현재식으론 보통:
  - 초기 `options`에 placeholder headerRight
  - data 준비 후 실제 onPress가 있는 버튼으로 교체

를 고려한다.

### 4. `useEffect`로도 충분하지만, header button 깜빡임이 보이면 `useLayoutEffect`를 검토할 수 있다

- React Navigation 문서는 `setOptions`를 screen 내부에서 업데이트하는 방식을 지원한다.
- 값이 mount 직후 바로 정해지고 header flicker가 신경 쓰이면,
  `useLayoutEffect`를 검토하는 편도 있다.

즉 이 커밋의 `useEffect`가 틀린 건 아니고,
UI polish를 더 챙길 때 한 단계 더 볼 수 있다는 뜻이다.

### 5. `TouchableOpacity`보다 `Pressable`이 더 current하다

- `vercel-react-native-skills`는 `TouchableOpacity` 대신 `Pressable`을 기본값으로 권장한다.
- 특히 header action이나 body action button 모두 현재식으론 `Pressable`이 더 자연스럽다.

### 6. share URL 결정 규칙은 media type과 링크 품질까지 같이 고려하는 편이 좋다

- 이 커밋은 영화면 IMDb, TV면 homepage를 쓴다.
- practical choice로는 이해되지만,
  현재식으론:
  - 공식 홈페이지가 없는 경우
  - IMDb ID 없음
  - 더 안정적인 canonical URL 필요

같은 fallback 규칙을 같이 설계하는 편이 좋다.

즉 share는 단순 버튼보다:
  - canonical external URL policy
  - fallback URL policy

를 포함하는 문제다.

### 7. header action과 body action은 같은 detail action model에서 파생시키는 편이 좋다

- 지금은:
  - share는 header에서 따로 생성
  - video 버튼은 body에서 따로 생성

된다.
- 현재식으론 detail query 결과에서:
  - `shareAction`
  - `watchActions`

를 함께 파생시키고,
UI는 그 결과만 소비하는 편이 더 정돈된다.

### 8. `react-native-gesture-handler`의 `TouchableOpacity`는 여기선 굳이 필요하지 않다

- 이 버튼은 스크롤 리스트 안 item press 최적화 맥락이 아니라,
  header button에 가깝다.
- 현재식으론 plain RN `Pressable`이나 header button component가 더 자연스럽다.

## 현재의 핵심 개념

### 1. detail screen은 query-driven content + query-driven actions 화면이다

- overview
- trailer
- share

가 모두 같은 detail data source에서 파생될 수 있다.

즉 detail 화면은 content와 action을 함께 orchestration하는 화면이 된다.

### 2. native share sheet는 플랫폼 공통 API지만 payload 전략은 플랫폼별이다

- API는 하나지만
- `message`, `url`, `title`, 반환값 해석은 플랫폼별로 차이가 있다.

그래서 current best practice는 "공통 API + 플랫폼별 payload policy"다.

### 3. headerRight는 screen state의 일부다

- 고정 장식이 아니라,
  query 결과와 action availability에 따라 달라지는 screen state다.

### 4. 외부 액션은 canonical URL 정책을 필요로 한다

- share
- open browser
- deep link

는 모두 "어떤 외부 URL이 이 콘텐츠를 대표하는가"라는 정책 문제와 연결된다.

## `vercel-react-native-skills` 기준 해석

- 이번 커밋은 특히 아래 규칙들과 잘 연결된다.
  - `ui-pressable`
  - `navigation-native-navigators`
  - `ui-expo-image`
- 현재식으로 번역하면:
  - native stack header에 dynamic action 유지
  - header/body action은 `Pressable`
  - detail query 결과는 action model로 먼저 정리
  - hero/poster는 `expo-image`

조합이 가장 자연스럽다.

## 현재 워크스페이스에 대한 추천

- `nomad-diary`에서 공유 액션을 붙인다면:
  - `buildShareContent(entry, platform)` helper
  - `getCanonicalShareUrl(entry)` helper
  - placeholder `headerRight`
  - data 준비 후 실제 share button 교체
  - `Pressable` 기반 header/body action

구조가 좋다.

Expo Router로 번역해도 개념은 같다.
차이는 route 파일에서 `headerRight`를 어떻게 세팅하느냐뿐이고,
핵심은 여전히 query-driven header action이다.

## 관련 문서

- [상세 화면 비디오 액션과 인앱 브라우저 열기](detail-video-actions-and-in-app-browser-opening.md)
- [프리뷰 파라미터에서 미디어 타입 분기 상세 쿼리로 전환](preview-params-to-media-type-detail-queries.md)
- [상세 화면 제목 파라미터와 네이티브 스택 헤더 테마](detail-title-params-and-native-stack-header-theming.md)

## 참고

- [React Native: Share](https://reactnative.dev/docs/share)
- [React Navigation: Header buttons](https://reactnavigation.org/docs/header-buttons/)
- [React Navigation: Configuring the header bar](https://reactnavigation.org/docs/headers/)
- [Expo WebBrowser](https://docs.expo.dev/versions/latest/sdk/webbrowser/)

## 스킬 추출 후보

### 트리거

- detail query 결과를 native share와 dynamic header button으로 연결할 때

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

- "share action은 query 결과를 기반으로 helper를 만들고, header button은 `useLayoutEffect`와 `Pressable`로 붙인다."

