# 20260428 Recipe Library Ownership Task 7

## 요약
- Recipes 탭을 owned/saved/remixed recipe library로 재구성했다.
- `All`, `Owned`, `Saved`, `Remixes` 필터를 추가하고 `useMemo`로 ownership 기반 목록을 계산했다.
- 필터 결과는 shared `ShootableRecipeCard` 2-column grid로 표시하며, `Shoot`는 prompter route, `Open`은 recipe detail route로 이동한다.
- 필터 결과가 비어 있으면 Explore로 이동하는 `Explore recipes` CTA를 표시한다.

## 변경 파일
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `plans/20260428_recipe_library_ownership_task7.md`
- `context/context_20260428_recipe_library_ownership_task7.md`

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과.
- `git diff --check` 통과.

## 참고
- `ShootableRecipeCard`의 현재 props는 `mode` 기반이고 `size="compact"`를 지원하지 않아, 사용자 요청의 파일 범위를 지키기 위해 card API는 수정하지 않았다.
- 기존 untracked `.superpowers/` 산출물은 건드리지 않았다.
