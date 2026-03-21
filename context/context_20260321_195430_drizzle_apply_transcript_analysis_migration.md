# Drizzle Apply Transcript Analysis Migration

## 작업 개요
- 배포 환경 `GET /api/recipes` 500 원인인 `references.transcript` 누락 문제를 운영 DB migration 미적용 이슈로 확인했다.
- Drizzle migrator를 사용해 `drizzle/` migration을 운영 DB에 반영했다.

## 확인 사항
- `.env.local`의 `DATABASE_URL`은 비밀번호 내 `#` 때문에 일반 파서에서 잘못 해석되고 있었다.
- 정규화 후 실제 호스트는 `aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres`로 확인됐다.
- `drizzle.__drizzle_migrations` 테이블이 기존에는 없었고, migration 적용 후 `0000`, `0001`, `0002` 해시가 기록됐다.

## 수행 내용
- `drizzle-orm/node-postgres` + `drizzle-orm/node-postgres/migrator`로 `./drizzle` migration 실행
- DB 컬럼 존재 확인
  - `public.references.transcript`
  - `public.references.transcript_source`
  - `public.references.transcript_language`
  - `public.references.source_metadata`
  - `public.recipes.analysis_metadata`
  - `public.recipes.script_source`
- `scripts/db-schema.cjs` 보완
  - `DATABASE_URL` 내 `#` password 정규화
  - `sslmode=require` 시 `uselibpqcompat=true` 추가
  - Supabase host/pooler host에서 `ssl.rejectUnauthorized=false` 적용

## 검증
- Drizzle migrator 실행 결과: 성공
- 컬럼 조회 검증: 6개 신규 컬럼 모두 존재
- `drizzle.__drizzle_migrations` 조회 검증: 3개 migration row 존재
- `node scripts/db-schema.cjs` 재실행: 성공
  - 생성 파일: `context/context_20260321_195430_supabase_schema_snapshot.md`

## 메모
- 이번 배포 에러는 Supadata `auto/native` 설정과 무관하다. 원인은 DB 스키마 mismatch였다.
- 재배포 없이도 DB migration 반영만으로 `/api/recipes` 컬럼 에러는 해소되는 방향이다.
