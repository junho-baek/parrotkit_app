# Context: Notion Report Upload Automation (2026-03-07 22:45 KST)

## Summary
- Notion 리포트 자동화를 위한 setup/upload 스크립트를 추가했다.
- `scripts/setup-notion-reports.cjs`는 Notion parent page 아래에 reports database를 생성하고, 반환된 `NOTION_REPORTS_DATABASE_ID`, `NOTION_REPORTS_DATA_SOURCE_ID`를 `.env.local`에 다시 기록할 수 있다.
- `scripts/upload-report-to-notion.cjs`는 PDF/PPT 같은 산출물과 Markdown 요약을 받아 Notion page + files property + page body blocks로 업로드한다.
- `scripts/find-latest-report.cjs`를 추가해 `make report-and-upload`, `make notion-upload-dry-run`이 최신 산출물을 자동 탐지하게 했다.

## Validation
- `node scripts/setup-notion-reports.cjs --help`
- `node scripts/setup-notion-reports.cjs --dry-run`
- `node scripts/upload-report-to-notion.cjs --help`
- `node --check scripts/notion-reporting-utils.cjs`
- `node --check scripts/setup-notion-reports.cjs`
- `node --check scripts/upload-report-to-notion.cjs`
- `node --check scripts/find-latest-report.cjs`
- `make notion-upload-dry-run`
  - latest artifact: `output/pdf/20260307_parrotkit_e2e_validation_report.pdf`
  - matched summary: `output/reports/20260307_parrotkit_e2e_validation_report.md`
  - derived summary blocks: 83

## MCP
- `~/.codex/config.toml`의 `notion` MCP 서버 설정을 재확인했다.
- `codex mcp login notion`을 실행해 OAuth 로그인을 완료했다.
- 현재 `codex mcp list`, `codex mcp get notion` 기준 서버는 enabled 상태다.

## Required User Inputs For First Real Upload
- `NOTION_API_KEY`: 내부 Integration token
- `NOTION_REPORTS_PARENT_PAGE_ID`: reports database를 만들 parent page id
- 위 두 값을 `.env.local`에 추가한 뒤 `make notion-setup` 실행
