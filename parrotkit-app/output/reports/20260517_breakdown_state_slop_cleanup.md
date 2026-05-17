# Breakdown State Slop Cleanup

## What Changed

- Removed the yellow partial-analysis alert card from Breakdown.
- Removed the red failed-analysis alert card from Breakdown.
- Kept failed state as a quiet inline note only.
- Removed fake retry CTA text until a real retry action exists.
- Added source-contract coverage to block the alert card colors/classes from returning.

## Screenshot Evidence

- `output/playwright/breakdown-state-slop-cleanup-20260517/ios-partial-no-alert.png`
- `output/playwright/breakdown-state-slop-cleanup-20260517/ios-failed-inline-note.png`

## Verification

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
git diff --check
```

All commands exited 0.
