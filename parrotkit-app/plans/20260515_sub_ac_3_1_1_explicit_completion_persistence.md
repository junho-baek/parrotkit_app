# 2026-05-15 Sub-AC 3.1.1 Explicit Completion Persistence

## 배경
Home Continue exclusion already needs an explicit publish/complete completion signal in addition to required-cut saved My Take coverage.

## 목표
Reuse the existing `MockRecipe.explicitCompletion` field as the persistent v1 board completion state and add a focused helper/test around marking that state.

## 범위
- Mock recipe persistence model and focused tests.
- No navigation, CTA language, Supabase schema, or UI publish flow changes.

## 변경 파일
- `src/core/mocks/parrotkit-data.ts`
- `src/core/mocks/parrotkit-data.test.ts`
- `plans/20260515_sub_ac_3_1_1_explicit_completion_persistence.md`
- `context/context_20260515_sub_ac_3_1_1_explicit_completion_persistence.md`

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/mocks/parrotkit-data.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.parrotkit-data-check.json`

## 롤백
Remove the helper/test additions and this plan/context note.

## 리스크
- This keeps explicit completion as a v1 mock recipe field; a future Supabase-backed implementation may map the same boolean to a table column or board metadata entry.

## 결과
- 완료: existing `MockRecipe.explicitCompletion` field를 v1 persistent recipe record의 explicit completion state로 재사용했다.
- 완료: `markRecipeBoardExplicitCompletion` helper를 추가해 publish/complete action이 해당 필드를 immutable하게 저장할 수 있는 entry point를 마련했다.
- 완료: focused mock data test와 TypeScript verification config를 추가했다.
- 연결 context: `context/context_20260515_sub_ac_3_1_1_explicit_completion_persistence.md`
