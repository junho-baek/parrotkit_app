# Issue #10 Shooting Board Hierarchy Cleanup

Date: 2026-05-16 KST

Target: `/Users/junho/project/parrotkit-app/parrotkit-app`

## Summary

PASS with residual media-network caveat.

- Reference media is now placed at the top of each cut card, above the `Cut #` label.
- The old board-level reference hero was removed.
- The Reference slot beside My Take was removed.
- `No take yet`, `0 takes`, and `Take saved` collapsed-card labels were removed.
- My Take now carries state through its own preview surface, count badge, and status icon.
- The separate right-side completion circle was removed so completion reads from My Take state.
- The shooting note box CTA was replaced with a functional inline note/check row.

## Evidence

- `output/playwright/issue-10-shoot-board-hierarchy-20260516/android-board-overview.png`
- `output/playwright/issue-10-shoot-board-hierarchy-20260516/ios-board-overview.png`
- `output/playwright/issue-10-shoot-board-hierarchy-20260516/contact-sheet.svg`

## Verification

PASS:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-action-status.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-media-slots.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-take-viewer-section.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-reference-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
npx -y @google/design.md lint DESIGN.md
git diff --check
```

`DESIGN.md` lint: 0 errors, 14 existing unused-token warnings.

## Runtime QA

Android:

- Captured through `com.anonymous.parrotkitapp` from current Metro on port `8095`.
- Result: PASS.

iPhone:

- Captured fresh through Expo Go using the underlying CoreSimulator `simctl`.
- Result: PASS for this shooting-board hierarchy surface.

## Residual Risk

- Remote reference thumbnails can render as dark media shells when the device has not loaded remote image URLs yet. The layout and interaction are correct, but a later asset-caching pass could make the thumbnails more visually rich.
- This report covers the shooting-board hierarchy cleanup. If #10 is treated as the full original capture package, the broader seven-screen package should still be regenerated after this patch.

