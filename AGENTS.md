# AGENTS

## 개발 규칙 (Orchestrator)

1. 코드 변경 전 최신 context\_\*.md 확인 (context 폴더의 타임라인 기준 최신 파일부터 읽기)
2. git status 확인
3. 변경/검증/테스트까지 수행
4. 결과 요약 기록 (context\_\*.md에 추가 또는 새 context 문서 작성)
5. 작업 완료 후 반드시 git push 수행

## 작업 절차 (고정)

1. 프로젝트 구조 파악
2. 최신 context 파악
3. plans 디렉토리 기존 플랜 파악
4. 이번 작업 plan 문서 작성
5. 구현/검증/테스트 수행
6. context 업데이트
7. git 상태 확인 후 커밋/푸시

## plans 디렉토리 운영 규칙

- 모든 작업은 `plans/`에 작업 시작 plan을 먼저 작성한다.
- 파일명 규칙: `YYYYMMDD_<topic>.md`
- 필수 섹션: 배경, 목표, 범위, 변경 파일, 테스트, 롤백, 리스크
- 작업 완료 시 plan 문서에 결과 및 연결된 context 파일명을 남긴다.

## Supabase 작업 규칙

- Supabase 테이블/쿼리/RLS/타입에 영향 있는 작업 시작 시 `npm run db:schema`를 먼저 실행한다.
- 작업 전 최신 `context/context_*_supabase_schema_snapshot.md`와 `src/types/supabase.generated.ts`를 확인한다.
- DB 스키마/계약 변경 후 `npm run db:schema`를 재실행해 스냅샷을 갱신한다.
- 실행/결과 요약을 `context/context_*.md`에 기록한다.
- 새 Supabase 프로젝트에서는 legacy `anon` / `service_role` 키를 새로 도입하지 않는다.
- 기본 env 이름은 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL`로 유지한다.
- 이유: publishable/secret 키는 프로젝트 JWT signing secret과 독립적으로 회전할 수 있어 운영 중 키 교체 리스크가 더 낮다.
- 브라우저/일반 auth 흐름은 publishable key를 사용하고, 관리자 API/백필/마이그레이션만 secret key를 사용한다.
- secret key는 서버 전용이다. `NEXT_PUBLIC_` 접두사를 붙이거나 클라이언트 번들로 흘려보내지 않는다.
- Next.js 앱 런타임용 `DATABASE_URL`은 우선 pooled connection string을 사용한다. direct connection은 장기 세션이 꼭 필요한 오프라인 관리 작업에만 쓴다.
- 다단계 쓰기, queue 처리, 정책 민감 로직은 HTTP에서 여러 round trip을 조합하기보다 Postgres function + Supabase RPC로 먼저 검토한다.
- RPC 함수는 기본적으로 `SECURITY INVOKER`를 우선하고, `SECURITY DEFINER`가 필요하면 고정 `search_path`, schema-qualified 이름, 명시적 auth 체크를 같이 남긴다.
- PGMQ를 사용할 때는 enqueue/dequeue/ack를 idempotent하게 설계하고, 긴 소비 작업을 request handler 안에서 돌리지 않는다.
- 새 RPC/queue 소비 경로가 추가되면 filter/order/join 컬럼에 필요한 인덱스를 같이 검토하고 hot path는 `EXPLAIN`으로 확인한다.

## 재사용 테스트 계정

- Email: `parrotkitcodextest@mailinator.com`
- Username: `parrotkitcodextest`
- Password: `ParrotkitE2E2026!`
- 용도: 로컬/Vercel smoke test 시 기본 로그인 계정으로 재사용
- 메모: 2026-03-07 기준 Supabase Auth signup은 email send rate limit에 막혀 있어, 이 계정은 admin provision 후 브라우저 로그인 검증까지 마친 상태다.
