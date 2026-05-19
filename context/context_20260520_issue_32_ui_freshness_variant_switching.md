# 2026-05-20 Issue 32 UI Freshness and Variant Switching

## Scope

- GitHub issue #32 only.
- No sibling issue work, no live smoke, no commit, no push.

## Result

- Latest generated API responses preserve `requestId` and `generatedAt` through the Expo mapping path.
- Projection-derived shoot boards carry source freshness metadata: `sourceGeneratedAt`, `sourceProjectionId`, and `sourceRequestId`.
- Recipe detail reconciliation now rejects stale hydrated/editor boards when the latest projection is newer.
- Focused evidence covers no stale 4-cut board after a latest 3-cut generated response.
- Existing variant switching remains `sourceFaithful` default with `goalAdapted` selectable in-place.

## Acceptance Checklist

- PASS: Immediately after generation, the app mapping keeps the latest API response as source of truth; focused test verifies a latest 3-cut response remains 3 scenes and 3 board projection items.
- PASS: Header/card source data, Breakdown transcript, and selected variant align with the latest generated response; tests verify board projection count, latest transcript text, request freshness metadata, and goal-adapted projection availability from the same response.
- PASS: Later hydrate/editor board reconciliation does not overwrite newer generated data; focused test verifies an older 4-cut board is replaced by a newer 3-cut board.
- PASS: Same-generation source board edits are preserved; focused test verifies current-generation edited copy survives reconciliation.
- PASS: Backend two variants exist, board default is `sourceFaithful`, and `goalAdapted` is selectable without a new recipe; audited existing #29/#31 tests and UI helper coverage, with no backend churn.
- PASS: Focused evidence shows no stale 4-cut recipe after a 3-cut response.

## Verification

- PASS: `cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-recipe-generation.test.ts`
- PASS: `cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`
- PASS: `npx --prefix parrotkit-app tsc --noEmit -p parrotkit-app/tsconfig.json`
- PASS: `git diff --check`
- NOT RUN: `cd services/reference-api && go test ./...` because no backend files were touched for issue #32.

## Notes

- Existing unrelated untracked QA outputs were preserved.
- No staging, commit, push, GitHub comment, or issue close was performed.
- No manual screenshot was produced because the change is state reconciliation/mapping behavior, not visual layout; focused deterministic tests cover the stale 4-cut to fresh 3-cut acceptance evidence.
