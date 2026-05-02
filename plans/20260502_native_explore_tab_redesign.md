# Native Explore Tab Redesign

## 배경
- 현재 Explore 탭은 verified creator avatar rail과 2열 recipe card 중심이라 정보 구조가 단순하고, 시안의 검색/필터/허브/추천 흐름과 다르다.
- 사용자는 첨부 시안에 맞춰 탐색 탭 UI 제작을 요청했다.

## 목표
- Explore 탭을 콘텐츠 허브처럼 재구성한다.
- 검색, 카테고리, 빠른 시작, 추천 레시피, 필터형 리스트를 한 화면에서 제공한다.
- 기존 흰 배경, 하단 native tabs, source CTA는 유지한다.
- 기존 mock recipe download/open 흐름은 유지한다.

## 범위
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx` 중심 변경.
- 실제 API, 저장소, recipe detail route 구조는 변경하지 않는다.
- English/Korean language setting에 맞춰 Explore copy도 같이 전환한다.

## 변경 파일
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `plans/20260502_native_explore_tab_redesign.md`
- `context/context_20260502_native_explore_tab_redesign.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- Metro reload 후 simulator screenshot으로 Explore 탭 확인

## 롤백
- Explore screen을 이전 verified creators + 2열 ShootableRecipeCard 구조로 되돌린다.

## 리스크
- mock 데이터가 3개뿐이라 리스트가 시안보다 짧다. 화면 밀도를 위해 derived/static quick-start 카드와 filter chips를 화면 내부에서 보강한다.

## 결과
- Explore 탭을 검색 바, 카테고리 shortcut rail, Quick Start cards, Recommended cards, browse filters/list 구조로 재구성했다.
- English/Korean language state에 따라 Explore copy가 전환되도록 화면 내부 copy dictionary를 추가했다.
- 검색어와 source filter는 실제 `exploreRecipes`에 적용되게 했다.
- 기존 `downloadRecipe`/recipe detail navigation 흐름은 유지했다.
- simulator screenshot으로 새 Explore 화면 반영을 확인했다.
- 연결 context: `context/context_20260502_native_explore_tab_redesign.md`
