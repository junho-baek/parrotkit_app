# Native Shoot Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the saved recipe execution overview with a compact Shoot Board that helps creators manage cuts and start filming immediately.

**Architecture:** Keep `/explore-recipe/:id` as the marketplace/detail preview and make `/recipe/:id` the execution board. Add a small pure state-model helper for cut mapping/status/progress, then rebuild the non-selected scene view in `RecipeDetailScreen` around Next Up, Progress, Cuts Board, bulk actions, and a local bottom nav. Existing `/recipe/:id/prompter` remains the camera/prompter destination, and existing selected-scene workspace remains the cut workspace.

**Tech Stack:** Expo Router, React Native, NativeWind, Expo LinearGradient, MaterialCommunityIcons, TypeScript type-check tests.

---

## 배경
- 사용자는 홈에서 레시피를 눌렀을 때 나오는 현재 타임라인이 상세 페이지처럼 보인다고 지적했다.
- 이 화면은 레시피를 읽는 곳이 아니라 촬영을 진행하는 작업 보드여야 한다.
- 탐색 상세(`/explore-recipe/:id`)와 실행 화면(`/recipe/:id`)은 이미 분리되어 있으므로 실행 화면만 Shoot Board로 교체한다.

## Frontend Thesis
- Visual thesis: 흰 배경 위에 촬영 보드 카드와 작은 상태 칩을 촘촘하지만 편안하게 배치해, 문서가 아니라 “오늘 찍을 컷 보드”처럼 보이게 한다.
- Content plan: 상단 작업 헤더 → compact Next Up → progress row → Cuts Board → add/bulk actions → local bottom nav.
- Interaction thesis: 컷 상태 토글 즉시 progress/Next Up을 갱신하고, 촬영 CTA는 바로 prompter로 보낸다. reorder/add는 우선 명확한 UI 상태와 로컬 추가 컷으로 구현한다.

## 목표
- `/recipe/:id` 기본 화면을 Shoot Board로 교체한다.
- 큰 hero/marketing/detail block, 긴 why-it-works, 준비 브리프 중심 섹션을 제거한다.
- 첫 viewport에 header, Next Up, Progress, Cuts Board 시작 부분이 보이게 한다.
- Next Up, progress row, cut cards, add cut, bulk action bar, local bottom nav를 구현한다.
- 컷 status를 `미촬영`/`촬영완료`로 토글하고 shot count와 Next Up을 갱신한다.
- CTA는 기존 prompter/camera route로 연결한다.

## 범위
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- Create: `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`
- Create: `parrotkit-app/src/features/recipes/lib/shoot-board-model.test.ts`
- Add plan/context docs.

## 변경 파일
- `plans/20260503_native_shoot_board.md`
- `context/context_20260503_native_shoot_board.md`
- `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`
- `parrotkit-app/src/features/recipes/lib/shoot-board-model.test.ts`
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`

## 테스트
- RED: `cd parrotkit-app && npx tsc --noEmit` should fail because `createShootBoardRecipe`, `toggleShootBoardCutStatus`, and `createAddedShootBoardCut` are not exported.
- GREEN: `cd parrotkit-app && npx tsc --noEmit` passes after implementing helpers and UI.
- `git diff --check`
- Local QA on iPhone 17 Pro only:
  - `exp://127.0.0.1:8081/--/recipe/recipe-korean-diet-hook`
  - Confirm Shoot Board first viewport, status toggle, Next Up move, and shooting CTA route.

## 작업 순서
- [ ] Write failing type-check tests for Shoot Board model behavior.
- [ ] Implement Shoot Board model helpers.
- [ ] Replace the `/recipe/:id` overview UI with the Shoot Board layout.
- [ ] Wire interactions: start shooting, prompter, preview/workspace, add cut, reorder mode, status toggle.
- [ ] Verify type-check and visual QA on iPhone 17 Pro.
- [ ] Update context, fetch/rebase latest remote, commit, and push.

## 롤백
- Revert `RecipeDetailScreen` overview to the previous execution workspace layout.
- Remove `shoot-board-model.ts` and `shoot-board-model.test.ts`.
- Existing explore detail and prompter screens are not structurally changed, so rollback is isolated to `/recipe/:id` overview.

## 리스크
- Add/reorder/selection actions are local UI state only; persistence is not introduced in this pass.
- Existing selected-scene workspace remains as the cut workspace, so it may visually differ from the new Shoot Board until redesigned separately.
- Mock recipe `shotSceneCount` may not match the requested reference state; the Shoot Board initializes unshot for a clean execution-board demo unless local toggles update it.

## 결과
- `/recipe/:id` 기본 화면을 Shoot Board로 교체했다.
- Next Up, Progress, Cuts Board, add cut, disabled bulk action bar, local bottom nav를 구현했다.
- cut status 토글 시 shot count와 Next Up이 로컬 상태에서 갱신되도록 했다.
- Home, Explore, Explore Detail, Recipes의 촬영 진입점을 직접 camera/prompter가 아니라 Shoot Board로 맞췄다.
- 개별 cut의 `촬영`/Shoot Board 중앙 촬영 CTA는 기존 prompter route로 이동한다.
- 검증: `cd parrotkit-app && npx tsc --noEmit`, `git diff --check`, iPhone 17 Pro 8081 QA.
- QA 스크린샷: `output/playwright/native_shoot_board_pro_final.png`
- 연결 context: `context/context_20260503_native_shoot_board.md`
