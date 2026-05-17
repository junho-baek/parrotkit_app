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
