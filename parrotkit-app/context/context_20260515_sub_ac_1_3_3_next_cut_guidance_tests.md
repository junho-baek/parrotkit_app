# 2026-05-15 Sub-AC 1.3.3 Next Cut Guidance Tests

## Summary
- Added a focused Home Continue fixture for the no-missing-required-cut case.
- The fixture covers a board where every required cut has a saved My Take, so Continue still lands on the shooting board overview, omits highlight metadata, and keeps camera entry gated behind a cut tap.
- Existing focused coverage in `home-workflow-resolution.test.ts` covers required cuts with and without saved My Takes and the no-missing-cut resolver result.

## Verification
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`

## Notes
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts` still fails before assertions in this runner because `@/core/mocks/parrotkit-data` is not resolved by plain `sucrase-node`; this was not changed by this sub-AC.
