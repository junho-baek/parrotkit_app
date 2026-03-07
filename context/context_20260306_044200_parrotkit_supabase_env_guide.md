# Context Update - Parrotkit Supabase Env Guide (2026-03-06 04:42 KST)

## 작업 요약
- `.env.local.example`를 Parrotkit 전용 Supabase 프로젝트 기준으로 정리했다.

## 변경 사항
- 전용 프로젝트 사용 경고 주석 추가.
- `SUPABASE_PROJECT_REF`(선택) 항목 추가.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`를 Parrotkit 전용 값으로 채우도록 예시 강화.
- `DATABASE_URL`를 동일 프로젝트의 Postgres 연결 문자열 예시로 명시.
- 레거시 사용자 이관 시 분리 사용 가능한 `LEGACY_DATABASE_URL` 예시 추가.

## 메모
- 실제 서비스 키/DB 비밀번호는 `.env.local`에만 설정하고 저장소에는 커밋하지 않도록 유지.
