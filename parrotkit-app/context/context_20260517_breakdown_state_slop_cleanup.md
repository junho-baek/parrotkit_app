# Context: Breakdown State Slop Cleanup

Date: 2026-05-17

## Summary

The yellow/red Breakdown state cards introduced for #21 QA looked like alert chrome and conflicted with `DESIGN.md` simplicity guardrails. This cleanup removes the alert-like treatment.

## Changes

- Partial reference-analysis state is no longer rendered in Breakdown when the Breakdown content itself is readable.
- Failed state now renders as a muted inline note rather than a red bordered/fill card.
- Removed fake retry CTA text from the visual state; the real retry flow is not implemented yet.
- Replaced provider-timeout QA copy with user-facing copy: `Could not refresh Breakdown. Use the current guide for now.`
- Added source-contract checks to prevent the yellow/red alert card tokens from returning.

## Screenshots

- `output/playwright/breakdown-state-slop-cleanup-20260517/ios-partial-no-alert.png`
- `output/playwright/breakdown-state-slop-cleanup-20260517/ios-failed-inline-note.png`

## Verification

Passed:

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `git diff --check`

## Notes

- This is a visual cleanup, not a provider retry implementation.
- Android emulator capture was not retried here; the previous QEMU/ADB blocker remains tracked on #21.
