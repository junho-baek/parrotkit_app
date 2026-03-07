# Context: E2E Validation Report (2026-03-07 19:14 KST)

## Summary
- Playwright로 핵심 MVP 사용자 여정을 검증했다.
- 검증 범위:
  - signup
  - onboarding interests save
  - reference input
  - recipe generation + recipe save
  - reconnect login
  - saved recipe reopen
  - direct route recipe rehydrate
  - event_logs persistence
- 스크린샷 8장을 `output/playwright/20260307_e2e/`에 저장했다.
- Markdown/PDF 보고서를 각각 `output/reports/20260307_parrotkit_e2e_validation_report.md`, `output/pdf/20260307_parrotkit_e2e_validation_report.pdf`로 생성했다.

## Validation Data
- Test account: `parrotkitflow202603071004@mailinator.com`
- Auth user id: `f7f6ed0a-8d73-4eb0-b4b4-3bc4db082b08`
- Recipe id: `d897f379-cdad-4105-8225-4dc3082d775b`
- Stored interests: `Education`, `Food`
- Event logs confirmed:
  - `signup_success`
  - `select_interest` x2
  - `onboarding_complete`
  - `reference_submitted`
  - `recipe_generated`
  - `recipe_saved`
  - `login`
  - `recipe_reopened`

## Key Finding
- 사용자 여정 자체는 통과했다.
- 다만 이번 샘플 YouTube Shorts URL에서는 FFmpeg 기반 다운로드가 `Failed to find any playable formats`로 실패했고, analyze API가 fallback scene segmentation으로 응답했다.
- 즉, core save/reopen flow는 준비됐지만 YouTube scene detection fidelity는 아직 별도 안정화가 필요하다.

## Render Verification
- PDF는 11페이지로 생성됐다.
- `pdfplumber`로 텍스트 추출과 페이지 수를 확인했다.
- `PyMuPDF`로 `tmp/pdfs/20260307_parrotkit_e2e_validation_report/`에 PNG 렌더링을 생성해 페이지 단위 렌더링 결과를 점검했다.
