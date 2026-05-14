# ParrotKit failed-items follow-up — 2026-05-14 12:03 KST

## Scope
Continued only the failed/skipped/pending ParrotKit v1 items from Ouroboros session `orch_78808bb15d74`, using repeated Codex passes with `superpowers:using-superpowers` plus direct targeted fixes/review.

## Completed fixes
- Locked Reference link and Brand context creation options now stay on manual blank flow and show Pro/coming-soon guidance instead of starting API/paid flows.
- Prompter save flow has local saved-take state, returns to the same cut board with selected take query params, and supports immediate My Take / take status refresh through local mock state.
- Saved takes and saved/copied recipes expose Home/My/Profile access destinations.
- Explore recipe template copy creates a local owned recipe and exposes start-filming destination into the copied recipe prompter.
- Expanded take viewer final-take assertion was corrected to assert the explicitly selected final take id; bounded Codex review found no product-flow must-fix, only direct `sucrase-node` alias tooling caveat.

## Verification passed
Used a temporary `NODE_PATH` alias for direct `sucrase-node` checks that import `@/...` modules.

Focused sucrase checks passed:
- `src/features/recipes/lib/recipe-create-options.test.ts`
- `src/features/recipes/lib/cut-card-reference-viewer-section.test.ts`
- `src/features/recipes/lib/cut-card-take-viewer-section.test.ts`
- `src/features/recipes/lib/cut-card-action-status.test.ts`
- `src/features/recipes/lib/prompter-take-save-state.test.ts`
- `src/features/recipes/lib/saved-take-storage.test.ts`
- `src/features/recipes/lib/saved-take-reload.test.ts`
- `src/features/recipes/lib/saved-take-home-access.test.ts`
- `src/features/explore/lib/explore-template-copy-action.test.ts`
- `src/features/explore/lib/explore-template-recipe-copy.test.ts`

Focused TypeScript checks passed:
- `tsconfig.recipe-create-options-check.json`
- `tsconfig.saved-take-storage-check.json`
- `tsconfig.saved-take-reload-check.json`
- `tsconfig.saved-take-home-access-check.json`
- `tsconfig.explore-card-detail-check.json`

Broad TypeScript check passed:
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

## Notes
- No commit or push was made.
- Work remains in Ouroboros worktree: `/Users/junho/.ouroboros/worktrees/parrotkit-app/orch_78808bb15d74/parrotkit-app`.
- Codex review pass returned BLOCK only because direct `sucrase-node` without alias cannot resolve `@/...`; final verification passed with explicit temporary `NODE_PATH` alias.
