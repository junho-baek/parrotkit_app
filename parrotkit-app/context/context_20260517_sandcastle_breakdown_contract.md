# 2026-05-17 Sandcastle Breakdown Contract

## 배경

사용자는 ParrotKit의 레퍼런스 분석/레시피 저장 구조가 Sandcastle식 구조와 더 가까워야 한다고 피드백했다. 특히 Breakdown 탭의 `Proof points`, `Why this works`, `Idea angle` 같은 임의 label은 화면 감도를 떨어뜨리고, DB에도 같은 ad hoc 구조가 쌓이면 이후 Gemini/SuperData 기반 레퍼런스 분석과 충돌할 수 있다.

## 변경

- `src/domain/recipes/reference-breakdown.ts`를 추가해 `parrotkit.reference_breakdown.v1` durable payload를 타입화했다.
- DB 저장 계약은 새 migration 없이 기존 `recipes.analysis_metadata jsonb`의 `analysis_metadata.reference_breakdown` 경로를 사용하도록 정리했다.
- `Recipe` / `NativeRecipe`에 `analysisMetadata`와 hydrated `referenceBreakdown` optional field를 추가했다.
- `normalizeNativeRecipe`가 `analysisMetadata.reference_breakdown`을 `referenceBreakdown`으로 올려 앱 projection에서 바로 쓰도록 했다.
- 첫 mock recipe는 DB-style `analysisMetadata.reference_breakdown` payload를 갖도록 seed했다.
- Breakdown 탭은 `Summary`, `Transcript`, `Idea Analysis`, `Hook`, `Storytelling`, `Visual Layout` 섹션만 렌더링한다.
- `Supporting evidence`는 `Idea Analysis` body 안에 포함하고, 별도 `Proof points` section은 만들지 않는다.
- `docs/reference-analysis/sandcastle-breakdown-schema-and-prompt.md`에 DB persistence guidance와 extraction prompt guardrail을 추가했다.

## 검증

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md` passed with 0 errors and existing unused-token warnings only.
- `git diff --check`

## 메모

이번 작업은 DB schema migration을 만들지 않았다. 현재 앱 repo에는 `db:schema` script가 없고, 실제 schema 변경 없이 existing JSONB storage contract를 타입/문서/seed 수준에서 고정하는 작업이다.
