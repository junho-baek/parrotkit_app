# Context 2026-05-14 Sub-AC 2 Forbidden Shoot Copy Verification

## 작업

- Follow-up Seed Sub-AC 2.
- Scope: user-facing navigation and CTA copy for forbidden `Shoot` / `New Shoot` / `Start Shoot` terminology.
- Constraint: no commit, push, or merge.

## 변경

- Updated remaining English user-facing action/navigation copy from exact `Shoot` / `Start Shooting` language to film-oriented copy:
  - Explore card action: `Shoot` -> `Film`
  - Explore detail primary action: `Start Shooting` -> `Start filming`
  - Recipes list small action: `Shoot` -> `Film`
  - Recipe detail internal tab/action labels: `Shoot` -> `Film`, `Start Shooting` -> `Start filming`, `Shoot time` -> `Film time`
  - Cut-card action helper: empty CTA `Shoot` -> `Film`
  - Cut-card take/reference helper copy: `Shoot this cut` -> `Film this cut`
  - Scene card English button text: `Shoot` -> `Film`
- Updated the focused cut-card action-status test expectation from `Shoot` to `Film`.
- Did not change internal `shoot-board` identifiers or route/query naming.
- Did not change the existing Quick Shoot feature name; remaining `Shoot` hits are Quick Shoot feature surfaces or internal/test wording rather than the primary blank creation CTA/root navigation copy.

## 검증

- Passed: focused `rg` search found no exact `New Shoot` or `Start Shoot` in searched app source.
- Passed: focused navigation/CTA `rg` search found no forbidden root/primary navigation or CTA copy; remaining hits were Quick Shoot feature naming, internal title helpers, or test wording.
- Passed: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts`
- Passed: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json`
- Passed: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- Passed: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

## 참고

- A combined direct `sucrase-node` run including `src/features/recipes/lib/cut-card-action-status.test.ts` hit the known `@/...` alias resolution issue documented in earlier context, so TypeScript checks plus source-level search were used for this Sub-AC verification.
- No simulator QA was run because this Sub-AC is copy search/verification only and web QA is out of scope.
- No commit, push, or merge was performed.
