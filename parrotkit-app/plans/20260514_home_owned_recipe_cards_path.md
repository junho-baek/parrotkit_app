# Home Owned Recipe Cards Path

## 배경

- Sub-AC 3.3 requires Home to expose a distinct section or path for viewing owned recipe cards.
- The current Home recipe card section uses generic saved recipe entries and its view-all action opens `/recipes` without selecting the owned recipe card filter.
- The v1 navigation realignment should keep Home, Explore, My focused and avoid restoring Recipes as a bottom tab.

## 목표

- Make Home recipe cards explicitly represent owned recipe cards.
- Route the Home view-all affordance to the owned recipe card view.
- Keep the change local/mock-only and simulator-oriented.

## 범위

- Home recipe card entry selection and view-all destination.
- Recipes screen query-param handling only as needed to open the owned filter.
- Focused TypeScript verification.

## 변경 파일

- `src/features/home/components/home-workspace-surface.tsx`
- `src/features/home/lib/home-owned-recipe-cards.ts`
- `src/features/home/lib/home-owned-recipe-cards.test.ts`
- `src/features/recipes/screens/recipes-screen.tsx`
- `tsconfig.home-owned-recipe-cards-check.json`
- `context/context_20260514_home_owned_recipe_cards_path.md`

## 테스트

- First run the focused new TypeScript check while the helper is missing to confirm RED.
- Then run the same focused check after implementation.
- Run full `tsc --noEmit` if feasible; do not run `npm run build`.

## 롤백

- Revert Home to direct `getSavedRecipeAccessEntries(recipes)` usage and `/recipes` view-all routing.
- Remove the added helper, focused tsconfig, test, and context entry.

## 리스크

- Existing session changes are broad and uncommitted; keep edits narrowly scoped and do not commit or push.
- Recipes remains a route for stack access only, not a restored bottom tab.

## 결과

- `src/features/home/lib/home-owned-recipe-cards.ts`를 추가해 Home의 recipe card 목록을 `ownership === 'owned'` 항목으로 제한했다.
- Home `내 레시피` / `My recipes` 전체 보기 경로를 `/recipes?filter=owned`로 연결했다.
- Recipes screen이 `filter=owned` query param을 읽어 owned filter를 선택하도록 했다.
- 연결 context: `context/context_20260514_home_owned_recipe_cards_path.md`
