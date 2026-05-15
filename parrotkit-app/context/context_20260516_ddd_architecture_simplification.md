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
