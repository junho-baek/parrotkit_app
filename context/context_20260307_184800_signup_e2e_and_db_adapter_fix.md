# Context: Signup E2E / DB Adapter Fix (2026-03-07 18:48 KST)

## Summary
- Supabase 전환 후 signup이 막히던 원인을 단계별로 정리하고 수정했다.
- 앱 DB 클라이언트를 Neon HTTP에서 `pg` 기반 Supabase Postgres 연결로 교체했다.
- Supabase pooled URL에 raw `#`가 포함된 비밀번호가 들어와도 URL parser가 host를 깨먹지 않도록 normalize 로직을 추가했다.
- Supabase managed host에 TLS 설정을 명시해 local `pg` 연결의 self-signed certificate 오류를 제거했다.
- 새 Supabase 프로젝트에 legacy `mvp_users` 테이블이 없는 경우를 허용해 signup/signin fallback이 500을 내지 않게 했다.
- 브라우저 기반 signup은 Supabase Auth의 `email rate limit exceeded`에 막혔고, 재사용 테스트 계정은 admin provision 후 브라우저 로그인으로 검증했다.

## Why
- 새 Parrotkit Supabase 프로젝트는 Neon HTTP endpoint가 아니라 표준 Postgres 연결을 제공한다.
- `.env.local`에 복사한 pooled URL의 비밀번호에 `#`가 있으면 Node URL parser가 fragment로 잘못 인식해 엉뚱한 host로 연결을 시도한다.
- Supabase 신규 프로젝트는 legacy 유저 이관 테이블(`mvp_users`)이 아직 없을 수 있으므로, auth fallback은 "없음"을 정상 상태로 처리해야 한다.
- Supabase Auth 기본 email send/rate limit 설정이 켜져 있으면 반복 E2E signup이 바로 막힐 수 있다.

## Verification
- `npm run build`: success
- Browser sign-in E2E:
  - reusable account: `parrotkitcodextest@mailinator.com`
  - landing page after sign-in: `/interests`
  - localStorage `token` persisted: yes
- Captured artifacts:
  - `output/playwright/signin-success.png`
  - `output/playwright/signup-error.png`

## Remaining Notes
- 실제 브라우저 signup 성공 검증을 하려면 Supabase Auth에서 confirm-email / email rate limit 설정을 E2E에 맞게 조정해야 한다.
- `output/`은 현재 git 추적 대상이 아니므로 스크린샷은 로컬 검증용이다.
