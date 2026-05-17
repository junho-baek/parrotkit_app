# 2026-05-17 Sandcastle Breakdown Contract

## 배경

Breakdown 탭이 `Why this works`, `Idea angle`, `Proof points`처럼 ParrotKit이 임의로 요약한 명칭을 섞어 쓰면서 Sandcastle식 reference analysis grammar와 어긋난다. 사용자는 Sandcastle 명칭을 거의 그대로 가져가도 되고, DB에도 content/recipe가 이 구조로 쌓이는 편이 낫다고 판단했다.

## 목표

- Breakdown 탭 section 명칭을 Sandcastle식 구조로 정리한다.
- Recipe/domain payload에 durable `referenceBreakdown` 구조를 추가한다.
- 현재 DB는 `recipes.analysis_metadata jsonb`가 있으므로 새 컬럼 대신 `analysis_metadata.reference_breakdown`으로 저장 가능한 타입/계약을 문서화한다.
- Board UI는 기존처럼 실행 정보만 유지한다.

## 범위

- Native recipe domain type.
- App recipe analysis metadata type.
- Breakdown summary projection.
- Mock seed data.
- Schema/prompt docs.
- Contract tests.

## 변경 파일

- `src/domain/recipes/recipe.ts`
- `src/domain/recipes/native-recipe.ts`
- `src/domain/recipes/reference-breakdown.ts`
- `src/features/recipes/lib/recipe-domain-normalizer.ts`
- `src/features/recipes/lib/recipe-breakdown-summary.ts`
- `src/features/recipes/lib/recipe-breakdown-summary.test.ts`
- `src/core/mocks/parrotkit-data.ts`
- `docs/reference-analysis/sandcastle-breakdown-schema-and-prompt.md`
- `plans/20260517_sandcastle_breakdown_contract.md`
- `context/context_20260517_sandcastle_breakdown_contract.md`

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md`
- `git diff --check`

## 롤백

Revert this commit. The previous fallback breakdown projection will return `Why this works`, `Idea angle`, `Story format`, `Visual layout`, and `Proof points`.

## 리스크

- Sandcastle section names can feel analysis-heavy if copied into Board. Keep them inside Breakdown only and enforce Board/Breakdown boundary with existing tests.

## 결과

- `ReferenceBreakdown` durable payload를 Sandcastle식 schema로 추가했다.
- DB 저장 계약은 새 migration 없이 기존 `recipes.analysis_metadata.reference_breakdown`을 사용하도록 문서화했다.
- 첫 mock recipe는 DB-style `analysisMetadata.reference_breakdown` payload로 seed되고, native normalization이 `referenceBreakdown`으로 hydrate한다.
- Breakdown 탭은 `Summary`, `Transcript`, `Idea Analysis`, `Hook`, `Storytelling`, `Visual Layout`만 렌더링한다.
- 연결 context: `context/context_20260517_sandcastle_breakdown_contract.md`
