# Playwright CLI 작업트리 정리 | Playwright CLI Worktree Ignore

## Summary

2026-04-11 운영 문맥은 루트 작업트리에 남던 `.playwright-cli/`를 anchored ignore 규칙으로 정리한 기록이다. 제품 기능 변경은 아니지만, agent 산출물 때문에 `git status`가 오염되지 않게 하는 운영 hygiene 사례로 남길 가치가 있다.

## Key Points

- 루트 `.gitignore`에 `/.playwright-cli/`가 추가됐다.
- 경로를 루트 기준으로 고정해 저장소 최상단 Playwright CLI 산출물만 무시하도록 했다.
- `git check-ignore -v .playwright-cli/`와 `git status --short --branch`로 규칙 적용 여부를 검증했다.
- 이 변경은 dev-only 문서 중심 워크플로에서 "작업트리를 깨끗하게 유지한다"는 운영 감각을 보강한다.

## Concepts

- [dev-only 멀티클론 워크플로 | Dev-Only Multi-Clone Workflow](../concepts/dev-only-multi-clone-workflow.md)

## Contradictions

- 현재 규칙은 `.playwright-cli/` 전체를 숨기므로, 향후 내부 파일 일부를 추적해야 한다면 예외 패턴이 필요하다.

## Open Questions

- 향후 다른 agent/tooling 산출물도 같은 anchored ignore 패턴으로 정리할지 별도 conventions로 승격할지는 아직 미정이다.

## Source Details

- Source file: `context/context_20260411_playwright_cli_ignore.md`
- Date: 2026-04-11
