# Reference Link Pro Badge

## 배경

- Sub-AC 7.1 requires the Reference link creation option to show a Pro badge and locked visual state.
- v1 keeps reference/API-assisted creation visible but non-main and Pro-locked, while blank/manual recipe creation remains the default path.

## 목표

- Make the Reference link option explicitly carry a user-facing `Pro` badge in the creation option contract.
- Render the Reference link creation card with both the `Pro` badge and a locked affordance.
- Keep the existing three-option creation flow and manual default unchanged.

## 범위

- Recipe creation option metadata.
- Recipe creation screen option-card rendering.
- Focused creation option verification.

## 변경 파일

- `src/features/recipes/lib/recipe-create-options.ts`
- `src/features/recipes/lib/recipe-create-options.test.ts`
- `src/features/recipes/screens/recipe-create-screen.tsx`
- `plans/20260514_reference_link_pro_badge.md`
- `context/context_20260514_reference_link_pro_badge.md`

## 테스트

- Add a failing focused assertion that the Reference link option exposes a `Pro` badge while remaining locked.
- Run `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts` red and green.
- Run focused TypeScript verification with `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`.

## 롤백

- Remove the new badge metadata/assertion and restore the creation screen card to the previous generic locked label rendering.

## 리스크

- The shared worktree has many sibling AC edits; do not commit this subtask in isolation.
- `recipe-create-screen.tsx` already contains AC 6 creation option work, so edits should be limited to the option-card badge/lock presentation.

## 결과

- Added `proBadgeLabel: "Pro"` to Pro-locked creation option metadata.
- Updated the recipe creation option card so Reference link renders a distinct `Pro` badge plus a lock-state pill.
- Kept the locked CTA copy and manual/blank default unchanged.
- 연결 context: `context/context_20260514_reference_link_pro_badge.md`
