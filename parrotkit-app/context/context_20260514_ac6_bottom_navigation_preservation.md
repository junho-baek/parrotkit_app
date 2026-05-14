# Context 2026-05-14 AC6 Bottom Navigation Preservation

## 작업
AC 6: Bottom navigation remains exactly Home, Explore, My; Source and Recipes do not return as bottom tabs.

## 확인
- `src/core/navigation/root-tab-config.ts`의 `rootTabNames`는 `['index', 'explore', 'my']`만 포함한다.
- `src/core/navigation/root-native-tabs.tsx`는 `rootTabNames.map((tabName) => <NativeTabs.Trigger ... />)` 경로로만 visible bottom tab trigger를 생성한다.
- `rg "NativeTabs\\.Trigger|name=\\\"(source|recipes)\\\"|rootTabNames|Source|Recipes" src/core/navigation src/app/'(tabs)' src/core/i18n -n` 결과, `source`와 `recipes` route 파일은 남아 있지만 bottom tab trigger로 직접 렌더링되지 않는다.
- `src/core/i18n/app-language.tsx`의 tab label contract는 `index`, `explore`, `my`만 요구한다.

## 변경
- production code 변경 없음.
- 이번 AC 6 기록용 plan/context 문서만 추가했다.

## 검증
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- `xcrun simctl list devices booted` 실패:
  - CoreSimulatorService connection invalid / connection refused.
  - live iPhone simulator UI 확인은 수행하지 못했다.

## 리스크
- simulator 접근 차단으로 실제 iPhone screenshot evidence는 남기지 못했다.
- 다만 현재 NativeTabs visible trigger source와 focused contract checks 기준으로 Source/Recipes bottom tab 미노출은 확인했다.

## 연결 문서
- `plans/20260514_ac6_bottom_navigation_preservation.md`
