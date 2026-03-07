# Notion Only Cleanup 플랜 (2026-03-07)

## 배경
- Notion 업로드 자동화는 유지하되, Vercel/GitHub Actions 기반 자동 배포 리포트 경로는 현재 스코프에서 제외한다.
- 이미 `origin/dev`에 올라간 Vercel 자동화 관련 변경을 Notion 수동 업로드 중심 구조로 다시 정리해야 한다.

## 목표
- Vercel deployment workflow와 deployment report generator를 제거한다.
- Notion 수동 업로드 경로(`notion-setup`, `report-and-upload`, `deck-template`, `deck-and-upload`)는 유지한다.
- 관련 문서/AGENTS/context를 Notion-only 기준으로 정리한다.

## 범위
- 포함: workflow 제거, deployment 관련 명령/문서 제거, plan/context 기록, git push
- 제외: 기존 Notion 업로드 스크립트 제거, PPT 업로드 경로 제거

## 변경 파일
- `plans/20260307_notion_only_cleanup.md`
- `.github/workflows/vercel-notion-auto-report.yml`
- `scripts/generate-deployment-report.cjs`
- `package.json`
- `Makefile`
- `README.md`
- `docs/notion-report-automation.md`
- `AGENTS.md`
- `context/context_20260307_224500_notion_report_upload_automation.md`

## 테스트
- `node scripts/init-report-summary.cjs --dry-run --file <pdf>`
- `make notion-upload-dry-run`
- `npm run build`

## 롤백
- 정리 커밋을 revert한다.

## 리스크
- 이미 생성된 Notion deployment report 페이지는 남는다.
- default branch/main에 이미 반영된 것이 있다면 별도 정리가 필요하다.

## 결과
- Vercel/GitHub Actions deployment workflow와 deployment report generator를 제거했다.
- Notion 수동 업로드 경로(`notion-setup`, `report-and-upload`)는 유지했다.
- PPT/PPTX용 summary template / manual upload 경로(`report-template`, `deck-template`, `deck-and-upload`)를 유지했다.
- 관련 문서와 AGENTS 규칙을 Notion-only 기준으로 정리했다.

## 연결 Context
- `context/context_20260307_233500_notion_only_cleanup.md`
