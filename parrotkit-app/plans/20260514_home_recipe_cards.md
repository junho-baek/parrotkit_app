# Home Recipe Cards

## 배경

- AC 4 requires Home to show the user's recipes as cards rather than duplicate lists.
- Home currently shows recipe data in both a quick-start horizontal card rail and a recent recipe row list.
- The v1 flow should keep Home recipe access simple while preserving the continue recipe panel and saved-take entry point.

## 목표

- Replace duplicate Home recipe list sections with one clear recipe card section.
- Keep recipe cards routed to the existing recipe/cut-board path.
- Preserve local/mock data behavior and avoid adding server, login, search, or recommendation features.

## 범위

- Home recipe presentation only.
- UI copy and local component structure as needed for the card section.
- Focused TypeScript verification if feasible.

## 변경 파일

- `src/features/home/components/home-workspace-surface.tsx`
- `context/context_20260514_home_recipe_cards.md`

## 테스트

- Run a focused TypeScript check or full `tsc --noEmit` when feasible without running build.
- Inspect Home component for duplicate recipe list sections and route preservation.

## 롤백

- Restore the previous quick-start rail and recent row list rendering in `HomeWorkspaceSurface`.
- Remove this plan and the related context entry.

## 리스크

- Other agents are editing adjacent Home flows, so this change must stay narrowly scoped to recipe card presentation.
- `HomeWorkspaceSurface` already contains sibling AC changes for saved takes; keep those intact.

## 결과

- Home의 중복 레시피 표시를 단일 `내 레시피` / `My recipes` 카드 섹션으로 정리했다.
- 기존 quick-start 가로 카드 rail과 recent row list를 제거하고, 같은 local/mock `recipes` 데이터를 하나의 카드 그리드에서 보여준다.
- 각 카드에는 썸네일, 상태, 제목, 촬영 진행률, 진행 바, 컷/씬 수, 최근 활동 정보가 표시된다.
- 카드 선택은 기존 `getShootBoardHref(recipe.id)` 경로를 유지해 레시피 컷보드로 이동한다.
- 연결 context: `context/context_20260514_home_recipe_cards.md`

## 검증 결과

- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - 통과.
