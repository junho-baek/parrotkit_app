# Sub-AC 6.1.4 Home Empty Workflow Fallback

## 배경
Previous Sub-AC work defined and rendered Home's selected in-progress or recent workflow. The remaining failed/pending item is the empty state when no selected workflow exists.

## 목표
- Add a focused empty/fallback state contract for Home when workflow selection is `none`.
- Keep the fallback aligned with manual blank recipe creation.
- Use `레시피 생성` for the Korean primary blank creation action.

## 범위
- Home continue workflow card helper/test.
- Minimal Home surface wiring for the empty workflow panel.
- Focused local TypeScript/runtime verification.

## 변경 파일
- `plans/20260514_sub_ac_6_1_4_home_empty_workflow_fallback.md`
- `src/features/home/lib/home-continue-workflow-card.ts`
- `src/features/home/lib/home-continue-workflow-card.test.ts`
- `src/features/home/components/home-workspace-surface.tsx`
- `context/context_20260514_sub_ac_6_1_4_home_empty_workflow_fallback.md`

## 테스트
- RED: add the empty workflow fallback contract and confirm the focused check fails before implementation.
- GREEN: run the focused runtime check and TypeScript check after implementation.
- Check iPhone simulator availability and record the environment blocker if unavailable.

## 롤백
- Revert only the files listed in this plan.

## 리스크
- The existing fallback used quick-shoot copy/routes; this change must avoid widening scope into unrelated Home sections or web QA.

## 결과
- Added `getHomeEmptyWorkflowFallback` so Home has an explicit fallback contract when workflow selection is `none`.
- Wired the Home empty workflow panel to `/recipe-create?mode=manual` and Korean CTA `레시피 생성`.
- Replaced the empty workflow panel icon/copy source so it no longer presents quick-shoot as the fallback action.
- Context: `context/context_20260514_sub_ac_6_1_4_home_empty_workflow_fallback.md`
