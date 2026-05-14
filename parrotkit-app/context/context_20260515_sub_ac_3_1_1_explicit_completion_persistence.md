# Context 2026-05-15 Sub-AC 3.1.1 Explicit Completion Persistence

## 작업
Explicit publish/complete action이 board completion state를 저장할 수 있도록 v1 mock recipe record의 persistent completion entry를 정리했다.

## 변경
- Updated `src/core/mocks/parrotkit-data.ts`
  - Existing `MockRecipe.explicitCompletion?: boolean` field를 재사용한다.
  - `markRecipeBoardExplicitCompletion(recipes, recipeId, explicitCompletion = true)` helper를 추가해 해당 field를 immutable하게 저장한다.
- Updated `src/core/mocks/parrotkit-data.test.ts`
  - Explicit completion helper가 대상 recipe record에만 `explicitCompletion: true`를 저장하고 sibling record identity를 보존하는지 검증한다.
  - Test runner 호환성을 위해 이 파일의 local imports를 relative path로 정리했다.
- Added `tsconfig.parrotkit-data-check.json`
  - Mock data completion persistence focused TypeScript verification target.
- Updated `plans/20260515_sub_ac_3_1_1_explicit_completion_persistence.md`
  - 결과와 연결 context를 기록했다.

## 검증
- RED: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.parrotkit-data-check.json`
  - Expected failure: `Module '"@/core/mocks/parrotkit-data"' has no exported member 'markRecipeBoardExplicitCompletion'.`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.parrotkit-data-check.json`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 미검증 / 리스크
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/mocks/parrotkit-data.test.ts`는 `parrotkit-data.ts` 내부 `@/core/mocks/ugc-media` runtime alias를 해석하지 못해 실행되지 않았다. Focused TypeScript check로 contract 검증은 완료했다.
- No navigation, bottom tab, CTA language, Supabase schema, or UI publish flow changes were introduced.
