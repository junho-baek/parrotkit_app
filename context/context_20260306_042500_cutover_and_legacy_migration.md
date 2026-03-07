# Context Update - Supabase Cutover + Legacy Users Migration (2026-03-06 04:25 KST)

## 작업 요약
- Supabase 원격 migration 히스토리 동기화 후 컷오버 마이그레이션 적용 완료.
- 기존 `profiles` 스키마 계약 불일치 이슈를 보정 migration으로 해결.
- legacy 22명 사용자 이관을 재실행하여 전원 매칭 완료.

## 상세 진행
1. Supabase 컷오버
- `supabase link --project-ref bnavatultbftxaklnphu --yes` 성공.
- `supabase migration fetch`로 원격 migration(20260203/0205/0206) 로컬 반영.
- `20260306_auth_recipe_storage.sql` 파일명 비표준(버전 `20260306`) 문제로 push 충돌.
- 파일명 정규화: `20260306040000_auth_recipe_storage.sql`.
- `supabase migration repair --status reverted 20260306`로 히스토리 보정.
- 재적용 성공:
  - `20260306040000_auth_recipe_storage.sql`
  - `20260306042000_align_profiles_columns.sql`

2. 계약 불일치 보정
- 기존 remote `profiles`는 `id/meta/created_at` 구조였고 코드/이관 스크립트는 `email/username/...` 컬럼을 요구.
- 신규 migration `20260306042000_align_profiles_columns.sql` 추가:
  - `profiles` 필수 컬럼 추가 및 backfill
  - `email/username` not null + unique index
  - `handle_new_user()` 트리거 함수 갱신

3. Legacy user migration
- `npm run migrate:legacy-users -- --dry-run`: 22명 확인.
- 1차 실이관: profile upsert 실패(컬럼 없음)로 `failed=22`.
- 보정 migration 적용 후 재실행:
  - `migrated=0`, `reused=22`, `failed=0`.

## 검증 결과
- `supabase migration list`: 로컬/원격 버전 일치 확인.
- Supabase profiles 검증:
  - `profiles_count=23`
  - `profiles_null_email=0`
  - `profiles_null_username=0`
  - legacy 22 이메일 매칭: `matched=22`, `missing=0`

## 이슈/메모
- `supabase db dump`는 로컬 Docker daemon 미실행으로 사용 불가.
- `supabase/migrations` 내 AppleDouble 파일(`._*`)은 생성 즉시 삭제 필요(파서 경고 원인).
