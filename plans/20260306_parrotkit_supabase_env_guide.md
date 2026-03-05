# Parrotkit Supabase 환경변수 가이드 정리 (2026-03-06)

## 배경
- 사용자가 Parrotkit 전용 Supabase 프로젝트를 새로 생성/링크하려고 한다.
- 기존 `.env.local.example`에는 프로젝트 분리/레거시 DB 분리 지침이 부족했다.

## 목표
- `.env.local.example`에 Parrotkit 전용 Supabase 설정 예시를 명확히 정리한다.
- 실수로 타 서비스 키를 혼용하지 않도록 주석을 추가한다.

## 범위
- 포함: `.env.local.example` 보강
- 제외: 실제 `.env.local` 값 입력, Supabase 프로젝트 생성/링크 실행

## 변경 파일
- `.env.local.example`

## 테스트
- 변경 파일 수동 검토

## 롤백
- 해당 파일 변경 revert

## 리스크
- 예시 문자열이 환경별 DB host 형식과 다를 수 있어 실제 값 확인 필요

## 결과
- Parrotkit 전용 Supabase 프로젝트 기준 변수/주의사항 추가
- `SUPABASE_PROJECT_REF`, `LEGACY_DATABASE_URL` 예시 추가
- `DATABASE_URL`를 같은 Parrotkit Supabase 프로젝트 연결 문자열로 명시

## 연결 Context
- `context/context_20260306_044200_parrotkit_supabase_env_guide.md`
