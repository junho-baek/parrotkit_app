# Issue #19 Provider Adapter Boundary Plan

## 배경

Issue #19는 레퍼런스 링크/영상 분석을 특정 공급자에 묶지 않고, Supadata/SuperData, Replicate-hosted Gemini/Claude/OpenAI, 또는 직접 OpenAI/Gemini/Anthropic 호출을 나중에 교체 가능하게 만드는 작업이다. 현재 앱은 mock/fallback 레시피를 만들고 있으며, #17/#18/#20에서 normalized media, job lifecycle, Breakdown, Shooting Board projection 계약은 이미 분리했다.

## 목표

- normalized media input을 받아 Sandcastle-style Breakdown과 compact Shooting Board projection을 돌려주는 provider adapter boundary를 만든다.
- provider debug metadata, prompt traces, queue IDs는 client-facing read model이나 board로 새지 않게 한다.
- model invalid JSON은 stable error code `model_invalid_output`으로 매핑한다.
- transcript가 없어도 visual/frame 기반 partial output은 `partial_ready`로 받을 수 있게 한다.
- Supadata/Replicate/Gemini/OpenAI/Claude 연결에 필요한 요청 구조와 env 이름을 문서화해 API key 주입 후 backend adapter 구현이 바로 가능하게 한다.

## 범위

- 포함: TypeScript domain/application-level ports, prompt contract builder, result validator/normalizer, provider error mapper, fixture tests, provider research note.
- 제외: 실제 API key 저장, 실 provider network 호출, Supabase migration/RPC/queue, 모바일 UI 변경, production worker 배포.

## 변경 파일

- `src/domain/recipes/reference-analysis-provider.ts`
- `src/domain/recipes/reference-analysis-provider.test.ts`
- `src/domain/recipes/reference-analysis-prompt.ts`
- `src/domain/recipes/reference-analysis-prompt.test.ts`
- `docs/reference-analysis/provider-adapter-research.md`
- `plans/20260517_issue_19_provider_adapter_boundary.md`
- `context/context_20260517_reference_analysis_pipeline_contract.md`

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-provider.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-prompt.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-contract.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-job.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/shoot-board/shoot-board-projection.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `git diff --check`

## 롤백

- 새로 추가한 provider/prompt 파일과 문서/plan/context 변경을 revert하면 기존 mock/fallback 레시피 생성과 board projection 동작은 그대로 남는다.

## 리스크

- Supadata/SuperData 명칭이 실제 사용 서비스와 다를 수 있다. 이번 작업은 provider 이름을 domain contract와 분리해 실제 서비스가 바뀌어도 adapter만 교체 가능하게 둔다.
- Claude/OpenAI는 raw video 분석보다 transcript/frame sampling 입력이 더 현실적일 수 있다. Gemini는 video input에 강하지만, Replicate 경유 모델별 input schema 차이가 있어 adapter별 request mapper가 필요하다.
- 실제 링크 ingestion은 저작권/플랫폼 정책/서명 URL/스토리지 권한 이슈가 있으므로, 모바일 클라이언트가 직접 secret key를 들고 호출하지 않고 backend/worker에서 실행해야 한다.

## 슈퍼파워 실행 계획

- [x] 공식 문서 기반 provider research를 정리한다.
- [x] prompt contract builder와 schema guard를 추가한다.
- [x] provider adapter boundary와 stable error mapper를 추가한다.
- [x] complete / transcript-missing partial / invalid model output fixture test를 추가한다.
- [x] context에 결과와 다음 backend 연결 단계를 남긴다.
- [ ] 검증 후 커밋/푸시한다.

## 결과

- 추가: `docs/reference-analysis/provider-adapter-research.md`
- 추가: `src/domain/recipes/reference-analysis-prompt.ts`
- 추가: `src/domain/recipes/reference-analysis-prompt.test.ts`
- 추가: `src/domain/recipes/reference-analysis-provider.ts`
- 추가: `src/domain/recipes/reference-analysis-provider.test.ts`

## 검증

- PASS: `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-prompt.test.ts`
- PASS: `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-provider.test.ts`
- PASS: `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-contract.test.ts`
- PASS: `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-job.test.ts`
- PASS: `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/shoot-board/shoot-board-projection.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `npm run check:architecture`
- PASS: `git diff --check`
