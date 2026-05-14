# Sub-AC 6.1.3 Continue Workflow Destination

## 배경
Home workflow selection and continue-card presentation are already defined, but the continue action still needs an explicit destination contract. The same follow-up must preserve the corrected blank creation CTA language: `레시피 생성`.

## 목표
- Wire Home continue action through a focused helper that opens the selected workflow destination.
- Keep blank creation fallback routed to the manual recipe creation step.
- Ensure Korean primary blank creation CTA copy uses `레시피 생성`.

## 범위
- Home continue workflow card helper/test.
- Home primary CTA copy/test for the Korean blank creation label.
- Minimal Home surface wiring.

## 변경 파일
- `plans/20260514_sub_ac_6_1_3_continue_workflow_destination.md`
- `src/features/home/lib/home-continue-workflow-card.ts`
- `src/features/home/lib/home-continue-workflow-card.test.ts`
- `src/features/home/lib/home-primary-cta.ts`
- `src/features/home/lib/home-primary-cta.test.ts`
- `src/features/home/components/home-workspace-surface.tsx`
- `context/context_20260514_sub_ac_6_1_3_continue_workflow_destination.md`

## 테스트
- RED: focused checks fail before implementation for missing continue-card destination and corrected Korean label.
- GREEN: run focused sucrase and TypeScript checks for affected Home helpers.
- Simulator availability check only if CoreSimulatorService is available.

## 롤백
- Revert the helper/test/copy/wiring changes listed above.

## 리스크
- Existing route helpers use the recipe cut-board route for workflow continuation. This task should not introduce a new tab or separate Recipes bottom-tab dependency.
