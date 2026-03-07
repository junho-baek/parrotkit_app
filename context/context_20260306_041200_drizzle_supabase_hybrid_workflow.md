# Context Update - Drizzle + Supabase 하이브리드 운영 고정 (2026-03-06 04:12 KST)

## 작업 목적
- 스키마 변경 관리 안정화를 위해 Drizzle(DDL 추적) + Supabase SQL(RLS/Auth/Storage 정책) 하이브리드 운영을 프로젝트에 반영.

## 적용 내용
- `src/lib/schema.ts`
  - 기존 `mvp_users` 외에 Supabase `public` 핵심 테이블 정의 추가:
    - `profiles`, `references`, `recipes`, `recipe_captures`, `event_logs`
  - 컬럼 기본값/인덱스/유니크/FK를 코드 레벨에서 추적 가능하게 구성.
- `scripts/db-generate.cjs` (신규)
  - `.env.local` 로딩
  - `DATABASE_URL` 정규화
  - `drizzle-kit generate:pg --config drizzle.config.ts` 실행 래핑
- `package.json`
  - `db:generate` 스크립트 추가
- Drizzle migration baseline 생성
  - `drizzle/0001_damp_marvel_zombies.sql`
  - `drizzle/meta/0001_snapshot.json`
  - `drizzle/meta/_journal.json` 업데이트
- `README.md`
  - Stable DB Workflow 섹션 추가 (DDL vs 정책 SQL 분리 절차)

## 검증 결과
- `npm run db:generate`: 성공
- `npm run db:schema`: 성공
  - 생성: `context/context_20260306_041050_supabase_schema_snapshot.md`
- `npx eslint src/lib/schema.ts drizzle.config.ts scripts/db-generate.cjs`: 성공
- `npm run build`: 성공
- `npx tsc --noEmit`: 실패
  - 기존 known issue: `.next/dev/types/validator.ts` typed-routes 제네릭 오류

## 운영 메모
- 이번 변경은 런타임 API 동작 변경이 아니라 스키마 변경 관리 절차 강화가 핵심.
- Supabase 고유 영역(RLS/Auth/Storage 정책)은 계속 `supabase/migrations/*.sql`로 직접 관리해야 함.
