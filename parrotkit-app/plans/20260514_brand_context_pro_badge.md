# Brand Context Pro Badge

## 배경

- Sub-AC 7.2 requires the Brand context creation option to show a Pro badge and locked visual state.
- v1 keeps brand/reference-assisted creation visible but Pro-locked, while blank/manual recipe creation remains the main free path.

## 목표

- Make the Brand context option explicitly carry a user-facing `Pro` badge in the creation option contract.
- Render the Brand context creation card with a clear locked affordance.
- Keep the existing Home `+ 레시피 만들기` to blank/manual recipe flow unchanged.

## 범위

- Recipe creation option metadata.
- Recipe creation screen Brand option copy and locked visual state.
- Focused recipe creation option verification.

## 변경 파일

- `src/features/recipes/lib/recipe-create-options.ts`
- `src/features/recipes/lib/recipe-create-options.test.ts`
- `src/features/recipes/screens/recipe-create-screen.tsx`
- `plans/20260514_brand_context_pro_badge.md`
- `context/context_20260514_brand_context_pro_badge.md`

## 테스트

- Add a failing focused assertion that the Brand option exposes an explicit `Pro` badge and Brand context identity while remaining locked.
- Run `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts` red and green.
- Run focused TypeScript verification with `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`.

## 롤백

- Remove the Brand context metadata/assertion and restore the creation screen Brand copy to the previous brief wording.

## 리스크

- The shared worktree has many sibling AC edits; do not commit this subtask in isolation.
- `recipe-create-screen.tsx` is shared with AC 6/7.1 work, so edits should stay limited to Brand option metadata/copy.

## 결과

- Added explicit Brand context identity to the recipe creation option metadata.
- Added focused coverage that the Brand context option remains visible, Pro-locked, and exposes a `Pro` badge.
- Updated the creation UI copy from Brand brief to Brand context / 브랜드 컨텍스트 while preserving the existing Pro badge and lock-state pill rendering.
- 연결 context: `context/context_20260514_brand_context_pro_badge.md`
