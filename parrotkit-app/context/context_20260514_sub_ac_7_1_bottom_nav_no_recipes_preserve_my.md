# Context 2026-05-14 Sub-AC 7.1 Bottom Nav No Recipes Preserve My

## 작업
Sub-AC 7.1: bottom navigation에서 Recipes tab이 보이지 않도록 유지하면서 My 접근은 보존한다.

## 확인
- `src/core/navigation/root-tab-config.ts`의 visible root tab contract는 `['index', 'explore', 'my']`이다.
- `src/core/navigation/root-native-tabs.tsx`는 `rootTabNames.map(...)`만으로 `NativeTabs.Trigger`를 렌더링한다.
- `rg` 확인 결과 `NativeTabs.Trigger`는 `src/core/navigation/root-native-tabs.tsx`의 `rootTabNames` map 경로뿐이다.
- `src/app/(tabs)/my.tsx`는 `ProfileScreen`을 export하므로 My route 접근은 유지된다.
- `src/app/(tabs)/recipes.tsx`는 route file로 남아 있지만 visible bottom tab trigger에는 연결되어 있지 않다.

## 변경
- Production code 변경 없음. 이전 Seed run에서 적용된 Home/Explore/My bottom tab shell을 보존했다.
- `plans/20260514_sub_ac_7_1_bottom_nav_no_recipes_preserve_my.md`를 추가하고 결과를 기록했다.
- 이 context 문서를 추가했다.

## 검증
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- `xcrun simctl list devices booted` 실패:
  - CoreSimulatorService connection invalid / connection refused.
  - iPhone simulator screenshot evidence는 이 환경에서 생성하지 못했다.

## 리스크
- Acceptance UI gate는 iPhone simulator지만 현재 실행 환경에서 CoreSimulatorService가 차단되어 live UI 확인은 불가했다.
- 판단 근거는 current source contract와 focused TypeScript/runtime checks이다.

## Git
- Seed constraint에 따라 commit, push, merge를 수행하지 않았다.
