# Supabase Migration 롤백 플랜 (2026-03-06)

## 배경
- Parrotkit 작업을 DeunDeunApp 프로젝트에 잘못 적용한 상태를 사용자 요청으로 전면 취소해야 했다.
- 프로젝트 혼선 방지를 위해 원격 마이그레이션과 데이터 상태를 이전 버전으로 되돌리고 링크를 해제한다.

## 목표
- 원격 Supabase를 `20260206040000` 기준 상태로 롤백한다.
- 잘못 적용된 `20260306040000`, `20260306042000`의 원격 반영을 제거한다.
- 로컬 워크스페이스에서 프로젝트 링크를 해제해 재발을 막는다.

## 범위
- 포함
  - `supabase migration down --linked --last 2`
  - 원격 migration 버전 재확인
  - 로컬 link ref 제거
- 제외
  - 새 Parrotkit 전용 Supabase 프로젝트 생성/초기화
  - 후속 QA/배포 작업

## 변경 파일
- `plans/20260306_supabase_migration_rollback.md`
- `context/context_20260306_043500_supabase_migration_rollback.md`

## 테스트
- `supabase migration list`로 remote 버전 확인
- 링크 해제 확인(`supabase/.temp/project-ref` 제거)

## 롤백
- 본 작업 자체가 롤백 작업이므로 추가 롤백 없음.
- 필요 시 새 프로젝트에서 기준 migration부터 재적용.

## 리스크
- `migration down`은 DB reset/데이터 삭제를 수반한다.
- 기존 DeunDeunApp 인증/데이터가 초기화될 수 있다.

## 결과
- `supabase migration down --linked --last 2 --yes` 실행 완료.
- 원격 상태가 `20260203201851`, `20260205120000`, `20260206040000`까지만 적용된 상태로 복귀.
- `20260306040000`, `20260306042000`은 remote 미적용 상태 확인.
- 로컬 링크 ref(`supabase/.temp/project-ref`) 삭제 완료.

## 연결 Context
- `context/context_20260306_043500_supabase_migration_rollback.md`
