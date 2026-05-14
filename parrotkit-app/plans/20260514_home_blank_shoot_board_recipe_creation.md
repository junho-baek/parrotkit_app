# Home Blank Shoot-board Recipe Creation

## 배경

- AC 8: 사용자가 Home에서 blank/shoot-board 레시피를 만들 수 있어야 한다.
- 기존 Home CTA는 `/recipe-create?mode=manual`로 이동하지만, creation 화면의 시작 CTA가 아직 로컬 레시피 생성과 컷보드 진입까지 연결되지 않았다.

## 목표

- Home의 `+ 레시피 만들기` → manual creation → 로컬 blank 레시피 생성 → 해당 레시피 컷보드 화면 진입 흐름을 완성한다.
- 생성된 레시피는 v1 범위에 맞게 local/mock 상태에 저장하고, 카드 기반 컷 편집/프롬프터 진입에 필요한 기본 컷을 가진다.

## 범위

- Blank/manual 레시피 생성 계약과 provider wiring.
- Recipe creation 화면의 manual CTA 동작.
- Pro-locked reference/brand 옵션은 생성 실행 없이 현재 잠금 표시를 유지한다.

## 변경 파일

- `src/features/recipes/lib/blank-shoot-board-recipe.ts`
- `src/features/recipes/lib/blank-shoot-board-recipe.test.ts`
- `src/core/providers/mock-workspace-provider.tsx`
- `src/features/recipes/screens/recipe-create-screen.tsx`
- `tsconfig.home-blank-shoot-board-recipe-check.json`

## 테스트

- `./node_modules/.bin/sucrase-node src/features/recipes/lib/blank-shoot-board-recipe.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-blank-shoot-board-recipe-check.json`

## 롤백

- Blank recipe helper/test/config를 제거하고 provider/screen에서 `createBlankShootBoardRecipe` wiring을 되돌린다.

## 리스크

- 공유 worktree에 sibling AC 변경이 많아 broad commit/push는 별도 조율이 필요하다.
- Expo runtime 수동 QA는 이 AC의 focused verification과 별개로 추후 aggregate 단계에서 수행해야 한다.

## 결과

- `createBlankShootBoardRecipeDraft`를 추가해 local/mock owned 레시피, 3개 starter cut scene, shoot-board destination 계약을 만들었다.
- `MockWorkspaceProvider.createBlankShootBoardRecipe`를 추가해 blank 레시피를 recipes state에 저장하고, normalized recipe로 editor shoot-board를 즉시 생성/저장한다.
- `RecipeCreateScreen` manual CTA를 실제 생성 동작에 연결하고, 제목 입력값 또는 기본 제목으로 `/recipe/{recipeId}` 컷보드에 진입하도록 했다.
- Reference/brand Pro-locked 옵션은 CTA에서 생성 동작을 실행하지 않도록 유지했다.

## 연결 context

- `context/context_20260514_home_blank_shoot_board_recipe_creation.md`
