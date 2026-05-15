# Context 2026-05-16 Paste Submission Reference Flow

## 작업
Issue 6 Sub-AC 3.3.3: validated Paste drawer submission을 기존 recipe creation flow에 연결하고, pasted reference link가 생성된 recipe에 source material로 전달되도록 했다.

## DESIGN.md 확인
- Recipe creation은 bottom drawer/modal sheet pattern을 유지해야 함을 확인했다.
- Preferred v1 bottom navigation model에서 `Paste`는 larger center action이고 short-form/reference link를 source material로 쓰는 액션임을 확인했다.
- Recipe drawer CTA copy는 English `Open recipe board`, Korean `레시피 보드 열기`를 유지해야 함을 확인했다.
- box-in-box, redundant CTA, Shoot/New Shoot/Start Shoot/workflow/console/debug user-facing copy 금지 guardrail을 확인했다.

## 변경
- `src/features/recipes/screens/recipe-create-screen.tsx`
  - Reference mode primary CTA submit 시 `buildLocalFallbackResult`와 `mapGeneratedRecipeToMockScenes`로 pasted link 기반 recipe scene material을 생성하도록 연결했다.
  - 생성된 scenes, thumbnail, summary, trimmed `referenceVideoSource`를 기존 `createRecipeDraft` flow에 전달한다.
  - 기존 manual/brand submit과 board route destination은 유지했다.
- `src/core/providers/mock-workspace-provider.tsx`
  - `createRecipeDraft` input이 generated scenes, thumbnail, summary, `referenceVideoSource`를 받을 수 있게 확장했다.
  - 전달된 scenes 수를 `totalSceneCount`로 사용하고, 없으면 기존 local draft scenes를 생성하는 fallback은 유지했다.
- `src/features/recipes/lib/reference-recipe-generation.ts`
  - local fallback generation이 pasted reference URL을 trim한 뒤 `reference.url`과 YouTube metadata parsing에 사용하도록 수정했다.
- `src/features/recipes/lib/reference-recipe-generation.test.ts`
  - fallback generation이 pasted URL을 trim/preserve하고 video id를 source URL에서 파생하는 계약을 추가했다.

## 검증
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- PASS: `git diff --check -- src/core/providers/mock-workspace-provider.tsx src/features/recipes/lib/reference-recipe-generation.ts src/features/recipes/lib/reference-recipe-generation.test.ts src/features/recipes/screens/recipe-create-screen.tsx plans/20260516_paste_submission_reference_flow.md`
- PASS: `node -e "...require('sucrase/register/ts'); require('./src/features/recipes/lib/reference-recipe-generation.test.ts')"` with a temporary `@/` resolver shim.
- PASS: `node -e "...require('sucrase/register/ts'); require('./src/features/recipes/lib/recipe-create-flow.test.ts')"` with a temporary `@/` resolver shim.
- PASS: DESIGN.md source check for recipe drawer, Paste center action, CTA copy, and guardrails.
- PASS: 금지 copy 검색 on `src/features/recipes/screens/recipe-create-screen.tsx` and `src/features/recipes/lib/reference-recipe-generation.ts`.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`
  - sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패했다 (`ENOTFOUND`).
  - repo-local `package.json`/`node_modules/.bin`에는 DESIGN.md lint script/binary가 없다.

## 리스크 / 후속
- 이번 wiring은 local fallback generation을 사용해 바로 board를 여는 경로다. Network-backed YouTube generation 호출/로딩 상태가 필요하면 별도 AC에서 async 상태와 실패 UX를 추가해야 한다.
- shared worktree에 sibling-agent 변경이 많아 이번 subtask 파일만 분리 커밋/푸시하기 어렵다. Seed 제약상 QA screenshots/local plans는 커밋 대상에서 제외해야 한다.
