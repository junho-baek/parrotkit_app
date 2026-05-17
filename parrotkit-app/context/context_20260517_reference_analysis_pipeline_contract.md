# 2026-05-17 Reference Analysis Pipeline Contract

## 요청

사용자가 레퍼런스 숏폼 분석 파이프라인을 대강 만들기 전에 계약을 명확히 하자고 요청했다. MCP가 없으면 Ouroboros CLI를 쓰면 된다고 지시했다.

## 수행

- `ouroboros init start --llm-backend codex`로 새 인터뷰를 시작했다.
- 인터뷰 ID: `interview_20260517_102321`
- 총 9라운드 진행.
- ambiguity score: `0.093`
- 생성 Seed ID: `seed_aa2c8d1aa680`
- 원본 Seed 위치: `/Users/junho/.ouroboros/seeds/seed_aa2c8d1aa680.yaml`

## 수렴된 결정

- v1 core는 `uploaded/provider-normalized video asset -> persisted Breakdown -> compact Shooting Board projection`으로 한정한다.
- Instagram/TikTok/YouTube scraping, SuperData/Gemini ingestion은 future adapter로 둔다.
- normalized media input은 `media_asset_id`, workspace/user ownership, playable URI, mime/container, duration, dimensions/aspect ratio, byte size, checksum/version, source metadata를 보장해야 한다.
- transcript/audio/thumbnail/language/creator metadata는 없어도 partial analysis가 가능하다.
- duration/dimensions/decodable media/cut segment가 없으면 usable analysis를 막는다.
- Breakdown과 Shooting Board projection은 immutable generated artifact다.
- 사용자 수정은 generated artifact를 mutate하지 않고 recipe/board override layer에 저장한다.
- Shooting Board는 execution-first compact read model이며 Hook/Proof/Sandcastle section labels/confidence/debug details를 노출하지 않는다.
- 깊은 분석은 Breakdown에 둔다.

## 산출물

- `seeds/parrotkit_reference_analysis_pipeline_contract_20260517.yaml`
- `plans/20260517_reference_analysis_pipeline_contract.md`

## 구현 메모

- 실제 구현 단계에서는 Supabase 규칙에 따라 `npm run db:schema`와 latest schema snapshot 확인 후 migration/RPC/worker 설계를 시작해야 한다.
- 모바일 read model은 polling-friendly 상태(`preparing`, `analyzing`, `ready`, `partial`, `failed`)만 노출하고 내부 job 상태는 숨긴다.
- projection regeneration은 새 projection version을 만들고 stable `projection_cut_id`/`source_cut_ids`로 user overrides를 보존해야 한다.

## 검증

- Ouroboros CLI interview completed.
- Seed generation completed.
- `ruby -e "require 'yaml'; YAML.load_file('seeds/parrotkit_reference_analysis_pipeline_contract_20260517.yaml'); puts 'yaml ok'"` PASS.
- `git diff --check` PASS.

## 2026-05-17 Issue #17 실행

- Superpowers worktree: `/Users/junho/.config/superpowers/worktrees/parrotkit-app/codex-issue-17-reference-contracts`
- GitHub issue: `#17 Define reference analysis data contracts`
- 추가: `src/domain/recipes/reference-analysis-contract.ts`
  - normalized media input contract
  - immutable Breakdown artifact metadata/sections
  - evidence refs
  - cut segments
  - Shooting Board projection
  - user board overrides
  - compact projection text limits
- 수정: `src/domain/recipes/reference-breakdown.ts`
  - 기존 Sandcastle-style `ReferenceBreakdown`는 유지했다.
  - 새 pipeline fields는 optional로 bridge했다: `artifact`, `cut_segments`, `shooting_board_projection`, `user_overrides`.
- 추가 테스트: `src/domain/recipes/reference-analysis-contract.test.ts`

## 2026-05-17 Issue #17 검증

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-contract.test.ts` PASS.
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts` PASS.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` PASS.
- `npm run check:architecture` PASS.
- `git diff --check` PASS.

## 2026-05-17 Issue #18 실행

- Superpowers stacked worktree: `/Users/junho/.config/superpowers/worktrees/parrotkit-app/codex-issue-18-reference-job-lifecycle`
- Base branch: `codex/issue-17-reference-contracts`
- GitHub issue: `#18 Implement reference analysis job lifecycle API`
- 추가: `src/domain/recipes/reference-analysis-job.ts`
  - internal job statuses
  - client statuses: `preparing`, `analyzing`, `ready`, `partial`, `failed`
  - stable error codes
  - stage checklist contract
  - idempotency key helper
  - retryability rules
  - terminal artifact coherence check
  - client-safe polling read-model projection
- 추가 테스트: `src/domain/recipes/reference-analysis-job.test.ts`
- 수정: `src/domain/recipes/reference-analysis-contract.ts`
  - `ReferenceBreakdownArtifactMetadata`에 optional `jobId`/`traceId` lineage fields 추가.

## 2026-05-17 Issue #18 검증

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-job.test.ts` PASS.
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-contract.test.ts` PASS.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` PASS.
- `npm run check:architecture` PASS.
- `git diff --check` PASS.

## 2026-05-17 Merge / Issue Closure

- PR #22 merged into `main`: merge commit `0762d0a`.
- PR #23 merged into `main`: merge commit `930caa3`.
- #17 and #18 closed automatically through merged PRs.
- Worktrees/branches for #17 and #18 were cleaned up after merge.
- #10/#11/#5 remain open because their issue comments explicitly say final iOS/full QA or lifecycle pass is still pending.

## 2026-05-17 Issue #20 Planning

- Next recommended implementation slice: `#20 Integrate Breakdown to compact Shooting Board projection`.
- Added plan: `plans/20260517_issue_20_board_projection_integration.md`.
- Plan sequence:
  1. Add pure projection-to-board mapper.
  2. Make `createShootBoardRecipe` prefer `referenceBreakdown.shooting_board_projection` with existing scene/template fallback.
  3. Preserve user overrides across projection regeneration.
  4. Guard Board UI from Hook/Proof/Storytelling/Visual Layout/confidence/debug labels.
  5. Leave Android/iOS screenshots for #21 after behavior lands.

## 2026-05-17 Issue #20 실행

- Superpowers worktree: `/Users/junho/.config/superpowers/worktrees/parrotkit-app/codex-issue-20-board-projection`
- GitHub issue: `#20 Integrate Breakdown to compact Shooting Board projection`
- 추가: `src/domain/shoot-board/shoot-board-projection.ts`
  - `shooting_board_projection.items`를 `ShootBoardCut[]`으로 변환하는 순수 mapper 추가.
  - reference time range를 `0:00-0:05` 형식으로 변환.
  - `projectionCutId`, `sourceCutIds`, `referenceUsage`, `myTakeRelationship`, `projectionTitle` lineage를 보드 cut에 보존.
  - 사용자 override를 generated projection에 mutate 없이 적용하는 helper 추가.
- 수정: `src/domain/shoot-board/shoot-board-model.ts`
  - `createShootBoardRecipe()`가 `referenceBreakdown.shooting_board_projection`이 있으면 projection board를 우선 사용.
  - 기존 Korean diet template / scene fallback은 유지.
  - projection board의 title/duration/summary는 projection 계약을 기준으로 계산.
  - reorder 시 projection execution title을 유지.
- 테스트:
  - projection mapper/override 테스트 추가.
  - shoot board integration 테스트에 projection 우선순위, 필드 매핑, duration, label guard, reorder title 보존 검증 추가.
  - board reference contract 테스트를 현재 컴포넌트 구조 기준으로 갱신하고 visible board label guard 추가.

## 2026-05-17 Issue #20 검증

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/shoot-board/shoot-board-projection.test.ts` PASS.
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts` PASS.
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts` PASS.
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-reference-contract.test.ts` PASS.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` PASS.
- `npm run check:architecture` PASS.
- `git diff --check` PASS.

## 2026-05-17 Issue #20 남은 QA

- 이번 작업은 domain/read-model 통합과 label guard까지다.
- Android/iOS 실행 화면 캡처와 실제 reference preview / My Take interaction QA는 #21에서 진행한다.
