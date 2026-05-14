# Global Floating Recipe Create CTA

## 배경

- ParrotKit v1 navigation realignment follow-up AC 3 only covers the existing floating plus-button creation pattern.
- Previous work kept Home/Explore/My navigation changes and manual blank recipe creation, but the global floating CTA still used the old Source action route/copy.

## 목표

- Keep the floating plus button available as the primary blank board creation entry.
- Use corrected Korean product language: `레시피 생성`.
- Route the floating plus CTA to the blank/manual recipe creation path.

## 범위

- Global floating CTA copy/route contract.
- Minimal component wiring for the existing floating plus button.

## 변경 파일

- `src/core/navigation/global-source-cta.tsx`
- focused test/helper files under `src/core/navigation/` if needed
- this plan and final context note

## 테스트

- Add a focused failing test for the floating plus CTA contract.
- Run the focused test through `sucrase-node`.
- Run a focused TypeScript check if the repo has or needs one for this surface.

## 롤백

- Revert the helper/test and restore the floating CTA route/copy to the previous Source action behavior.

## 리스크

- Sibling agents are changing bottom tabs and broad checks, so this task avoids root tab config and shared navigation tab files unless strictly necessary.
- Simulator QA may be blocked by local CoreSimulator availability; record if unavailable.

## 결과

- Added `src/core/navigation/global-create-cta.ts` to define the floating plus CTA contract.
- Updated `src/core/navigation/global-source-cta.tsx` so the existing floating plus button routes to `/recipe-create?mode=manual`.
- Korean floating CTA label/accessibility label is now `레시피 생성`; English avoids Source/Shoot language.
- Added `src/core/navigation/global-create-cta.test.ts`.
- Added `tsconfig.global-create-cta-check.json`.
- Context: `context/context_20260514_global_floating_recipe_create_cta.md`.

## 검증

- Red: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts`
  - Failed because `./global-create-cta` did not exist.
- Green: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts`
  - Passed.
- Focused TypeScript: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json`
  - Passed.
- Simulator probe: `xcrun simctl list devices available`
  - Failed with CoreSimulatorService connection invalid / connection refused, so iPhone simulator UI QA could not be completed in this sandbox.
