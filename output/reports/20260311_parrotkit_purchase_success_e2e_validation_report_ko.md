# ParrotKit 배포환경 Purchase Success E2E Validation Report

## 1. 테스트 개요
- 테스트 시간: 2026-03-11 19:55 KST
- 대상 URL: https://parrotkit-deploy.vercel.app/
- 기준 브랜치: `dev`
- 기준 GTM 컨테이너: `GTM-WNHB8L5J`
- 기준 GTM 버전: `3` (`이벤트명 수정` 게시 완료)
- 테스트 계정: `parrotkitcodextest@mailinator.com`
- 테스트 목적:
  - GTM `purchase_success` 이벤트명 수정 게시 후 실제 결제 플로우에서 GA4가 표준 이벤트명 `purchase_success`를 수신하는지 확인
  - 배포환경 기준 `signin -> pricing -> Lemon checkout -> billing/success -> my` 흐름이 계속 정상 동작하는지 재검증

## 2. 검증 범위
1. `/signin` 로그인
2. `/pricing` 접근
3. Lemon Squeezy test checkout 진입
4. 테스트 카드 결제 submit
5. Lemon 성공 모달 `계속` 처리
6. `/billing/success` 복귀
7. `/my` 복귀
8. 네트워크 로그 기준 GA4 collect 이벤트명 확인

## 3. 실행 결과 요약
- 결과: 통과
- 핵심 판단:
  - 결제 제출과 성공 복귀 플로우는 정상 동작했다.
  - GTM 수정 후 GA4 collect 요청에서 `en=purchase_success`가 관측됐다.
  - 기존 잘못된 이벤트명 `GA4-purchase_success` 또는 `GA4 - purchase_success`는 이번 실행에서 관측되지 않았다.

## 4. 세부 결과
### 4.1 앱 내부 플로우
- `/signin` 로그인 성공
- `/pricing` 진입 성공
- `Get Access Now` 클릭 후 Lemon checkout 로드 성공

### 4.2 결제 플로우
- Lemon checkout에서 테스트 카드 `4242 4242 4242 4242 / 12-35 / 123` 입력 성공
- 청구 주소 입력 후 `US$9.99 결제` submit 성공
- Lemon 성공 모달에서 `계속` 버튼이 나타났고 이를 클릭해 우리 도메인으로 복귀했다.

### 4.3 성공 복귀 및 이벤트 검증
- `/billing/success` 화면까지 복귀 성공
- 이후 `/my`로 이동 성공
- 네트워크 로그 기준 아래 이벤트가 확인됐다.
  - `en=view_pricing`
  - `en=begin_checkout`는 앱 API/CTA 흐름상 계속 관측되며 기존 퍼널은 유지됨
  - `en=purchase_success`
- 기존 잘못된 이벤트명은 이번 실행 네트워크 로그와 결과 JSON 어디에도 남지 않았다.

## 5. 네트워크/추적 증거
원본 로그: `output/playwright/20260311_purchase_success_e2e_validation/network_requests.txt`

핵심 라인:
- `/api/checkout` 요청: `variantId=1383129`
- Lemon submit: `POST https://parrotkit-app.lemonsqueezy.com/checkout/submit?... => 200`
- Pricing page collect:
  - `en=view_pricing`
- Billing success page collect:
  - `en=purchase_success`

직접 근거:
- `.../pricing ... en=page_view` 다음 줄 `en=view_pricing`
- `.../billing/success ... en=purchase_success`

## 6. 스크린샷 증거
- 로그인 입력: `output/playwright/20260311_purchase_success_e2e_validation/00_signin.png`
- Pricing 화면: `output/playwright/20260311_purchase_success_e2e_validation/02_pricing.png`
- Lemon checkout 로드: `output/playwright/20260311_purchase_success_e2e_validation/03_checkout_loaded.png`
- Lemon checkout 입력 완료: `output/playwright/20260311_purchase_success_e2e_validation/04_checkout_filled.png`
- Lemon 성공 모달: `output/playwright/20260311_purchase_success_e2e_validation/05_checkout_success_modal.png`
- Lemon `계속` 버튼 상태: `output/playwright/20260311_purchase_success_e2e_validation/06_checkout_continue_button.png`
- Billing success: `output/playwright/20260311_purchase_success_e2e_validation/07_billing_success.png`
- 결제 후 My page: `output/playwright/20260311_purchase_success_e2e_validation/08_my_after_checkout.png`

## 7. 관찰 사항 및 리스크
- Lemon checkout은 외부 도메인으로 이동하므로 Tag Assistant 연결은 중간에 끊기는 것이 정상이다.
- 따라서 결제 퍼널 검증은 `begin_checkout`와 `/billing/success` 복귀 후 `purchase_success`를 기준으로 보는 것이 맞다.
- 이번 테스트 스크립트의 `result.json`에는 `view_pricing` 파싱이 줄바꿈 때문에 `page_view\r\nen=view_pricing`로 함께 남았지만, 이는 로컬 캡처 스크립트 파싱 문제이고 실제 GA4 수신 이벤트명 문제는 아니다.

## 8. 결론
- GTM 이벤트명 수정은 live에 정상 반영됐다.
- 현재 배포환경 기준 결제 퍼널의 최소 GA4 이벤트 세트는 아래까지 닫혔다.
  - `view_pricing`
  - `begin_checkout`
  - `purchase_success`
- 결제 성공 이벤트명 표준화 이슈는 해소된 상태다.

## 9. 다음 액션
1. GA4 DebugView에서도 `purchase_success`를 한 번 더 확인해 콘솔/리포트 간 증거를 이중화
2. GTM에 Meta Pixel `ViewContent / InitiateCheckout / Purchase` 추가
3. 남은 GA4 최소 세트 `signup_success / login / onboarding_complete / recipe_generated / recipe_saved`를 같은 방식으로 닫기
