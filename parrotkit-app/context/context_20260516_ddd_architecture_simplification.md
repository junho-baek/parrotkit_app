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

## Task 9: Recipe Detail Board Orchestration Split

## 작업

Task 9 from `plans/20260516_ddd_architecture_simplification.md` was implemented without committing.

## 변경

- Added `src/features/recipes/screens/recipe-detail/recipe-detail-board-state.ts` for board overview highlight state and workspace saved-take hydration helpers.
- Added `src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts` covering the empty board overview state contract.
- Updated `src/features/recipes/screens/recipe-detail-screen.tsx` to import the extracted helpers and removed the local board overview/hydration helper copies.
- Kept recipe detail React components, styles, and UI behavior unchanged.

## 검증

- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `npm run check:architecture`
- PASS: `node -r sucrase/register -e "const Module=require('module');const path=require('path');const root=process.cwd();const original=Module._resolveFilename;Module._resolveFilename=function(request,parent,isMain,options){if(request.startsWith('@/')) return original.call(this,path.join(root,'src',request.slice(2)),parent,isMain,options);return original.call(this,request,parent,isMain,options);};require('./src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts');"`
- BLOCKED/KNOWN FAIL: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts` failed before test execution because this runtime does not resolve `@/` imports used by the helper dependency chain.
- PASS: `git diff --check`

## 리스크

- Helper placement uses the requested `screens/recipe-detail/` support directory, so its import path differs from the original plan example.
- The helper uses a narrow structural `GetSavedRecipeTakes` type instead of importing the workspace provider hook, avoiding a screen/provider dependency cycle.

## Final Verification And QA

## 검증

- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `npm run check:architecture`
- PASS: focused alias-hook test bundle:
  - `src/features/recipes/lib/recipe-create-flow.test.ts`
  - `src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`
  - `src/core/navigation/root-tab-config.test.ts`
- PASS: `npx expo install --check`
- PASS: Expo Go simulator smoke on iPhone 17 Pro:
  - Home rendered.
  - Center `Paste` action opened the recipe create bottom drawer.
  - Drawer showed dim backdrop, drag handle, close affordance, `New recipe`, Blank/Link/Brand tabs, niche grid, goal cards, and `Open recipe board`.
  - `Other` niche revealed custom input and accepted `PetCare`.

## 산출물

- `output/playwright/native-qa-20260516/expo-go-home.png`
- `output/playwright/native-qa-20260516/expo-go-recipe-create-drawer.png`
- `output/playwright/native-qa-20260516/expo-go-recipe-create-other-petcare.png`
- Native build logs:
  - `/tmp/parrotkit-ios-build.log`
  - `/tmp/parrotkit-ios-build-clean.log`

## Native Build Blocker

- `npm run ios -- --device "iPhone 17 Pro"` failed in Xcode linker with `Undefined symbols for architecture arm64`; debug log showed `_OBJC_CLASS_$_RCTPackagerConnection` referenced from `libexpo-dev-launcher.a`.
- `EXPO_DEBUG=1 npx expo run:ios --device "iPhone 17 Pro" --no-bundler --no-build-cache` also failed at native link. The clean build log exposed a SwiftUI private framework link issue: `cannot link directly with 'SwiftUICore' because product being built is not an allowed client of it`.
- `npx expo install --check` still reports dependencies are up to date, so this appears to be an iOS dev-client/Xcode/native linker issue rather than a TypeScript or architecture-refactor issue.

## Design Review Notes

- Checked `DESIGN.md` after implementation.
- Recipe creation drawer flow matches the required bottom drawer pattern.
- Removed two user-facing English `workflow` strings in a separate design cleanup commit.
- Remaining `workflow` matches are internal file/function/import names.
