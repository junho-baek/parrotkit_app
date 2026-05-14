# Context 2026-05-14 Explore Copy Save Authenticated User

## 작업

Sub-AC 23.2.2: Wire the Explore copy action to save the generated recipe for the authenticated user.

## 변경

- `src/features/explore/lib/explore-template-recipe-copy.ts`
  - `ExploreTemplateRecipeOwner` 타입을 추가했다.
  - `createOwnedRecipeFromExploreTemplate`가 owner를 받을 수 있게 확장했다.
  - 기존 기본 owner fallback은 유지해 기존 호출 호환성을 보존했다.
- `src/core/providers/mock-workspace-provider.tsx`
  - `downloadRecipe`가 Explore 템플릿 copy/save 시 `profileSeed`를 전달하도록 변경했다.
  - 생성된 owned recipe가 current mock authenticated user인 `Junho Baek` / `@junho` 소유로 저장된다.
  - 반복 copy idempotency와 recipe editor board 복사 경로는 유지했다.
- `src/features/explore/lib/explore-template-recipe-copy.test.ts`
  - Explore copy action의 generated recipe owner가 authenticated profile과 일치해야 한다는 contract를 추가했다.
- `plans/20260514_explore_copy_save_authenticated_user.md`
  - 결과와 검증 내용을 기록했다.

## 검증

- Red 확인:
  - `npm exec --offline -- tsc --noEmit -p tsconfig.explore-card-detail-check.json`
  - owner 인자 미지원으로 `Expected 1 arguments, but got 2` 실패를 확인했다.
- Green 확인:
  - `npm exec --offline -- tsc --noEmit -p tsconfig.explore-card-detail-check.json` 통과.
  - `npm exec --offline -- tsc --noEmit` 통과.

## 참고

- 데이터는 local/mock state 안에서만 저장된다.
- login/cloud/server/payment/community/search/recommendation 흐름은 추가하지 않았다.
- shared worktree에 sibling AC 변경이 많아 commit/push는 수행하지 않았다.
