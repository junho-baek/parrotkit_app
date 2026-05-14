# Source Recipes Not Bottom Tabs

## 배경
ParrotKit v1은 broad five-tab prototype이 아니라 Home, Explore, My 중심의 creator workflow navigation으로 맞춘다. AC 2는 iPhone simulator screenshot evidence에서 Source와 Recipes가 bottom tab으로 보이지 않아야 한다.

## 목표
- 현재 bottom tab shell이 Source와 Recipes를 렌더링하지 않는지 확인한다.
- 기존 simulator screenshot artifact가 AC 2 기준을 만족하는지 확인한다.
- 가능한 경우 iPhone simulator에서 최신 screenshot evidence를 남긴다.

## 범위
- `src/core/navigation/root-native-tabs.tsx`의 visible tab trigger 구성 확인.
- `qa-ui-screenshots/simulator/`의 기존 screenshot evidence 확인.
- 필요 시 최소한의 navigation-shell 수정만 수행한다.
- web QA, paid/API/upload flow, Source/Recipes bottom tab 복원은 제외한다.

## 변경 파일
- `plans/20260514_source_recipes_not_bottom_tabs.md`
- `context/context_20260514_source_recipes_not_bottom_tabs.md`
- 필요 시 `src/core/navigation/root-native-tabs.tsx`
- 가능한 경우 `qa-ui-screenshots/simulator/` 내 최신 iPhone simulator evidence

## 테스트
- 정적 확인: `NativeTabs.Trigger` name이 `index`, `explore`, `my`뿐인지 확인한다.
- 정적 확인: `source`와 `recipes`가 `NativeTabs.Trigger`로 사용되지 않는지 확인한다.
- 가능한 경우 iPhone simulator screenshot에서 bottom tab labels에 Source/Recipes가 없는지 확인한다.

## 롤백
- 문서 변경은 이 plan/context 파일을 제거한다.
- screenshot artifact를 갱신했다면 해당 artifact만 이전 상태로 되돌린다.
- 코드 변경이 발생하면 `src/core/navigation/root-native-tabs.tsx`의 해당 변경만 되돌린다.

## 리스크
- 현재 환경에서 CoreSimulatorService가 차단되면 최신 simulator screenshot evidence를 생성하지 못할 수 있다.
- 기존 simulator screenshot artifact가 이전 five-tab prototype을 보여주는 stale evidence일 수 있으므로 최신 code contract와 분리해서 기록해야 한다.

## 결과
- `src/core/navigation/root-tab-config.ts`의 visible root tab contract가 `index`, `explore`, `my`로 제한되어 있음을 확인했다.
- `src/core/navigation/root-native-tabs.tsx`는 `rootTabNames.map(...)`만으로 `NativeTabs.Trigger`를 렌더링하므로 `source`와 `recipes`는 bottom tab trigger로 노출되지 않는다.
- `src/core/navigation/root-tab-config.test.ts`는 `source`/`recipes` negative assertion을 포함한다.
- 기존 `qa-ui-screenshots/simulator/04_sim_my.png`는 old five-tab prototype을 보여주는 stale artifact로 확인했다. CoreSimulatorService 차단 때문에 최신 simulator screenshot으로 교체하지 못했다.
- 연결 context: `context/context_20260514_source_recipes_not_bottom_tabs.md`
