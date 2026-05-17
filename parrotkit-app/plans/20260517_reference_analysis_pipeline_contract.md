# 2026-05-17 Reference Analysis Pipeline Contract

## 배경

ParrotKit은 레퍼런스 숏폼 영상을 분석해 레시피 촬영 보드로 투영해야 한다. 기존 `recipe_analysis_contract` seed는 Sandcastle식 분석 taxonomy와 Board/Breakdown 경계를 잡았지만, 실제 분석 파이프라인의 normalized media input, async job, API, immutable artifact, projection contract는 아직 덜 명확하다.

사용자가 Ouroboros CLI 인터뷰를 통해 계약을 명확히 하자고 요청했다.

## 목표

- Ouroboros CLI 인터뷰로 v1 reference video analysis pipeline 계약을 수렴한다.
- 생성된 Seed를 ParrotKit brownfield 기준으로 보정해 repo `seeds/`에 보관한다.
- normalized media input, job lifecycle, Breakdown, cut segments, Shooting Board projection, API/error/retention/partial semantics를 스펙으로 고정한다.

## 범위

- 스펙/Seed 문서 추가.
- 작업 context 기록.
- 코드, DB migration, API 구현, UI 변경은 이번 작업 범위에서 제외한다.

## 변경 파일

- `seeds/parrotkit_reference_analysis_pipeline_contract_20260517.yaml`
- `plans/20260517_reference_analysis_pipeline_contract.md`
- `context/context_20260517_reference_analysis_pipeline_contract.md`

## 테스트

- Ouroboros CLI interview/seed generation result 확인.
- YAML parse 확인.
- `git diff --check`.

## 롤백

추가된 seed/context/plan 파일을 제거한다.

## 리스크

- 실제 SuperData/Gemini/provider API 계약은 추후 도입 시 재검증이 필요하다.
- 현재 Seed는 구현 전 계약이다. DB/RLS/worker 설계 시 Supabase 규칙에 따라 별도 schema snapshot과 migration 검토가 필요하다.

## 결과

- Ouroboros CLI interview `interview_20260517_102321`을 9라운드 수행했다.
- ambiguity score `0.093`으로 Seed 생성 가능 판정을 받았다.
- Ouroboros generated seed `seed_aa2c8d1aa680`을 repo seed로 보정해 저장했다.
- 연결 context: `context/context_20260517_reference_analysis_pipeline_contract.md`
