# ParrotKit 배포환경 결제 포함 E2E 재검증 보고서 (GTM 배포 후)

## 1) 테스트 개요
- 테스트 일시: 2026-03-11 06:27 KST
- 대상 URL: https://parrotkit-deploy.vercel.app/
- 브랜치/커밋: `dev` / `149b0d8`
- 테스트 목적:
  - GTM 배포 상태에서 결제 포함 E2E를 다시 자동화 검증
  - `view_pricing`, `begin_checkout`, `purchase_success` 추적 신호 검증
  - 결제 성공 후 `Pro` 권한 반영 확인

## 2) 검증 범위
- 로그인: 재사용 테스트 계정 로그인
- 결제 동선: 하단 네비 `My Page` -> `Upgrade` -> `/pricing` -> Lemon checkout
- 결제 처리: 테스트 카드 결제 -> `/billing/success` 복귀
- 권한 반영: `/my`에서 `Pro Plan` 반영
- 추적: `dataLayer` 이벤트 + 네트워크(`g/collect`, `/api/events`) 증거

## 3) 실행 결과 요약
- 결과: **통과 (결제 완료 + Pro 반영 + 핵심 이벤트 신호 확인)**

체크리스트:
- [x] 로그인 성공
- [x] `My Page`에서 Free 상태 확인
- [x] `/pricing` 진입
- [x] `view_pricing` 신호 확인
- [x] `begin_checkout` 신호 확인
- [x] Lemon checkout 결제 성공
- [x] `/billing/success` 복귀
- [x] `purchase_success` 신호 확인
- [x] `/my`에서 `Pro Plan` 반영 확인

## 4) 핵심 증거

### A. 화면 캡처
- 홈: `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/00_home.png`
- 로그인 후 홈: `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/01_home_after_login.png`
- My Page(Free): `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/02_my_page_free_plan.png`
- Pricing: `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/03_pricing_page.png`
- Lemon checkout: `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/04_lemonsqueezy_checkout_loaded.png`
- Billing success(Pro active): `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/05_billing_success_waiting.png`
- My Page(Pro): `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/06_my_page_pro_plan.png`

### B. 네트워크 로그
- 원본: `output/playwright/20260311_deploy_checkout_gtm_e2e_retry/network_requests.txt`

핵심 라인:
- `view_pricing` -> GA4 collect 204: line 73, 74
- `begin_checkout` -> GA4 collect 204: line 80, 81
- checkout API 200: line 79
- Lemon 결제 submit 200: line 172
- `purchase_success` -> GA4 collect 204: line 198, 199
- `/api/events` 200 다수: line 20, 30, 32, 59, 61, 71, 77, 191, 207

## 5) 확인된 리스크/관찰
- Lemon checkout 페이지에서 Sentry 403 로그가 보이지만 결제 성공 자체에는 영향 없음.
- 외부 도메인(`parrotkit-app.lemonsqueezy.com`)으로 이동하는 구간은 Tag Assistant 세션이 끊길 수 있음.
  - 정상 동작이며, 결제 전후 이벤트는 앱 도메인 기준(`/pricing`, `/billing/success`)으로 검증하는 것이 맞음.

## 6) 결론
- GTM 배포 후 결제 포함 E2E를 자동화로 재검증했으며,
  - 결제 플로우,
  - Pro 권한 반영,
  - 핵심 추적 이벤트(`view_pricing`, `begin_checkout`, `purchase_success`)
  모두 증거 기반으로 확인됨.

## 7) 다음 액션 추천
1. Meta Pixel 매핑(`ViewContent`, `InitiateCheckout`, `Purchase`)도 동일 플로우로 네트워크 증거까지 닫기
2. `signup_success`, `onboarding_complete`, `recipe_generated`, `recipe_saved`를 같은 방식으로 회귀 템플릿화
3. 릴리즈 게이트용 사용자 표본(3~5명) 수동 체크 결과를 동일 리포트 포맷으로 누적
