# Brand Context Locked Guidance

## 배경

- Sub-AC 9.2 requires Brand context UI to remain locked and show only Pro/coming-soon guidance.
- v1 should not expose real paid, API, or upload flows for Brand context.

## 목표

- Ensure Brand context cannot become the active creation detail mode.
- Keep Brand context visible as a Pro/coming-soon locked option.
- Remove active upload-style Brand context UI from the reachable locked path.

## 범위

- Recipe creation option state contract.
- Recipe creation screen Brand context detail rendering.
- Focused recipe creation option verification.

## 변경 파일

- `src/features/recipes/lib/recipe-create-options.ts`
- `src/features/recipes/lib/recipe-create-options.test.ts`
- `src/features/recipes/screens/recipe-create-screen.tsx`
- `plans/20260514_brand_context_locked_guidance.md`
- `context/context_20260514_brand_context_locked_guidance.md`

## 테스트

- Add failing assertions that Brand context route/press state keeps manual selected while exposing locked guidance.
- Add a focused assertion that the Brand context option keeps Pro/coming-soon guidance rather than upload flow copy.
- Run `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts` red and green.
- Run focused TypeScript verification with `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`.

## 롤백

- Restore Brand context active detail behavior and remove the added locked-guidance assertions.

## 리스크

- The worktree contains many sibling AC changes; keep edits scoped and do not commit or push for this run.

## 결과

- `src/features/recipes/lib/recipe-create-options.test.ts` now asserts Brand context locked guidance does not expose upload/brief-flow wording.
- `src/features/recipes/screens/recipe-create-screen.tsx` removes stale Brand helper/field/chip upload copy and keeps Brand fallback copy limited to Pro/coming-soon locked guidance.
- 연결 context: `context/context_20260514_brand_context_locked_guidance.md`

## 검증 결과

- `./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-create-options.test.ts` passed.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json` passed.
- `rg` check confirmed no stale Brand upload/brief affordance wording remains in the focused creation files.
- iPhone simulator gate attempted with `xcrun simctl list devices booted`, but CoreSimulatorService was unavailable in this sandbox (`connection invalid` / `Connection refused`).
