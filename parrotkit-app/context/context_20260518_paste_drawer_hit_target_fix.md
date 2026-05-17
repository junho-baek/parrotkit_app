# 2026-05-18 Paste Drawer Hit Target Fix

## Request

User opened the fresh Expo link and reported that tapping bottom-center Paste still did not open the drawer.

## Root Cause

The previous fix only asserted that `openPasteDrawer` was wired through the custom `tabBarButton`. That was not enough native evidence. The visible Paste item is still an Expo Router tab screen kept visible with `href="/"`, and native tab press delivery can behave like a tab route surface instead of a reliable app-owned action surface.

## Change

- Added an app-shell-owned transparent hit target above the visual center Paste tab.
- The hit target calls `openPasteDrawer` directly.
- The hit target is sized from `tabBarLayout.height` and `rootTabBarCenterActionTopOffset` so it follows the bottom-tab geometry instead of hard-coded device dimensions.
- The hit target is not rendered while the drawer is open, and the drawer overlay remains above it.
- Strengthened `root-tab-config.test.ts` so this dedicated hit target cannot be accidentally removed.

## Verification

Passed:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
git diff --check
```

## QA Notes

- A fresh Expo tunnel must be restarted with `--clear` after this patch so Expo Go does not keep the old bundle.
- Native user confirmation is still the final check for this specific touch delivery bug.

