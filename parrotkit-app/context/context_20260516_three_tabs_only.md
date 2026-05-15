# 2026-05-16 Three Tabs Only

## Summary
- Read `DESIGN.md` before touching navigation and kept the change aligned with the lightweight Home, Explore, My hierarchy.
- Tightened `src/core/navigation/root-tab-config.test.ts` so the visible bottom tab contract must expose exactly three user-facing tabs in order: Home, Explore, My.
- Confirmed the current runtime tab config uses `rootTabNames = ['index', 'explore', 'my']`, while sibling hidden-tab work keeps `source` and `recipes` outside the visible tab list.

## Verification
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`

## Blocked Verification
- `npx -y @google/design.md lint DESIGN.md` was attempted, but failed because the sandbox cannot reach `registry.npmjs.org` (`ENOTFOUND`).

## Notes
- No QA screenshots were added for this AC.
- Existing untracked `qa-ui-screenshots/` artifacts were present before this task and were not modified intentionally.
