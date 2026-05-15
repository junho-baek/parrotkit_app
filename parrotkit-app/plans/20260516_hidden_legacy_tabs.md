# Hidden Legacy Tabs

## 배경
Issue 6 AC 2 requires Source and Recipes to remain reachable as routes but not appear as user-facing bottom tabs. DESIGN.md also favors a simple native-feeling Home, Explore, My navigation surface.

## 목표
- Bottom navigation exposes only Home, Explore, and My as visible tabs.
- Source and Recipes are explicitly registered as hidden legacy tab routes.
- The static nav contract test fails if Source or Recipes become visible tabs.

## 범위
- `src/core/navigation/root-tab-config.ts`
- `src/core/navigation/root-native-tabs.tsx`
- `src/core/navigation/root-tab-config.test.ts`
- Context documentation for this AC

## 변경 파일
- `plans/20260516_hidden_legacy_tabs.md`
- `src/core/navigation/root-tab-config.ts`
- `src/core/navigation/root-native-tabs.tsx`
- `src/core/navigation/root-tab-config.test.ts`
- `context/context_20260516_hidden_legacy_tabs.md`

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- DESIGN.md lint equivalent: read and apply `DESIGN.md` UI guardrails for this scoped nav change.

## 롤백
- Revert the nav config/layout/test changes and remove this task context if the explicit hidden route contract causes Expo Router issues.

## 리스크
- Other agents may be editing adjacent tab presentation code. This task will avoid tab styling and Home hierarchy changes.

## 결과
- `rootTabNames` remains limited to `index`, `explore`, `my`.
- Added an explicit `hiddenRootTabNames` contract for `source`, `recipes`.
- `RootNativeTabs` registers hidden legacy routes from that contract with `href: null`, so Source and Recipes remain routable but not visible bottom tabs.
- `root-tab-config.test.ts` now asserts both the visible three-tab order and the hidden legacy tab set.
- 연결 context: `context/context_20260516_hidden_legacy_tabs.md`
