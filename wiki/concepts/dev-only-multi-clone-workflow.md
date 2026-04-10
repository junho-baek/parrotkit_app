# dev-only 멀티클론 워크플로 | Dev-Only Multi-Clone Workflow

## Summary

이 저장소의 운영 규칙은 feature branch 전략보다 `dev-only`와 작업별 local clone 분리를 우선한다. 문서화된 작업 흐름은 "최신 `origin/dev` 기준선 확인 -> context/plans 확인 및 작성 -> 구현 -> 최소 로컬 검증 -> context 업데이트 -> `dev` 푸시 -> 배포 QA"다.

## Current Understanding

- clone 하나는 작업 하나만 담당한다.
- 새 작업 전에는 현재 clone이 최신 `origin/dev` 기준인지 먼저 확인한다.
- `make cl`은 AppleDouble/metadata 정리의 표준 명령으로 우선 사용한다.
- agent/tooling 산출물이 작업트리를 계속 오염시키면 anchored ignore 규칙으로 정리해 `git status`를 읽기 쉽게 유지한다.
- `plans/` 문서를 먼저 쓰고 `context/`로 결과를 남기는 문서 중심 흐름이 강하다.
- 큰 변경도 오래 끌지 말고 작은 단위로 자주 통합하는 것을 권장한다.
- 프론트엔드/배포 연동 작업은 푸시 후 배포 상태와 주요 사용자 흐름 QA까지 확인하는 것이 기본이다.

## Evidence

- [dev-only 운영 규칙 보정 | AGENTS Dev-Only Correction](../sources/agents-dev-only-correction.md)
- [원격 동기화와 최신 리뷰 | Sync Remote Review 59da22e](../sources/sync-remote-review-59da22e.md)
- [Playwright CLI 작업트리 정리 | Playwright CLI Worktree Ignore](../sources/playwright-cli-ignore.md)

## Contradictions

- 2026-04-01 초반 문맥에는 `main-only` 표현이 있었지만, 이후 `dev-only` correction이 현재 기준을 확정했다.

## Open Questions

- 배포 QA 결과를 context와 별도 배포 지식 축으로 묶을지, 기존 context에 계속 적층할지 아직 정리되지 않았다.
- multi-clone 운영의 비용과 install/cache 전략은 아직 wiki concept로 따로 확장되지 않았다.
- agent용 임시 산출물 ignore 규칙을 어디까지 일반화할지는 아직 명문화되지 않았다.

## Related Pages

- [ParrotKit](../entities/parrotkit.md)
- [2026년 4월 context 맵 | Context Map for April 2026](../analyses/context-map-april-2026.md)
