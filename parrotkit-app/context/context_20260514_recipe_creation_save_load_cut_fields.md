# Context 2026-05-14 Recipe Creation Save Load Cut Fields

## 작업

Sub-AC 9.3 범위로 레시피 생성/편집 후 저장 및 다시 열기 흐름에서 컷 카드의 네 필수 필드 `Hook`, `Line to Say`, `Shot/Action`, `Note`가 손실되지 않도록 local/mock editor board 저장 경로를 보강했다.

## 변경

- `src/features/recipes/lib/recipe-editor-state.ts`
  - `copyRecipeEditorBoard` helper 추가
  - source recipe id의 editor board를 target recipe id로 복사하며 `isSaved`를 true로 지정
  - 컷 배열을 새 객체로 복사해 `hook`, `lineToSay`, `shotAction`, `note` 등 기존 컷 필드 값을 그대로 유지
- `src/features/recipes/lib/recipe-editor-state.test.ts`
  - 저장된 recipe id로 board를 복사했을 때 네 필수 필드가 유지되는 smoke test 추가
- `src/core/providers/mock-workspace-provider.tsx`
  - `downloadRecipe`가 Explore/source recipe를 `downloaded-*` id로 저장할 때 기존 editor board도 같은 target id로 복사하도록 연결
  - 이미 다운로드된 recipe를 다시 저장하는 경우에도 누락된 editor board 복사를 시도

## 검증

- Red: `npm exec --offline -- tsc --noEmit` 실행 시 `copyRecipeEditorBoard` export 미구현 오류 확인.
- Green: 구현 후 `npm exec --offline -- tsc --noEmit` 통과.
- 로컬 Expo runtime QA는 수행하지 않았다.

## 연결된 plan

- `plans/20260514_recipe_creation_save_load_cut_fields.md`
