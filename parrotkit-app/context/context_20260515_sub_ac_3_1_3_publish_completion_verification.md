# Context 2026-05-15 Sub-AC 3.1.3 Publish Completion Verification

## 작업
Successful publish/complete action만 explicit completion marker를 저장하고 failed action은 저장하지 않는 focused verification을 추가했다.

## 변경
- Added `src/features/recipes/lib/publish-completion-success-path.ts`
  - `persistPublishCompletionResult` helper가 `publishSucceeded === true`이고 `recipeId`가 있을 때만 `markRecipeBoardComplete(recipeId)`를 호출한다.
  - Failed publish 또는 missing recipe state는 marker action을 호출하지 않고 `false`를 반환한다.
- Updated `src/features/recipes/screens/recipes-screen.tsx`
  - Publish CTA가 publish result boolean을 전달하고, screen success handler가 helper를 통해 explicit completion marker persistence를 수행한다.
- Replaced `src/features/recipes/lib/publish-completion-success-path.test.ts`
  - Success case: marker action 호출 및 persisted result 반환 검증.
  - Failed case: marker action 미호출 검증.
  - Missing recipe case: marker action 미호출 검증.
- Updated `tsconfig.publish-completion-success-path-check.json`
  - Focused helper/test source까지 TypeScript check에 포함했다.
- Updated `plans/20260515_sub_ac_3_1_3_publish_completion_verification.md`
  - 결과와 연결 context를 기록했다.

## 검증
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/recipes/lib/publish-completion-success-path.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.publish-completion-success-path-check.json`

## 리스크 / 후속
- Publish remains a v1 mock action with `publishSucceeded = true` in the CTA; failure behavior is verified at the shared helper boundary so a future real publish result can reuse the same guard.
- No Home Continue predicate, bottom tab labels, CTA language, Supabase schema, or layout behavior changed.
