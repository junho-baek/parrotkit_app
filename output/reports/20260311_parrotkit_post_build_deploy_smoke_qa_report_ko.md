# ParrotKit 배포환경 Post-build Smoke QA Report

## 1. 테스트 개요
- 테스트 시간: 2026-03-11 15:41 KST
- 대상 URL: https://parrotkit-deploy.vercel.app/
- 기준 브랜치: `dev`
- 기준 커밋: `15dd7da`
- 테스트 계정: `parrotkitcodextest@mailinator.com`
- 테스트 목적:
  - `fix(build): wrap tracking initializer in suspense` 적용 후 배포환경 핵심 플로우가 정상 동작하는지 재확인
  - 로그인, Pricing 접근, Lemon Squeezy test checkout, `/billing/success` 복귀, `My Page` 구독 상태 반영까지 확인

## 2. 검증 범위
1. `/signin` 로그인
2. `/home` 진입
3. `/my`에서 현재 구독 상태 확인
4. `/pricing` 접근 및 Pro CTA 동작 확인
5. Lemon Squeezy test checkout 로드
6. 테스트 카드 결제 submit
7. `/billing/success`에서 `Pro is active` 확인
8. `/my` 복귀 후 `Pro Plan` 표시 확인

## 3. 실행 결과 요약
- 결과: 통과
- 핵심 판단:
  - build fix 이후 배포 URL에서 실제 사용자 플로우가 깨지지 않았다.
  - 외부 Lemon checkout 이동과 복귀가 정상 동작했다.
  - webhook 반영 이후 `/billing/success`와 `/my` 구독 UI가 정상 갱신됐다.

## 4. 세부 결과
### 4.1 로그인 및 앱 진입
- `/signin`에서 테스트 계정 로그인 성공
- `/home`으로 정상 이동 확인

### 4.2 구독/가격 화면
- `/my`에서 기존 구독 상태가 `Pro Plan`으로 표시됨
- 하단/Quick Action 경로를 통해 `/pricing` 접근 성공
- `Get Access Now` CTA가 활성 상태로 유지됨

### 4.3 결제 플로우
- Lemon Squeezy checkout 페이지 정상 로드
- 테스트 카드 정보 입력 후 `US$9.99 결제` submit 성공
- Lemon 완료 모달에서 `계속` 클릭 후 우리 도메인으로 복귀

### 4.4 성공 복귀 및 권한 반영
- `/billing/success`에서 `Pro is active` 확인
- `Go to My Page` 클릭 후 `/my` 복귀
- `Current Plan: Pro Plan` 유지 확인

## 5. 네트워크/추적 증거
원본 로그: `output/playwright/20260311_post_build_deploy_smoke_qa/network_requests.txt`

핵심 라인:
- `view_pricing`: 67, 68 (`GA4 collect` 204)
- `begin_checkout`: 74, 76 (`GA4 collect` 204)
- `/api/checkout`: 73 (200)
- Lemon checkout submit: 163 (`/checkout/submit` 200)
- `purchase_success` 관련 collect: 189, 190 (204)
- `/api/events` 200: 22, 25, 50, 52, 65, 71, 183, 198

## 6. 스크린샷 증거
- 로그인 입력: `output/playwright/20260311_post_build_deploy_smoke_qa/00_signin.png`
- 로그인 후 Home: `output/playwright/20260311_post_build_deploy_smoke_qa/01_home_after_login.png`
- My Page Pro 상태: `output/playwright/20260311_post_build_deploy_smoke_qa/02_my_page_pro.png`
- Pricing: `output/playwright/20260311_post_build_deploy_smoke_qa/03_pricing.png`
- Lemon checkout 로드: `output/playwright/20260311_post_build_deploy_smoke_qa/04_checkout_loaded.png`
- Lemon thank you 모달: `output/playwright/20260311_post_build_deploy_smoke_qa/05_checkout_success_thankyou.png`
- Billing success: `output/playwright/20260311_post_build_deploy_smoke_qa/06_billing_success_waiting.png`
- 결제 후 My Page: `output/playwright/20260311_post_build_deploy_smoke_qa/07_my_page_after_checkout.png`

## 7. 콘솔/리스크
원본 로그: `output/playwright/20260311_post_build_deploy_smoke_qa/console_messages.txt`

관찰 내용:
- Lemon checkout 자산 내부에서 Sentry 403, `auth.lemonsqueezy.com/user` 401, Stripe 경고가 있었음
- 이번 실행에서는 결제 성공까지 진행되어 blocking 이슈는 아니었음
- `/billing/success`에서 `parrot-logo.png` preload 경고 2건 관찰

## 8. 결론
- 이번 배포는 build fix 이후 기준으로 핵심 구독 플로우가 정상 동작했다.
- 특히 Vercel 빌드 복구 후에도 GTM/GA4 추적 신호와 Lemon checkout 복귀가 깨지지 않았다는 점을 확인했다.
- 현재 단계에서 프로덕션 스모크 기준 가장 큰 blocker는 해소된 상태다.

## 9. 다음 액션
1. GA4 DebugView에서 `purchase_success` 수신 여부를 콘솔 화면 기준으로 최종 확인
2. GTM에 Meta Pixel `ViewContent / InitiateCheckout / Purchase` 추가 및 publish
3. Lemon checkout 콘솔의 외부 경고(Sentry 403, auth 401)는 우리 앱 blocker는 아니지만 운영 메모로 분리 추적
