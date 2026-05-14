# Reference Link Locked Guidance Only

## 배경

- Sub-AC 9.1 requires the Reference link UI to remain locked and show only Pro/coming-soon guidance.
- Existing locked-option behavior keeps Reference from starting link/API flow, but the card still uses active generation copy.

## 목표

- Keep Reference link visible but Pro-locked.
- Make the Reference link card surface Pro/coming-soon guidance instead of active link-generation copy.
- Preserve manual/blank recipe creation as the only active creation flow.

## 범위

- Recipe creation option metadata.
- Recipe creation screen card copy for locked options.
- Focused recipe-create option verification.

## 변경 파일

- `src/features/recipes/lib/recipe-create-options.ts`
- `src/features/recipes/lib/recipe-create-options.test.ts`
- `src/features/recipes/screens/recipe-create-screen.tsx`
- `plans/20260514_reference_link_locked_guidance_only.md`
- `context/context_20260514_reference_link_locked_guidance_only.md`

## 테스트

- Add a failing focused assertion that Reference exposes a locked guidance label and keeps manual selected when pressed/opened.
- Run `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts` red and green.
- Run focused TypeScript verification with `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`.

## 롤백

- Remove the locked guidance label metadata/assertion and restore the creation card body to the prior mode body copy.

## 리스크

- The worktree contains many existing session changes; keep edits limited and do not commit/push.
- Simulator UI QA is the final gate for the full run, but this subtask only performs focused contract/type checks unless the simulator is explicitly available in the parent run.

## 결과

- Added `lockedGuidanceLabel: "Pro / coming soon"` to Pro-locked creation option metadata.
- Updated the creation option card body to render the locked guidance label for locked options, so Reference no longer advertises active link generation on the card surface.
- Preserved locked Reference behavior: tapping/opening Reference keeps manual selected and exposes Reference Pro/coming-soon guidance.
- iPhone simulator check was attempted with `xcrun simctl list devices booted`, but CoreSimulatorService was unavailable in this sandbox.
- 연결 context: `context/context_20260514_reference_link_locked_guidance_only.md`
