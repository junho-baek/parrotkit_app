# Context 2026-05-14 Sub-AC 8.4.1 Focused Local QA

## 작업

- Follow-up Seed Sub-AC 8.4.1.
- Scope: focused local QA / automated checks for previously fixed navigation and CTA flows.
- Time: 2026-05-14 17:00:41 KST.
- Constraint: no commit, push, merge, or web QA.

## 범위

- Rechecked root bottom tab contract.
- Rechecked global floating CTA copy and destination.
- Rechecked Home primary CTA, blank recipe creation entry, recent workflow routing, and owned recipe access.
- Rechecked Explore template card/detail routing, template copy, and saved-template filming hydration contracts.
- Rechecked saved take storage, saved take access, reload flow, and prompter save state contracts.

## Focused sucrase checks

All passed with exit code 0 using the existing temporary alias shim:

```sh
NODE_PATH=/tmp/parrotkit-su-alias ./node_modules/.bin/sucrase-node <test>
```

Passed tests:

- `src/core/navigation/root-tab-config.test.ts`
- `src/core/navigation/global-create-cta.test.ts`
- `src/features/home/lib/home-primary-cta.test.ts`
- `src/features/recipes/lib/blank-shoot-board-recipe.test.ts`
- `src/features/explore/lib/explore-card-routing.test.ts`
- `src/features/explore/lib/explore-template-copy-action.test.ts`
- `src/features/recipes/lib/saved-take-home-access.test.ts`
- `src/features/explore/lib/explore-template-recipe-copy.test.ts`
- `src/features/recipes/lib/saved-take-storage.test.ts`
- `src/features/recipes/lib/saved-take-reload.test.ts`
- `src/features/recipes/lib/prompter-take-save-state.test.ts`
- `src/features/home/lib/home-owned-recipe-cards.test.ts`
- `src/features/home/lib/home-recipe-create-entry.test.ts`
- `src/features/home/lib/home-workflow-resolution.test.ts`
- `src/features/home/lib/home-workspace-sections.test.ts`

## Focused TypeScript checks

All passed with exit code 0:

- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-primary-cta-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-blank-shoot-board-recipe-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-home-access-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-reload-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-storage-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-contract-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-owned-recipe-cards-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-recent-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.prompter-mode-state-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.prompter-full-script-display-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`

## Source-level constraint audit

- `src/core/navigation/root-tab-config.ts` still declares only `index`, `explore`, and `my`.
- `src/core/navigation/global-create-cta.ts` still labels the Korean global CTA as `레시피 생성`.
- `src/core/navigation/global-create-cta.ts` still routes to `/recipe-create?mode=manual`.
- `rg -n "New Shoot|Start Shoot|Start Shooting" ... -g '!*.test.ts'` returned no user-facing source hits.
- `rg` search for Source/Recipes bottom-tab declarations returned no hits.
- A remaining `Start Shooting` string exists only in `src/features/recipes/lib/shoot-board-model.test.ts` assertion text and was not part of user-facing UI copy.

## Simulator QA

- Attempted: `xcrun simctl list devices available`
- Result: failed with CoreSimulatorService unavailable:
  - `CoreSimulatorService connection became invalid`
  - `Connection refused`
  - `Unable to locate device set`
- Live iPhone simulator UI evidence remains blocked by the local sandbox environment. No web QA was run.

## 결과

- Focused automated local QA passed for the previously fixed navigation and CTA flows.
- Product files were not changed in this Sub-AC pass.
- No commit, push, or merge was performed.
