# Context - Playwright CLI Ignore

## 작업 요약
- 루트 작업트리에 남아 있던 미추적 `.playwright-cli/`를 Git ignore 대상에 추가했다.
- 루트 `.gitignore`에 `/.playwright-cli/`를 명시해 루트 기준 Playwright CLI 산출물만 무시하도록 고정했다.

## 변경 파일
- `.gitignore`
- `plans/20260411_playwright_cli_ignore.md`
- `context/context_20260411_playwright_cli_ignore.md`

## 검증
- `git check-ignore -v .playwright-cli/`
  - 결과: `.gitignore`의 `/.playwright-cli/` 규칙이 적용됨
- `git status --short --branch`
  - 결과: `.playwright-cli/` 미추적 항목이 더 이상 표시되지 않음

## 남은 리스크
- 향후 `.playwright-cli/` 내부에서 추적해야 할 샘플이나 설정 파일이 생기면 예외 패턴을 별도로 추가해야 한다.
- 현재 규칙은 루트 기준 경로 고정이라 하위 다른 디렉토리의 동명 폴더에는 적용되지 않는다.

## 메모
- 이번 변경 후 작업트리에는 `.gitignore` 수정과 신규 plan/context 문서만 남는다.
