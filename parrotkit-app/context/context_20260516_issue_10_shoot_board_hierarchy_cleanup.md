# 2026-05-16 Issue #10 Shooting Board Hierarchy Cleanup

## 배경

User QA clarified that the #10 shooting-board work was not complete. The reference video should be above each cut label, not beside My Take. The collapsed cut rows should not expose `No take yet`, `0 takes`, or `Take saved` copy because My Take already owns the take state. The shooting note CTA also violated the no box-in-box rule and needed to become an actual usable note/check row.

## 변경 사항

- Moved per-cut reference media into the top of `ShootBoardSceneCard`, above `Cut #`.
- Removed the board-level reference preview from `CutBoardHeader`.
- Removed the collapsed Reference media slot; collapsed media now shows only `My Take`.
- Added My Take count badge and status icon handling inside the My Take slot.
- Removed collapsed-card status/count labels from `getCutCardActionStatus`.
- Removed the separate right-side completion circle from cut rows.
- Replaced `ShootBoardNoteCta` dashed card with an inline TextInput + checkbox row.
- Added `boardNote` and `boardNoteChecked` to `ShootBoardRecipe` state so the note row is functional and persists in the in-memory editor board.
- Added `scripts/register-tsconfig-alias.cjs` so targeted sucrase tests can run with the project's `@/` alias.
- Updated source-contract tests for the new hierarchy.

## 검증

PASS:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-action-status.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-media-slots.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-take-viewer-section.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-reference-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
npx -y @google/design.md lint DESIGN.md
git diff --check
```

`DESIGN.md` lint result: 0 errors, 14 existing unused-token warnings.

## QA 산출물

- `output/reports/20260516_issue_10_shoot_board_hierarchy_cleanup.md`
- `output/playwright/issue-10-shoot-board-hierarchy-20260516/android-board-overview.png`
- `output/playwright/issue-10-shoot-board-hierarchy-20260516/ios-board-overview.png`
- `output/playwright/issue-10-shoot-board-hierarchy-20260516/contact-sheet.svg`

## 판단

The specific shooting-board hierarchy regression is fixed. If GitHub #10 is interpreted as the original full native QA package, regenerate the broader seven-screen Android/iPhone package after this patch before closing it.

