# Context: Post-build Deploy Smoke QA (2026-03-11 15:49 KST)

## 목적
- `fix(build): wrap tracking initializer in suspense` 적용 후 배포 빌드가 통과한 상태에서 실제 배포환경 핵심 플로우를 다시 확인.

## 대상
- URL: `https://parrotkit-deploy.vercel.app/`
- 브랜치/기준 커밋: `dev` / `15dd7da`
- 계정: `parrotkitcodextest@mailinator.com`

## 실행 흐름
1. `/signin` 로그인
2. `/home` 진입 확인
3. `/my`에서 `Pro Plan` 상태 확인
4. Quick Action으로 `/pricing` 이동
5. `Get Access Now` 클릭 -> Lemon checkout 진입
6. test mode 카드 결제 submit
7. `/billing/success`에서 `Pro is active` 확인
8. `/my` 복귀 후 `Pro Plan` 유지 확인

## 결과
- 로그인: 성공
- Pricing 접근: 성공
- Lemon checkout 로드: 성공
- test mode 결제 submit: 성공
- `/billing/success` 복귀: 성공
- `/my` 구독 반영: 성공

## 추적/네트워크 증거
- 원본: `output/playwright/20260311_post_build_deploy_smoke_qa/network_requests.txt`
- 핵심 라인:
  - `view_pricing`: 67, 68
  - `begin_checkout`: 74, 76
  - `/api/checkout`: 73 (200)
  - Lemon submit: 163 (`/checkout/submit` 200)
  - `purchase_success` collect: 189, 190 (204)
  - `/api/events` 200: 22, 25, 50, 52, 65, 71, 183, 198

## 콘솔 관찰
- Lemon checkout 외부 자산에서 Sentry 403, `auth.lemonsqueezy.com/user` 401, Stripe 경고 관찰
- 이번 실행에서는 blocking 이슈 없이 결제 성공까지 진행
- `/billing/success`에서 `parrot-logo.png` preload 경고 2건 관찰

## 산출물
- 스크린샷/로그: `output/playwright/20260311_post_build_deploy_smoke_qa/*`
- Markdown 리포트: `output/reports/20260311_parrotkit_post_build_deploy_smoke_qa_report_ko.md`
- PDF 리포트: `output/pdf/20260311_parrotkit_post_build_deploy_smoke_qa_report_ko.pdf`

## Notion 업로드
- 페이지 URL: `https://www.notion.so/20260311-Parrotkit-Post-build-Deploy-Smoke-QA-Report-320fdc54bb72811fbed9c8c090b08995`
- pageId: `320fdc54-bb72-811f-bed9-c8c090b08995`
- dataSourceId: `5ffa971d-cbf9-4729-a904-ca5845dc7b91`

## 판단
- build fix 이후 배포환경 기준 핵심 구독 플로우는 정상이다.
- 빌드 복구가 실제 로그인/결제/복귀 동선에 regression을 만들지 않았음을 확인했다.
