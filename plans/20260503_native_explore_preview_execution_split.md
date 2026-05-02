# Native Explore Preview / Execution Split

## 배경
- 사용자는 탐색 탭에서 레시피를 눌렀을 때 나오는 상세 페이지와 홈에서 레시피를 실행할 때 나오는 실행 화면이 다른 목적의 화면이라고 피드백했다.
- 현재 Explore recipe card가 `/recipe/:recipeId`로 이동하면서 탐색용 설명 페이지와 실행용 cockpit이 같은 UI를 공유한다.

## Frontend Thesis
- Visual thesis: 탐색 상세는 저장/촬영 여부를 판단하는 흰 배경 preview sheet처럼, 실행 화면은 촬영 준비와 씬 진행이 바로 보이는 creator cockpit처럼 분리한다.
- Content plan: 탐색 상세는 hero, hook, 포함 기능, 구조 미리보기, 저장/촬영 CTA를 담당하고, 실행 화면은 timeline, scene workspace, camera prompter를 담당한다.
- Interaction thesis: Explore에서 누르면 preview route로 들어가고, 저장/촬영 CTA를 누를 때만 실행 route 또는 prompter로 넘어가며, 홈/저장 레시피는 곧장 실행 route를 탄다.

## 목표
- Explore recipe press가 실행용 `/recipe/:recipeId` 대신 탐색 전용 route로 이동하게 한다.
- 탐색 전용 recipe detail screen을 별도로 추가해 preview/decision UI만 담당하게 한다.
- 기존 `/recipe/:recipeId`는 홈/저장 레시피 실행용 cockpit으로 유지한다.

## 범위
- Expo Router route 추가
- Explore recipe navigation 변경
- 탐색 전용 recipe detail screen 추가
- 문서 기록

## 변경 파일
- `parrotkit-app/src/app/_layout.tsx`
- `parrotkit-app/src/app/explore-recipe/[recipeId].tsx`
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/explore/screens/explore-recipe-detail-screen.tsx`
- `plans/20260503_native_explore_preview_execution_split.md`
- `context/context_20260503_native_explore_preview_execution_split.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- Metro/simulator에서 Explore preview route와 `/recipe/:id` execution route가 서로 다른 화면인지 확인한다.

## 롤백
- Explore card navigation을 `/recipe/:recipeId`로 되돌린다.
- `explore-recipe` route와 screen 파일을 제거한다.
- `_layout.tsx`의 explore preview stack entry를 제거한다.

## 리스크
- marketplace recipe 저장 전후 id가 달라질 수 있으므로, preview CTA는 기존 `downloadRecipe` 결과 id를 기준으로 실행 route/prompter에 진입해야 한다.
- 기존 `/recipe/:id` 화면에 preview 성격의 overview가 일부 남아 있어도, route와 컴포넌트 경계는 이번 작업에서 먼저 분리한다.

## 결과
- Explore recipe card press를 `/explore-recipe/:recipeId`로 변경했다.
- `ExploreRecipeDetailScreen`을 추가해 탐색 탭의 레시피 상세를 저장/촬영 판단용 preview UI로 분리했다.
- 기존 `/recipe/:recipeId` overview는 큰 preview hero를 제거하고 실행 워크스페이스 header, 오늘 촬영 흐름, 준비 브리프, 씬 타임라인 중심으로 정리했다.
- Preview의 Start Shooting은 저장 전 marketplace recipe를 먼저 다운로드한 뒤 prompter로 이동한다.

## 검증
- 2026-05-03 00:48 KST `cd parrotkit-app && npx tsc --noEmit` 통과
- 2026-05-03 00:48 KST `git diff --check` 통과
- Metro status: `packager-status:running`
- Simulator 캡처:
  - `output/playwright/native_explore_preview_split.png`
  - `output/playwright/native_recipe_execution_split.png`

## 연결 context
- `context/context_20260503_native_explore_preview_execution_split.md`
