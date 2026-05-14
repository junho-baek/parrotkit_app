# Home Explore My Top Tabs

## 배경
ParrotKit v1 하단 내비게이션은 Home 중심 흐름을 기준으로 Home, Explore, My/Profile만 최상위 탭으로 제공해야 한다. AC 1에서 Source와 Recipes 탭 제거가 먼저 수행되었으므로, 이번 작업은 남은 v1 탭 3개가 실제로 노출되고 route가 연결되어 있는지 확인한다.

## 목표
- Home, Explore, My/Profile이 v1 top-level tab으로 사용 가능함을 보장한다.
- Source와 Recipes는 top-level tab trigger로 다시 노출하지 않는다.
- 기존 route 파일은 삭제하지 않아 route integrity를 유지한다.

## 범위
- `RootNativeTabs`의 visible trigger 구성을 확인한다.
- `src/app/(tabs)`의 Home, Explore, My/Profile route export 연결을 확인한다.
- 필요 시 navigation 문서만 보강하고, sibling task가 수정 중인 recipe/provider/prompter 파일은 건드리지 않는다.

## 변경 파일
- `plans/20260514_home_explore_my_top_tabs.md`
- `context/context_20260514_home_explore_my_top_tabs.md`

## 테스트
- `rg`로 `NativeTabs.Trigger` 구성이 `index`, `explore`, `my`뿐인지 확인한다.
- `src/app/(tabs)/index.tsx`, `explore.tsx`, `my.tsx`가 각각 Home, Explore, Profile screen으로 export되는지 확인한다.
- `npm exec --offline -- tsc --noEmit`으로 타입 검증을 수행한다.

## 롤백
- 문서 변경만 되돌리면 된다.
- 만약 향후 navigation trigger를 변경했다면 `root-native-tabs.tsx`의 trigger 목록을 AC 1 상태로 되돌린다.

## 리스크
- Expo Router native tabs가 route 파일 존재만으로 탭을 자동 노출하는 동작이 있다면 별도 hide 옵션이 필요할 수 있다.
- `/source`, `/recipes` route 파일은 route integrity를 위해 유지되므로, 링크 진입 정책은 후속 AC에서 Home/My 하위 흐름으로 정리해야 한다.

## 결과
- `RootNativeTabs`의 visible trigger가 Home(`index`), Explore(`explore`), My/Profile(`my`) 3개뿐임을 확인했다.
- `src/app/(tabs)/index.tsx`, `explore.tsx`, `my.tsx`가 각각 Home, Explore, Profile screen으로 연결되어 있음을 확인했다.
- AC 1에서 제거한 Source/Recipes trigger는 다시 추가하지 않았다.
- 연결 context: `context/context_20260514_home_explore_my_top_tabs.md`
