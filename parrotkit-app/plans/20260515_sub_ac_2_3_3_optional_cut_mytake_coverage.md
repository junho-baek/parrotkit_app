# 2026-05-15 Sub-AC 2.3.3 Optional Cut My Take Coverage

## 배경
Home Continue v1 completion is based primarily on saved My Takes for required cuts. Optional cuts missing saved My Takes must not keep a board unfinished.

## 목표
Add focused coverage for boards where all required cuts have saved My Takes and only optional cuts are missing, ensuring Home Continue treats the board as complete and excludes it.

## 범위
- Home workflow resolution model and focused tests only.
- Minimal optional-cut marker in the current mock model if needed.
- No persistence refactor, navigation changes, CTA copy changes, or bottom tab changes.

## 변경 파일
- `src/core/mocks/parrotkit-data.ts`
- `src/features/home/lib/home-workflow-resolution.ts`
- `src/features/home/lib/home-workflow-resolution.test.ts`
- `plans/20260515_sub_ac_2_3_3_optional_cut_mytake_coverage.md`
- `context/context_20260515_sub_ac_2_3_3_optional_cut_mytake_coverage.md`

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 롤백
Remove the optional-cut marker, resolver filtering change, added focused test, and this plan/context note.

## 리스크
- Optional cut metadata is currently absent from the mock model, so the implementation should stay minimal and avoid changing persistence contracts.

## 결과
- Added focused coverage that Home Continue excludes a board when all required cuts have saved My Takes and only optional cuts are missing.
- Added minimal `MockRecipeScene.isOptional` metadata for the current mock model.
- Updated required-cut My Take completion logic to ignore optional scenes when deriving required cut IDs.
- 연결 context: `context/context_20260515_sub_ac_2_3_3_optional_cut_mytake_coverage.md`
