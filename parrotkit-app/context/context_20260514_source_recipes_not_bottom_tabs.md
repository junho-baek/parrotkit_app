# Context 2026-05-14 Source Recipes Not Bottom Tabs

## 작업
AC 2: Source와 Recipes가 iPhone bottom tab으로 보이지 않아야 한다.

## 확인
- `src/core/navigation/root-tab-config.ts`의 `rootTabNames`는 `['index', 'explore', 'my']`만 포함한다.
- `src/core/navigation/root-native-tabs.tsx`는 `rootTabNames.map((tabName) => <NativeTabs.Trigger ... />)` 구조로 visible bottom tab trigger를 생성한다.
- 정적 검색 결과 `NativeTabs.Trigger`는 `src/core/navigation/root-native-tabs.tsx`의 위 map 경로 하나뿐이고, `source` 또는 `recipes`를 직접 trigger name으로 렌더링하는 코드가 없다.
- `src/app/(tabs)/source.tsx`와 `src/app/(tabs)/recipes.tsx` route 파일은 남아 있지만 visible bottom tab trigger에는 연결되지 않는다.

## 변경
- production code 변경 없음. 이전 Seed run에서 완료된 Home/Explore/My tab shell을 보존했다.
- `plans/20260514_source_recipes_not_bottom_tabs.md`에 결과를 추가했다.
- 이 context 문서를 추가했다.

## 검증
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- `xcrun simctl list devices booted` 실패:
  - CoreSimulatorService connection invalid / connection refused.
  - live iPhone simulator screenshot evidence는 생성하지 못했다.

## QA Artifact Note
- 기존 `qa-ui-screenshots/simulator/04_sim_my.png`는 old five-tab prototype을 보여주는 stale artifact로 확인했다.
- simulator 접근이 차단되어 stale artifact를 최신 Home/Explore/My UI evidence로 교체하지 못했다.
- AC 2 판단은 현재 source contract와 focused checks 기준으로 Source/Recipes bottom tab 미노출을 확인했다.

## 리스크
- 실제 iPhone simulator UI gate는 환경 차단 때문에 완료하지 못했다.
- stale simulator screenshot이 남아 있어 artifact만 보면 이전 prototype처럼 보일 수 있다. 최신 simulator 접근 가능 환경에서 재촬영이 필요하다.
