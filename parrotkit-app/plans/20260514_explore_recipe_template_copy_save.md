# Explore Recipe Template Copy Save

## 배경
Explore v1 cards currently open detail and can save recipe-backed guides through the existing local mock download path. Sub-AC 23.1 requires that Explore cards expose this as a recipe-template copy/save action, while keeping brand/reference-assisted flows locked or deferred.

## 목표
- Recipe-backed Explore cards show an explicit template copy/save action before they are saved.
- After saving, the same card state changes to shooting/access state without requiring server storage.
- Static brand/request cards remain Pro/deferred and do not enter the free copy path.
- Detail screen save copy remains consistent with Explore card action copy.

## 범위
- Explore card action state/copy helper.
- Explore list/recommended card action label and icon behavior.
- Explore detail save button label.
- Targeted TypeScript contract coverage.

## 변경 파일
- `plans/20260514_explore_recipe_template_copy_save.md`
- `src/features/explore/lib/explore-template-copy-action.ts`
- `src/features/explore/lib/explore-template-copy-action.test.ts`
- `src/features/explore/screens/explore-screen.tsx`
- `src/features/explore/screens/explore-recipe-detail-screen.tsx`
- `tsconfig.explore-card-detail-check.json`
- `context/context_20260514_explore_recipe_template_copy_save.md`

## 테스트
- `npm exec --offline -- tsc --noEmit -p tsconfig.explore-card-detail-check.json`
- 가능하면 `npm exec --offline -- tsc --noEmit`

## 롤백
- 위 파일 변경을 되돌리면 Explore card action copy는 기존 Save/Shoot/Remix 상태로 돌아간다.
- Existing `downloadRecipe` local/mock behavior is reused, so 별도 데이터 마이그레이션은 없다.

## 리스크
- Explore still contains search/filter UI from earlier mock scope; this AC only changes card copy/save action and does not broaden Explore behavior.
- Worktree has many sibling AC edits, so this task should not commit in isolation unless aggregate coordination happens.
