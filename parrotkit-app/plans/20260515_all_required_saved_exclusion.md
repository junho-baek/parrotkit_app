# All Required Saved Exclusion

## 배경

- Home Continue must not show recipe boards that are already complete by the default completion truth.
- For v1, required cuts are represented by non-optional recipe scenes, and saved My Takes are matched by `sceneId` or `cardIds`.

## 목표

- Verify a board is excluded from Home Continue when every required cut has a saved My Take.
- Preserve optional-cut behavior and existing v1 navigation / CTA copy.

## 범위

- Focused Home workflow selection and Continue card predicate verification.
- No route, CTA label, bottom tab, persistence, Supabase, or explicit completion action changes.

## 변경 파일

- `plans/20260515_all_required_saved_exclusion.md`
- `context/context_20260515_all_required_saved_exclusion.md`

## 테스트

- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 롤백

- Remove this plan/context documentation if no longer needed.
- If a code regression is found later, revert only the narrow predicate or tests introduced for this task.

## 리스크

- The completion predicate depends on v1 mock recipe scenes as the required-cut source until a first-class required-cuts contract exists.
- Sibling agents are editing related explicit-completion behavior, so this task avoids broad edits outside all-required-saved exclusion.

## 결과

- Existing resolver predicate already excludes boards from Home Continue when every required cut has a saved My Take.
- Verified focused coverage in `src/features/home/lib/home-workflow-resolution.test.ts`.
- 기록: `context/context_20260515_all_required_saved_exclusion.md`
