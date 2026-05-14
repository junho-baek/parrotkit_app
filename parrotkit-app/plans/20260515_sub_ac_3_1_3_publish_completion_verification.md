# 2026-05-15 Sub-AC 3.1.3 Publish Completion Verification

## 배경
Publish/complete success path is wired to the v1 explicit completion marker, but verification should directly prove successful actions persist the marker and failed actions do not.

## 목표
Add focused verification around publish/complete completion persistence semantics: success writes the explicit marker, failure does not.

## 범위
- Publish/complete marker helper or focused contract surface.
- Existing publish CTA wiring only as needed to use the tested contract.
- Focused test/config updates.
- No Home Continue navigation, CTA language, Supabase, or UI layout changes.

## 변경 파일
- `src/features/recipes/lib/publish-completion-success-path.ts`
- `src/features/recipes/lib/publish-completion-success-path.test.ts`
- `src/features/recipes/screens/recipes-screen.tsx`
- `tsconfig.publish-completion-success-path-check.json`
- `plans/20260515_sub_ac_3_1_3_publish_completion_verification.md`
- `context/context_20260515_sub_ac_3_1_3_publish_completion_verification.md`

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/publish-completion-success-path.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.publish-completion-success-path-check.json`

## 롤백
Remove the helper/test updates and restore publish CTA to directly call the workspace completion action after successful publish.

## 리스크
- Publish remains a v1 mock success path; this task verifies marker persistence semantics without introducing a real publish backend.

## 결과
- Added focused `persistPublishCompletionResult` contract and wired the publish CTA success handler through it.
- Verified success persists the marker, failed publish does not call the marker action, and missing recipe state does not call the marker action.
- 연결 context: `context/context_20260515_sub_ac_3_1_3_publish_completion_verification.md`
