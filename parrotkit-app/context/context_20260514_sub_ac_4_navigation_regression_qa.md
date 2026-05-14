# Context 2026-05-14 Sub-AC 4 Navigation Regression QA

## 작업

- Follow-up Seed Sub-AC 4: focused regression QA over the previously realigned navigation paths.
- Time: 2026-05-14 16:51:47 KST.
- Scope: QA/documentation only.

## 범위

- Preserved previous Seed fixes.
- Did not reintroduce Source or Recipes as bottom tabs.
- Did not change the primary floating CTA away from `레시피 생성`.
- Did not run web QA.
- Did not commit, push, or merge.

## 확인한 경로

- Root bottom tab contract remains Home / Explore / My only through `src/core/navigation/root-tab-config.ts` and `src/core/navigation/root-native-tabs.tsx`.
- Global floating creation CTA remains `레시피 생성` and routes to `/recipe-create?mode=manual`.
- Home primary CTA routes continue-workflow recipes to `/recipe/{id}` and blank creation to `/recipe-create?mode=manual`.
- Manual recipe creation creates a local/mock blank shoot-board recipe and returns a `/recipe/{id}` destination.
- Explore template copy/start routes continue to create or hydrate owned recipes and start filming through the copied recipe prompter path.
- Saved recipe and saved take access routes continue to resolve from Home/My/Profile into the relevant recipe, cut, and selected take.
- Prompter save/reload state checks continue to pass for the saved-take return flow.

## Simulator QA

- Attempted `xcrun simctl list devices booted`.
- Attempted `xcrun simctl list devices available`.
- Both failed with CoreSimulatorService unavailable:
  - `CoreSimulatorService connection became invalid`
  - `Connection refused`
  - `Unable to locate device set`
- Result: live iPhone simulator UI evidence could not be produced from this sandbox. This matches earlier Sub-AC 1/3 simulator blockers and is recorded as an environment blocker, not a product-code failure.

## Focused sucrase regression checks

Passed:
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/blank-shoot-board-recipe.test.ts`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/explore/lib/explore-card-routing.test.ts`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/explore/lib/explore-template-copy-action.test.ts`

Passed with temporary `@/...` alias shim at `/tmp/parrotkit-su-alias`:
- `NODE_PATH=/tmp/parrotkit-su-alias ./node_modules/.bin/sucrase-node src/features/recipes/lib/saved-take-home-access.test.ts`
- `NODE_PATH=/tmp/parrotkit-su-alias ./node_modules/.bin/sucrase-node src/features/explore/lib/explore-template-recipe-copy.test.ts`
- `NODE_PATH=/tmp/parrotkit-su-alias ./node_modules/.bin/sucrase-node src/features/recipes/lib/saved-take-storage.test.ts`
- `NODE_PATH=/tmp/parrotkit-su-alias ./node_modules/.bin/sucrase-node src/features/recipes/lib/saved-take-reload.test.ts`
- `NODE_PATH=/tmp/parrotkit-su-alias ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-take-save-state.test.ts`
- `NODE_PATH=/tmp/parrotkit-su-alias ./node_modules/.bin/sucrase-node src/features/home/lib/home-owned-recipe-cards.test.ts`
- `NODE_PATH=/tmp/parrotkit-su-alias ./node_modules/.bin/sucrase-node src/features/home/lib/home-recipe-create-entry.test.ts`
- `NODE_PATH=/tmp/parrotkit-su-alias ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- `NODE_PATH=/tmp/parrotkit-su-alias ./node_modules/.bin/sucrase-node src/features/home/lib/home-workspace-sections.test.ts`

Tooling note:
- Direct sucrase runs for `saved-take-home-access.test.ts`, `explore-template-recipe-copy.test.ts`, and `home-owned-recipe-cards.test.ts` failed before the shim because Node could not resolve `@/...` imports.
- The alias-shim reruns passed, matching the known prior tooling caveat.

## Focused TypeScript regression checks

Passed:
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

## 결과

- No product-code regression found in the focused navigation contract pass.
- Remaining failure: iPhone simulator UI evidence is blocked by the local CoreSimulatorService environment.
- Final verification gate reran the focused sucrase regression loop and focused TypeScript regression loop; both exited 0.
- Context file for this Sub-AC: `context/context_20260514_sub_ac_4_navigation_regression_qa.md`.
