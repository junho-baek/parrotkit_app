# route_explore_correct

## Summary

AC 5 verified and guarded: the Explore tab opens Explore, and Home from Explore returns to the canonical Home tab route.

## Changes

- Added focused route contract assertions to `src/core/navigation/root-tab-config.test.ts`.
- The test now verifies:
  - `rootTabHrefs.explore === '/explore'`
  - Explore and Home tab hrefs are distinct
  - `src/app/(tabs)/explore.tsx` renders `ExploreScreen`
  - `src/app/(tabs)/index.tsx` renders `HomeScreen`

## Verification

- `npx tsc -p tsconfig.root-tabs-check.json` passed.
- `npx tsc -p tsconfig.json --noEmit` passed.
- Focused Node route contract check passed.
- DESIGN.md guardrail copy scan passed for the touched navigation/route files; broader scan only found internal identifier names, not rendered navigation copy.

## Notes

- No screenshots were added.
- No commit or push was performed because the shared worktree contains concurrent sibling-agent changes.
