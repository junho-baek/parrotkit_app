# 2026-05-17 Shooting Session Board Redesign

## 배경

The shooting board needed to match the new `DESIGN.md` contract: short-form filming session, dark top session bar, body title, note entry instead of default checklist, 9:16 media, and execution-first cut rows.

## 변경 사항

- Added `ShootBoardSessionHeader` with dark active-session top bar, stats, More/Reorder trigger, and `Done` / `완료`.
- Added `ShootBoardBodyHeader` so the recipe title lives in the white body header.
- Converted `ShootBoardNoteCta` into an expanded-only note/check surface opened from the body header note row.
- Added lifecycle reset for the note surface when the board is rehydrated.
- Added execution-first cut titles via `getCutCardExecutionTitle`.
- Changed Reference and My Take frames to 9:16 short-form framing.
- Quieted sticky list header to `Cut list` / `컷 리스트`.
- Added accessibility state and labels to the reorder toggle.
- Added screen-local `StatusBar style="light"` for readable status icons over the dark session bar.

## 검증

PASS:

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-execution-title.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-header.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-note-entry-contract.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-session-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md`
- `git diff --check`

`DESIGN.md` lint: 0 errors, 14 existing unused-token warnings.

## QA 산출물

- `output/reports/20260517_shooting_session_board_redesign.md`
- `output/playwright/shooting-session-board-20260517/android-board-overview.png`
- `output/playwright/shooting-session-board-20260517/android-note-expanded.png`
- `output/playwright/shooting-session-board-20260517/contact-sheet.svg`

## iPhone 상태

Fresh iPhone capture remains blocked locally:

- `xcrun simctl list devices booted` timed out.
- direct `/Applications/Xcode.app/Contents/Developer/usr/bin/simctl` list/screenshot commands timed out.
- Computer Use could not attach to Simulator because no captureable window was available (`cgWindowNotFound`).

No stale iPhone screenshot was reused as passing evidence.

## 연결된 plan

- `plans/20260517_shooting_session_board_redesign.md`
