# 2026-05-16 Navigation Source Removal Paste Action

## 요약

GitHub #13/#14 범위로 Source Inbox/product route 모델을 제거하고, Paste를 main tab shell의 in-place drawer action으로 정리했다.

## 변경

- Destination tabs are Home, Explore, Recipes, My.
- Paste remains visible as centered bottom action with button semantics.
- Paste no longer has a route href.
- Internal center action name changed from `source` to `paste`.
- `/source` and `/source-actions` route modules were removed.
- `source-actions` is no longer registered in the root stack.
- Root navigation tests now assert Paste is not counted as a destination route.

## 검증

- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-ios-layout-verification.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-android-layout-verification.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `git diff --check`
- PASS: non-test source search found no `Source Inbox`, `/source`, `/source-actions`, or `source`-named Paste route target.
- PASS: `EXPO_NO_TELEMETRY=1 CI=1 npm run start -- --port 8090`

## 리스크

- Expo Tabs still needs an internal hidden `/paste` screen module. It redirects to Home if directly reached and has `href: null` in the bottom nav.
- Native simulator proof for Home/Explore/Recipes/My Paste drawer behavior remains for #15.
