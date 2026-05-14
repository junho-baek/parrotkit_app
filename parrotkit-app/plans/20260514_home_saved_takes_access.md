# Home Saved Takes Access

## 배경

- Sub-AC 17.3.1 requires saved takes to be reachable and selectable from the Home saved recipes/takes entry point.
- Existing local/mock saved-take storage can list saved recipe takes, and the recipe board can hydrate saved takes back into cut cards.
- Home currently exposes saved/recent recipes but does not expose saved takes as a direct entry point.

## 목표

- Add a Home entry point for saved recipe takes.
- Ensure selecting a saved take routes back to the matching recipe cut board context.
- Ensure the recipe detail screen can open the take viewer with the selected take active.

## 범위

- Local/mock-only UI and routing.
- Home saved-take list surface.
- Recipe detail route params for cut/take selection.
- Focused TypeScript validation for route construction.

## 변경 파일

- `src/features/home/components/home-workspace-surface.tsx`
- `src/features/recipes/screens/recipe-detail-screen.tsx`
- `src/features/recipes/lib/saved-take-home-access.ts`
- `src/features/recipes/lib/saved-take-home-access.test.ts`
- `tsconfig.saved-take-home-access-check.json`
- `context/context_20260514_home_saved_takes_access.md`

## 테스트

- Red/green focused TypeScript check for saved-take Home destination helper.
- Full project TypeScript check if feasible without running build.

## 롤백

- Remove the Home saved-take section and helper files.
- Remove recipe detail `takeId` route handling.
- Remove the focused tsconfig and context entry.

## 리스크

- Existing sibling-task edits are already present in this worktree; keep changes scoped and avoid reverting unrelated files.
- Saved takes remain in-memory local/mock state, so they reset on app reload as expected for v1.

## 결과

- Home에 저장한 테이크 목록 진입점을 추가했다.
- 저장한 테이크를 누르면 `/recipe/[recipeId]?sceneId=[cutOrSceneId]&takeId=[takeId]`로 이동한다.
- 레시피 상세/컷보드는 해당 컷을 펼치고 테이크 리뷰 모달을 열어 선택된 take를 활성화한다.
- 연결 context: `context/context_20260514_home_saved_takes_access.md`

## 검증 결과

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-home-access-check.json`
  - 구현 전 helper 미존재로 실패 확인.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-home-access-check.json`
  - 통과.
- Full: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - 통과.
