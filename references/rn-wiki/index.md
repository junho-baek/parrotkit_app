# 인덱스 | Index

이 문서는 위키의 내용 중심 목차다.

## 방향

- 이 위키는 노마드 코더 React Native 마스터클래스와 `raw/noovies/`, 애니메이션 중심 샘플 앱 `raw/nomad-lang/`, 그리고 local DB / ads 중심 샘플 앱 `raw/nomad-diary/`를 staged source로 삼는다.
- 실제 학습 중에는 레거시 소스가 하는 방식, 최신 React Native 권장 방식, 그리고 현재 우리가 채택한 방향을 분리해서 기록한다.
- 반복적으로 유효한 교훈은 개인용 RN 스킬 `oh-my-rn`으로 점진적으로 승격하는 것을 목표로 한다.

## 개요 문서

- [overview](overview.md): 현재 학습 범위와 상태를 한눈에 정리한 개요 문서.

## 예정된 소스

- `raw/noovies/`: 노마드 코더 React Native 마스터클래스에서 따라갈 예정인 레거시 React Native 코스 프로젝트. 아직 본격 ingest 전이다.
- `raw/nomad-lang/`: 애니메이션과 gesture 상호작용을 중심으로 읽을 예정인 레거시 React Native / Expo 샘플 앱. 저장소 전체가 20개 커밋으로 구성되어 있다.
- `raw/nomad-diary/`: 온디바이스 DB, `AsyncStorage` 대안, layout animation, AdMob 흐름을 다루는 레거시 React Native / Expo 샘플 앱. 저장소 전체가 10개 커밋으로 구성되어 있다.
- `raw/social-coin/`: Firebase auth, login flow, public crypto API, detail chart를 다루는 레거시 React Native / Expo 샘플 앱. 저장소 전체가 8개 커밋으로 구성되어 있다.

## 개념 문서

- [rn-study-workflow](concepts/rn-study-workflow.md): 계획, 실제 학습, 비교, 스킬 추출까지의 기본 루프.
- [rn-storage-decision-map](concepts/rn-storage-decision-map.md): `AsyncStorage`, `Realm`, `SQLite`, `Supabase`, `jsonb`를 같은 문제처럼 섞지 않기 위한 저장소 선택 지도.
- [rn-skill-promotion-criteria](concepts/rn-skill-promotion-criteria.md): 어떤 교훈을 `oh-my-rn`으로 바로 승격하고, 어떤 교훈은 seed로 남길지 판단하는 기준.

## 소스 문서

- [social-coin](sources/social-coin.md): `social-coin` 저장소 전체의 기술 축, 커밋 흐름, Firebase↔Supabase 비교 포인트를 묶은 source summary.

## 엔티티 문서

- 실제 학습이 시작되면 필요한 엔티티 문서를 여기에 추가한다.

## 분석 문서

### 스킬 추출 원장

- [noovies-ui-and-data-skill-extraction-seeds](analyses/noovies-ui-and-data-skill-extraction-seeds.md): noovies 기반 44개 UI/데이터 분석 문서에서 `oh-my-rn`으로 승격하기 쉬운 규칙 묶음과 우선 승격 후보를 정리한 원장.
- [nomad-diary-local-persistence-and-ads-skill-extraction-seeds](analyses/nomad-diary-local-persistence-and-ads-skill-extraction-seeds.md): `nomad-diary` 10개 문서에서 local persistence, 작은 폼, `LayoutAnimation`, 광고, reward event 흐름 규칙을 `oh-my-rn` 승격 관점으로 다시 묶은 원장. 현재는 `expo-sqlite` migration / `user_version` 규칙과 keyboard-aware local-first compose 규칙까지 후속 승격 메모가 붙어 있다.
- [social-coin-auth-backend-and-chart-skill-extraction-seeds](analyses/social-coin-auth-backend-and-chart-skill-extraction-seeds.md): `social-coin` 8개 문서에서 auth SDK 선택, session-gated navigation, auth form, public query, chart pipeline 규칙을 seed 형태로 다시 묶은 원장.
- 위 원장들의 상위 규칙은 현재 `~/.codex/skills/oh-my-rn/references/v1-rules.md`로 먼저 승격해 관리한다.

### 계획과 환경

- [rn-study-plan](analyses/rn-study-plan.md): 현재 범위, 학습 루프, 다음 단계 정리.
- [nomad-lang-animation-study-plan](analyses/nomad-lang-animation-study-plan.md): `raw/nomad-lang/`의 20개 커밋을 개념 중심 문서 20개로 읽어낼 계획과 비교 축을 정리한 메모.
- [nomad-diary-local-data-study-plan](analyses/nomad-diary-local-data-study-plan.md): `raw/nomad-diary/`의 10개 커밋을 local DB, 광고, layout animation, 이벤트 sequencing 축으로 읽어낼 계획을 정리한 메모.
- [social-coin-firebase-auth-and-chart-study-plan](analyses/social-coin-firebase-auth-and-chart-study-plan.md): `raw/social-coin/`의 8개 커밋을 auth SDK 선택, navigator gating, public query, detail chart 축으로 읽어낼 계획 메모.
- [rn-bare-cli-flow](analyses/rn-bare-cli-flow.md): 왜 bare React Native Community CLI 흐름이 이 워크스페이스에 잘 맞는지 정리.
- [rn-setup-status](analyses/rn-setup-status.md): 현재 환경 상태, 첫 bare RN 앱 상태, Expo 대비 bare RN 핵심 차이 정리.
- [expo-prebuild-flow](analyses/expo-prebuild-flow.md): Expo 기본 생성, `prebuild`, `run:ios`, Watchman 복구 흐름 정리.
- [expo-splash-screen-loading](analyses/expo-splash-screen-loading.md): `nomad-diary`에서 splash screen 자동 숨김을 막고 준비 완료 뒤 직접 닫는 흐름 메모.
- [expo-preload-patterns](analyses/expo-preload-patterns.md): `useAssets`, `useFonts`, `Image.prefetch`, `expo-splash-screen`을 함께 쓰는 preload 패턴 정리.

### 인증, 백엔드, 차트

- [expo-crypto-tracker-sandbox-bootstrap](analyses/expo-crypto-tracker-sandbox-bootstrap.md): `social-coin` 첫 커밋을 auth/data/native boundary가 생길 앱 셸 부트스트랩 관점으로 다시 읽은 메모.
- [firebase-auth-sdk-selection-and-native-build-boundary](analyses/firebase-auth-sdk-selection-and-native-build-boundary.md): Firebase JS SDK, RNFirebase, Supabase Auth를 runtime boundary와 product backend 관점에서 다시 비교한 메모.
- [auth-state-gated-navigation-and-entry-shell](analyses/auth-state-gated-navigation-and-entry-shell.md): auth session이 root navigator branch를 가르는 구조를 현재식으로 정리한 메모.
- [email-password-signup-flow-with-submit-guard](analyses/email-password-signup-flow-with-submit-guard.md): 작은 auth form의 local state, focus handoff, duplicate submit guard를 현재식으로 정리한 메모.
- [query-driven-coin-list-fetch-and-filtering](analyses/query-driven-coin-list-fetch-and-filtering.md): public market data를 query 계층과 도메인 필터링으로 다루는 구조를 정리한 메모.
- [animated-coin-grid-cards-and-detail-entry](analyses/animated-coin-grid-cards-and-detail-entry.md): 코인 grid card를 detail 진입용 재사용 프리미티브로 읽은 메모.
- [coin-detail-query-branch-and-header-identity](analyses/coin-detail-query-branch-and-header-identity.md): detail header seed와 병렬 query를 최소 route params 관점으로 정리한 메모.
- [historical-price-chart-data-and-victory-migration](analyses/historical-price-chart-data-and-victory-migration.md): historical price 데이터를 chart point로 파생하고 Victory Native를 현재 패키지 상태와 함께 다시 읽은 메모.

### 로컬 퍼시스턴스와 광고

- [expo-journal-sandbox-bootstrap](analyses/expo-journal-sandbox-bootstrap.md): `nomad-diary` 첫 커밋의 Expo 42 저널 샌드박스를 현재 앱 셸 부트스트랩 관점으로 다시 읽은 메모.
- [modal-journal-navigation-and-compose-entry](analyses/modal-journal-navigation-and-compose-entry.md): 홈 화면에서 작성 화면으로 들어가는 modal journal IA를 현재 native navigation 기준으로 다시 읽은 메모.
- [emotion-picker-and-validated-journal-form](analyses/emotion-picker-and-validated-journal-form.md): 감정 선택기와 작은 작성 폼의 validation 기본값을 현재 RN form 관점으로 다시 읽은 메모.
- [device-local-object-db-bootstrap-with-realm](analyses/device-local-object-db-bootstrap-with-realm.md): `AsyncStorage` string-only 한계를 넘는 온디바이스 DB 도입을 Realm과 현재 local-first persistence 기준으로 다시 읽은 메모.
- [realm-context-injection-and-write-transactions](analyses/realm-context-injection-and-write-transactions.md): Realm connection 주입과 write transaction을 현재 provider / repository 구조로 다시 읽은 메모.
- [reactive-realm-collection-reading-and-list-rendering](analyses/reactive-realm-collection-reading-and-list-rendering.md): reactive local collection 읽기와 list rendering을 현재식 local query 관점으로 정리한 메모.
- [tap-to-delete-with-layout-animation](analyses/tap-to-delete-with-layout-animation.md): local delete action과 `LayoutAnimation` list reflow를 현재 삭제 UX 기준으로 다시 읽은 메모.
- [mobile-ads-sdk-installation-and-build-boundaries](analyses/mobile-ads-sdk-installation-and-build-boundaries.md): 광고 SDK 설치를 native build boundary 문제로 다시 읽은 메모.
- [banner-ads-and-rewarded-gates-in-journal-flow](analyses/banner-ads-and-rewarded-gates-in-journal-flow.md): banner placement와 rewarded gate를 현재 광고 UX 관점으로 정리한 메모.
- [rewarded-ad-event-sequencing-before-persist](analyses/rewarded-ad-event-sequencing-before-persist.md): reward ad 이벤트가 저장 side effect를 여는 흐름을 현재식 event sequencing 관점으로 정리한 메모.

### 애니메이션과 제스처

- [animation-and-gesture-skill-extraction-seeds](analyses/animation-and-gesture-skill-extraction-seeds.md): `nomad-lang` 20개 애니메이션/제스처 문서에서 스킬로 승격하기 쉬운 규칙 묶음과 후보 rule name을 따로 모은 원장.
- [expo-based-animation-sandbox-bootstrap](analyses/expo-based-animation-sandbox-bootstrap.md): `nomad-lang` 첫 커밋의 Expo 42 + RN 0.63 + Reanimated 2 셸 세팅을 현재 `create-expo-app` / prebuild / worklets 관점으로 다시 읽은 메모.
- [manual-frame-loop-and-animated-value-introduction](analyses/manual-frame-loop-and-animated-value-introduction.md): JS timer와 React state로 움직임을 직접 갱신하던 가장 초기 animation 사고방식을 현재 value-driven animation 관점으로 다시 읽은 메모.
- [animated-value-and-create-animated-component-basics](analyses/animated-value-and-create-animated-component-basics.md): `Animated.Value`, `createAnimatedComponent`, animated style binding의 기초를 정리한 메모.
- [spring-driven-first-motion](analyses/spring-driven-first-motion.md): 첫 `Animated.spring` 도입을 현재 spring animation 개념과 비교해 정리한 메모.
- [animation-state-toggle-and-stable-value-lifecycle](analyses/animation-state-toggle-and-stable-value-lifecycle.md): React state 토글과 `useRef(new Animated.Value(...))` 조합이 왜 중요했는지 정리한 메모.
- [single-value-to-multi-style-interpolation](analyses/single-value-to-multi-style-interpolation.md): 하나의 animated value에서 opacity와 border radius를 함께 파생하는 interpolation 기초를 정리한 메모.
- [valuexy-and-multi-property-interpolation](analyses/valuexy-and-multi-property-interpolation.md): `Animated.ValueXY`와 색상/회전 같은 다중 속성 파생을 함께 읽는 메모.
- [valuexy-sequence-paths-and-looped-motion](analyses/valuexy-sequence-paths-and-looped-motion.md): `Animated.sequence` / `Animated.loop` / 좌표 경로 애니메이션을 현재식으로 번역한 메모.
- [panresponder-driven-drag-tracking](analyses/panresponder-driven-drag-tracking.md): scripted motion에서 gesture-driven drag로 축이 바뀌는 지점을 정리한 메모.
- [spring-back-on-gesture-release](analyses/spring-back-on-gesture-release.md): drag release 후 원위치 복귀 spring을 interaction phase 분리 관점에서 정리한 메모.
- [drag-offset-accumulation-with-setoffset-and-flattenoffset](analyses/drag-offset-accumulation-with-setoffset-and-flattenoffset.md): offset 누적이 drag model을 어떻게 바꾸는지 정리한 메모.
- [swipe-card-foundation-with-scale-and-horizontal-drag](analyses/swipe-card-foundation-with-scale-and-horizontal-drag.md): 2D drag 예제를 horizontal swipe card 문제로 축소하는 첫 전환을 정리한 메모.
- [swipe-dismiss-thresholds-and-rotation-feedback](analyses/swipe-dismiss-thresholds-and-rotation-feedback.md): rotation feedback과 좌우 dismiss threshold를 통해 release decision model이 생기는 지점을 정리한 메모.
- [stacked-card-depth-and-explicit-action-buttons](analyses/stacked-card-depth-and-explicit-action-buttons.md): 다음 카드 preview와 명시적 accept/reject 버튼이 추가되며 deck UI가 커지는 단계를 정리한 메모.
- [card-deck-index-cycling-and-data-driven-icon-sequences](analyses/card-deck-index-cycling-and-data-driven-icon-sequences.md): 아이콘 배열과 `index` 상태를 통해 animation 위에 data progression이 올라가는 지점을 정리한 메모.
- [spring-rest-threshold-tuning-for-dismiss-transitions](analyses/spring-rest-threshold-tuning-for-dismiss-transitions.md): dismiss spring의 rest threshold 조정이 completion timing에 미치는 영향을 정리한 메모.
- [vertical-drop-zone-shell-for-classification-drag](analyses/vertical-drop-zone-shell-for-classification-drag.md): 좌우 swipe deck에서 위/아래 분류형 drag-and-drop 셸로 문제를 재정의하는 단계를 정리한 메모.
- [draggable-center-card-and-drop-target-interaction-foundation](analyses/draggable-center-card-and-drop-target-interaction-foundation.md): 중앙 draggable card와 persistent drop target이 같은 화면에서 상호작용하기 시작하는 단계를 정리한 메모.
- [drop-zone-scaling-and-accepted-drop-sequences](analyses/drop-zone-scaling-and-accepted-drop-sequences.md): hover-like target feedback과 accepted drop exit sequence를 정리한 메모.
- [next-item-advance-after-drop-completion](analyses/next-item-advance-after-drop-completion.md): drop completion 뒤 다음 아이템으로 넘어가는 state transition을 정리한 메모.

### 내비게이션과 구조

- [expo-router-stack-native-tabs](analyses/expo-router-stack-native-tabs.md): 하단 시스템 탭바 감각을 위해 `NativeTabs`를 현재 선택으로 다시 채택하고, Android icon 입력 tradeoff까지 적어둔 메모.
- [native-safe-area-in-tabs](analyses/native-safe-area-in-tabs.md): header 없는 탭 화면과 header 있는 화면의 safe area 보정 규칙 메모.
- [expo-native-tabs-search-role](analyses/expo-native-tabs-search-role.md): `role="search"` 탭과 nested `Stack` search bar를 함께 쓰는 현재식 native search 흐름 메모.
- [expo-router-stack-stable-tabs](analyses/expo-router-stack-stable-tabs.md): `NativeTabs`를 잠깐 걷어낸 stable `Tabs` 우회와, 왜 현재 선택으로 남기지 않았는지 정리한 비교 메모.
- [expo-router-domain-file-organization](analyses/expo-router-domain-file-organization.md): Expo Router에서 `app`을 route-only로 두고 `core`와 `features`를 바깥으로 분리하는 구조, 그리고 LLM이 읽기 쉬운 도메인 이름 규칙 메모.
- [native-stack-vs-js-stack](analyses/native-stack-vs-js-stack.md): 현재 워크스페이스가 실제로 어떤 stack을 쓰는지와, 2026 기준 기본 추천이 무엇인지 정리한 짧은 메모.
- [configuring-stack-navigation-best-practices](analyses/configuring-stack-navigation-best-practices.md): `#2.11 Configuring Stack Navigation`을 현재 native stack 기준으로 다시 풀어쓴 설정 best practice 메모.
- [Expo TypeScript 전환과 내비게이션 타이핑](analyses/expo-typescript-migration-and-navigation-typing.md): 레거시 noovies의 TypeScript 도입 단계를 현재 Expo / React Navigation / Expo Router 기준의 타입 설정과 navigation typing 관점으로 다시 읽은 메모.
- [내비게이션 의존성 준비와 preload 단순화](analyses/navigation-dependency-setup-and-preload-simplification.md): 레거시 noovies 커밋 `e79282f`의 실제 변경 범위를 내비게이션 의존성 준비와 preload 단순화 관점으로 다시 읽은 메모.
- [네이티브 내비게이션의 공통 탭/헤더 옵션](analyses/shared-tab-and-header-options-in-native-navigation.md): 레거시 noovies 커밋 `3489af6`의 `screenOptions` 설명을 현재 `Stack + NativeTabs` 구조와 1:1로 비교한 메모.
- [중첩 탭/스택과 모달 경계](analyses/nested-tabs-stacks-and-modal-boundaries.md): 레거시 `Stacks and Tabs` 단계를 최신 nested modal 구조와 parent navigator 처리 기준으로 다시 읽은 메모.
- [색상 스킴 기반 내비게이션 테마](analyses/color-scheme-driven-navigation-theming.md): 레거시 noovies 커밋 `75bb483`의 다크 모드 적용을 현재 `Stack + NativeTabs + theme tokens` 구조로 번역한 메모.
- [네이티브 탭 아이콘과 Router ThemeProvider](analyses/native-tab-icons-and-router-theme-provider.md): 레거시 noovies 커밋 `5d4b570`의 `NavigationContainer theme + tabBarIcon`을 현재 Expo Router `ThemeProvider + NativeTabs` 구조로 번역한 메모.

### 스타일링과 UI 패턴

- [styled-components-vs-nativewind-and-shadcn](analyses/styled-components-vs-nativewind-and-shadcn.md): 레거시 `styled-components`와 현재 RN의 `NativeWind` / shadcn-style 선택지를 비교한 메모.
- [stylesheet-create-vs-nativewind](analyses/stylesheet-create-vs-nativewind.md): `StyleSheet.create`와 `NativeWind`의 차이, 그리고 현재 사용자에게 더 잘 맞는 방향을 정리한 메모.

### 리스트, 피드, 캐러셀

- [rn-scroll-cache-upload-query-evolution](analyses/rn-scroll-cache-upload-query-evolution.md): 스크롤, 리스트 virtualization, 이미지 캐싱, 업로드, PATCH mutation, TanStack Query까지의 발전 흐름과 2026 기본값을 한 장으로 정리한 메모.
- [scrollview-flatlist-legendlist-sectionlist](analyses/scrollview-flatlist-legendlist-sectionlist.md): `ScrollView`, `FlatList`, `LegendList`, `SectionList`의 역할과 선택 기준, 그리고 공식 baseline과 modern best practice 차이를 한 장으로 정리한 메모.
- [히어로 캐러셀 스캐폴딩과 라이브러리 선택](analyses/hero-carousel-scaffolding-and-library-selection.md): 레거시 noovies의 `react-native-web-swiper` 도입을 현재 hero carousel / pager 선택 기준으로 다시 읽은 메모.
- [데이터 기반 히어로 화면과 블러 오버레이](analyses/data-driven-hero-screen-and-blur-overlay.md): 레거시 noovies의 실제 영화 데이터 hero 화면 구현을 현재 query, `expo-image`, blur/gradient overlay, virtualized screen 구조 기준으로 다시 읽은 메모.
- [리치 히어로 카드와 테마 적응, Expo tsconfig](analyses/rich-hero-cards-theme-adaptation-and-expo-tsconfig.md): 레거시 noovies의 richer hero card, `react-native-swiper`, `useColorScheme`, `expo/tsconfig.base` 변화를 현재 carousel/image/theme/typing 기준으로 다시 읽은 메모.
- [컴포넌트 추출과 병렬 fetch 리팩터링](analyses/component-extraction-and-parallel-fetch-refactoring.md): 레거시 noovies의 `Poster` / `Slide` 분리와 병렬 fetch 리팩터링을 현재 feature 구조, query layer, prop naming 관점에서 다시 읽은 메모.
- [가로 미디어 행과 홈 피드 확장](analyses/horizontal-media-rows-and-home-feed-expansion.md): 레거시 noovies의 첫 horizontal trending row 구현을 현재 horizontal list, item memoization, 이미지 최적화 기준으로 다시 읽은 메모.
- [혼합 홈 피드 섹션과 세로 개봉 예정 카드](analyses/mixed-home-feed-sections-and-vertical-upcoming-cards.md): 레거시 noovies의 `Coming soon` 세로 섹션 추가를 현재 다중 섹션 피드, root virtualization, 날짜/텍스트/이미지 처리 기준으로 다시 읽은 메모.
- [Pull-to-Refresh와 재사용 미디어 프리미티브](analyses/pull-to-refresh-and-reusable-media-primitives.md): 레거시 noovies의 pull-to-refresh와 `HMedia` / `VMedia` / `Votes` 분리를 현재 virtualized root list, query refetch, memo-friendly item 구조 기준으로 다시 읽은 메모.
- [가로 미디어 행을 위한 FlatList 기본형](analyses/horizontal-flatlist-baseline-for-media-rows.md): 레거시 noovies의 horizontal `FlatList` 전환을 현재 공식 baseline과 modern virtualizer 기준으로 다시 읽은 메모.
- [ListHeader 기반 루트 FlatList 피드 구조](analyses/root-flatlist-feed-architecture-with-list-header.md): 레거시 noovies의 root `FlatList + ListHeaderComponent` 전환을 현재 영화 홈 피드 아키텍처와 modern virtualization 기준으로 다시 읽은 메모.
- [reusable-media-sections-and-screen-scaffolding](analyses/reusable-media-sections-and-screen-scaffolding.md): 공용 가로 미디어 섹션, 공용 로더, 도메인 API namespace를 통해 비슷한 화면을 빠르게 세우는 구조와 그 현재식 한계를 정리한 메모.

### 데이터 패칭과 서버 상태

- [react-query-and-data-fetch-best-practices](analyses/react-query-and-data-fetch-best-practices.md): React Query에서 TanStack Query로 이어진 현재 server-state 기본값과, RN/Expo에서 데이터를 가져오고 갱신하는 실무 기본 패턴을 따로 정리한 메모.
- [Query Provider 준비와 API 레이어 추출](analyses/query-provider-setup-and-api-layer-extraction.md): 레거시 noovies의 `react-query` v3 provider 도입과 `api.ts` 분리를 현재 TanStack Query v5 기준으로 다시 읽은 메모.
- [query-driven-pull-to-refresh](analyses/query-driven-pull-to-refresh.md): pull-to-refresh를 local `refreshing` 토글이 아니라 query refetch 상태에서 파생해 읽는 현재식 개념과, `refetchQueries` / `invalidateQueries` 역할 차이를 정리한 메모.
- [infinite-query-page-shape-and-flattened-list-data](analyses/infinite-query-page-shape-and-flattened-list-data.md): `useInfiniteQuery` 도입 초기에 `results`에서 `pages[]` 구조로 사고가 바뀌는 지점과, virtualized list용 flat data를 어디서 파생할지 정리한 메모.
- [page-param-infinite-scrolling-and-end-reached-fetching](analyses/page-param-infinite-scrolling-and-end-reached-fetching.md): `useInfiniteQuery`의 `pageParam`, `getNextPageParam`, `FlatList.onEndReached`를 연결하는 무한 스크롤 기본 구조와 현재식 guard 패턴을 정리한 메모.
- [supabase-expo-upload-and-storage-patterns](analyses/supabase-expo-upload-and-storage-patterns.md): Expo 앱에 Supabase를 붙일 때 auth/session, query, storage upload, gallery/document picker, bucket/path/RLS 설계를 어떻게 나누는지 정리한 메모.

### 검색과 상세 화면

- [api-response-typing-and-nullable-media-fields](analyses/api-response-typing-and-nullable-media-fields.md): query 화면에서 API 응답 타입을 어디에 두고, nullable poster/backdrop path 같은 미디어 필드를 어디서 처리할지 현재식으로 정리한 메모.
- [search-input-state-and-query-trigger-timing](analyses/search-input-state-and-query-trigger-timing.md): 검색 입력 문자열과 실제 query 실행 시점을 분리해서 설계하는 현재식 개념, 그리고 search screen에서 lazy query를 여는 기준을 정리한 메모.
- [search-submit-driven-lazy-queries-and-parallel-search](analyses/search-submit-driven-lazy-queries-and-parallel-search.md): submit 시점에 movie/tv 검색 query를 병렬로 트리거하는 구조와, 현재식 committed query / declarative search 설계를 함께 정리한 메모.
- [search-result-sections-and-pressable-media-card-navigation](analyses/search-result-sections-and-pressable-media-card-navigation.md): 검색 결과를 실제 섹션 UI로 붙이고, 공용 미디어 카드를 detail 진입점으로 만드는 구조를 현재식 pressable/route payload 관점에서 정리한 메모.
- [detail-title-params-and-native-stack-header-theming](analyses/detail-title-params-and-native-stack-header-theming.md): detail route에 title seed params를 싣고 native stack header를 theme와 동기화하는 구조를 현재식 identity/typing/header chrome 관점에서 정리한 메모.
- [full-object-detail-params-and-union-route-typing](analyses/full-object-detail-params-and-union-route-typing.md): list item preview 데이터를 detail route params로 통째로 싣는 구조와, `Movie | TV` union typing을 현재식 preview seed / detail query 관점에서 정리한 메모.
- [preview-params-to-media-type-detail-queries](analyses/preview-params-to-media-type-detail-queries.md): preview route params 위에 movie/tv detail query를 얹는 전환과, 현재식 single detail query / placeholderData 구조를 정리한 메모.
- [detail-video-actions-and-in-app-browser-opening](analyses/detail-video-actions-and-in-app-browser-opening.md): detail query 결과를 YouTube 액션 버튼과 외부 브라우저 열기로 연결하는 구조, 그리고 current link-opening 정책을 정리한 메모.
- [detail-share-actions-and-dynamic-header-buttons](analyses/detail-share-actions-and-dynamic-header-buttons.md): native share sheet, query-driven `headerRight`, 플랫폼별 share payload 정책을 함께 정리한 메모.
- [detail-hero-header-and-minimal-route-params](analyses/detail-hero-header-and-minimal-route-params.md): 상세 화면 hero header의 시각 구조와, 전체 객체 params 대신 최소 식별자 + detail query로 가는 현재식 전략을 함께 정리한 메모.
- [tab-blur-stack-reset-and-query-refresh](analyses/tab-blur-stack-reset-and-query-refresh.md): 탭을 벗어날 때 stack을 어디까지 초기화할지와, 화면 데이터는 query lifecycle에서 어떻게 새로고침할지를 분리해서 정리한 메모.
