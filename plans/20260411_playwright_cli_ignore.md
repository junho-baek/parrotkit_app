# 20260411 Playwright CLI Ignore

## 배경
- 직전 Expo 스캐폴드 작업 이후 루트 작업트리에 `.playwright-cli/`가 미추적으로 남아 있었다.
- 사용자는 이 미추적 항목을 루트 Git ignore 규칙에 포함해 달라고 요청했다.
- 팀 운영 규칙상 작은 정리 작업도 `plans/` 문서를 먼저 남기고 진행한다.

## 목표
- 루트 `.gitignore`에 `.playwright-cli/`를 명시해 Git 상태에서 더 이상 미추적으로 보이지 않게 한다.
- 변경 결과와 검증 내용을 `context/`에 기록한다.

## 범위
- 루트 `.gitignore` 수정
- 검증용 `git status` / `git check-ignore` 확인
- 신규 context 문서 작성

## 변경 파일
- `.gitignore`
- `plans/20260411_playwright_cli_ignore.md`
- `context/context_20260411_playwright_cli_ignore.md`

## 테스트
- `git check-ignore -v .playwright-cli/`
- `git status --short --branch`

## 롤백
- 루트 `.gitignore`에서 `.playwright-cli/` 항목을 제거하면 된다.
- 이번 작업으로 추가한 plan/context 문서를 삭제하면 문서 변경도 롤백된다.

## 리스크
- `.playwright-cli/` 내부에 나중에 추적해야 할 파일이 생기면 별도 예외 규칙이 필요할 수 있다.
- 현재는 루트 디렉토리 기준 ignore라 동일 이름의 하위 폴더까지 의도치 않게 무시하지 않도록 경로를 고정해야 한다.

## 결과
- 완료
- 루트 `.gitignore`에 `/.playwright-cli/`를 추가해 Codex Playwright CLI 작업 디렉토리를 Git 추적 대상에서 제외했다.
- `git check-ignore -v .playwright-cli/`로 규칙 적용 위치를 확인했고, `git status --short --branch`에서 더 이상 미추적으로 보이지 않음을 확인했다.

## 연결 context
- `context/context_20260411_playwright_cli_ignore.md`
