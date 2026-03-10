# Context: Deploy Checkout + GTM E2E Retry (2026-03-11 06:33 KST)

## 목적
- GTM 배포 상태에서 결제 포함 E2E를 자동화로 다시 검증하고, 보고서를 Notion까지 업로드.

## 테스트 대상
- URL: `https://parrotkit-deploy.vercel.app/`
- 브랜치/기준 커밋: `dev` / `149b0d8`
- 계정: `parrotkitcodextest@mailinator.com`

## 자동화 실행 흐름
1. `/signin` 로그인
2. `/my` 진입 후 Free Plan 상태 확인
3. `Upgrade` 클릭 -> `/pricing`
4. `Get Access Now` 클릭 -> Lemon checkout 이동
5. 테스트 카드 결제 입력 및 승인
6. `/billing/success` 복귀 및 `Pro is active` 확인
7. `/my` 재진입 후 `Pro Plan` 반영 확인

## 추적/네트워크 핵심 증거
- 원본 로그: `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/network_requests.txt`
- 핵심 라인:
  - `view_pricing`: 73, 74 (GA4 collect 204)
  - `begin_checkout`: 80, 81 (GA4 collect 204)
  - `/api/checkout`: 79 (200)
  - Lemon submit: 172 (`/checkout/submit` 200)
  - `purchase_success`: 198, 199 (`GA4 - purchase_success` collect 204)
  - `/api/events` 200: 20, 30, 32, 59, 61, 71, 77, 191, 207

## 산출물
- 스크린샷/로그:
  - `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/00_home.png`
  - `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/01_home_after_login.png`
  - `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/02_my_page_free_plan.png`
  - `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/03_pricing_page.png`
  - `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/04_lemonsqueezy_checkout_loaded.png`
  - `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/05_billing_success_waiting.png`
  - `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/06_my_page_pro_plan.png`
  - `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/console_messages.txt`
  - `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/network_requests.txt`
- 리포트(MD): `output/reports/20260311_parrotkit_deploy_checkout_gtm_e2e_retry_report_ko.md`
- 리포트(PDF): `output/pdf/20260311_parrotkit_deploy_checkout_gtm_e2e_retry_report_ko.pdf`

## Notion 업로드
- 페이지 URL: `https://www.notion.so/20260311-Parrotkit-Deploy-Checkout-Gtm-E2e-Retry-Report-Ko-31ffdc54bb7281ca91a8df37f034972f`
- pageId: `31ffdc54-bb72-81ca-91a8-df37f034972f`
- dataSourceId: `5ffa971d-cbf9-4729-a904-ca5845dc7b91`

## 결론
- 이전 불안정 구간 없이 결제 완료/복귀/권한 반영까지 자동화 경로가 이번 실행에서는 안정적으로 통과.
- GTM/GA4 핵심 결제 퍼널 이벤트(`view_pricing`, `begin_checkout`, `purchase_success`)를 네트워크 로그 기준으로 확인.
- 다음은 Meta Pixel 매핑 3종(ViewContent/InitiateCheckout/Purchase) 동일 방식 검증이 우선.
