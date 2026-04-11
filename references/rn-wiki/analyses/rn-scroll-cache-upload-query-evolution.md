# 스크롤, 캐싱, 업로드, 서버 상태 발전 흐름 | Scroll, Caching, Upload, and Server-State Evolution

## 범위

- React Native / Expo 앱에서 자주 부딪히는 다섯 축을 현재 기준으로 다시 정리한다.
  - 스크롤과 리스트
  - 이미지와 캐싱
  - 업로드
  - API PATCH / mutation
  - React Query 계열 서버 상태 관리
- 목표는 "예전엔 보통 어떻게 했고, 지금은 어디까지 발전했으며, 2026 기준 기본값은 무엇인가"를 한 장으로 정리하는 것이다.

## 큰 흐름

- 초반 React Native 앱은 `ScrollView + map`, `Image`, `useEffect + fetch`, 수동 `setState`, `FormData` 위주로 시작하는 경우가 많았다.
- 이후 공식 기본값은 `FlatList` / `SectionList`, 명시적 virtualized list, 더 체계적인 query cache, mutation lifecycle 쪽으로 이동했다.
- 현재 Expo / RN 실무에선:
  - 리스트는 더 이르게 virtualization
  - 이미지는 `expo-image`
  - 서버 상태는 TanStack Query
  - mutation은 `useMutation`
  - 업로드는 system picker + `File` / `Blob` + `fetch` 흐름
  으로 읽는 편이 자연스럽다.

## 1. 스크롤과 리스트

### 발전 순서

- 초기:
  - `ScrollView`에 `items.map(...)`으로 children을 직접 렌더링
  - 작은 화면, 설정 화면, 상세 화면에는 충분히 단순하고 빠름
- 표준화 단계:
  - 긴 목록은 `FlatList` / `SectionList`
  - virtualization, pull-to-refresh, infinite scroll, separator 같은 기능을 기본 제공
- 현재 고성능 단계:
  - 피드, 검색 결과, 채팅, 캘린더 이벤트 목록처럼 데이터가 길어질 가능성이 큰 화면은 `FlashList`나 `LegendList` 같은 더 공격적인 virtualizer를 기본값으로 보는 흐름이 강해졌다

### 현재 공식 기본값

- React Native 공식 문서는:
  - `ScrollView`는 모든 child를 한 번에 렌더링하므로 긴 리스트에 비효율적
  - 긴 목록에는 `FlatList`
  - `FlatList`는 `VirtualizedList` 기반이며 성능 tuning prop을 제공
  라고 설명한다.

### `vercel-react-native-skills` 기준 해석

- 이 스킬은 공식 문서보다 한 단계 더 공격적이다.
- 핵심 메시지는:
  - "리스트라면 일찍 virtualizer를 써라"
  - `ScrollView + map`보다 `FlashList` / `LegendList`를 기본값으로 올려라
- 관련 규칙:
  - [`list-performance-virtualize`](../../../../.agents/skills/vercel-react-native-skills/rules/list-performance-virtualize.md)
  - [`ui-safe-area-scroll`](../../../../.agents/skills/vercel-react-native-skills/rules/ui-safe-area-scroll.md)

### 2026 기본 추천

- 설정 / 약관 / 프로필 상세처럼 child 수가 작고 구조가 정적인 화면:
  - `ScrollView`
- 피드 / 검색 / 기록 목록 / 무한 스크롤 / 길어질 가능성이 있는 목록:
  - `FlashList` 우선 검토
- `FlatList`는 여전히 유효한 공식 baseline이지만, 성능 민감 화면에선 "충분히 괜찮은 과거 표준"에 더 가깝다
- iOS safe area가 걸린 root scroll에선:
  - `contentInsetAdjustmentBehavior="automatic"` 우선

## 2. 이미지와 캐싱

### 발전 순서

- 초기:
  - 로컬 이미지는 `require(...)`
  - 원격 이미지는 React Native `Image`
- 중간:
  - `Asset.loadAsync`, `useAssets`, `Image.prefetch`
  - "첫 화면 전에 미리 받아놓기"가 중요해짐
- 현재:
  - `expo-image`
  - disk / memory cache, placeholder, transition, prefetch, 더 나은 native 이미지 파이프라인

### 현재 공식 기본값

- Expo 공식 문서는 `expo-image`를 성능 중심 이미지 컴포넌트로 제공한다.
- 기능:
  - disk / memory cache
  - BlurHash / ThumbHash placeholder
  - transition
  - `cachePolicy`
  - `prefetch`

### `vercel-react-native-skills` 기준 해석

- 이 스킬은 아예 "모든 이미지에 `expo-image`"를 기본값으로 둔다.
- 관련 규칙:
  - [`ui-expo-image`](../../../../.agents/skills/vercel-react-native-skills/rules/ui-expo-image.md)

### 2026 기본 추천

- 지금 새 Expo 앱이면:
  - `expo-image`를 기본 이미지 컴포넌트로 사용
- prefetch는:
  - "곧 보여줄 핵심 이미지"에만 제한적으로 사용
- 캐싱은:
  - 일반 이미지 `disk`
  - 반복 노출이 잦고 UX 민감한 이미지 `memory-disk`
- 리스트 안 이미지:
  - thumbnail 크기 사용
  - 이미지 컴포넌트와 item 컴포넌트 둘 다 가볍게 유지

## 3. 데이터 fetch와 서버 상태

### 발전 순서

- 초기:
  - 컴포넌트 안 `useEffect + fetch`
  - loading / error / retry / refetch를 각 화면이 따로 처리
- 중간:
  - 커스텀 hook (`useMovies`, `useProfile`)로 로직을 분리
  - 하지만 cache, stale 처리, refetch 기준은 여전히 앱마다 제각각
- 현재:
  - TanStack Query
  - query key, cache, stale/fresh, background refetch, reconnect/focus 처리, persistence까지 체계적으로 관리

### 현재 공식 기본값

- TanStack Query 문서는 기본적으로:
  - query data는 stale로 간주
  - mount / focus / reconnect에 background refetch 가능
  - inactive query는 일정 시간 cache 유지
  - 실패 query는 재시도
  라는 공격적이지만 합리적인 기본값을 둔다.
- React Native에선 웹과 달리:
  - `onlineManager`를 `NetInfo`와 연결
  - `focusManager`를 `AppState`와 연결
  하는 흐름을 공식 문서가 안내한다.

### 2026 기본 추천

- 서버 데이터가 들어오는 앱이라면:
  - TanStack Query를 기본 서버 상태 계층으로 둔다
- 원칙:
  - server state와 UI state를 분리
  - query key를 일관되게 설계
  - `staleTime`을 명시해 불필요한 refetch를 줄임
  - 피드는 `useInfiniteQuery`
  - RN에서는 `AppState` / `NetInfo` 연동을 같이 고려
- persistence는:
  - 모든 query를 무조건 영구 저장하기보다
  - 오프라인 진입 가치가 큰 query만 선택적으로 persisting

## 4. API PATCH / mutation

### 발전 순서

- 초기:
  - 버튼 누르면 `fetch(..., { method: 'PATCH' })`
  - 성공하면 `setState`
  - 실패하면 alert
  - 목록은 수동 refetch
- 중간:
  - custom hook에 update 로직 분리
  - 그래도 invalidate / rollback / race condition은 화면이 직접 감당
- 현재:
  - `useMutation`
  - `invalidateQueries`, `setQueryData`, optimistic update, rollback

### 현재 공식 기본값

- TanStack Query 문서는 mutation 후:
  - 관련 query invalidation
  - 또는 cache 직접 업데이트
  - 필요하면 optimistic update와 rollback
  을 공식 패턴으로 설명한다.

### 2026 기본 추천

- PATCH / POST / DELETE는:
  - `useMutation`으로 감싼다
- 단순하고 안전하면:
  - 성공 후 invalidate
- 여러 화면이 동시에 반영되어야 하면:
  - `setQueryData`까지 고려
- optimistic update는:
  - 실패 시 되돌리기 규칙이 명확할 때만
  - 단일 화면이면 UI 단 optimistic update
  - 여러 화면 공유 상태면 cache 단 optimistic update

## 5. 업로드

### 발전 순서

- 초기:
  - picker로 URI를 받고
  - `FormData`에 넣어 바로 업로드
- 중간:
  - 앱이 file access, cache copy, preview, retry를 더 신경쓰기 시작
  - 이미지 선택기 / 문서 선택기 / file system 역할이 분리
- 현재 Expo 흐름:
  - system picker (`expo-document-picker`, `expo-image-picker`)
  - `expo-file-system`의 `File`
  - 필요하면 `Blob`
  - `expo/fetch` 또는 `FormData`

### 현재 공식 기본값

- Expo 문서는:
  - `expo-document-picker`로 파일 선택
  - 필요하면 `copyToCacheDirectory: true`
  - `expo-file-system`의 `File`
  - `expo/fetch` 또는 `FormData`
  로 업로드하는 흐름을 공식 예제로 보여준다.

### 2026 기본 추천

- 업로드 입력:
  - 시스템 picker 사용
- 업로드 파일 표현:
  - `File` 또는 `Blob`
- 전송:
  - `expo/fetch`
  - multipart가 필요하면 `FormData`
- 큰 파일 / 이미지 / 영상:
  - 앱 서버를 경유하는 단순 업로드보다 storage direct upload가 더 나은 경우가 많다
  - 이 부분은 백엔드 설계 판단까지 포함된 해석이다
- 업로드 UX:
  - progress
  - cancel / retry
  - 성공 후 query invalidation 또는 cache patch
  를 한 흐름으로 본다

## 영역별 현재 기본값 요약

| 영역 | 옛 기본값 | 중간 단계 | 2026 기본 추천 |
| --- | --- | --- | --- |
| 긴 목록 | `ScrollView + map` | `FlatList` / `SectionList` | `FlashList` 우선, `FlatList`는 baseline |
| 이미지 | RN `Image` | `useAssets` / `prefetch` | `expo-image` |
| 서버 데이터 | `useEffect + fetch` | custom hooks | TanStack Query |
| PATCH / update | 수동 `fetch` + `setState` | hook 분리 | `useMutation` + invalidate / cache update |
| 업로드 | picker + `FormData` | file access 분리 | picker + `File` / `Blob` + `expo/fetch` |

## 현재 워크스페이스에 대한 추천

- `nomad-diary` 같은 Expo 앱에서 다음 순서로 잡는 게 무난하다.
  1. 상세 / 설정 화면은 `ScrollView`
  2. 기록 목록 / 검색 결과 / 피드는 `FlashList`
  3. 이미지는 `expo-image`
  4. 서버가 붙는 순간 TanStack Query 도입
  5. 쓰기 작업은 `useMutation`
  6. 파일 업로드는 picker + `expo-file-system` + `expo/fetch`

## 공식 baseline과 Vercel RN 스킬의 차이

- React Native 공식 baseline:
  - "긴 리스트면 `FlatList`"
- `vercel-react-native-skills`:
  - "리스트라면 더 일찍 virtualizer, 가능하면 `FlashList` / `LegendList`"
- Expo 공식 이미지 baseline:
  - `expo-image`를 성능형 이미지 계층으로 제공
- TanStack Query 공식 baseline:
  - stale/focus/reconnect/retry를 기본 모델로 둠

즉 현재식으로 읽으면:

- 공식 문서는 "최소 공통 baseline"
- Vercel RN 스킬은 "실무 최적화 default"

로 이해하는 것이 가장 자연스럽다.

## 현재 결론

- 스크롤:
  - 작은 문서형 화면만 `ScrollView`
  - 목록은 더 빨리 virtualizer로 간다
- 캐싱:
  - 이미지 캐싱은 `expo-image`
  - 서버 캐싱은 TanStack Query
- 업로드:
  - `File` / `Blob` + `expo/fetch`
- API PATCH:
  - `useMutation`
- 리스트:
  - 공식 baseline은 `FlatList`
  - 현재 실무 기본값은 `FlashList` 쪽으로 더 이동


## 스킬 추출 후보

### 트리거

- 스크롤, 캐시, 업로드, query mutation 흐름을 한 장으로 일반화하고 싶을 때

### 권장 기본값

- 서버 상태는 TanStack Query key와 query function boundary에서 모델링한다.
- loading, refreshing, stale 상태는 query state에서 파생한다.
- 응답 타입, nullable 필드, mapper는 API boundary에서 먼저 정리한다.

### 레거시 안티패턴

- 화면마다 `useEffect + fetch + setState`를 반복하기
- query key 설계 없이 refetch만 호출해 흐름을 맞추기

### 예외 / 선택 기준

- 짧은 일회성 데모나 툴링 없는 스크립트라면 단순 fetch도 가능하다.

### 현재식 코드 스케치

```ts
const trendingOptions = queryOptions({
  queryKey: ['movies', 'trending'],
  queryFn: moviesApi.trending,
});

const trendingQuery = useQuery(trendingOptions);
```

### 스킬 규칙 초안

- "스크롤/캐시/업로드는 각각 다른 문제처럼 보여도 현재 앱 구조에선 query와 virtualization 경계에서 같이 설계한다."

## 관련 페이지

- [Expo preload 패턴 메모 | Expo Preload Patterns](expo-preload-patterns.md)
- [스타일드 컴포넌트와 NativeWind, shadcn-style 비교 | Styled Components vs NativeWind and shadcn-style](styled-components-vs-nativewind-and-shadcn.md)
- [StyleSheet.create와 NativeWind 선택 메모 | StyleSheet.create vs NativeWind](stylesheet-create-vs-nativewind.md)

## 참고 링크

- [React Native ScrollView](https://reactnative.dev/docs/scrollview)
- [React Native FlatList](https://reactnative.dev/docs/flatlist)
- [Optimizing FlatList Configuration](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [Expo Image](https://docs.expo.dev/versions/latest/sdk/image/)
- [React Native Networking](https://reactnative.dev/docs/network)
- [Expo FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [Expo DocumentPicker](https://docs.expo.dev/versions/latest/sdk/document-picker/)
- [TanStack Query Important Defaults](https://tanstack.com/query/v4/docs/framework/react/guides/important-defaults)
- [TanStack Query React Native](https://tanstack.com/query/v4/docs/framework/react/react-native)
- [TanStack Query Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [TanStack Query AsyncStorage Persister](https://tanstack.com/query/latest/docs/framework/react/plugins/createAsyncStoragePersister)
