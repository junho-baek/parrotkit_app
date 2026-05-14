# Explore Template Owned Recipe Copy

## 배경

Sub-AC 23.2.1 requires copied Explore card templates to become user-owned recipe records. The current Explore save path uses `downloadRecipe`, but it creates a `downloaded` recipe identity rather than a local user-owned recipe.

## 목표

- Convert an Explore template into a distinct local/mock user-owned recipe record.
- Preserve the source template as Explore/static mock data.
- Keep repeated copy/save actions idempotent for the same template.
- Ensure copied templates can still route into the existing recipe cut-board/prompter flow.

## 범위

- Add a focused pure helper and TypeScript contract test for Explore template copying.
- Wire `MockWorkspaceProvider.downloadRecipe` through the helper while keeping its existing public API.
- Update saved/copy detection to treat user-owned template copies as saved.
- No server persistence, login, cloud sync, search, recommendation, community, or payment work.

## 변경 파일

- `src/features/explore/lib/explore-template-recipe-copy.ts`
- `src/features/explore/lib/explore-template-recipe-copy.test.ts`
- `src/core/providers/mock-workspace-provider.tsx`
- `src/features/explore/screens/explore-recipe-detail-screen.tsx`
- `src/features/recipes/screens/recipe-detail-screen.tsx`
- `tsconfig.explore-card-detail-check.json`
- `plans/20260514_explore_template_owned_recipe_copy.md`
- `context/context_20260514_explore_template_owned_recipe_copy.md`

## 테스트

- Red: focused TypeScript check fails while the copy helper is missing.
- Green: focused TypeScript check passes after implementation.
- Final: run broader TypeScript check if the shared dirty worktree allows it.

## 롤백

Remove the helper/test, restore `downloadRecipe` to its previous downloaded-id creation logic, and remove the tsconfig/context/plan additions.

## 리스크

- `MockWorkspaceProvider` is a high-overlap file with sibling AC changes; preserve `recipeEditorBoards` and prompter state.
- Existing names `downloadRecipe` / `isRecipeDownloaded` remain for route compatibility even though v1 copy semantics become user-owned.

## 결과

- `src/features/explore/lib/explore-template-recipe-copy.ts`를 추가해 Explore 템플릿을 안정적인 로컬 사용자 소유 레시피 id로 복사하는 순수 헬퍼를 만들었다.
- `MockWorkspaceProvider.downloadRecipe`가 더 이상 `downloaded-*` 레시피를 만들지 않고, `ownership: "owned"` / `ownerName: "You"` / `remixOfRecipeId`가 있는 로컬 레시피를 생성하도록 연결했다.
- 같은 Explore 템플릿을 반복 저장해도 동일한 사용자 소유 레시피를 반환하도록 idempotent하게 유지했다.
- 결과 context: `context/context_20260514_explore_template_owned_recipe_copy.md`

## 검증

- `npm exec --offline -- tsc --noEmit -p tsconfig.explore-card-detail-check.json` 통과.
- `npm exec --offline -- tsc --noEmit` 통과.
