# Context 2026-05-16 DDD Architecture Simplification

## Task 6: Workspace Provider Application Layer

## 작업

Task 6 from `plans/20260516_ddd_architecture_simplification.md` was implemented without committing.

## 변경

- Moved the current workspace provider implementation from `src/core/providers/mock-workspace-provider.tsx` to `src/application/workspace/mock-workspace-provider.tsx`.
- Replaced `src/core/providers/mock-workspace-provider.tsx` with a compatibility re-export for `MockWorkspaceProvider` and `useMockWorkspace`.
- Updated `src/app/_layout.tsx` to import `MockWorkspaceProvider` directly from `@/application/workspace/mock-workspace-provider`.
- Kept application provider behavior unchanged, including temporary feature helper imports allowed by this task.

## 검증

- PASS: `rg -n "@/features/" src/core/providers src/core/mocks` returned no matches.
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- EXPECTED FAIL: `npm run check:architecture` reports only `core_does_not_import_features: src/core/navigation/root-native-tabs.tsx imports @/features/recipes/screens/recipe-create-screen`, which is owned by Task 7.
- PASS: `git diff --check`

## 리스크

- Feature screens still import `useMockWorkspace` from the old core path by design; the compatibility shim keeps those imports working until later cleanup.
- The application provider still imports feature helper modules temporarily, as allowed by the Task 6 scope.

## Task 7: Root Navigation Shell App Shell Layer

## 작업

Task 7 from `plans/20260516_ddd_architecture_simplification.md` was implemented without committing.

## 변경

- Moved the current root native tabs implementation from `src/core/navigation/root-native-tabs.tsx` to `src/app-shell/navigation/root-native-tabs.tsx`.
- Replaced `src/core/navigation/root-native-tabs.tsx` with a compatibility re-export so old core imports continue to work.
- Updated `src/app/(tabs)/_layout.tsx` to import `RootNativeTabs` from `@/app-shell/navigation/root-native-tabs`.
- Updated `src/core/navigation/root-tab-config.test.ts` so Paste drawer source assertions read the app-shell implementation instead of the core compatibility shim.

## 검증

- PASS: `npm run check:architecture`
- PASS: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

## 리스크

- Runtime behavior should be unchanged because the implementation file was moved intact and the old core path remains as a shim.
- The Task 7 commit step was intentionally skipped because the current request says not to commit.

## Task 8: Recipe Create Screen Support Split

## 작업

Task 8 from `plans/20260516_ddd_architecture_simplification.md` was implemented without committing.

## 변경

- Added `src/features/recipes/screens/recipe-create/recipe-create-copy.ts` for the static recipe create copy/config object.
- Added `src/features/recipes/screens/recipe-create/recipe-create-styles.ts` for the extracted `StyleSheet.create(...)` styles.
- Updated `src/features/recipes/screens/recipe-create-screen.tsx` to import the extracted copy and styles.
- Kept local `StyleSheet` imported in the screen because drawer backdrop and goal image overlay still use `StyleSheet.absoluteFillObject` and `StyleSheet.absoluteFill`.
- Kept drawer JSX and behavior unchanged: backdrop dismiss, close button, title, mode tabs, niche grid, Other input, goal image cards, and bottom CTA remain in the screen.

## 검증

- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `npm run check:architecture`
- PASS: `git diff --check`
- BLOCKED/KNOWN FAIL: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-flow.test.ts` failed before test execution because this runtime does not resolve `@/` imports.
- PASS: Equivalent alias-hook invocation with `node -r sucrase/register` ran `src/features/recipes/lib/recipe-create-flow.test.ts`.

## 리스크

- The direct `sucrase-node` alias limitation is pre-existing and matches earlier context notes for focused tests.
