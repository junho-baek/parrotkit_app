# Context: Supabase API Key Upgrade (2026-03-07 17:39 KST)

## Summary
- Supabase env naming을 legacy `anon/service_role`에서 modern `publishable/secret` 기준으로 전환했다.
- auth helper 이름도 `createSupabasePublishableServerClient`로 맞춰 future agent가 의미를 오해하지 않게 정리했다.
- `.env.local.example`, `README.md`, `AGENTS.md`에 새 키 체계와 사용 이유를 남겼다.

## Why
- 새 Supabase 프로젝트는 publishable/secret key 체계를 기본으로 제공한다.
- 운영 중 key rotation을 JWT signing secret rotation과 분리하기 위해 legacy key naming을 새 코드에 다시 남기지 않기로 했다.
- Vercel/Supabase dashboard setup 시 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`가 보일 수 있어 코드에서 fallback으로 허용했다.

## Verification
- `rg -n "NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY|createSupabaseAnonServerClient"`: no matches in active code/docs (`plans`, `context`, `node_modules` 제외).
- `npm run build`: success.

## Notes
- historical `plans/` 및 `context/` 문서에는 legacy key 이름이 남아 있을 수 있다. 이는 과거 실행 기록으로 유지한다.
- 실제 런타임 auth는 새 env (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `DATABASE_URL`)가 채워져야 동작한다.
