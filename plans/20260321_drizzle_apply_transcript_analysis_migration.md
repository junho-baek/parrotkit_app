# Drizzle Transcript Analysis Migration Apply

## 배경
- 배포 환경 `GET /api/recipes`에서 `references.transcript` 컬럼이 없다는 500 에러가 발생했다.
- 코드와 타입은 신규 transcript/analysis metadata 컬럼을 전제로 배포됐지만, 운영 DB에는 해당 마이그레이션이 아직 적용되지 않았다.

## 목표
- Drizzle 기준 신규 migration을 운영 DB에 반영한다.
- 배포 환경에서 `/api/recipes`가 다시 정상 응답하도록 만든다.

## 범위
- Drizzle migration 실행 경로 확인
- transcript/analysis metadata 컬럼 추가 migration 적용
- 배포 DB 기준 최소 검증

## 변경 파일
- `plans/20260321_drizzle_apply_transcript_analysis_migration.md`
- `context/context_20260321_*_drizzle_apply_transcript_analysis_migration.md`

## 테스트
- `db:schema` 또는 동등한 DB 연결 확인
- migration 적용 후 `references.transcript`, `references.transcript_source`, `references.transcript_language`, `references.source_metadata`, `recipes.analysis_metadata`, `recipes.script_source` 존재 확인
- 필요 시 배포 API 재확인

## 롤백
- 신규 컬럼은 additive 변경이므로 긴급 롤백은 미적용을 제외하면 필요성이 낮다.
- 문제 시 API 조회 경로를 legacy select로 일시 완화할 수 있다.

## 리스크
- 현재 `DATABASE_URL`이 일반 파서에서 깨지는 형식이라 migration 실행 시 정규화가 필요하다.
- 운영 DB 연결이 제한되면 CLI/직접 SQL 경로를 우회 검토해야 한다.

## 결과
- `drizzle-orm` migrator로 `./drizzle` 폴더 전체 migration을 운영 DB에 적용했다.
- `references.transcript`, `references.transcript_source`, `references.transcript_language`, `references.source_metadata`, `recipes.analysis_metadata`, `recipes.script_source` 컬럼 존재를 확인했다.
- `drizzle.__drizzle_migrations` 기록도 `0000` ~ `0002`까지 생성된 것을 확인했다.
- `scripts/db-schema.cjs`에 Supabase pooled `DATABASE_URL` 정규화 및 SSL 호환 처리를 추가해 이후 스키마 스냅샷도 정상 생성되도록 보완했다.

## 연결 Context
- `context/context_20260321_195430_drizzle_apply_transcript_analysis_migration.md`
- `context/context_20260321_195430_supabase_schema_snapshot.md`
