# Context Update - Supabase Migration Rollback (2026-03-06 04:35 KST)

## 요청
- DeunDeunApp 프로젝트에 반영된 마이그레이션을 모두 취소하고, Parrotkit 전용 프로젝트에서 다시 시작하기 위한 상태로 되돌림.

## 수행 내용
- `supabase link --project-ref bnavatultbftxaklnphu --yes`로 대상 프로젝트 명시.
- `supabase migration down --linked --last 2 --yes` 실행.
  - 롤백 대상: `20260306040000`, `20260306042000`
  - CLI 경고대로 DB reset/데이터 삭제(truncate/drop) 절차 수행됨.
- `supabase migration list`로 원격 버전 확인:
  - applied: `20260203201851`, `20260205120000`, `20260206040000`
  - not applied: `20260306040000`, `20260306042000`
- `supabase/.temp/project-ref` 삭제하여 링크 해제.

## 주의사항
- 해당 롤백은 원격 데이터/인증 정보를 초기화하는 파괴적 작업임.
- 이후 Parrotkit 전용 Supabase 프로젝트를 새로 생성/링크한 뒤 재적용 필요.
