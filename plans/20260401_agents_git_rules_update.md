# AGENTS Git Rules Update

## 배경
- 사용자가 `AGENTS.md`에 main-only / multi-clone 기반 Git 운영 원칙과 갱신된 작업 기본 흐름을 추가하길 요청했다.
- 기존 `AGENTS.md`는 `dev` 기준 검증과 일반 오케스트레이션 규칙 위주로 구성되어 있으며, clone 운영 및 `main` 중심 통합 원칙은 명시되어 있지 않다.

## 목표
- 사용자가 제공한 Git 운영 원칙과 작업 기본 흐름을 `AGENTS.md`에 반영한다.
- 기존 문서의 구조를 크게 깨지 않으면서, 새 원칙이 상위 규칙으로 읽히도록 정리한다.

## 범위
- `AGENTS.md` 문서 수정
- 이번 작업용 plan 문서 작성
- 작업 결과를 기록하는 context 문서 작성

## 변경 파일
- `AGENTS.md`
- `plans/20260401_agents_git_rules_update.md`
- `context/context_20260401_*.md`

## 테스트
- 수정 후 `AGENTS.md` 내용을 확인해 새 Git 운영 원칙과 작업 기본 흐름이 반영되었는지 검토한다.
- 문서 변경 작업이므로 별도 `npm run dev` 실행은 생략하고 문서 무결성 확인으로 대체한다.

## 롤백
- `AGENTS.md`에서 이번에 추가한 섹션을 제거하고 이전 버전으로 되돌린다.
- 관련 plan/context 문서는 기록으로 유지한다.

## 리스크
- 기존 `dev` 기준 규칙과 새 `main-only` 원칙이 함께 존재해 해석 충돌이 생길 수 있다.
- 같은 내용을 중복 서술하면 문서가 길어지고 우선순위가 모호해질 수 있다.

## 결과
- `AGENTS.md` 상단에 `Git 운영 원칙 (dev-only / multi-clone)` 및 `작업 기본 흐름` 섹션을 추가했다.
- 기존 세부 규칙은 유지하고, 사용자가 제안한 상위 운영 원칙이 먼저 읽히도록 구조를 조정했다.
- 사용자 피드백에 따라 최초 반영된 `main-only` 표현을 `dev-only` 기준으로 정정했다.

## 연결된 context
- `context/context_20260401_163248_agents_git_rules_update.md`
- `context/context_20260401_163842_agents_dev_only_correction.md`
