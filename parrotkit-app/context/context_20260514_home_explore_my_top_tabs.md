# Context 2026-05-14 Home Explore My Top Tabs

## 작업
ParrotKit v1 top-level bottom navigation에서 Home, Explore, My/Profile 3개 탭이 사용 가능한지 확인했다.

## 변경
- `plans/20260514_home_explore_my_top_tabs.md`
  - AC 2 전용 계획과 결과를 기록했다.
- `context/context_20260514_home_explore_my_top_tabs.md`
  - 검증 결과와 범위를 기록했다.

## 확인한 코드 상태
- `src/core/navigation/root-native-tabs.tsx`
  - visible `NativeTabs.Trigger`는 `index`, `explore`, `my`뿐이다.
  - 각 trigger label은 `copy.nav.home`, `copy.nav.explore`, `copy.nav.my`를 사용한다.
- `src/app/(tabs)/index.tsx`
  - `HomeScreen`을 default export한다.
- `src/app/(tabs)/explore.tsx`
  - `ExploreScreen`을 default export한다.
- `src/app/(tabs)/my.tsx`
  - `ProfileScreen`을 default export한다.

## 검증
- `rg -n "NativeTabs\\.Trigger name=\\\"|<NativeTabs.Trigger name=\\\"" src/core/navigation/root-native-tabs.tsx`
  - 결과: `index`, `explore`, `my` 3개 trigger만 확인했다.
- `sed`로 `src/app/(tabs)/index.tsx`, `explore.tsx`, `my.tsx` export 연결을 확인했다.
- `npm exec --offline -- tsc --noEmit`
  - 통과했다.

## 참고
- Source/Recipes route 파일은 route integrity를 위해 유지되어 있지만, bottom tab trigger로는 노출되지 않는다.
- sibling task가 수정 중인 recipe/provider/prompter 파일은 건드리지 않았다.
