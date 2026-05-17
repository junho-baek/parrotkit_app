# 2026-05-18 Recipe Create Drawer Motion And Bottom Margin

## Request

User confirmed the Paste drawer opens, then noted:

- the drawer does not feel like it smoothly rises from the bottom
- the bottom area needs more margin

## Design Context

Checked `DESIGN.md` before implementation:

- recipe creation must remain a bottom drawer / modal sheet
- drawer should keep dim backdrop, rounded top corners, visible drag handle, close affordance, compact tabs, niche cards, visual goal cards, and one primary CTA
- fixed CTAs should respect bottom safe area padding

## Change

- Added a subtle React Native `Animated` entrance:
  - drawer sheet translates from `56px` below to `0`
  - duration `280ms`
  - `Easing.out(Easing.cubic)`
- Added backdrop fade through the same progress value.
- Added short dismiss animation for backdrop tap and close X:
  - duration `180ms`
  - `Easing.in(Easing.cubic)`
- Added CTA footer bottom spacing:
  - `paddingBottom: Math.max(insets.bottom + 18, 28)`
- Kept the existing drawer content and Link default mode intact.
- Added `recipe-create-drawer-motion.test.ts` as a source contract.

## Verification

Passed:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-create/recipe-create-drawer-motion.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
git diff --check
```

## QA Notes

- Restart Expo with `--clear` after this commit so Expo Go receives the motion update.
- Native user confirmation is still useful because animation feel cannot be fully proven by source tests.
