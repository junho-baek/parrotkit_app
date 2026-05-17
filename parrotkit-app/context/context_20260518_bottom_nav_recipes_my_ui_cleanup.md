# 2026-05-18 Bottom Nav / Recipes / My UI Cleanup

## Request

User deferred #19 live adapter work and asked for a DESIGN.md-aligned UI cleanup:

- bottom center **Paste** action should open the recipe-create drawer, not navigate away
- Recipes should show owned recipes directly
- Recipes should remove search, collections, Continue Shooting, publish/community clutter
- My should remove AI-slop labels, nested boxes, status panels, and redundant CTA/copy
- Use the Superpowers plan and keep the product language compact

## Result

- Updated the root native tab button so non-standard tab actions call `preventDefault()` before invoking `openPasteDrawer`.
- Added nav source contract coverage to guard that Paste opens the in-place drawer and does not call `router.push(rootPasteActionHref)`.
- Replaced the Recipes tab with a flat owned-recipes list:
  - title only
  - row press opens the shooting board
  - no search/filter/collections/Continue Shooting/publish/FAB surfaces
  - count copy uses `cut/cuts` instead of internal `scene/scenes`
- Flattened My into a quiet account/content hub:
  - profile heading only
  - direct saved recipe rows
  - direct saved take rows
  - compact language segmented control
  - no pro/status card, nested list cards, focus tags, boxed empty states, or duplicate Start filming CTA
- Added Recipes and My design-contract tests so these surfaces do not drift back into the removed copy/components.

## Verification

Passed:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipes-screen-design-contract.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/profile/screens/profile-screen-design-contract.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/profile/lib/profile-layout.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
git diff --check
```

Expo web smoke:

```bash
NODE_PATH=/opt/homebrew/lib/node_modules npx expo start --web --port 8084 --clear
curl -I --max-time 10 http://localhost:8084
```

Result: HTTP 200.

## QA Notes

- Native Expo Go/simulator screenshot QA is still recommended before release. Android had no attached device in this pass, and `xcrun simctl list devices` did not return before being killed.
- This change is UI-only and does not modify persistence, Supabase, recipe generation, or #19 provider adapter contracts.

