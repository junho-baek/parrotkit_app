# 로그

ingest, query, lint, 유지보수 작업을 시간순으로 누적 기록하는 문서다.

## [2026-04-10] scaffold | 초기 세팅

- 시작용 `raw/`와 `wiki/` 디렉터리를 만들었다.
- `index.md`, `log.md`, `overview.md`, 유지보수 규칙 문서를 추가했다.

## [2026-04-10] setup | RN 학습 계획 세팅

- `raw/noovies/`를 아직 완전 ingest 하지 않은 미래 학습 소스로 올려두었다.
- 계획 우선 React Native 학습 위키 규칙으로 커스터마이즈했다.
- 학습 워크플로우 개념 문서와 계획 문서를 추가했다.
- `~/.codex/skills/oh-my-rn`에 개인용 스킬 초안을 만들었다.

## [2026-04-10] analysis | 프로젝트 시작 방향 정리

- 왜 bare React Native Community CLI 프로젝트가 이 워크스페이스에 잘 맞는지에 대한 durable note를 추가했다.
- 이 학습 저장소에 연결할 원격 저장소 URL을 기록했다.

## [2026-04-10] analysis | 환경 설정과 첫 실행 상태

- 현재 Android/iOS 시뮬레이터 설정 상태를 기록했다.
- `AwesomeProject`라는 bare RN 0.85 프로젝트를 실습용으로 만들었다는 점을 기록했다.
- Expo 기반 작업과 bare RN CLI 프로젝트의 실질적 차이를 정리했다.

## [2026-04-10] analysis | Expo prebuild 흐름 추가 정리

- `nomad-diary`라는 Expo 샌드박스를 추가했다.
- `npx create-expo-app@latest`로 시작한 뒤 `npx expo prebuild`로 네이티브 디렉터리를 생성할 수 있다는 점을 기록했다.
- `npx expo run:ios`와 Watchman 복구 루틴(`watchman shutdown-server`)을 setup note로 남겼다.

## [2026-04-10] study | Expo splash screen 실습

- `nomad-diary`에 `expo-splash-screen`을 설치했다.
- 앱 준비 전에는 splash를 유지하고, 준비 완료 뒤 `hideAsync()`로 닫는 최소 예제를 추가했다.
- 이번 단계에서는 커스텀 splash asset 설정 대신 JS 제어 흐름 이해에만 집중했다.

## [2026-04-10] study | Expo splash 자산 연결

- `nomad-diary/assets/`에 라이트/다크 splash 이미지를 추가했다.
- `app.json`에 `expo-splash-screen` 플러그인 설정을 넣어 배경색과 이미지를 연결했다.
- splash hide 시점에 짧은 fade를 넣어 전환이 덜 거칠게 보이도록 조정했다.

## [2026-04-10] fix | iOS splash 로고 누락 보정

- iOS `SplashScreen.storyboard`에 로고용 `imageView`가 빠져 있어 배경색만 보이던 상태를 확인했다.
- centered logo view를 수동으로 추가해 splash 이미지가 실제로 보이도록 보정했다.

## [2026-04-10] fix | Android splash 재생성과 SDK 경로 보정

- Android native 리소스가 구버전 splash 설정을 들고 있어 `expo prebuild --platform android`로 다시 생성했다.
- 재생성 뒤 Android 12+ splash theme, 라이트/다크 배경색, splash 로고 drawable이 반영된 것을 확인했다.
- 로컬 Android SDK 경로가 없어 빌드가 멈추던 문제를 `android/local.properties`로 보정했다.

## [2026-04-10] fix | Android dev client 딥링크 보정

- Android 앱이 설치돼 있어도 `a` 실행 시 dev client URL을 받을 intent filter가 없어 열리지 않던 상태를 확인했다.
- `expo-dev-client`를 설치하고 Android prebuild를 다시 돌려 `exp+nomad-diary` 스킴이 manifest에 생성되도록 맞췄다.
- 이후 `npx expo run:android` 재빌드로 `exp+nomad-diary://expo-development-client/...` 링크가 실제로 열리는 것을 확인했다.

## [2026-04-10] study | Expo preload 패턴 적용

- `nomad-diary`에 `expo-asset`과 `expo-font`를 명시적으로 설치했다.
- `useAssets`, `useFonts`, `Image.prefetch`, `expo-splash-screen`을 함께 쓰는 preload 예제를 앱에 적용했다.
- 위키에 예전 `expo-app-loading` 흐름과 현재 SplashScreen 기반 preload 패턴의 대응 관계를 정리했다.

## [2026-04-10] analysis | noovies navigation introduction commit 해석

- `nomadcoders/noovies`의 `e79282f` 커밋이 실제로는 navigator 구현보다 dependency 준비 단계라는 점을 정리했다.
- Expo / JS 레이어와 iOS native 레이어가 각각 어디서 바뀌는지 나눠 적었다.
- 현재 기준으로는 `React Navigation + native-stack`과 `Expo Router`를 어떤 상황에서 고를지 비교 메모를 남겼다.

## [2026-04-10] study | Expo Router 샌드박스 적용

- `nomad-diary`에 `expo-router`, `react-native-screens`, `react-native-safe-area-context` 등을 설치했다.
- 기존 `App.js` 중심 구조를 `app/` 기반 file routing 구조로 전환했다.
- 루트 `Stack`, 최상위 `NativeTabs`, 동적 상세 route 조합을 직접 만져볼 수 있는 예제를 추가했다.

## [2026-04-10] fix | Expo Router entry / scheme 보정

- 기존 Expo 프로젝트에 Router를 붙인 뒤 `EXPO_ROUTER_APP_ROOT` transform error가 발생해 Babel 설정과 custom entry를 보정했다.
- Android dev client가 `com.anonymous.nomaddiary://` 링크를 못 열던 문제를 native manifest 스킴 추가로 맞췄다.
- `expo start`가 shared dev-client scheme를 고르지 못하던 상태라 start script에서 공통 scheme를 명시하도록 조정했다.

## [2026-04-10] decision | Stable Tabs로 현재 선택 정리

- `NativeTabs` 실험은 기록으로 남기고, 현재 구조는 stable `Tabs` + native `Stack` 조합으로 정리했다.
- Liquid Glass 헤더 체감은 `Stack` 쪽에서 유지되고, 탭은 실험 import 없이 단순하게 관리하도록 바꿨다.

## [2026-04-10] decision | NativeTabs로 복귀

- 하단 탭바의 시스템 감각이 더 중요하다고 판단해 `NativeTabs`를 현재 선택으로 다시 채택했다.
- stable `Tabs` 시도는 비교용 메모로 남기고, 실제 샌드박스는 `Stack + NativeTabs` 조합으로 되돌렸다.

## [2026-04-10] fix | Android NativeTabs 아이콘 보정

- Android 에뮬레이터에서 `NativeTabs` 아이콘이 비거나 어색하게 보이는 상태를 확인했다.
- iOS는 `sf`, Android는 `androidSrc + VectorIcon`으로 분리해 아이콘 소스를 명시적으로 맞췄다.
- 위키에 이 조합이 우회가 아니라 Expo NativeTabs 공식 icon API 범위 안의 해결이라는 해석을 추가했다.
- 다만 포커스된 시각 상태는 native tabs 특성상 플랫폼 쪽 결정권이 크다는 점도 함께 메모했다.

## [2026-04-10] polish | Android NativeTabs 포커스 톤 보정

- Android 하단 탭의 default/selected 텍스트와 아이콘 색을 분리해 선택 상태 대비를 더 차분하게 맞췄다.
- active indicator와 ripple 톤을 부드럽게 잡아 포커스된 탭이 덜 튀게 만들었다.
- NativeTabs 자체는 유지하고, JS tabs로 바꾸지 않은 채 네이티브 감각 안에서 시각 보정만 적용했다.

## [2026-04-10] analysis | noovies navigation configuring commit 해석

- `nomadcoders/noovies`의 `3489af6` 커밋이 실제로는 탭 navigator 공통 옵션(`screenOptions`) 설명 단계라는 점을 정리했다.
- 레거시 `@react-navigation/bottom-tabs` 설정과 현재 `Expo Router + Stack + NativeTabs` 구조를 항목별로 1:1 대응시켰다.
- `vercel-react-native-skills` 기준으로는 개념은 유지하되 구현 수단은 native stack/native tabs 쪽으로 옮겨 읽는 편이 더 맞는다는 해석을 남겼다.

## [2026-04-11] analysis | Expo Router 도메인 중심 파일 구조 메모

- Expo Router 공식 문서 기준으로 `app` 또는 `src/app`는 route-only로 보고, 비라우트 코드는 바깥 디렉터리로 두는 쪽이 자연스럽다는 점을 정리했다.
- `vercel-react-native-skills`의 native navigator 방향과 연결해서 `app + features + core` 또는 `src/app + src/features + src/core` 구조를 현재 추천 방향으로 남겼다.
- 도메인 이름은 LLM이 읽기 쉬운 풀네임과 stable kebab-case를 우선한다는 규칙도 함께 적었다.

## [2026-04-11] study | noovies dark mode를 nomad-diary에 현재식으로 번역

- `nomadcoders/noovies`의 `75bb483` 커밋이 `useColorScheme + Tab.Navigator`로 다크 모드를 붙인 단계라는 점을 새 분석 문서로 정리했다.
- `nomad-diary`에 `core/theme.js`를 추가해 light/dark theme token을 만들고, 레거시 dark palette 의도를 현재 app shell 전체에 다시 연결했다.
- 루트 `Stack`, `NativeTabs`, 홈/스터디/상세 화면이 같은 token을 공유하도록 바꾸고, 비교 내용을 entry 화면에서도 읽을 수 있게 study content를 분리했다.

## [2026-04-11] analysis | Native stack vs JS stack 현재 결론

- 현재 `nomad-diary`의 루트 `Stack`가 Expo Router 기본 stack이므로, 지금 워크스페이스는 native stack 계열을 쓴다고 정리했다.
- `vercel-react-native-skills` 기준으로도 기본 추천은 JS stack이 아니라 native stack이라는 점을 다시 고정했다.
- JS stack은 예외 선택이고, 현재 기본 답은 "우리도 native stack, best default도 native stack"으로 메모했다.

## [2026-04-11] analysis | Configuring Stack Navigation 현재식 정리

- `#2.11 Configuring Stack Navigation`을 현재 Expo Router + native stack 기준으로 다시 읽는 best practice 메모를 추가했다.
- `screenOptions`, layout의 `Stack.Screen options`, route file 안의 동적 `<Stack.Screen options={...} />`로 책임을 나누는 방식을 기본값으로 정리했다.
- `vercel-react-native-skills`와 Expo Router 공식 문서를 기준으로, composition API보다 options-based API를 현재 안정적인 기본값으로 적어두었다.
- 이어서 `headerShown`, `headerRight`, `headerLargeTitle`, `presentation`, `animation`, `contentStyle`, `headerSearchBarOptions` 같은 대표 stack option과, drawer가 stack prop이 아니라 별도 navigator라는 점도 치트시트 형태로 덧붙였다.

## [2026-04-11] analysis | noovies Stacks and Tabs 최신 해석

- 레거시 `c08c9f1` 커밋의 root-wide `presentation: "modal"` 구조를 현재 문서 기준으로 다시 읽었다.
- 최신 기준으로는 modal presentation을 root 전체 default가 아니라 modal 대상 screen/group에만 주는 편이 더 자연스럽다는 점을 정리했다.
- nested navigator에서 `goBack()`과 `getParent().goBack()`의 역할 차이, 그리고 `requestAnimationFrame`은 공식 규칙보다 실전 안정화 팁에 가깝다는 점을 메모했다.

## [2026-04-11] analysis | styled-components와 NativeWind, shadcn-style 비교

- 레거시 강의에서 보이는 `styled-components`를 현재 RN 생태계 기준으로 다시 비교했다.
- `vercel-react-native-skills` 기준으로는 `StyleSheet.create` 또는 `NativeWind`가 기본 추천에 더 가깝다는 점을 적었다.
- React Native에서 shadcn은 보통 `shadcn/ui` 자체보다 NativeWind 기반의 shadcn-style component layer로 이해하는 편이 자연스럽다고 정리했다.

## [2026-04-11] analysis | StyleSheet.create vs NativeWind 선택 메모

- React Native 공식 문서와 NativeWind 문서, `vercel-react-native-skills`를 기준으로 두 스타일링 방식의 차이를 정리했다.
- 현재 사용자 감각에는 `NativeWind` 메인 + `StyleSheet.create` 보조의 혼합형이 잘 맞는다는 추천을 남겼다.
- 즉 layout과 utility styling은 NativeWind, 복잡한 계산형/동적 스타일은 StyleSheet.create로 가는 방향을 현재 기본 제안으로 저장했다.

## [2026-04-11] analysis | noovies TypeScript 커밋 현재식 해석

- 레거시 `c6ebd2a` 커밋의 TypeScript 도입 방식을 현재 Expo / React Navigation / Expo Router 기준으로 다시 정리했다.
- Expo에선 `expo/tsconfig.base` 상속, `typescript + @types/react`, `strict: true` 같은 최신 기본값을 우선 적었다.
- 현재 기준으론 `@types/react-native` 제거, navigation props의 `any` 제거, ParamList 별도 파일화, Expo Router typed routes 고려가 더 자연스럽다는 해석을 남겼다.

## [2026-04-11] analysis | 스크롤, 캐싱, 업로드, 서버 상태 발전 흐름

- React Native / Expo에서 `ScrollView`, `FlatList`, `FlashList`, `expo-image`, 업로드, TanStack Query, mutation 패턴이 어떤 순서로 발전했는지 한 장으로 정리했다.
- React Native 공식 baseline과 `vercel-react-native-skills`의 더 공격적인 실무 기본값을 분리해서 적었다.
- 현재 추천으로는 작은 상세 화면만 `ScrollView`, 목록은 더 일찍 virtualizer, 이미지는 `expo-image`, 서버 상태는 TanStack Query, PATCH는 `useMutation`, 업로드는 `File` / `Blob` + `expo/fetch` 흐름을 남겼다.

## [2026-04-11] analysis | Supabase와 Expo 업로드/스토리지 패턴

- Expo 앱에서 Supabase를 붙일 때 auth/session, DB query, Storage upload를 어떻게 나눠 생각하는지 현재식으로 정리했다.
- 갤러리 사진은 `expo-image-picker`, 일반 파일은 `expo-document-picker`, 업로드는 RN 특성을 고려해 `ArrayBuffer` 기반 Storage upload 흐름을 우선 적었다.
- bucket 분리, `users/{uid}/...` path 규칙, overwrite 대신 새 path, metadata table, RLS와 owner 기반 정책까지 같이 메모했다.

## [2026-04-11] analysis | noovies Movies Screen swiper 커밋 현재식 해석

- 레거시 `ee41a35` 커밋이 `react-native-web-swiper`로 상단 영화 hero 영역을 먼저 scaffold한 단계라는 점을 정리했다.
- 현재 기준으로는 `react-native-web-swiper`보다, full-page는 `react-native-pager-view`, hero/card carousel은 `react-native-reanimated-carousel`, 단순 snap은 horizontal list가 더 자연스럽다는 선택 기준을 남겼다.
- `vercel-react-native-skills` 관점에서 virtualization, GPU-friendly animation, `expo-image` 원칙을 swiper/carousel 해석에 연결했다.

## [2026-04-11] analysis | noovies Movies Screen part two 현재식 해석

- 레거시 `34d8eac` 커밋이 `useState + useEffect + fetch`, `ActivityIndicator`, `makeImgPath`, `expo-blur`, `sceneContainerStyle`까지 붙여 실제 hero 영화 화면으로 넘어간 단계라는 점을 정리했다.
- 현재 기준으로는 query layer, `expo-image`, gradient overlay 우선, 필요시 `BlurView`, 그리고 장기적으로 root virtualized screen 구조가 더 자연스럽다고 메모했다.
- `expo-blur`의 현재 Android 지원 조건과 dynamic content 관련 known issue도 함께 적어두었다.

## [2026-04-11] analysis | noovies Movies Screen part three 현재식 해석

- 레거시 `9e2d5ec` 커밋이 `react-native-swiper`, richer hero card, `useColorScheme`, `expo/tsconfig.base`까지 묶어서 화면 완성도를 높인 단계라는 점을 정리했다.
- 현재 기준으로는 `react-native-swiper`도 오래된 선택지이며, carousel은 `react-native-reanimated-carousel`, 이미지는 `expo-image`, text contrast는 gradient overlay가 더 기본값에 가깝다고 메모했다.
- 이번 커밋 안에서 상대적으로 현재식에 가까운 부분으로는 `expo/tsconfig.base` 상속과 color-scheme 대응을 남겼다.

## [2026-04-11] analysis | noovies Refactor 커밋 현재식 해석

- 레거시 `6b7e702` 커밋이 `Poster`, `Slide` 컴포넌트 분리와 `Promise.all` 기반 병렬 fetch를 도입한 리팩터링 단계라는 점을 정리했다.
- 현재 기준으로는 컴포넌트 분리 의도는 좋지만, 위치는 `components/`보다 feature 폴더 안이 더 자연스럽고, 데이터 orchestration은 `Promise.all + setState`보다 query layer 쪽이 기본값이라고 메모했다.
- 사용자 메모의 `title` prop 충돌 사례를 현재식 naming 규칙과 RN text rendering 에러 관점에서 함께 정리했다.

## [2026-04-11] analysis | noovies Trending Movies 커밋 현재식 해석

- 레거시 `246fa33` 커밋이 hero 아래에 첫 horizontal trending row를 붙이면서 영화 홈을 feed형 구조로 확장한 단계라는 점을 정리했다.
- 현재 기준으로는 horizontal `ScrollView + map`보다 horizontal list가 더 자연스럽고, 제목 잘라내기도 `slice()`보다 layout-aware truncation이 낫다고 메모했다.
- `vercel-react-native-skills` 관점에서 item memoization, primitive props, 적정 해상도 이미지 로딩 기준도 함께 연결했다.

## [2026-04-11] analysis | noovies Coming Soon 커밋 현재식 해석

- 레거시 `031d414` 커밋이 `Trending` 아래에 `Coming soon` 세로 섹션을 붙여 다중 섹션 홈 피드를 성립시킨 단계라는 점을 정리했다.
- 현재 기준으론 이 시점부터 root `ScrollView`를 계속 키우기보다 `FlashList` 중심의 화면 재구성이 더 자연스럽다는 해석을 남겼다.
- 날짜 포맷 hoist, layout-aware truncation, `expo-image` placeholder 쪽이 더 현대적인 구현 수단이라는 점도 같이 메모했다.

## [2026-04-11] analysis | noovies Refreshing 커밋 현재식 해석

- 레거시 `0a93796` 커밋이 `RefreshControl`을 붙이고 `HMedia` / `VMedia` / `Votes`로 반복 UI를 분리하면서 홈 피드를 실제 앱처럼 관리하기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 `RefreshControl` 발상 자체는 유지하되, root `ScrollView`보다 virtualized root list 위에서 `refreshing` / `onRefresh`를 다루는 편이 더 자연스럽다는 해석을 남겼다.
- item component의 primitive props, `voteAverage` truthy check 주의, 날짜 formatter hoist, `expo-image` 전환까지 함께 메모했다.

## [2026-04-11] analysis | ScrollView, FlatList, LegendList, SectionList 비교 정리

- `ScrollView`, `FlatList`, `LegendList`, `SectionList`를 한 장에서 비교하는 새 분석 문서를 추가했다.
- React Native 공식 baseline과 `vercel-react-native-skills`의 더 공격적인 virtualization 기본값을 분리해서 적었다.
- 현재 워크스페이스에선 페이지형 화면은 `ScrollView`, 일반 목록은 `FlatList`, grouped list는 `SectionList`, 성능 민감 피드는 `LegendList`/`FlashList`를 우선 검토하는 쪽으로 정리했다.

## [2026-04-11] analysis | noovies FlatList 커밋 현재식 해석

- 레거시 `97a2e43` 커밋이 `Trending` row를 `ScrollView + map`에서 horizontal `FlatList`로 옮기며 공식 list API 쪽으로 한 단계 전진한 시점이라는 점을 정리했다.
- 현재 기준으론 이 변화가 분명 좋은 진전이지만, root `ScrollView`와 `upcoming.map(...)`가 그대로 남아 있어 화면 전체로 보면 아직 과도기 구조라는 해석을 남겼다.
- 공식 baseline으로는 `FlatList`가 맞지만, `vercel-react-native-skills` 관점에선 홈 피드처럼 성능 민감한 화면이면 `LegendList`/`FlashList`까지 더 빨리 검토하는 쪽이 modern best practice라고 메모했다.

## [2026-04-11] analysis | noovies FlatList part Two 커밋 현재식 해석

- 레거시 `07516eb` 커밋이 root `ScrollView`를 `FlatList`로 바꾸고 `ListHeaderComponent`에 hero와 trending row를 올리면서, 화면 전체를 공식 list architecture로 재구성한 단계라는 점을 정리했다.
- 현재 기준으론 이 변화가 공식 baseline으로는 꽤 정석적이지만, 실무 성능 관점에선 `FlashList`/`LegendList`, stable render references, feature-local header/section 분리까지 더 가는 편이 좋다고 해석했다.
- 이 시점은 `2.10`의 부분 전환 이후, 실제 홈 피드가 진짜 root list 기반 구조로 넘어간 첫 분기점이라고 메모했다.

## [2026-04-11] analysis | noovies React Query part One 커밋 현재식 해석

- 레거시 `a3be0bd` 커밋이 `react-query` v3의 `QueryClientProvider`를 앱 루트에 붙이고 `api.ts`로 fetch 함수를 분리하면서, server-state 계층을 도입하기 위한 발판을 깔기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 이 커밋이 실제 query hook 전환보다 provider + API layer 준비 단계에 더 가깝고, 지금 새 앱이면 `react-query` 대신 `@tanstack/react-query`를 써야 한다고 메모했다.
- fixed parallel `useQuery`, `staleTime`, RN `AppState` / network manager 연동, RN용 devtools 경로까지 포함해야 비로소 modern TanStack Query best practice에 가깝다고 정리했다.

## [2026-04-11] analysis | React Query와 현재 데이터 패칭 베스트 프랙티스

- React Native / Expo 앱에서 `useEffect + fetch`가 왜 기본값이 아니게 되었는지, React 공식 문서와 TanStack Query 최신 문서 기준으로 따로 묶어 정리했다.
- 현재 기본값을 `@tanstack/react-query`의 `useQuery`, `useInfiniteQuery`, `useMutation` 축으로 두고, fixed parallel queries, `staleTime`, RN `AppState` / `onlineManager` 연동까지 포함해 설명했다.
- 오프라인 persistence는 `PersistQueryClientProvider`와 `createAsyncStoragePersister`로 가능하지만, 모든 query에 무조건 붙이기보다 선택적으로 쓰는 쪽이 좋다는 해석을 남겼다.

## [2026-04-11] analysis | 쿼리 기반 Pull-to-Refresh와 리패칭 상태

- 레거시 `c263769` 커밋이 local `refreshing` state와 `unmountOnBlur`에 의존하기보다, query key prefix와 `queryClient.refetchQueries(["movies"])`로 refresh를 cache 쪽에서 설계하기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 이 방향이 여전히 맞지만, `refetchQueries`는 promise를 반환해 technically await 가능하되, RefreshControl 로딩 표시는 그 promise를 기다리기보다 query의 `isRefetching` / `useIsFetching`에 맡기는 쪽이 더 자연스럽다고 정리했다.
- 지금은 `@tanstack/react-query`, object syntax, grouped `useIsFetching`, `invalidateQueries`와 `refetchQueries`의 역할 구분까지 같이 보는 편이 더 정확하다고 메모했다.
- React Native에선 refresh를 remount 문제로 보기보다 `focusManager`, screen focus refetch, `subscribed: isFocused` 같은 query lifecycle 도구로 다루는 쪽이 modern best practice에 가깝다고 남겼다.

## [2026-04-11] analysis | API 응답 타입과 Nullable 미디어 필드 처리

- 레거시 `f93741c` 커밋이 `MovieResponse` 같은 응답 타입을 API boundary에 올리고, `useQuery<MovieResponse>`로 화면 query 결과를 구체 타입으로 다루기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 이 방향이 맞지만, 지금은 화면 제네릭 반복보다 typed query function과 `queryOptions` helper 쪽으로 타입이 흘러가게 두는 편이 더 현재식이라고 메모했다.
- `poster_path || ""` 같은 빈 문자열 sentinel보다, nullable 미디어 필드를 image component나 mapper 한 곳에서 명시적으로 처리하는 편이 더 좋고, screen에선 early fallback boundary를 세워 null guard를 줄이는 쪽이 낫다고 남겼다.

## [2026-04-11] analysis | 검색 입력 상태와 쿼리 실행 시점 분리

- 레거시 `b88e6ae` 커밋이 search screen에 `query` 문자열과 `TextInput`을 도입하며, 검색 입력 상태를 결과 query와 분리하기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 검색은 controlled input, query key에 search term 포함, `enabled` / `skipToken` 또는 submit/debounce/deferred value 기반 lazy query로 여는 편이 더 현재식이라고 메모했다.
- 같은 커밋에서 `Movies` / `Tv`의 refresh 로직이 다시 local `setRefreshing`으로 돌아간 점도 같이 기록하고, refresh indicator는 여전히 query state에서 파생하는 편이 좋다고 연결해뒀다.

## [2026-04-11] analysis | 미디어 섹션 재사용과 화면 스캐폴딩

- 레거시 `6e6f418` 커밋이 `moviesApi` / `tvApi` namespace, 공용 `Loader`, 공용 horizontal section `HList`를 통해 비슷한 콘텐츠 화면을 빠르게 복제 가능한 구조로 만들기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 이 방향이 맞지만, `HList`의 `any[]`와 `original_title ?? original_name` 같은 필드 혼합은 shared UI보다 mapper / normalized model이 먼저여야 한다는 신호라고 메모했다.
- root `ScrollView` + 내부 horizontal `FlatList` 구조는 과도기 구조이고, 현재식으론 root virtualization을 더 빨리 검토하며, `react-native-gesture-handler`의 list wrapper는 제스처 interop 이유가 있을 때만 고르는 편이 더 자연스럽다고 정리했다.

## [2026-04-11] analysis | 상세 화면 히어로 헤더와 최소 라우트 파라미터

- 레거시 `d0a9aa2` 커밋이 상세 화면 상단에 backdrop + gradient + poster + title hero header를 도입하면서, detail screen을 정보 페이지보다 콘텐츠 페이지처럼 다루기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 gradient overlay와 hero header 자체는 여전히 유효하지만, route params에 `Movie | TV` 전체 객체를 싣기보다 `id`와 `mediaType` 같은 최소 식별자만 넘기고 detail query를 여는 편이 더 current하다고 메모했다.
- `expo-linear-gradient`는 지금도 자연스러운 선택이지만, nullable poster/backdrop path는 `|| \"\"`보다 media fallback 위치를 한 군데로 모으는 편이 낫고, header option 동기화는 필요 시 `useLayoutEffect`까지 검토할 수 있다고 남겼다.

## [2026-04-11] analysis | 탭 이탈 시 스택 초기화와 화면 새로고침

- 레거시 `7cbbd1b` 커밋을 계기로, 예전 `unmountOnBlur` 발상과 현재 `popToTopOnBlur` / query-driven refresh를 분리해서 설명하는 새 분석 문서를 추가했다.
- 핵심 결론을 "navigator reset과 data refresh는 다른 층의 문제"로 정리하고, 탭 blur에서 nested stack reset은 navigation 옵션으로, 화면 데이터 freshness는 TanStack Query lifecycle로 다루는 현재식 해석을 남겼다.
- 앞으로 위키 제목과 파일명은 커밋번호보다 남는 개념이 먼저 보이도록 짓는 규칙을 `llm-wiki` 스킬과 참조 문서에도 반영했다.

## [2026-04-11] study | noovies tab bar icons와 navigation theme를 Expo Router로 번역

- `nomadcoders/noovies`의 `5d4b570` 커밋이 `NavigationContainer` theme와 `tabBarIcon`을 함께 다룬 단계라는 점을 새 분석 문서로 정리했다.
- `nomad-diary` 루트 layout에 `ThemeProvider`를 추가해 Expo Router 구조에서 React Navigation theme를 현재식으로 주입했다.
- 홈/스터디 화면 문구와 entry study content를 갱신해, 과거의 `tabBarIcon`과 현재 `NativeTabs` icon API 차이를 앱 안에서 바로 읽을 수 있게 했다.

## [2026-04-11] decision | 위키 결론을 앱 구현까지 이어가는 기본 원칙 추가

- 학습 단계 워크플로우에, 위키에 남긴 구현 가능한 결론은 가능한 같은 흐름 안에서 `nomad-diary/`에도 반영한다는 기본 원칙을 추가했다.
- 즉 문서만 쌓지 않고, 앱 구조와 직접 연결되는 내용은 계속 샌드박스 구현으로 이어가는 것을 현재 작업 방식으로 고정했다.
- 바로 구현하지 못하는 내용은 보류 이유와 다음 액션을 위키에 남기도록 규칙을 분명히 했다.

## [2026-04-11] study | native Search 탭과 header search flow 구현

- `NativeTabs`에 `role="search"` 탭을 추가하고, 현재 SDK 54 기준으로 Android는 search icon, iOS는 search role 중심으로 탭을 구성했다.
- `app/(tabs)/search/_layout.js`에 nested `Stack`을 두고 `app/(tabs)/search/index.js`에서 `headerSearchBarOptions`를 연결해 native search bar 데모를 만들었다.
- 위키 메모를 앱 안에서 다시 찾을 수 있도록 search result 목록을 연결했고, 관련 비교와 해석을 별도 분석 문서로 남겼다.

## [2026-04-11] fix | 탭 화면 safe area 보정

- header 없는 탭 화면에서 상단 cutout과 하단 tab bar에 내용이 가려지는 문제를 확인했다.
- `core/scroll-chrome.js`를 추가해 header 없는 탭, header 있는 탭, 일반 stack 화면의 scroll inset 규칙을 분리했다.
- 홈, 스터디, 검색, 상세 화면이 이 공통 규칙을 쓰도록 바꾸고, 관련 메모를 별도 분석 문서로 남겼다.

## [2026-04-11] analysis | 검색 제출 기반 지연 쿼리와 병렬 검색

- 레거시 `91c9335` 커밋이 `enabled: false` + `refetch()`로 submit 시점에 movie / tv 검색 query를 병렬로 트리거하고, 검색어를 query key 일부로 연결하기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 이 방식이 여전히 가능하지만, 기본값은 `inputValue`와 `submittedQuery`를 분리하고, committed query를 기준으로 선언형 search query를 여는 쪽에 더 가깝다고 메모했다.
- `skipToken`과 manual `refetch()`의 tradeoff, `URLSearchParams` 기반 query 문자열 구성, controlled `TextInput`, 결과 list virtualization까지 함께 연결해뒀다.

## [2026-04-11] analysis | 검색 결과 섹션과 프레서블 미디어 카드 내비게이션

- 레거시 `14928ee` 커밋이 `Search` 화면에 실제 movie/tv 결과 섹션을 붙이고, `VMedia` / `HMedia` / `Slide` 같은 공용 카드들을 detail 진입점으로 연결하기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 nested navigate 패턴 자체는 맞지만, `TouchableOpacity` / `TouchableWithoutFeedback`보다 `Pressable`, `navigate(..., { screen, params })`의 최소 식별자 payload, 그리고 card UI와 route topology의 느슨한 분리가 더 current하다고 메모했다.
- 검색 결과가 붙는 순간부터 list virtualization, primitive item props, `expo-image`, detail query contract까지 함께 봐야 한다는 점도 기존 검색/상세 문서와 연결해뒀다.

## [2026-04-11] analysis | 상세 화면 제목 파라미터와 네이티브 스택 헤더 테마

- 레거시 `3b5562e` 커밋이 detail route에 `originalTitle` params를 싣고, `Detail` 화면 내부 `setOptions`로 header title을 동기화하며, native stack header 색상을 color scheme에 맞추기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 `originalTitle` 같은 값은 screen identity 자체보다 chrome seed로 읽는 편이 더 적절하고, 실제 route params는 `id` / `mediaType` 같은 최소 식별자에 optional `initialTitle`를 더하는 구조가 더 current하다고 메모했다.
- `headerTitleStyle.color`만이 아니라 `headerTintColor`, theme token 기반 header chrome, route param typing과 `@ts-ignore` 제거까지 함께 봐야 한다는 점도 기존 detail/search 문서들과 연결해뒀다.

## [2026-04-11] analysis | 상세 화면 전체 객체 파라미터와 유니온 라우트 타이핑

- 레거시 `847e9f1` 커밋이 `Slide` / `HMedia` / `VMedia` 같은 카드에서 `fullData`를 받아 detail route params로 통째로 넘기고, `Detail: Movie | TV` union typing으로 상세 화면이 list preview payload를 실제로 소비하기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 이 방식이 빠른 detail shell을 만드는 practical step이긴 하지만, React Navigation 관점에선 여전히 full object params보다 최소 식별자 params가 권장되고, preview data는 optional seed 또는 TanStack Query `placeholderData` 쪽으로 읽는 편이 더 current하다고 메모했다.
- `fullData` object prop은 list item memoization과 primitive prop 원칙에 불리하고, `poster_path || \"\"` fallback도 여전히 거칠기 때문에, discriminated union, `Pressable`, `expo-image`, detail query 기반 구조로 다시 번역하는 쪽이 더 자연스럽다고 연결해뒀다.

## [2026-04-11] analysis | 프리뷰 파라미터에서 미디어 타입 분기 상세 쿼리로 전환

- 레거시 `ade5797` 커밋이 preview params만 읽던 `Detail` 화면에 `moviesApi.detail` / `tvApi.detail` query를 붙이며, 실제 detail endpoint를 배경에서 읽기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 preview params와 authoritative detail query를 분리하는 방향 자체는 맞지만, `useQuery` 두 개를 `enabled`로 갈라 두기보다 media type discriminant와 id를 기준으로 single active query를 여는 편이 더 current하다고 메모했다.
- `placeholderData`와 `initialData` 차이, `enabled = false` query의 제약, detail key naming, richer detail payload와 screen state machine 설계까지 함께 연결해뒀다.

## [2026-04-11] analysis | 페이지 파라미터 기반 무한 스크롤과 끝지점 페칭

- 레거시 `7aea416` 커밋이 `upcoming` fetcher를 `pageParam` 기반으로 바꾸고, `useInfiniteQuery`의 `getNextPageParam`, `hasNextPage`, `fetchNextPage`를 `FlatList.onEndReached`와 실제로 연결하기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 이 방향이 여전히 맞지만, `useInfiniteQuery` object syntax, `initialPageParam`, `hasNextPage && !isFetchingNextPage` guard, 그리고 initial loading / refresh / next-page loading 분리가 더 current한 기본값이라고 메모했다.
- `FlatList`는 공식 baseline이지만 큰 피드에선 `FlashList`도 빠르게 검토하는 편이 좋고, infinite data의 `pages[]` 구조를 어떻게 flatten해 소비할지도 별도 설계가 필요하다는 점을 함께 연결해뒀다.

## [2026-04-11] ops | noovies 분석 노트 개념 중심 재정리

- 커밋 해시와 part 번호가 파일명 앞에 오던 분석 노트 16개를 개념 중심 파일명으로 일괄 rename했다.
- 각 문서의 H1도 `한국어 | English` 형식의 개념 중심 제목으로 바꾸고, 커밋/챕터 정보는 계속 `범위` 섹션에 남기도록 정리했다.
- `wiki/index.md`, 관련 페이지 링크, 운영 규칙 문서에도 같은 naming 원칙을 반영해 앞으로 새 noovies 메모도 같은 기준을 따르도록 맞췄다.

## [2026-04-11] analysis | 상세 화면 비디오 액션과 인앱 브라우저 열기

- 레거시 `128e234` 커밋이 detail query 결과의 `videos.results`를 실제 YouTube 버튼 목록으로 렌더하고, `expo-web-browser`로 외부 콘텐츠를 열기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 movie/tv 이중 query를 single active query로 줄인 방향은 맞지만, query key intent를 더 분명히 하고, raw response를 바로 렌더하기보다 video action model을 먼저 정리하며, 버튼은 `Pressable`로 읽는 편이 더 current하다고 메모했다.
- `Linking.openURL()`은 시스템 브라우저, `WebBrowser.openBrowserAsync()`는 인앱 브라우저라는 차이를 공식 Expo 문서 기준으로 함께 정리하고, 제품 의도에 따라 외부 링크 정책을 의식적으로 고르는 편이 좋다고 연결해뒀다.

## [2026-04-11] analysis | 상세 화면 공유 액션과 동적 헤더 버튼

- 레거시 `79bec8b` 커밋이 detail query 결과를 이용해 native share sheet를 호출하고, 데이터가 준비된 뒤 `setOptions({ headerRight })`로 공유 버튼을 헤더에 동적으로 붙이기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 `Share.share()`와 query-driven `headerRight` 자체는 여전히 유효하지만, placeholder header button으로 layout shift를 줄이고, share payload builder와 canonical URL 정책을 helper로 분리하며, `TouchableOpacity`보다 `Pressable`로 읽는 편이 더 current하다고 메모했다.
- React Native `Share` 문서의 iOS/Android payload 차이와 반환값, React Navigation header button 문서의 dynamic `setOptions` 패턴, Expo WebBrowser와의 역할 구분까지 함께 연결해뒀다.

## [2026-04-11] analysis | 무한 쿼리 페이지 구조와 평탄화된 리스트 데이터

- 레거시 `5e8e000` 커밋이 `upcoming` 목록을 `useQuery`에서 `useInfiniteQuery`로 옮기며, 아직 실제 다음 페이지 fetch는 붙지 않았더라도 화면 데이터 shape를 `results`에서 `pages[]` 중심으로 바꾸기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 infinite query의 첫 핵심이 `data.pages` / `data.pageParams` 구조 이해와 flat list data 파생 위치 설계라는 점을 강조했고, JSX 안의 ad-hoc flatten보다 hook 또는 `select` 쪽으로 파생 로직을 모으는 편이 더 current하다고 메모했다.
- React Native `FlatList` / `VirtualizedList` 문서의 shallow compare와 `onEndReachedThreshold` 의미, TanStack Query의 `initialPageParam` / `getNextPageParam` / `maxPages`, 그리고 `FlashList` / `LegendList` 같은 modern virtualizer 선택지까지 함께 연결해뒀다.

## [2026-04-11] maintain | 인덱스와 oh-my-rn 방향 명시

- `wiki/index.md`, `wiki/overview.md`, `wiki/concepts/rn-study-workflow.md`에 노마드 코더 React Native 마스터클래스와 `raw/noovies/`를 주된 staged source로 본다는 점을 명시했다.
- 반복적으로 유효한 교훈을 개인용 RN 스킬 `oh-my-rn`으로 점진적으로 승격한다는 목표를 위키 핵심 문서에 함께 적었다.
- 길어진 분석 문서 목록을 계획과 환경, 내비게이션과 구조, 스타일링과 UI 패턴, 리스트와 피드, 데이터 패칭, 검색과 상세 화면 같은 축으로 재분류해 탐색성을 높였다.

## [2026-04-11] planning | nomad-lang 애니메이션 커밋 라운드 시작

- `raw/nomad-lang/`를 새 staged source로 추가했다.
- 이 저장소는 전체 이력이 정확히 20개 커밋으로 구성되어 있어, oldest → newest 순으로 커밋당 분석 문서 1개씩 만드는 라운드에 잘 맞는다는 점을 기록했다.
- `wiki/analyses/nomad-lang-animation-study-plan.md`를 추가하고, `wiki/index.md`와 `wiki/overview.md`에도 새 소스와 실행 계획을 연결했다.

## [2026-04-11] analysis | Expo 기반 애니메이션 샌드박스 부트스트랩

- 레거시 `a1af7d8` 커밋이 `App.js`는 아직 비워둔 채, Expo 42 + React Native 0.63 + Reanimated 2 + Gesture Handler + native splash/icon/config를 한 번에 세팅해 애니메이션 실험용 앱 셸을 먼저 올린 단계라는 점을 정리했다.
- 현재 기준으론 이 셋업이 예전 Expo 템플릿 감각에 가깝고, 오늘의 대응 개념은 `create-expo-app` 기본 스타터, CNG / prebuild, config plugin, Reanimated 4 + worklets 쪽이라고 메모했다.
- 기능 없는 `return null` 셸도 학습상 가능하지만, 현재식으로는 최소 visible scaffold를 두고 runtime을 더 빨리 검증하는 편이 낫다는 해석을 함께 남겼다.

## [2026-04-11] analysis | 수동 프레임 루프와 Animated.Value 도입

- 레거시 `74862f8` 커밋이 `setInterval`과 React state로 박스를 수동 이동시키며 animation을 "프레임마다 state를 바꾸는 일"로 다루기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 이런 JS timer loop보다 `Animated.Value`나 Reanimated shared value처럼 animation 전용 값을 source of truth로 삼는 쪽이 기본값이라고 메모했다.

## [2026-04-11] analysis | Animated.Value와 createAnimatedComponent 기초

- 레거시 `543c325` 커밋이 `Animated.Value`와 `Animated.createAnimatedComponent`를 도입해, React state가 아니라 animated value가 style을 직접 구동하는 전환점이라는 점을 정리했다.
- 현재 기준으론 `Animated.View` 또는 Reanimated animated component가 더 자연스럽고, transform/opacity 중심 설계가 더 강한 기본값이라고 메모했다.

## [2026-04-11] analysis | 첫 spring 기반 움직임

- 레거시 `e7e3283` 커밋이 첫 `Animated.spring`을 붙이며, 수동 위치 변경에서 spring physics 감각으로 넘어가는 지점이라는 점을 정리했다.
- 현재 기준으론 spring 선택 자체는 여전히 유효하지만, 새 구현에선 Reanimated `withSpring`과 명확한 motion intent 정의가 더 current하다고 메모했다.

## [2026-04-11] analysis | 애니메이션 상태 토글과 안정적인 값 생명주기

- 레거시 `03db0dc` 커밋이 `useRef(new Animated.Value(...))`와 React state 토글을 결합해, animated value의 생명주기와 UI state를 분리하기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 animated value/shared value는 재생성하지 않고 안정적으로 유지하며, animation trigger와 business state를 섞지 않는 편이 더 current하다고 메모했다.

## [2026-04-11] analysis | 단일 값에서 여러 스타일로의 interpolation

- 레거시 `e0872c4` 커밋이 하나의 animated value에서 opacity와 border radius를 동시에 파생하며 interpolation 사고를 처음 보여준다는 점을 정리했다.
- 현재 기준으론 하나의 source value에서 여러 style을 파생하는 구조는 여전히 핵심이며, 색상/회전/overlay까지 확장할 때도 같은 발상이 유지된다고 메모했다.

## [2026-04-11] analysis | ValueXY와 다중 속성 interpolation

- 레거시 `618ee19` 커밋이 `Animated.ValueXY`와 rotation, background color interpolation을 결합해 2D 좌표 기반 다중 피드백을 만들기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 2D gesture translation은 shared value나 gesture event에서 읽고, 파생 style은 `interpolate`로 계산하는 편이 더 current하다고 메모했다.

## [2026-04-11] analysis | ValueXY 기반 다중 좌표 경로와 반복 이동

- 레거시 `432618c` 커밋이 `Animated.sequence`와 `Animated.loop`, `Dimensions` 기반 코너 좌표를 써서 scripted path animation을 만든 단계라는 점을 정리했다.
- 현재 기준으론 이런 반복 경로 예제도 여전히 유용하지만, 제품 interaction에선 scripted loop보다 user-driven motion 쪽으로 빨리 넘어가는 편이 더 current하다고 메모했다.

## [2026-04-11] analysis | PanResponder 기반 드래그 추적

- 레거시 `d88be38` 커밋이 scripted motion을 버리고 `PanResponder`의 `dx`, `dy`를 `ValueXY`에 직접 연결해 gesture-driven drag로 축을 바꾼 단계라는 점을 정리했다.
- 현재 기준으론 `PanResponder`는 여전히 존재하지만, 새 gesture-heavy UI의 기본 비교 대상은 Gesture Handler `Pan` gesture라고 메모했다.

## [2026-04-11] analysis | 드래그 해제 후 스프링 복귀

- 레거시 `4a5e62f` 커밋이 drag release 후 spring으로 원점 복귀시키며, drag 중간 상태와 release 후 정착 상태를 분리하기 시작한 단계라는 점을 정리했다.
- 현재 기준으론 tracking, release, snap/settle을 별도 phase로 설계하고, release logic을 파생 motion과 분리하는 편이 더 current하다고 메모했다.

## [2026-04-11] analysis | 드래그 누적을 위한 setOffset과 flattenOffset

- 레거시 `eed4b20` 커밋이 `setOffset`과 `flattenOffset`으로 현재 위치를 새로운 기준점으로 누적하는 drag model을 도입한 단계라는 점을 정리했다.
- 현재 기준으론 `_value` 직접 접근보다 base position과 translation을 명시적으로 나누고, accumulated position을 더 구조적으로 관리하는 편이 더 current하다고 메모했다.

## [2026-04-11] analysis | 스와이프 카드의 압축·수평 드래그 기초

- 레거시 `5d83cb5` 커밋이 자유로운 2D drag 예제를 수평 swipe card 문제로 축소하고, `scale`과 `translateX`를 분리해 첫 제품형 card interaction 감각을 만든 단계라는 점을 정리했다.
- 현재 기준으론 `Gesture.Pan()` + shared value 조합, transform/opacity 중심 애니메이션, gesture translation과 deck state 분리가 더 current하다고 메모했다.

## [2026-04-11] analysis | 회전 피드백과 스와이프 dismiss 임계값

- 레거시 `301bf0a` 커밋이 `rotateZ` interpolation과 좌우 dismiss threshold를 더해, release 시점이 중앙 복귀냐 화면 밖 dismiss냐를 고르는 decision point가 된다는 점을 정리했다.
- 현재 기준으론 fixed magic number 대신 카드 폭/화면 폭 비율과 velocity까지 함께 보는 적응형 threshold가 더 current하다고 메모했다.

## [2026-04-11] analysis | 스택형 카드 깊이감과 명시적 액션 버튼

- 레거시 `ad5c3ca` 커밋이 뒤 카드 preview scale과 close/check 버튼을 추가해, drag dismiss와 explicit action이 같은 결과로 합쳐지는 deck UI 단계라는 점을 정리했다.
- 현재 기준으론 secondary card feedback은 derived value로 읽고, 버튼 입력은 `Pressable`과 단일 action pipeline으로 묶는 편이 더 current하다고 메모했다.

## [2026-04-11] analysis | 카드 덱 순환과 데이터 기반 아이콘 시퀀스

- 레거시 `1284ef9` 커밋이 `icons` 배열과 `index` 상태를 도입해 dismiss completion 뒤 다음 아이콘으로 넘어가는 data progression을 붙인 단계라는 점을 정리했다.
- 현재 기준으론 raw index 증가보다 stable id 기반 deck state와 end-of-deck guard를 함께 설계하는 편이 더 current하다고 메모했다.

## [2026-04-11] analysis | dismiss 전환을 위한 스프링 정지 임계값 튜닝

- 레거시 `5206494` 커밋이 spring의 `restDisplacementThreshold`, `restSpeedThreshold`를 조정해 dismiss completion timing을 직접 건드린 단계라는 점을 정리했다.
- 현재 기준으론 completion tuning을 product motion intent와 함께 읽고, Reanimated `withSpring`의 `stiffness`, `damping`, `energyThreshold` 같은 현재 파라미터로 번역하는 편이 더 current하다고 메모했다.

## [2026-04-11] analysis | 분류형 드래그를 위한 세로 드롭존 셸

- 레거시 `62e9c37` 커밋이 카드 덱을 걷어내고 상단 `알아`, 하단 `몰라`, 중앙 카드만 남긴 세로 drop-zone 셸로 문제를 재정의한 단계라는 점을 정리했다.
- 현재 기준으론 gesture 코드보다 target shell과 도메인 action model을 먼저 고정하는 흐름이 여전히 유효하다고 메모했다.

## [2026-04-11] analysis | 중앙 드래그 카드와 드롭 타깃 상호작용 기초

- 레거시 `2ca4700` 커밋이 중앙 카드에 pan responder와 scale feedback, 원위치 복귀를 다시 붙여 실제 draggable subject를 살린 단계라는 점을 정리했다.
- 현재 기준으론 `PanResponder`보다 `Gesture.Pan()`과 shared value가 기본 후보이고, hover/highlight는 translation에서 파생하는 편이 더 current하다고 메모했다.

## [2026-04-11] analysis | 드롭존 확대 피드백과 승인 드롭 시퀀스

- 레거시 `cd8a2f2` 커밋이 drag 도중 target zone scale feedback과, accepted drop 뒤 fade/scale-out + position reset sequence를 도입한 단계라는 점을 정리했다.
- 현재 기준으론 단순 `dy` threshold보다 target geometry 기반 acceptance와, hover feedback/acceptance/post-drop transition을 분리하는 설계가 더 current하다고 메모했다.

## [2026-04-11] analysis | 드롭 완료 후 다음 항목으로 진행하는 상태 전이

- 레거시 `dcd05db` 커밋이 accepted drop completion callback에서 `index`를 증가시키고 animated values를 복구해, 다음 아이템으로 넘어가는 진행형 drag-and-drop 흐름을 만든 단계라는 점을 정리했다.
- 현재 기준으론 이런 흐름을 작은 state machine처럼 읽고, animation reset과 data advance, end-of-list 처리를 하나의 전이 모델로 설계하는 편이 더 current하다고 메모했다.

## [2026-04-11] maintain | nomad-lang 애니메이션 문서 스킬 원재료 보강

- `nomad-lang` 애니메이션/제스처 20개 분석 문서 전부에 `## 스킬 추출 후보` 섹션을 추가했다.
- 각 문서에 트리거, 권장 기본값, 레거시 안티패턴, 예외, 현재식 코드 스케치, 스킬 규칙 초안을 고정 포맷으로 넣어 나중에 스킬로 옮기기 쉽게 맞췄다.
- [애니메이션·제스처 스킬 추출 후보](analyses/animation-and-gesture-skill-extraction-seeds.md) 문서를 새로 만들어 규칙 묶음과 우선 승격 후보도 함께 정리했다.

## [2026-04-11] maintain | noovies 문서 스킬 원재료 확장

- noovies 기반 UI/데이터 분석 문서 44개에 `## 스킬 추출 후보` 섹션을 추가했다.
- 문서마다 트리거, 권장 기본값, 레거시 안티패턴, 예외, 현재식 코드 스케치, 스킬 규칙 초안을 같은 포맷으로 넣어 `oh-my-rn` 후보로 바로 뽑아낼 수 있게 정리했다.
- [noovies UI·데이터 스킬 추출 후보](analyses/noovies-ui-and-data-skill-extraction-seeds.md) 문서를 새로 만들어 내비게이션, 피드, 서버 상태, 검색, 상세, 스타일링 축의 우선 승격 후보를 한 장으로 묶었다.

## [2026-04-11] maintain | oh-my-rn 스킬 초안 생성

- `~/.codex/skills/oh-my-rn/SKILL.md`를 새로 만들고, `vercel-react-native-skills`를 baseline으로 삼는 personal RN decision skill 초안을 잡았다.
- `references/core-defaults.md`, `references/ui-and-data.md`, `references/animation-and-gesture.md`를 함께 추가해 noovies와 nomad-lang에서 추출한 규칙을 현재식 기본값과 코드 스케치 중심으로 묶었다.
- 위키의 두 원장, [애니메이션·제스처 스킬 추출 후보](analyses/animation-and-gesture-skill-extraction-seeds.md)와 [noovies UI·데이터 스킬 추출 후보](analyses/noovies-ui-and-data-skill-extraction-seeds.md),도 초안 생성 이후 상태로 갱신했다.

## [2026-04-11] maintain | oh-my-rn v1 규칙집 정제

- `~/.codex/skills/oh-my-rn/references/v1-rules.md`를 새로 만들고, 지금 가장 자주 쓰일 8개 규칙을 `rule / why / avoid / exceptions / example` 형식으로 먼저 고정했다.
- 이번 라운드에서 먼저 승격한 축은 내비게이션 owner 분리, root virtualized feed, query 중심 서버 상태, query 파생 refresh, input/committed search 분리, 최소 detail params, single motion source, track/decide/settle gesture flow다.
- `~/.codex/skills/oh-my-rn/SKILL.md`와 `references/core-defaults.md`도 새 규칙집을 먼저 읽는 구조로 갱신했다.
- [noovies UI·데이터 스킬 추출 후보](analyses/noovies-ui-and-data-skill-extraction-seeds.md)와 [애니메이션·제스처 스킬 추출 후보](analyses/animation-and-gesture-skill-extraction-seeds.md)에 어떤 규칙이 v1로 먼저 승격됐는지 함께 남겼다.

## [2026-04-11] analysis | nomad-diary 로컬 데이터 학습 계획

- `raw/nomad-diary/`를 새 active source로 추가하고, 저장소 전체 이력이 10개 커밋이라는 점을 확인했다.
- [nomad-diary 로컬 데이터 학습 계획](analyses/nomad-diary-local-data-study-plan.md) 문서를 새로 만들어, 이번 라운드를 local DB, `AsyncStorage` 대안, layout animation, 광고, reward event sequencing 축으로 읽겠다고 정리했다.

## [2026-04-11] maintain | nomad-diary 10개 커밋 개념 문서화

- `nomad-diary`의 10개 커밋을 각각 개념 중심 문서 10개로 정리했다.
- 이번 라운드에서 특히 남긴 축은 Expo app shell, modal write flow, 작은 감정 기록 폼, Realm 기반 온디바이스 DB, reactive local collection, `LayoutAnimation`, 광고 SDK build boundary, banner/rewarded placement, reward event sequencing이다.
- 각 문서에는 레거시 커밋이 실제로 한 것, 현재 대응 개념, 현재 기준 베스트 프랙티스, `oh-my-rn`으로 승격 가능한 스킬 추출 후보를 함께 넣었다.
- `wiki/index.md`와 `wiki/overview.md`도 `nomad-diary`를 새 active source로 연결하고, local persistence / ads 축 문서를 바로 찾을 수 있게 갱신했다.

## [2026-04-11] maintain | nomad-diary 규칙을 oh-my-rn으로 승격

- `nomad-diary` 라운드에서 반복된 규칙을 `oh-my-rn`의 `v1-rules.md`로 승격했다.
- 이번에 먼저 올린 규칙은 local persistence 선택 기준, DB provider ownership, reactive local list, simple `LayoutAnimation`, small compose form, ads build boundary, rewarded ads placement, event-gated side effect sequencing이다.
- supporting note로 `~/.codex/skills/oh-my-rn/references/local-persistence-and-monetization.md`도 추가했다.
- 위키에는 [nomad-diary 로컬 퍼시스턴스·광고 스킬 추출 후보](analyses/nomad-diary-local-persistence-and-ads-skill-extraction-seeds.md) 문서를 새로 만들어, 어떤 규칙이 실제로 승격됐는지 따로 남겼다.

## [2026-04-11] maintain | nomad-diary 후속 규칙 2개 추가 승격

- `oh-my-rn`에 `expo-sqlite-migrations-live-in-oninit-with-user-version` 규칙을 추가해, `SQLiteProvider onInit`과 `PRAGMA user_version` 기반 migration / schema versioning을 별도 규칙으로 고정했다.
- 작은 작성 폼 규칙도 `small-compose-forms-handle-keyboard-and-local-first-commit`으로 확장해 `Pressable`, keyboard handling, duplicate submit guard, local-first write timing을 함께 다루게 했다.
- supporting note와 [nomad-diary 로컬 퍼시스턴스·광고 스킬 추출 후보](analyses/nomad-diary-local-persistence-and-ads-skill-extraction-seeds.md)도 같은 상태로 갱신했다.

## [2026-04-11] maintain | 저장소 선택 지도와 스킬 승격 기준 정리

- React Native 저장소 판단을 위해 [RN 저장소 선택 지도](concepts/rn-storage-decision-map.md) 문서를 새로 만들고, `AsyncStorage`, `Realm`, `expo-sqlite`, `Supabase`, `jsonb`를 로컬/서버/캐시 층으로 나눠 정리했다.
- `jsonb`는 로컬 객체 DB 대체재가 아니라 서버 Postgres의 유연한 필드 전략이라는 점, 새 Expo 앱의 로컬 DB 기본값은 `expo-sqlite` 쪽이 더 차분하다는 현재 선택도 함께 명시했다.
- [RN 스킬 승격 기준](concepts/rn-skill-promotion-criteria.md) 문서를 새로 만들어 어떤 교훈을 `oh-my-rn` v1 규칙으로 올리고, 어떤 교훈은 seed로 남길지 판단하는 기준을 정리했다.
- `wiki/index.md`, [개요](overview.md), [RN 학습 워크플로우](concepts/rn-study-workflow.md)도 같은 흐름으로 갱신해, 앞으로의 최신 비교 기준을 `vercel-react-native-skills`로 더 명확하게 고정했다.

## [2026-04-11] ingest | social-coin auth·query·chart 라운드 추가

- `https://github.com/nomadcoders/social-coin.git`를 `raw/social-coin/`으로 가져오고, 전체 8개 커밋 흐름을 확인했다.
- [social-coin 소스 개요](sources/social-coin.md)와 [social-coin Firebase 인증·차트 학습 계획](analyses/social-coin-firebase-auth-and-chart-study-plan.md)을 새로 만들어, Firebase auth, public crypto API, detail chart, Supabase 비교 축을 먼저 고정했다.
- 커밋별로:
  - [암호화폐 트래커 샌드박스 부트스트랩](analyses/expo-crypto-tracker-sandbox-bootstrap.md)
  - [Firebase auth SDK 선택과 네이티브 빌드 경계](analyses/firebase-auth-sdk-selection-and-native-build-boundary.md)
  - [auth state 기반 navigator gating과 엔트리 셸](analyses/auth-state-gated-navigation-and-entry-shell.md)
  - [email/password 회원가입 폼과 submit guard](analyses/email-password-signup-flow-with-submit-guard.md)
  - [query 기반 코인 목록 fetch와 도메인 필터링](analyses/query-driven-coin-list-fetch-and-filtering.md)
  - [애니메이션 코인 그리드 카드와 detail 진입](analyses/animated-coin-grid-cards-and-detail-entry.md)
  - [coin detail 병렬 query와 header identity seed](analyses/coin-detail-query-branch-and-header-identity.md)
  - [chart 데이터 파생과 Victory Native 현대화](analyses/historical-price-chart-data-and-victory-migration.md)
  를 만들었다.
- Firebase는 SDK 브랜드보다 runtime/native build boundary 문제로 읽고, auth/backend 관련 문서에는 Supabase 기준 대응 개념도 같이 적었다.
- [social-coin 인증·백엔드·차트 스킬 추출 후보](analyses/social-coin-auth-backend-and-chart-skill-extraction-seeds.md) 문서를 추가해 auth SDK 선택, session-gated navigation, auth form, public query, chart pipeline 규칙을 seed로 따로 묶었다.
- `wiki/index.md`와 [개요](overview.md)도 갱신해 `social-coin`을 새 active source로 연결했다.
