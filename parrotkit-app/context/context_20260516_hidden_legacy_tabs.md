# Context 2026-05-16 Hidden Legacy Tabs

## 작업
Issue 6 AC 2: Source and Recipes must not appear as visible bottom tabs on iOS or Android.

## 변경
- `src/core/navigation/root-tab-config.ts`
  - `rootTabNames` preserved as `['index', 'explore', 'my']`.
  - Added `hiddenRootTabNames` as `['source', 'recipes']`.
- `src/core/navigation/root-native-tabs.tsx`
  - Visible tab screens are still generated only from `rootTabNames`.
  - Hidden legacy screens are generated from `hiddenRootTabNames` with `options={{ href: null }}`.
- `src/core/navigation/root-tab-config.test.ts`
  - Added assertions that hidden legacy tabs are exactly Source and Recipes and never included in visible tabs.

## 검증
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false` 통과.
- Static inspection confirms visible `Tabs.Screen` entries come from `rootTabNames`, while `source` and `recipes` are registered only through `hiddenRootTabNames` with `href: null`.
- `npx -y @google/design.md lint DESIGN.md` attempted, but failed because the sandbox cannot resolve `registry.npmjs.org` (`ENOTFOUND`). DESIGN.md was read and applied for this scoped nav-only change.

## 리스크
- No native screenshot was captured for this AC-only execution. The code-level contract prevents Source and Recipes from becoming visible bottom tabs, but full Issue 6 native QA is still owned by the broader sibling/aggregate task.
