# Locked Creation Option Guidance

## 배경

- Sub-AC 7.3 requires locked Reference link and Brand context creation options to respond to taps with Pro/coming-soon guidance.
- v1 must keep blank/manual recipe creation as the active free flow and must not enable link/API/brand-assisted creation.

## 목표

- Tapping Reference link or Brand context does not select/enable that option.
- The creation screen shows clear Pro/coming-soon guidance for the tapped locked option.
- Manual/blank creation remains selected and usable.

## 범위

- Recipe creation option interaction helper.
- Recipe creation screen tap handling and guidance rendering.
- Focused creation option verification.

## 변경 파일

- `src/features/recipes/lib/recipe-create-options.ts`
- `src/features/recipes/lib/recipe-create-options.test.ts`
- `src/features/recipes/screens/recipe-create-screen.tsx`
- `plans/20260514_locked_creation_option_guidance.md`
- `context/context_20260514_locked_creation_option_guidance.md`

## 테스트

- Add a failing focused assertion that locked option taps keep manual selected and expose the locked guidance mode.
- Run `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts` red and green.
- Run focused TypeScript verification with `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`.

## 롤백

- Remove the locked-tap helper/assertions and restore creation cards to directly selecting every option.

## 리스크

- `recipe-create-screen.tsx` is shared by prior AC 6/7.1/7.2 work; edits should stay limited to locked-option interaction and guidance UI.
- Existing routes may still pass `mode=reference` or `mode=brand`; the screen should preserve route integrity by showing guidance while keeping manual active.
