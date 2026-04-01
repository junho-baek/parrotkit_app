# AGENTS Dev-Only Correction

## 작업 개요
- 직전 `AGENTS.md` 변경에서 Git 운영 원칙을 `main-only`로 적었으나, 실제 팀 운영 기준이 `dev-only`라는 사용자 피드백을 반영해 문구를 수정했다.
- 상단 Git 운영 원칙과 작업 기본 흐름의 기준 브랜치를 모두 `dev`로 통일했다.

## 주요 변경
- `AGENTS.md`
  - `## Git 운영 원칙 (main-only / multi-clone)`를 `## Git 운영 원칙 (dev-only / multi-clone)`로 수정
  - `main` / `origin/main` 기준 표현을 `dev` / `origin/dev` 기준으로 전환
  - 작업 완료 후 커밋/푸시 대상 브랜치를 `dev`로 수정

## 검증
- `AGENTS.md` 상단을 재확인해 제목, 동기화 기준, 기준선 브랜치가 모두 `dev`로 정리되었는지 검토했다.
- 문서 변경 작업이므로 `npm run dev` 또는 `npm run build`는 실행하지 않았다.

## 메모
- 현재 작업 clone도 `dev...origin/dev` 상태이므로, 수정된 운영 원칙과 실제 작업 환경이 일치한다.
