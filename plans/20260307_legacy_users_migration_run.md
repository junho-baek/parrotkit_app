# Legacy Users 이관 실행 플랜 (2026-03-07)

## 배경
- 기존 `mvp_users` 22명은 비밀번호 재설정 없이 로그인 유지가 필요하다.
- 배치 이관 + 런타임 fallback이 구현되어 있어 실행 단계만 남았다.

## 목표
- 레거시 사용자 전원을 `auth.users + profiles`로 이관하고 검증 리포트를 남긴다.

## 범위
- 포함: dry-run, 본실행, 이관 검증, 실패 사용자 재시도
- 제외: 신규 기능 개발

## 변경 파일
- `context/context_*`
- 필요 시 `scripts/migrate-legacy-users-to-supabase.cjs`

## 테스트
- `npm run migrate:legacy-users -- --dry-run`
- `npm run migrate:legacy-users`
- users/profiles count 및 샘플 로그인 검증

## 롤백
- 잘못 생성된 auth/profiles 레코드 식별 후 삭제 SQL 준비
- fallback 로그인 경로로 임시 대응

## 리스크
- `password_hash` 호환성 문제
- 중복 이메일/username 충돌

## 결과
- `dry-run` 결과: legacy 22명 전원 대상 확인.
- 1차 실이관 실행 시 `profiles.email` 컬럼 부재로 profile upsert 실패(원인: 기존 profiles 스키마와 계약 불일치) 확인.
- `20260306042000_align_profiles_columns.sql` 적용 후 실이관 재실행.
- 재실행 결과: `migrated=0 / reused=22 / failed=0` (기생성 auth 유저 재사용 + profiles 정상 upsert).
- 검증:
  - Supabase `profiles` 전체 count: 23
  - `profiles.email is null`: 0
  - `profiles.username is null`: 0
  - legacy 22 이메일 매칭: `profiles_matched=22`, `missing=0`

## 연결 Context
- `context/context_20260306_042500_cutover_and_legacy_migration.md`
