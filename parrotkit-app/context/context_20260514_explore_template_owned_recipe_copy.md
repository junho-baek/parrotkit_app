# Context 2026-05-14 Explore Template Owned Recipe Copy

## 작업

Sub-AC 23.2.1: copied Explore card templates become user-owned recipe records.

## 변경

- `src/features/explore/lib/explore-template-recipe-copy.ts`
  - `getOwnedExploreTemplateRecipeId`를 추가해 Explore 템플릿 원본 id에서 안정적인 로컬 소유 레시피 id를 만든다.
  - `createOwnedRecipeFromExploreTemplate`를 추가해 원본 템플릿은 그대로 두고 `ownership: "owned"`, `ownerName: "You"`, `ownerHandle: "@parrotkitcodextest"`, `remixOfRecipeId`를 가진 사용자 레시피를 생성한다.
  - `isOwnedExploreTemplateRecipe`를 추가해 반복 저장 시 같은 로컬 레시피를 재사용할 수 있게 했다.
- `src/core/providers/mock-workspace-provider.tsx`
  - `downloadRecipe`의 기존 `downloaded-*` 생성 로직을 user-owned template copy 로직으로 교체했다.
  - `isRecipeDownloaded`는 기존 public API 이름을 유지하되, 내부적으로는 해당 Explore 템플릿의 user-owned copy 존재 여부를 확인한다.
  - `recipeEditorBoards` 복사 경로는 유지해 저장한 템플릿이 기존 컷보드/프롬프터 플로우로 이어지게 했다.
- `src/features/explore/lib/explore-template-recipe-copy.test.ts`
  - 기존 contract test가 새 helper를 검증한다.

## 검증

- Red 확인:
  - `npm exec --offline -- tsc --noEmit -p tsconfig.explore-card-detail-check.json`
  - helper 파일이 없어 `Cannot find module './explore-template-recipe-copy'`로 실패했다.
- Green 확인:
  - `npm exec --offline -- tsc --noEmit -p tsconfig.explore-card-detail-check.json` 통과.
  - `npm exec --offline -- tsc --noEmit` 통과.

## 참고

- 데이터는 local/mock state 안에서만 유지된다.
- public context API 이름 `downloadRecipe` / `isRecipeDownloaded`는 기존 route와 UI 호환을 위해 유지했다.
- shared worktree에 sibling AC 변경이 많아 commit/push는 수행하지 않았다.
