# Native Explore Preview / Execution Split Context

## 작업 시간
- 2026-05-03 00:48 KST

## 배경
- 사용자는 탐색 탭의 레시피 상세 페이지와 홈/레시피 보관함에서 여는 실행 화면이 다른 목적의 화면인데 같은 UI를 쓰고 있다고 지적했다.
- Explore는 저장/촬영 여부를 판단하는 preview 화면이어야 하고, `/recipe/:id`는 실행 워크스페이스여야 한다.

## 변경 요약
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
  - Explore recommended/list row press가 `/recipe/:id`가 아니라 `/explore-recipe/:id`로 이동하도록 변경했다.
- `parrotkit-app/src/app/explore-recipe/[recipeId].tsx`
  - 탐색 전용 recipe detail route를 추가했다.
- `parrotkit-app/src/features/explore/screens/explore-recipe-detail-screen.tsx`
  - 탐색 상세를 full-bleed reference hero, key hook, included items, structure preview, creator notes, Save/Start Shooting CTA 중심의 preview UI로 구현했다.
  - Start Shooting은 marketplace recipe를 먼저 `downloadRecipe`로 저장한 뒤 downloaded recipe prompter로 이동한다.
- `parrotkit-app/src/app/_layout.tsx`
  - `explore-recipe/[recipeId]` stack screen을 등록했다.
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - 기존 `/recipe/:id` overview에서 탐색형 hero를 제거했다.
  - 실행 워크스페이스 header, recipe thumbnail, Start Shooting CTA, today shooting flow, ready-to-shoot brief, scene timeline 중심으로 정리했다.
  - Scene workspace Watch/Plan/Shoot 및 camera prompter 흐름은 유지했다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과
- `git diff --check` 통과
- Metro status: `packager-status:running`
- Simulator direct route QA:
  - `exp://127.0.0.1:8081/--/explore-recipe/market-recipe-beauty-proof-routine`
  - `exp://127.0.0.1:8081/--/recipe/recipe-airfryer-stack`
- Screenshots:
  - `output/playwright/native_explore_preview_split.png`
  - `output/playwright/native_recipe_execution_split.png`

## 리스크 / 후속
- Preview screen의 copy와 tags는 아직 mock recipe id 기반으로 일부 localize한다. 실제 marketplace metadata가 생기면 recipe detail copy model로 옮기는 편이 좋다.
- `/recipe/:id`는 source/draft도 함께 쓰므로, 향후 owned draft와 downloaded recipe의 header copy를 더 세분화할 수 있다.
