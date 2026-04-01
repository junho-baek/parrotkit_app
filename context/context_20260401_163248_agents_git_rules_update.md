# AGENTS Git Rules Update

## 작업 개요
- `AGENTS.md` 상단에 `main-only / multi-clone` 기반 Git 운영 원칙을 추가했다.
- 새 작업 시작 전 clone 상태 확인, `origin/main` 동기화, `make cl` 우선 사용, 로컬 충돌 해결, 배포 후 QA 확인 등 사용자가 요청한 운영 규칙을 문서화했다.
- 기존 오케스트레이션 규칙과 별도로, 상위 수준의 `작업 기본 흐름` 섹션을 추가해 시작부터 커밋/푸시까지의 순서를 정리했다.

## 주요 변경
- `AGENTS.md`
  - `## Git 운영 원칙 (main-only / multi-clone)` 섹션 추가
  - `## 작업 기본 흐름` 섹션 추가
  - 기존 `개발 규칙 (Orchestrator)` 및 하위 세부 규칙은 유지

## 검증
- `AGENTS.md` 상단을 재확인해 새 Git 운영 원칙과 작업 기본 흐름이 반영되었는지 검토했다.
- 문서 변경 작업이므로 `npm run dev` 또는 `npm run build`는 실행하지 않았다.

## 메모
- 현재 작업 clone의 실제 브랜치는 `dev...origin/dev` 상태였다.
- 이번 변경은 저장소의 향후 운영 원칙을 `AGENTS.md`에 반영한 것으로, 현재 브랜치 구조 자체를 즉시 전환하는 작업은 범위에서 제외했다.
