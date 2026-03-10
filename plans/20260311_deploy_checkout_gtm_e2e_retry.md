# Deploy Checkout + GTM E2E Retry Plan (2026-03-11)

## 배경
- 사용자는 GTM 배포 이후 배포환경에서 결제 포함 E2E 자동화 재검증과 Notion 보고서 업로드를 요청했다.
- 기존 QA에서는 외부 결제 구간에서 자동화 불안정성이 있었고, 이번에는 GTM 배포 상태 기준으로 재확인이 필요하다.

## 목표
- 배포 URL `https://parrotkit-deploy.vercel.app/`에서 로그인 -> 주요 플로우 -> 결제 시도를 자동화로 재실행한다.
- GTM/GA4 연동 신호를 `dataLayer`/네트워크 증거로 수집한다.
- 한국어 QA 리포트(Markdown + PDF)를 작성하고 Notion 업로드를 완료한다.

## 범위
- 포함: 배포환경 E2E 실행, 스크린샷 수집, 이벤트 증거 수집, 리포트 작성/업로드
- 제외: GTM 태그 구성 변경, Meta Pixel 콘솔 설정 변경, 결제 UX 코드 리팩터링

## 변경 파일
- `plans/20260311_deploy_checkout_gtm_e2e_retry.md`
- `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/*`
- `output/reports/20260311_parrotkit_deploy_checkout_gtm_e2e_retry_report_ko.md`
- `output/pdf/20260311_parrotkit_deploy_checkout_gtm_e2e_retry_report_ko.pdf`
- `context/context_20260311_*_deploy_checkout_gtm_e2e_retry.md`

## 테스트
- Playwright headed 배포 QA
- 결제 시작/성공 여부 확인
- dataLayer 이벤트 확인(`view_pricing`, `begin_checkout`, `purchase_success`)

## 롤백
- 코드 변경이 있는 경우 해당 커밋 revert로 롤백 가능.
- 이번 작업은 주로 산출물/문서 생성 중심이며 애플리케이션 동작 변경은 없음.

## 리스크
- Lemon Squeezy 외부 결제 페이지의 네트워크/자산 상태에 따라 자동화 성공률이 낮아질 수 있다.
- 외부 도메인 이동 시 Tag Assistant 연결은 끊길 수 있으므로 이벤트 검증은 앱 도메인 기준 증거를 우선한다.

## 결과
- 배포 URL에서 로그인 -> My Page -> Pricing -> Lemon checkout -> Billing success -> My Page(Pro 반영)까지 자동화로 재검증 완료.
- 결제 결과:
  - Lemon checkout submit 200 확인
  - `/billing/success`에서 `Pro is active` 확인
  - `/my`에서 `Current Plan: Pro Plan` 반영 확인
- 추적 결과:
  - `view_pricing`, `begin_checkout`, `purchase_success` 관련 GA4 collect(204) 확인
  - `/api/events` 200 다수 확인
- 산출물 생성:
  - `output/reports/20260311_parrotkit_deploy_checkout_gtm_e2e_retry_report_ko.md`
  - `output/pdf/20260311_parrotkit_deploy_checkout_gtm_e2e_retry_report_ko.pdf`
  - `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/*` (스크린샷/로그)
- Notion 업로드 완료:
  - `https://www.notion.so/20260311-Parrotkit-Deploy-Checkout-Gtm-E2e-Retry-Report-Ko-31ffdc54bb7281ca91a8df37f034972f`
- 연결 context:
  - `context/context_20260311_063319_deploy_checkout_gtm_e2e_retry.md`
