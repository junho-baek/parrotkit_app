# 2026-05-14 Explore Copy Save Authenticated User

## 배경

Explore의 레시피 복사 액션은 v1에서 외부/API 추출이 아니라 로컬/mock 레시피를 현재 사용자 소유 레시피로 저장하는 흐름이어야 한다.

## 목표

- Explore 카드의 copy 액션이 생성된 레시피를 현재 사용자 소유로 저장하도록 계약을 명확히 한다.
- 저장된 레시피가 Home/My에서 접근 가능한 일반 user recipe 목록에 들어갈 수 있도록 `owned` 상태와 로컬 사용자 attribution을 보존한다.
- 중복 copy 시 같은 소스 템플릿에서 여러 user recipe가 생기지 않도록 한다.

## 범위

- Explore copy/save helper와 provider wiring
- Focused TypeScript contract test
- Explore card detail/list 경로의 기존 라우트 보존

## 변경 파일

- `src/features/explore/lib/explore-template-recipe-copy.ts`
- `src/features/explore/lib/explore-template-recipe-copy.test.ts`
- `src/core/providers/mock-workspace-provider.tsx`
- `tsconfig.explore-card-detail-check.json`
- `context/context_20260514_explore_copy_save_authenticated_user.md`

## 테스트

- Red: Explore copy-save contract test가 미구현 helper로 실패하는지 확인
- Green: `npm exec --offline -- tsc --project tsconfig.explore-card-detail-check.json`

## 롤백

- 추가 helper와 테스트 변경을 되돌리고 provider는 기존 `createOwnedRecipeFromExploreTemplate` 호출로 복귀한다.

## 리스크

- 공유 worktree의 다른 AC 변경과 provider 충돌 가능성이 있으므로 기존 `recipeEditorBoards`/prompter 상태 변경을 보존한다.

## 결과

- `createOwnedRecipeFromExploreTemplate`가 profile-like owner를 받을 수 있게 확장됐다.
- Explore copy/save provider path가 `profileSeed`를 넘겨 생성된 owned recipe를 현재 mock authenticated user(`Junho Baek`, `@junho`) 소유로 저장한다.
- 기존 idempotent copy behavior와 `recipeEditorBoards` 복사 경로는 유지했다.
- 결과 context: `context/context_20260514_explore_copy_save_authenticated_user.md`

## 검증

- Red: `npm exec --offline -- tsc --noEmit -p tsconfig.explore-card-detail-check.json`
  - `createOwnedRecipeFromExploreTemplate`가 owner 인자를 받지 않아 `Expected 1 arguments, but got 2`로 실패했다.
- Green: `npm exec --offline -- tsc --noEmit -p tsconfig.explore-card-detail-check.json` 통과.
- Integration: `npm exec --offline -- tsc --noEmit` 통과.
