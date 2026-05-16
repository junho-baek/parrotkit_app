# Explore Detail And Board Follow-Up

## 배경

Native QA screenshots showed that the Explore recipe detail page still feels too metadata-heavy and the shooting board still exposes fixed `Hook` language and left-side controls too prominently. The existing #5/#10 emergency UI seed asks for no box-in-box drift, concise copy, and a board-like shooting page.

## 목표

- Make Explore detail read as a reference guide with fewer meta rows and fewer nested boxes.
- Replace fixed `Key Hook` / included-feature emphasis with reference structure and how to apply it.
- Move the board reference preview above the board title area.
- Reduce wasted left space from drag/expand controls in cut rows.
- Keep completion oriented around My Take state; checklist remains supporting guidance.
- Remove fixed `Hook` copy from cut-list labels where it makes editable user content feel hard-coded.

## 범위

- Explore detail screen content and visual hierarchy.
- Shooting board header, cut row controls, collapsed preview labels, and expanded editable field labels.
- Focused source-contract tests for the changed UI contracts.
- Local TypeScript and targeted test verification.

## 변경 파일

- `src/features/explore/screens/explore-recipe-detail-screen.tsx`
- `src/features/explore/lib/explore-recipe-detail-design-contract.test.ts`
- `src/features/recipes/components/shoot-board-scene-card.tsx`
- `src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `src/features/recipes/lib/cut-card-body-preview.ts`
- `src/features/recipes/lib/cut-card-body-preview.test.ts`
- `src/features/recipes/lib/cut-card-editor-fields.ts`
- `src/features/recipes/lib/cut-card-editor-fields.test.ts`
- `src/features/recipes/lib/shoot-board-completion-state-contract.test.ts`
- `src/features/recipes/screens/recipe-detail-screen.tsx`
- `src/features/recipes/screens/recipe-detail/recipe-detail-board-reference-contract.test.ts`
- `context/context_20260516_explore_detail_board_followup.md`

## 테스트

- `./node_modules/.bin/sucrase-node src/features/explore/lib/explore-recipe-detail-design-contract.test.ts`
- `./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-body-preview.test.ts`
- `./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-editor-fields.test.ts`
- `./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-reference-contract.test.ts`
- `./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-completion-state-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `git diff --check`

## 롤백

Revert the final commit for this follow-up. If only one surface regresses, keep the changes split in review notes so Explore detail and shooting board can be reverted separately.

## 리스크

- Removing fixed `Hook` labels may affect tests that still assert legacy field naming.
- Compacting the cut row controls must preserve reorder and expand accessibility.
- Moving the reference preview into the board header must not create another nested-card visual regression.

## 결과

- Explore detail now removes heavy meta/included boxes and uses reference-feature / reference-structure / apply-to-your-case copy.
- Shooting board header now places a compact reference preview above the board title.
- Cut rows no longer reserve permanent left space for reorder/expand handles.
- Collapsed cuts show Line to Say and Shot guide only.
- Expanded cut editing shows Line to Say, Shot guide, Apply to your case, and Note.
- Completion state now treats saved/final My Take as complete and checklist-only progress as partial.

## 연결된 context

`context/context_20260516_explore_detail_board_followup.md`
