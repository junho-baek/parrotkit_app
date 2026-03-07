# Signup E2E / DB Adapter Fix (2026-03-07)

## 배경
- 신규 Supabase 프로젝트로 전환한 뒤 `/api/auth/signup`이 500을 반환했다.
- 원인은 앱 DB 클라이언트가 Neon HTTP 드라이버를 계속 사용해 Supabase Postgres pooled URL을 제대로 처리하지 못한 것이다.
- 사용자 요청은 실제 브라우저에서 회원가입을 검증하고, 이후 반복 테스트에 쓸 공용 테스트 계정을 남기는 것이다.

## 목표
- Supabase pooled Postgres URL에 맞는 DB 어댑터로 교체한다.
- 실제 브라우저에서 회원가입이 성공하는지 검증한다.
- 반복 E2E에 사용할 테스트 계정 정보를 저장한다.

## 범위
- 포함: `src/lib/db.ts`, 필요 시 관련 스크립트 보정, Playwright 기반 signup 검증, 테스트 계정 기록
- 제외: 모바일 QA, 결제, 레거시 유저 대량 이관

## 변경 파일
- `src/lib/db.ts`
- `scripts/migrate.ts`
- `AGENTS.md`
- `context/context_*.md`

## 테스트
- `npm run build`
- 브라우저에서 `/signup` 진입 후 실제 회원가입
- 가입 후 계정/프로필 생성 확인

## 롤백
- `src/lib/db.ts`를 이전 커밋으로 되돌리고 기존 DB 드라이버 설정을 복구한다.

## 리스크
- Supabase Auth 이메일 정책에 따라 signup 직후 session 획득 방식이 달라질 수 있다.
- 테스트 계정을 저장하면 레포 접근자에게 해당 정보가 노출된다.

## 결과
- `src/lib/db.ts`를 Neon HTTP에서 `pg` + `drizzle-orm/node-postgres`로 교체했다.
- Supabase pooled URL에서 비밀번호에 `#`가 포함돼도 동작하도록 URL normalize 로직을 추가했다.
- Supabase managed host에 맞는 TLS 설정을 명시했고, 새 프로젝트에 `mvp_users`가 없어도 legacy fallback이 500을 내지 않도록 보정했다.
- 브라우저 signup은 Supabase Auth email rate limit 때문에 성공까지 가지 못했지만, reusable test account를 admin으로 생성하고 `/signin -> /interests` 브라우저 검증은 완료했다.

## 연결 Context
- `context/context_20260307_184800_signup_e2e_and_db_adapter_fix.md`
