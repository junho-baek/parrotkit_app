# Issues 7 9 4 Design Burn-Down

## 배경

GitHub #7, #9, #4 are the next UI regression fixes after Paste/navigation recovery. They share the same design concern: execution surfaces should be direct, sparse, and page-like instead of button-heavy or card-heavy.

## 목표

- #7: Explore cards/rows become the primary CTA surface without duplicate button clusters.
- #9: Shooting board opens and reads as a full-page board with reference media placed near cut copy where practical.
- #4: Continue/next-cut guidance stays passive and does not auto-open, auto-focus, auto-scroll, or jump to camera.

## 범위

Explore card CTA model, recipe detail board behavior, shoot board cut layout, source-contract tests, native screenshot QA, GitHub issue updates.

## 변경 파일

See `docs/superpowers/plans/2026-05-16-issues-7-9-4-ui-burn-down.md`.

Expected implementation files:

- `src/features/explore/screens/explore-screen.tsx`
- `src/features/explore/lib/explore-card-cta-contract.test.ts`
- `src/features/recipes/screens/recipe-detail-screen.tsx`
- `src/features/recipes/screens/recipe-detail/recipe-detail-board-state.ts`
- `src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`
- `src/features/recipes/components/shoot-board-scene-card.tsx`
- `src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`

Expected documentation and QA files:

- `context/context_20260516_issues_7_9_4_design_burn_down.md`
- `output/reports/20260516_issues_7_9_4_design_burn_down.md`
- `output/playwright/issue-7-explore-qa-20260516/`
- `output/playwright/issue-9-board-qa-20260516/`
- `output/playwright/issue-4-passive-next-cut-qa-20260516/`

## 테스트

- `./node_modules/.bin/sucrase-node src/features/explore/lib/explore-card-cta-contract.test.ts`
- `./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`
- `./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- Focused existing recipe component tests if impacted.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `git diff --check`
- Android and iPhone screenshot QA for Explore, passive board overview, and shooting board layout.

## 롤백

Revert the implementation commit. If only one issue regresses, revert that issue-sized slice because the implementation is planned as separated #7/#4/#9 changes.

## 리스크

Board layout refactor may disturb saved take/reference affordances. Preserve core actions and verify on both platforms.

Simulator availability can block native screenshot QA. If QA cannot run, do not close GitHub issues without clearly marking the report as blocked.

## 결과

- #7 Explore CTA simplification completed.
- #4 Passive next-cut guidance completed.
- #9 Shooting board layout completed.
- Focused tests, TypeScript, architecture check, design lint, Android QA, and iPhone QA completed.
- Recommended GitHub action: close #7, #4, and #9.

## 연결된 context

`context/context_20260516_issues_7_9_4_design_burn_down.md`

## 연결된 QA 리포트

`output/reports/20260516_issues_7_9_4_design_burn_down.md`
