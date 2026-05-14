# AC 4 Primary Creation CTA Language

## 배경

- ParrotKit v1 navigation realignment follow-up AC 4 requires primary blank creation CTA copy to use recipe creation language.
- AC 3 already corrected the global floating CTA to `레시피 생성`, but Home still has a blank creation entry using shoot-board wording.

## 목표

- Ensure the primary blank creation CTA/user-facing Korean label is `레시피 생성`.
- Avoid Shoot/New Shoot/Start Shoot or similar shoot-language for that creation entry.
- Preserve the existing manual/blank recipe creation destination.

## 범위

- Focused Home blank creation entry contract and any direct UI label consuming that contract.
- No bottom tab changes.
- No commit, push, or merge.

## 변경 파일

- `src/features/home/lib/home-recipe-create-entry.test.ts`
- `src/features/home/lib/home-recipe-create-entry.ts`
- `src/features/home/components/home-workspace-surface.tsx` if it has hard-coded duplicate creation label copy
- this plan and a final context note

## 테스트

- First update the focused Home recipe creation entry test and confirm it fails.
- Make the minimal code change to pass.
- Run a focused TypeScript check for the Home creation entry surface if needed.

## 롤백

- Restore the previous Home creation entry labels while leaving the manual recipe creation destination unchanged.

## 리스크

- Some legitimate filming/shooting flow copy remains outside primary blank recipe creation; this task should not rewrite those broader workflow labels.
- Sibling agents may be editing navigation tabs, so this plan avoids tab config files.

## 결과

- Updated Home blank creation entry contract so Korean label/accessibility label is `레시피 생성`.
- Updated the Home visible blank creation row title to render the entry label and use `빈 레시피로 시작` as supporting copy.
- Preserved `/recipe-create?mode=manual` as the manual/blank recipe creation destination.
- Added `tsconfig.home-recipe-create-entry-check.json` for focused verification.
- Context: `context/context_20260514_ac4_primary_creation_cta_language.md`.

## 검증

- Red: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-recipe-create-entry.test.ts`
  - Failed because Home entry still returned `+ 빈 슛보드`.
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
- Simulator probe: `xcrun simctl list devices available`
  - Failed with CoreSimulatorService connection invalid / connection refused; iPhone simulator UI QA could not be completed in this sandbox.
