# 2026-05-16 Paste Submission Reference Flow

## 배경
Issue 6 Sub-AC 3.3.3은 validated Paste drawer submission이 기존 recipe creation flow로 이어지고, 입력한 reference link가 생성된 recipe에 정확히 전달되어야 한다.

## 목표
Paste drawer에서 유효한 reference link로 primary CTA를 누르면 recipe board가 생성되고, 해당 링크가 recipe source/reference metadata와 generated scene material에 반영되도록 한다.

## 범위
- Reference submit path에서 기존 draft 생성 흐름에 reference generation fallback scene material을 연결한다.
- Mock workspace draft 생성 API가 reference thumbnail/scenes/source를 보존할 수 있게 최소 확장한다.
- 기존 manual/brand submit, five-slot nav, route mapping은 변경하지 않는다.

## 변경 파일
- `src/core/providers/mock-workspace-provider.tsx`
- `src/features/recipes/lib/reference-recipe-generation.ts`
- `src/features/recipes/lib/reference-recipe-generation.test.ts`
- `src/features/recipes/screens/recipe-create-screen.tsx`
- `plans/20260516_paste_submission_reference_flow.md`
- `context/context_20260516_paste_submission_reference_flow.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- `git diff --check` on touched files
- DESIGN.md source check 및 금지 copy 검색

## 롤백
Reference submit path의 generated scene/thumbnail wiring과 mock workspace input 확장을 제거하고 기존 `createRecipeDraft(draft)` 호출로 되돌린다.

## 리스크
- 실제 API 호출 없이 local fallback generation을 사용하므로 network-backed generation 품질은 별도 AC에서 검증해야 한다.

## 결과
- Paste reference mode submit에서 `buildLocalFallbackResult`와 `mapGeneratedRecipeToMockScenes`를 사용해 pasted link 기반 scene material을 생성하도록 연결했다.
- `createRecipeDraft` input을 확장해 generated scenes, thumbnail, summary, `referenceVideoSource`를 보존하도록 했다.
- Reference fallback generation이 pasted URL을 trim한 뒤 metadata/source URL로 보존하도록 했다.

## 검증 결과
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.recipe-create-options-check.json`
- PASS: `git diff --check -- src/core/providers/mock-workspace-provider.tsx src/features/recipes/lib/reference-recipe-generation.ts src/features/recipes/lib/reference-recipe-generation.test.ts src/features/recipes/screens/recipe-create-screen.tsx plans/20260516_paste_submission_reference_flow.md`
- PASS: `node -e "...require('sucrase/register/ts'); require('./src/features/recipes/lib/reference-recipe-generation.test.ts')"` with a temporary `@/` resolver shim.
- PASS: `node -e "...require('sucrase/register/ts'); require('./src/features/recipes/lib/recipe-create-flow.test.ts')"` with a temporary `@/` resolver shim.
- PASS: DESIGN.md source check for recipe drawer, Paste center action, CTA copy, and guardrails.
- PASS: 금지 copy 검색 on `src/features/recipes/screens/recipe-create-screen.tsx` and `src/features/recipes/lib/reference-recipe-generation.ts`.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md` failed because sandbox network cannot resolve `registry.npmjs.org` and no repo-local design lint binary exists.
- 연결 context: `context/context_20260516_paste_submission_reference_flow.md`
