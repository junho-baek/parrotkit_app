# Context 2026-05-14 Global Floating Recipe Create CTA

## 작업

- ParrotKit v1 navigation realignment follow-up AC 3.
- Scope was limited to the existing floating plus-button creation entry.
- Corrected primary floating CTA language to `레시피 생성` for Korean blank recipe creation.

## 변경

- `src/core/navigation/global-create-cta.ts`
  - Added a focused contract for floating creation CTA copy, destination, and visibility.
  - Destination is `/recipe-create?mode=manual`.
  - Korean label/accessibility label is `레시피 생성`.
  - English label is `Create recipe`, avoiding Source/Shoot language.
- `src/core/navigation/global-source-cta.tsx`
  - Reused the existing floating plus-button UI.
  - Wired press action to the blank/manual recipe creation route instead of `/source-actions`.
  - Hid the CTA while `/recipe-create` is open.
- `src/core/navigation/global-create-cta.test.ts`
  - Covers label, accessibility label, destination, Home availability, create-screen hiding, and no Shoot/Source language.
- `tsconfig.global-create-cta-check.json`
  - Added focused TypeScript verification for this surface.

## 검증

- Red: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts`
  - Failed because `./global-create-cta` did not exist.
- Green: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts`
  - Passed.
- Focused TypeScript: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json`
  - Passed.

## Simulator QA

- Attempted: `xcrun simctl list devices available`
- Result: failed with CoreSimulatorService connection invalid / connection refused.
- iPhone simulator UI QA could not be completed from this sandbox; no web QA was run.

## 참고

- Did not modify root bottom tab config or reintroduce Source/Recipes as bottom tabs.
- Did not commit, push, or merge.
