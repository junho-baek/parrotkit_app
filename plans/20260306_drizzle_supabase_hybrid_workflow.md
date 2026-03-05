# Drizzle + Supabase 하이브리드 스키마 운영 계획 (2026-03-06)

## 배경
- 현재 런타임 데이터 경로는 Supabase(Auth/Postgres/Storage) 중심으로 전환되었고, 레거시 호환 일부만 Drizzle(`mvp_users`)를 사용한다.
- 스키마 변경 관리의 일관성을 높이기 위해, 공용 테이블 DDL 변경은 Drizzle 기반으로 추적하고 Supabase 고유 영역(RLS/Auth/Storage 정책)은 SQL로 분리 관리하는 운영 규칙이 필요하다.

## 목표
- Drizzle 스키마에 Supabase `public` 핵심 테이블 계약을 반영해 컬럼 변경 이력을 코드에서 관리 가능하게 한다.
- 마이그레이션 워크플로를 명시해 팀이 동일한 절차(DDL vs 정책 SQL 분리)로 작업하도록 고정한다.
- 기존 런타임 동작은 변경하지 않고, 운영/개발 프로세스 안정성만 강화한다.

## 범위
- 포함
  - Drizzle 스키마 확장(`public` 테이블 정의 반영)
  - Drizzle config/스크립트 보강(생성 명령 추가)
  - 하이브리드 DB 변경 워크플로 문서화
- 제외
  - 실제 Supabase DB에 신규 DDL 적용
  - RLS/Storage 정책 변경
  - Auth 로직 변경

## 변경 파일
- `src/lib/schema.ts`
- `drizzle.config.ts`
- `package.json`
- `README.md` (또는 운영 문서)
- `context/context_*`

## 테스트
- `npx tsc --noEmit` (현 저장소 known issue 여부 포함 기록)
- `npm run build`
- `npx eslint src/lib/schema.ts drizzle.config.ts`

## 롤백
- 스키마/설정/문서 변경 커밋 revert 시 즉시 원복 가능.
- 런타임 API 로직은 건드리지 않아 기능 회귀 리스크는 낮다.

## 리스크
- Drizzle 스키마와 실제 Supabase 스키마 간 드리프트 가능성.
- RLS/Storage 정책이 Drizzle 범위 밖이라 문서 절차 미준수 시 누락 가능성.

## 결과
- Drizzle 스키마(`src/lib/schema.ts`)를 Supabase `public` 핵심 테이블(`profiles`, `references`, `recipes`, `recipe_captures`, `event_logs`)까지 확장했다.
- Drizzle 생성 명령을 `.env.local` 자동 로딩/URL 정규화가 가능한 래퍼 스크립트(`scripts/db-generate.cjs`)로 고정하고 `npm run db:generate`를 추가했다.
- Drizzle 마이그레이션 베이스라인을 생성했다.
  - `drizzle/0001_damp_marvel_zombies.sql`
  - `drizzle/meta/0001_snapshot.json`, `drizzle/meta/_journal.json` 갱신
- README에 하이브리드 운영 절차(DDL은 Drizzle, RLS/Auth/Storage 정책은 Supabase SQL)를 명시했다.
- 검증
  - `npm run db:generate`: 성공
  - `npm run db:schema`: 성공
  - `npx eslint src/lib/schema.ts drizzle.config.ts scripts/db-generate.cjs`: 성공
  - `npm run build`: 성공
  - `npx tsc --noEmit`: 기존 `.next/dev/types/validator.ts` Typed Routes 이슈로 실패(변경분 외 known issue)

## 연결 Context
- `context/context_20260306_041050_supabase_schema_snapshot.md`
- `context/context_20260306_041200_drizzle_supabase_hybrid_workflow.md`
