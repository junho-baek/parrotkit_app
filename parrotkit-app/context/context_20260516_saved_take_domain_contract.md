# Context 2026-05-16 Saved Take Domain Contract

## 작업

Task 4 from `plans/20260516_ddd_architecture_simplification.md` was implemented without committing.

## 변경

- Added `src/domain/takes/saved-take-contract.ts` as a pure domain module.
- Used a structural saved-take card input because `src/domain/shoot-board/shoot-board-model.ts` does not exist yet.
- Kept `src/features/recipes/lib/saved-take-contract.ts` as a compatibility re-export from the domain module.
- Updated `src/core/mocks/parrotkit-data.ts` to import `SavedTakePersistenceContract` from `@/domain/takes/saved-take-contract`.

## 검증

- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: focused saved take contract test via `node` with `sucrase/register` and a local `@/` alias resolver.
- EXPECTED FAIL: `npm run check:architecture` still reports later provider/navigation feature imports. `src/core/mocks/parrotkit-data.ts` is no longer in the failure list.

## 리스크

- Direct `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/saved-take-contract.test.ts` does not resolve the `@/` alias in this runtime, so the focused test used an equivalent local alias hook.
- `src/core/providers/mock-workspace-provider.tsx` still imports feature modules until later DDD tasks move provider ownership.
