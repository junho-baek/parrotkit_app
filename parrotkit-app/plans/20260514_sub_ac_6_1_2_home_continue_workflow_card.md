# Sub-AC 6.1.2 Home Continue Workflow Card

## 배경
Previous follow-up work defined how Home selects one local creator workflow, but this Sub-AC needs the Home UI to clearly present that selected workflow as a continue path.

## 목표
- Add a focused Home UI contract for the selected workflow continue card.
- Reuse the existing selected workflow resolver instead of introducing Source or Recipes bottom tabs.
- Keep Korean blank creation language aligned with `레시피 생성` and avoid Shoot/New Shoot/Start Shoot as primary creation CTA language.

## 범위
- Home continue card view-model helper and focused test.
- Minimal `HomeWorkspaceSurface` wiring to render from the selected workflow.
- Focused TypeScript verification only; iPhone simulator QA if the local simulator service is available.

## 변경 파일
- `plans/20260514_sub_ac_6_1_2_home_continue_workflow_card.md`
- `src/features/home/lib/home-continue-workflow-card.ts`
- `src/features/home/lib/home-continue-workflow-card.test.ts`
- `src/features/home/components/home-workspace-surface.tsx`
- `tsconfig.home-continue-workflow-card-check.json`
- `context/context_20260514_sub_ac_6_1_2_home_continue_workflow_card.md`

## 테스트
- RED: run the new focused TypeScript check before implementation and confirm the missing helper fails.
- GREEN: run the focused runtime and TypeScript checks after implementation.
- Try an iPhone simulator availability check; record blocker if CoreSimulatorService is unavailable.

## 롤백
- Revert only the files listed in this plan.

## 리스크
- Existing Home UI already has a continue panel, so the change should remain a small contract/wiring adjustment rather than a visual redesign.

## 2026-05-14 follow-up run
- Focus only on the remaining failed Home Continue card/rendering clarity.
- Preserve existing Home / Explore / My bottom navigation and global `레시피 생성` CTA behavior.
- Tighten the selected workflow card copy/state labels and component wiring without broad layout changes.

## 결과
- Home Continue card now renders selected workflow state through `sectionTitle`, `stateLabel`, `body`, `title`, and `accessibilityLabel`.
- Linked context: `context/context_20260514_sub_ac_6_1_2_home_continue_workflow_card.md`.
