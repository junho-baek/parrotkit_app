# Vercel Notion Auto Report 플랜 (2026-03-07)

## 배경
- 현재는 로컬 또는 수동 명령으로만 Notion 보고서 업로드가 가능하다.
- 사용자 요청은 Vercel 배포 이후 항상 자동으로 리포트를 생성/업로드하고, PPT 산출물도 같은 경로로 다룰 수 있게 정리하는 것이다.

## 목표
- Vercel `repository_dispatch` 이벤트를 받는 GitHub Actions workflow를 추가한다.
- 배포 메타데이터에서 Markdown/PDF 배포 리포트를 생성하고 Notion에 자동 업로드한다.
- PPT/PDF 산출물용 summary template 생성 명령과 업로드 alias를 추가한다.
- `AGENTS.md`, `README.md`, 관련 문서를 갱신해 다른 에이전트도 같은 자동화 경로를 따른다.

## 범위
- 포함: GitHub Actions workflow, deployment report generator, PPT summary template generator, Makefile/docs/AGENTS 업데이트
- 제외: 실제 PPT 파일 생성기, Vercel Dashboard 설정 자동화, Notion multipart 대용량 파일 업로드

## 변경 파일
- `plans/20260307_vercel_notion_auto_report.md`
- `.github/workflows/*.yml`
- `scripts/generate-deployment-report.cjs`
- `scripts/init-report-summary.cjs`
- `scripts/upload-report-to-notion.cjs` (필요시)
- `scripts/find-latest-report.cjs` (필요시)
- `package.json`
- `package-lock.json`
- `Makefile`
- `README.md`
- `docs/notion-report-automation.md`
- `AGENTS.md`
- `context/context_*.md`

## 테스트
- `node --check` on new scripts
- `node scripts/generate-deployment-report.cjs --dry-run ...`
- `node scripts/init-report-summary.cjs --dry-run --file ...`
- `make report-template ...`
- `make notion-upload-dry-run`
- `npm run build`
- workflow YAML lint via basic parse/readback

## 롤백
- workflow 및 스크립트는 커밋 단위로 되돌린다.
- GitHub Actions secrets 및 Vercel Git integration 설정은 UI에서 비활성화 가능하다.

## 리스크
- GitHub `repository_dispatch`는 workflow 파일이 default branch에 있어야만 실제 트리거된다.
- Vercel deployment payload 스키마에 새 필드가 추가될 수 있으므로, 없는 필드는 안전한 기본값으로 처리해야 한다.
- GitHub Actions 러너에는 로컬 개발 환경의 output 산출물이 없으므로 CI에서는 자체 deployment report를 생성해야 한다.


## 결과
- `pdfkit` 기반 deployment report 생성 스크립트를 추가했다.
- `report-template`, `deck-template`, `deck-and-upload`, `deployment-report` Make targets를 추가했다.
- `vercel.deployment.ready`를 수신하는 GitHub Actions workflow를 추가했다.
- 로컬에서 deployment report PDF/Markdown을 실제 생성하고 Notion 업로드까지 검증했다.
- GitHub repository secrets `NOTION_API_KEY`, `NOTION_REPORTS_DATA_SOURCE_ID`를 설정했다.
- 남은 운영 조건은 workflow 파일이 default branch(`main`)에 존재해야 한다는 점이다.

## 연결 Context
- `context/context_20260307_224500_notion_report_upload_automation.md`
