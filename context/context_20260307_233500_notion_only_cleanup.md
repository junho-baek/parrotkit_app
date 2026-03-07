# Context: Notion Only Cleanup (2026-03-07 23:35 KST)

## Summary
- Vercel/GitHub Actions 기반 deployment report 자동화는 현재 스코프에서 제거했다.
- Notion 수동 업로드 경로는 유지했다.
- 유지한 명령:
  - `make notion-setup`
  - `make notion-upload-dry-run`
  - `make report-and-upload`
  - `make report-template`
  - `make deck-template`
  - `make deck-and-upload`

## Removed
- `.github/workflows/vercel-notion-auto-report.yml`
- `scripts/generate-deployment-report.cjs`
- deployment automation 관련 문서/설명

## Kept
- `scripts/init-report-summary.cjs`
- `scripts/setup-notion-reports.cjs`
- `scripts/upload-report-to-notion.cjs`

## Validation
- `node scripts/init-report-summary.cjs --dry-run --file output/pdf/20260307_parrotkit_e2e_validation_report.pdf --report-type deck` 성공
- `make notion-upload-dry-run`, `npm run build`는 shell process limit 때문에 이번 정리 직후 재실행이 막혔다.

## Notes
- 이미 생성된 Notion deployment report page는 남겨둔다.
- 원격 `origin/dev`에는 cleanup 커밋을 다시 푸시해야 최종 반영된다.
