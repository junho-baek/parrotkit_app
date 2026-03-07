# Notion Report Upload Automation 플랜 (2026-03-07)

## 배경
- 테스트 결과 PDF/PPT/Markdown 산출물을 Notion에 반복적으로 업로드할 수 있는 자동화가 필요하다.
- 사용자 요청 범위는 Notion 리포트 데이터베이스 스키마 정의, 업로드 스크립트 구현, Makefile 연결, 그리고 Notion MCP 연결 상태 정리까지 포함한다.

## 목표
- Notion 리포트 데이터베이스를 API로 생성하거나 재사용할 수 있는 setup 스크립트를 추가한다.
- PDF/PPT 같은 산출물을 Notion에 업로드하고, 메타데이터와 요약을 함께 남기는 업로드 스크립트를 추가한다.
- `.env.local.example`, `Makefile`, `README.md`, `AGENTS.md`를 갱신해 다른 에이전트도 같은 경로로 작업할 수 있게 한다.
- Notion MCP 설정 상태를 검증하고 필요한 사용자 입력을 명확히 정리한다.

## 범위
- 포함: Notion API 업로드 스크립트, DB/data source setup 스크립트, env 예시, Makefile/npm wiring, 문서화, MCP 상태 확인
- 제외: Notion OAuth 브라우저 승인 자체, Notion 페이지 템플릿 세부 디자인, 대용량 multipart 업로드 구현

## 변경 파일
- `plans/20260307_notion_report_upload_automation.md`
- `scripts/notion-reporting-utils.cjs`
- `scripts/setup-notion-reports.cjs`
- `scripts/upload-report-to-notion.cjs`
- `Makefile`
- `package.json`
- `.env.local.example`
- `README.md`
- `AGENTS.md`
- `context/context_*.md`

## 테스트
- `node scripts/setup-notion-reports.cjs --help`
- `node scripts/upload-report-to-notion.cjs --help`
- `node scripts/upload-report-to-notion.cjs --dry-run --file <existing pdf> --summary-md <existing md>`
- `make notion-upload-dry-run`
- MCP 설정 조회 (`codex mcp list`, `codex mcp get notion`)

## 롤백
- 스크립트 및 Makefile 변경은 커밋 단위로 되돌린다.
- Notion DB 생성은 새 workspace page 하위에만 수행하고, 필요 시 Notion UI에서 삭제한다.

## 리스크
- Notion API는 `2025-09-03` 버전부터 database/data source 개념이 분리되어 요청 형태가 다르다.
- File Upload는 기본적으로 20MB 이하 single-part 기준으로 구현해야 한다.
- 실제 업로드 실행에는 `NOTION_API_KEY`, `NOTION_REPORTS_PARENT_PAGE_ID` 또는 `NOTION_REPORTS_DATA_SOURCE_ID`가 필요하다.


## 결과
- `scripts/setup-notion-reports.cjs`, `scripts/upload-report-to-notion.cjs`, `scripts/find-latest-report.cjs`, `scripts/notion-reporting-utils.cjs`를 추가했다.
- `.env.local.example`, `Makefile`, `package.json`, `README.md`, `AGENTS.md`를 갱신해 setup/upload 명령과 env 계약을 문서화했다.
- `make notion-upload-dry-run`으로 기존 E2E PDF/Markdown 산출물을 기준으로 업로드 메타데이터 파싱을 검증했다.
- `codex mcp login notion`으로 Notion MCP OAuth 로그인도 완료했다.

## 연결 Context
- `context/context_20260307_224500_notion_report_upload_automation.md`
