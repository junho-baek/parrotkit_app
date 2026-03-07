# Supabase API Key Upgrade 플랜 (2026-03-07)

## 배경
- Parrotkit는 새 Supabase 프로젝트를 기준으로 다시 연결 중이다.
- Supabase는 새 프로젝트에서 legacy `anon` / `service_role`보다 `publishable` / `secret` 키 사용을 권장한다.
- 현재 코드와 env 예시는 legacy key 이름을 기준으로 남아 있어 새 프로젝트 연결 시 혼선이 생긴다.

## 목표
- 코드베이스를 modern Supabase key naming으로 전환한다.
- `.env.local.example`와 `README`, `AGENTS.md`에 이유와 운영 규칙을 남긴다.
- 빌드가 계속 통과하는지 확인한다.

## 범위
- 포함: Supabase helper/env 이름 변경, auth 호출부 정리, legacy migration script 업데이트, AGENTS/README/env 예시 갱신
- 제외: 새 Supabase 프로젝트 실제 연결, 마이그레이션 실행, 결제/로그인 E2E

## 변경 파일
- `.env.local.example`
- `src/lib/supabase/*`
- `src/app/api/auth/*`
- `scripts/migrate-legacy-users-to-supabase.cjs`
- `README.md`
- `AGENTS.md`

## 테스트
- `rg`로 legacy env 이름 잔존 여부 확인
- `npm run build`

## 롤백
- env 이름을 legacy key 기준으로 되돌리고 auth helper export 이름을 복원한다.

## 리스크
- Vercel/local env가 아직 새 이름으로 채워지지 않았으면 런타임 auth는 실패할 수 있다.
- historical plan/context에는 legacy key 이름이 남아 있을 수 있다.

## 결과
- Supabase runtime/env 예시를 `publishable` / `secret` key naming으로 전환했다.
- `createSupabaseAnonServerClient`를 `createSupabasePublishableServerClient`로 정리해 auth 호출부의 의미를 맞췄다.
- `.env.local.example`, `README.md`, `AGENTS.md`에 새 키 체계와 이유를 주석/규칙으로 남겼다.
- `rg -n "NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY|createSupabaseAnonServerClient"`를 코드/예시 파일 기준으로 실행해 잔존 항목이 없음을 확인했다.
- `npm run build` 성공.

## 연결 Context
- `context/context_20260307_173900_supabase_api_key_upgrade.md`
