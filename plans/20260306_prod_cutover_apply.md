# Prod Cutover 적용 플랜 (2026-03-06)

## 배경
- 코드/마이그레이션 준비는 완료됐지만 Supabase 실환경 적용이 아직 남아 있다.
- 3/13 이전 안정 릴리즈를 위해 먼저 DB 컷오버를 확정해야 한다.

## 목표
- Supabase 환경에 핵심 마이그레이션을 적용하고, 테이블/RLS/Storage bucket이 정상 상태인지 확인한다.

## 범위
- 포함: `supabase/migrations/*.sql` 적용, 스키마 스냅샷 확인, 기본 동작 smoke 확인
- 제외: 레거시 유저 이관 실행, 모바일 QA

## 변경 파일
- `supabase/migrations/*.sql` (필요 시 보정)
- `context/context_*`

## 테스트
- `npm run db:schema`
- 컷오버 후 테이블 존재 및 정책 조회
- 간단 API smoke (`/api/auth/signin`, `/api/recipes`)

## 롤백
- 컷오버 SQL의 역순 롤백 SQL 준비
- 심각 이슈 시 직전 상태로 revert 및 배포 중단

## 리스크
- Supabase 연결 정보 누락 시 적용 불가
- RLS/Storage 정책 누락 시 런타임 장애 가능

## 결과
- Supabase 프로젝트(`bnavatultbftxaklnphu`) link 완료.
- 원격 migration 이력 fetch로 로컬/원격 히스토리 정합성 확보.
- 기존 `20260306_auth_recipe_storage.sql` 파일명 비표준 이슈를 해결하기 위해 timestamp 형식으로 정규화:
  - `20260306040000_auth_recipe_storage.sql`
- 원격 history에서 기존 `20260306` 버전을 `reverted`로 repair 후, 정규화된 migration 재적용 완료.
- 정책 생성 구문 호환성 이슈(`create policy if not exists` 미지원) 수정 후 적용 성공.
- `supabase db push` 결과:
  - `20260306040000_auth_recipe_storage.sql` 적용
  - `20260306042000_align_profiles_columns.sql` 적용
- `supabase migration list`에서 로컬/원격 버전 일치 확인.

## 연결 Context
- `context/context_20260306_042500_cutover_and_legacy_migration.md`
