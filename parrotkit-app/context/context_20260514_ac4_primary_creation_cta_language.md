# Context 2026-05-14 AC 4 Primary Creation CTA Language

## 작업

- ParrotKit v1 navigation realignment follow-up AC 4.
- Scope stayed limited to failed/pending CTA language work.
- Corrected the Home blank creation entry to use recipe creation language instead of shoot-board language.

## 변경

- `src/features/home/lib/home-recipe-create-entry.ts`
  - Korean label/accessibility label is now `레시피 생성`.
  - English label/accessibility label is now `Create recipe`.
  - Destination remains `/recipe-create?mode=manual`.
- `src/features/home/components/home-workspace-surface.tsx`
  - The blank creation row title now renders the contract label.
  - Supporting copy uses `빈 레시피로 시작` / `Start with a blank recipe`.
- `src/features/home/lib/home-recipe-create-entry.test.ts`
  - Updated focused contract checks for recipe creation language and forbidden shoot-language.
- `tsconfig.home-recipe-create-entry-check.json`
  - Added focused TypeScript verification for the Home recipe creation entry surface.

## 검증

- Red: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-recipe-create-entry.test.ts`
  - Failed because the Home entry still returned `+ 빈 슛보드`.
- Green: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-recipe-create-entry.test.ts`
  - Passed.
- Focused TypeScript: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json`
  - Passed.
- Global CTA regression: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts`
  - Passed.
- Global CTA TypeScript: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json`
  - Passed.
- Copy search: `rg -n "새 빈 슛보드|빈 슛보드|Blank shoot-board|New blank shoot-board|New Shoot|Start Shoot|Start shooting" src/features/home src/core/navigation`
  - No matches.

## Simulator QA

- Attempted: `xcrun simctl list devices available`
- Result: failed with CoreSimulatorService connection invalid / connection refused.
- iPhone simulator UI QA could not be completed from this sandbox; no web QA was run.

## 참고

- Did not modify bottom tab configuration.
- Did not commit, push, or merge.
