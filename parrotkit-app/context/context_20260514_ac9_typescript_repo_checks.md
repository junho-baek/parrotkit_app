# AC 9 TypeScript Repo Checks — 2026-05-14 KST

## Scope

- Completed AC 9 for the ParrotKit v1 navigation realignment follow-up.
- Web QA and simulator QA were out of scope for this task.
- No commit, push, or merge was performed.

## Change

- Updated `src/core/i18n/app-language.tsx` so `copy.nav` matches the actual root tab contract:
  - `index`
  - `explore`
  - `my`
- Removed the stale `home`, `recipes`, and `source` nav-copy keys from the typed nav map.

## Reason

- The focused root tab check already expected the bottom tabs to be limited to `index`, `explore`, and `my`.
- The broad project TypeScript check failed because `RootNativeTabs` passed `copy.nav` into a helper typed as `Record<RootTabName, string>`, but the i18n nav object still used the old key shape.

## Verification

Focused TypeScript checks passed:

- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-primary-cta-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-blank-shoot-board-recipe-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-owned-recipe-cards-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-recent-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.profile-bottom-clearance-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-contract-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-home-access-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-reload-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-storage-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.prompter-full-script-display-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.prompter-mode-state-check.json`

Broad TypeScript check passed:

- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

## Notes

- `npm run build` was not run, per project instruction to avoid build unless explicitly requested.
- Source/Recipes were not reintroduced as root bottom tabs.
