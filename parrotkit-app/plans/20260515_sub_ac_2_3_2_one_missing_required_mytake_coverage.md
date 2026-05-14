# 2026-05-15 Sub-AC 2.3.2 One Missing Required My Take Coverage

## 배경
Home Continue v1 uses saved My Takes for required cuts as the primary completion signal for recipe shooting boards.

## 목표
Add focused test coverage for boards where exactly one required cut is missing a saved My Take, ensuring the board remains eligible for Continue.

## 범위
- Home workflow resolution focused tests only.
- No persistence refactor, navigation changes, CTA copy changes, or bottom tab changes.

## 변경 파일
- `src/features/home/lib/home-workflow-resolution.test.ts`
- `plans/20260515_sub_ac_2_3_2_one_missing_required_mytake_coverage.md`
- `context/context_20260515_sub_ac_2_3_2_one_missing_required_mytake_coverage.md`

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 롤백
Remove the added focused test block and this plan/context note.

## 리스크
- Existing resolver behavior may already satisfy this edge case, so this subtask may be test-only coverage with no production code change.

## 결과
- Added focused coverage that Home Continue keeps a board eligible when exactly one required cut is missing a saved My Take.
- The fixture sets `shotSceneCount` equal to `totalSceneCount` to verify required-cut My Take state remains the completion source over checklist-style progress.
- No production code changes were needed because the existing resolver already satisfies this one-missing-required-cut case.
- 연결 context: `context/context_20260515_sub_ac_2_3_2_one_missing_required_mytake_coverage.md`
