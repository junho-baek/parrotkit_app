# Missing Required Included

## 배경

Home Continue completion exclusion must use required-cut saved My Take state as the primary default completion truth.

## 목표

Verify that a recipe board remains eligible for Home Continue when any required cut lacks a saved My Take.

## 범위

- Focused Home workflow resolver verification.
- No navigation, CTA copy, persistence, Supabase, or route behavior changes.
- Do not modify sibling explicit-completion or optional-cut work unless verification shows this AC is broken.

## 변경 파일

- `plans/20260515_missing_required_included.md`
- `context/context_20260515_missing_required_included.md`

## 테스트

- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 롤백

- Remove this plan/context documentation if this AC is superseded by another tracking document.
- If verification later reveals a regression, revert only the narrow predicate or focused test changes that caused it.

## 리스크

- Sibling agents are editing nearby completion behavior, so this AC should avoid production edits unless the missing-required predicate is failing.
- Existing coverage may already satisfy the AC, making this a verification/documentation task.

## 결과

- Existing focused coverage in `src/features/home/lib/home-workflow-resolution.test.ts` verifies:
  - `isRecipeBoardUnfinishedByRequiredMyTakes` returns unfinished when any required cut lacks a saved My Take.
  - `getHomeWorkflowSelection` keeps a `continue` board eligible when exactly one required cut is missing a saved My Take.
- No production code changes were required.
- 연결 context: `context/context_20260515_missing_required_included.md`
