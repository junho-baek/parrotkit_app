# dev-only 운영 규칙 보정 | AGENTS Dev-Only Correction

## Summary

2026-04-01 context는 저장소 운영 기준을 `main-only`에서 `dev-only`로 바로잡은 기록이다. 현재 AGENTS 규칙의 핵심인 "작업별 로컬 clone 분리, 최신 `origin/dev` 기준 동기화, 문서화 후 구현, 로컬 최소 검증 + 배포 QA"는 이 보정 이후를 기준으로 읽어야 한다.

## Key Points

- Git 운영 원칙 제목이 `main-only / multi-clone`에서 `dev-only / multi-clone`으로 수정됐다.
- `origin/main` 대신 `origin/dev`를 기준선으로 삼도록 작업 기본 흐름이 맞춰졌다.
- 작업 완료 후 커밋/푸시 대상 브랜치도 `dev`로 통일됐다.
- 문서 변경만으로 끝나는 작업이라 별도 빌드는 수행하지 않았고, 실제 현재 clone 상태와 규칙의 일치 여부를 점검했다.

## Concepts

- [dev-only 멀티클론 워크플로 | Dev-Only Multi-Clone Workflow](../concepts/dev-only-multi-clone-workflow.md)

## Contradictions

- 바로 이전 문맥에서는 `main-only`가 적혀 있었으나, 이 문서가 그 상태를 명시적으로 supersede한다.

## Open Questions

- 배포 QA가 어느 수준까지 체크리스트화되어 있는지는 개별 context마다 편차가 있어 별도 synthesis가 더 가능하다.

## Source Details

- Source files:
  - `context/context_20260401_163248_agents_git_rules_update.md`
  - `context/context_20260401_163842_agents_dev_only_correction.md`
  - `AGENTS.md`
- Date: 2026-04-01
