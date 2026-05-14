# Home Continue Recent First

## 작업 시간

- 2026-05-14

## 범위

- AC 3: Home first shows Continue recent recipe/board access.
- Local/mock-only Home ordering and route access.

## 변경 요약

- Added `src/features/home/lib/home-workspace-sections.ts`.
  - Defines Home's v1 section order with `continueRecentRecipe` first.
- Added `src/features/home/lib/home-workspace-sections.test.ts`.
  - Verifies populated and empty Home states both reserve the first section for continue/recent recipe board access.
- Updated `HomeWorkspaceSurface`.
  - Renders the continue/recent recipe board panel before welcome and `+ 레시피 만들기`.
  - Keeps the panel routed to the existing recipe cut-board destination.
- Updated Home copy.
  - English: `Continue recent recipe`, `Open recipe board`.
  - Korean: `최근 레시피 이어하기`, `레시피 보드 열기`.
- Added `tsconfig.home-continue-recent-check.json` for focused validation.

## 검증

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-recent-check.json`
  - Failed before implementation because `home-workspace-sections` did not exist.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-recent-check.json`
  - Passed.
- Full check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - Passed.

## 리스크 / 후속

- No headed Expo/device visual QA was run for this isolated AC.
- The shared worktree still contains concurrent sibling AC changes; this AC was not committed independently.
