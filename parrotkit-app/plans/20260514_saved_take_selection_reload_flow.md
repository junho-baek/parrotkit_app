# Saved Take Selection Reload Flow

## 배경

Sub-AC 17.3.3 requires confirming that selecting a saved take reopens the associated recipe, cut cards, and take metadata in the expected editing/playback flow. Existing saved-take validation covers storage reload, but not the selection target used by Home/My links.

## 목표

- Confirm a saved-take selection resolves to the correct recipe board cut.
- Confirm the selected take id is preserved for playback/review, even when the final take is different.
- Keep behavior local/mock-only and scoped to Home/My saved-take access.

## 범위

- Add a small reload-target resolver for saved-take selection.
- Add focused TypeScript validation for selecting a saved take into a hydrated cut board.
- Wire recipe detail query handling through the resolver.
- No server persistence, login, cloud sync, payment, or Explore search/community work.

## 변경 파일

- `src/features/recipes/lib/saved-take-reload-flow.ts`
- `src/features/recipes/lib/saved-take-reload.test.ts`
- `src/features/recipes/screens/recipe-detail-screen.tsx`
- `tsconfig.saved-take-reload-check.json`
- `plans/20260514_saved_take_selection_reload_flow.md`
- `context/context_20260514_saved_take_selection_reload_flow.md`

## 테스트

- Red: focused TypeScript check fails before the reload-target resolver exists.
- Green: focused TypeScript check passes after implementation.
- Final: run full TypeScript check if current sibling edits allow it.

## 롤백

Remove the resolver, remove the added validation block, restore direct query handling in `recipe-detail-screen.tsx`, and remove this plan/context note.

## 리스크

- This confirms the route/state contract with TypeScript validation rather than an end-to-end device test.
- Full-project validation can be affected by concurrent sibling-task edits in this dirty worktree.

## 결과

- Added `resolveSavedTakeReloadFlow` to map a saved-take record back onto the hydrated recipe cut board.
- Extended saved-take reload validation to confirm selection preserves recipe id/title, cut id, scene id, selected take id, hydrated cut-card fields, and selected take metadata.
- Updated `RecipeDetailScreen` saved-take query handling to use the resolver when a Home/My saved-take link includes `takeId`.
- 연결 context: `context/context_20260514_saved_take_selection_reload_flow.md`

## 검증

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-reload-check.json` failed with missing `saved-take-reload-flow` module before implementation.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-reload-check.json` passed.
- Full check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` passed.
