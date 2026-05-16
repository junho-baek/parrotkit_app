# 2026-05-16 Explore Detail And Board Follow-Up

## 배경

User QA screenshots pointed out remaining design drift after the #7/#9/#4 burn-down:

- Explore recipe detail still had unnecessary meta, fixed `Key Hook` emphasis, included-feature chips, and boxed note structure.
- Shooting board placed reference media too low relative to the board title.
- Cut rows spent too much left-side space on drag/expand handles.
- Cut list copy exposed fixed `Hook` language even though the card structure is editable.
- Completion should read from My Take state, with checklist as supporting guidance only.

Existing source of truth reviewed:

- `DESIGN.md`
- `seeds/parrotkit_emergency_ui_patch_20260515.yaml`
- GitHub #5 and #10
- Prior #7/#9/#4 implementation context and plan

## 변경 사항

- Explore detail:
  - Removed save/view/creator meta rows and tag chips from the hero.
  - Removed `Key Hook`, `Included`, included-item chips, and boxed creator notes.
  - Reframed detail copy around `Reference feature`, `Reference structure`, and `Apply it to your case`.
  - Changed primary CTA copy to `Open shoot board` / `촬영 보드 열기`.
  - Removed fixed Hook/Proof/CTA role labels from structure preview cards.

- Shooting board:
  - Added a compact reference preview above the board title/header row.
  - Removed always-visible left drag handle and separate left expand handle.
  - Drag handle now appears only in reorder mode.
  - Collapsed cut preview now shows only `Line to say` and `Shot guide`.
  - Expanded editable fields now read `Line to say`, `Shot guide`, `Apply to your case`, and `Note`.
  - Removed manual cut-completion UI plumbing from the row; the status circle opens My Take/film flow.
  - `getShootBoardCutCompletionState` now treats saved/final My Take as complete, needs-reshoot as partial, and checklist-only completion as partial.

## 검증

PASS:

```bash
./node_modules/.bin/sucrase-node src/features/explore/lib/explore-recipe-detail-design-contract.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-body-preview.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-editor-fields.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-completion-state-contract.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-reference-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
git diff --check
npx -y @google/design.md lint DESIGN.md
```

`DESIGN.md` lint result: 0 errors, existing unused-token warnings only.

## 비고

- No new simulator captures were produced in this pass. #10 remains the right place for the final Android/iPhone contact sheet after this follow-up lands.
- Existing broad `shoot-board-model.test.ts` still depends on mock data files with `@/` imports; the new focused completion contract avoids that runtime alias blocker.

