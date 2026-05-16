# 2026-05-16 Navigation Source Removal Paste Action

## 배경

GitHub #11 supersedes the older Source route model. Paste must be a centered main-tab action that opens the reference recipe drawer in place, not a visible `/source` or `/source-actions` destination.

## 목표

- Remove user-facing Source route modules.
- Rename the internal center action from `source` to `paste`.
- Keep Home, Explore, Recipes, My as destination tabs.
- Keep Paste visible as a center action with button semantics and local drawer state.
- Update tests so regressions back to Source destination behavior fail.

## 범위

- Root tab config, icons, viewport matrix, app language nav copy.
- Root tab shell Paste action wiring.
- Source/source-actions route removal or compatibility redirect.
- Navigation contract tests and focused TypeScript validation.

## 변경 파일

- `src/core/navigation/root-tab-config.ts`
- `src/core/navigation/root-tab-icons.ts`
- `src/core/navigation/root-tab-viewport-matrix.ts`
- `src/core/i18n/app-language.tsx`
- `src/app-shell/navigation/root-native-tabs.tsx`
- `src/app/(tabs)/paste.tsx`
- `src/app/(tabs)/source.tsx`
- `src/app/source-actions.tsx`
- `src/app/_layout.tsx`
- `src/core/navigation/global-create-cta.ts`
- `src/core/navigation/root-tab-config.test.ts`
- `src/core/navigation/root-tab-viewport-matrix.test.ts`
- `src/core/navigation/root-tab-ios-layout-verification.test.ts`
- `src/core/navigation/root-tab-android-layout-verification.test.ts`

## 테스트

- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- `./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts`
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts`
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-ios-layout-verification.test.ts`
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-android-layout-verification.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

## 롤백

Revert the navigation commit to restore the previous `source`-named Paste center action and route wrappers.

## 리스크

- Expo Tabs may require a screen module for the center action. Use hidden `/paste` redirect with `href: null` rather than a product route.
- Existing tests and viewport matrices currently use `source`; update all in one commit to avoid partial breakage.

## 결과

- Source route/product navigation was removed.
- Paste is now a non-destination center action named `paste`.
- Home, Explore, Recipes, My are the only destination tabs.
- Navigation contract tests and TypeScript passed.
- 연결 context: `context/context_20260516_navigation_source_removal_paste_action.md`
