# Deploy Checkout + Tracking QA Plan (2026-03-09)

## 배경
- 배포환경에서 Lemon Squeezy 결제 플로우와 GTM/GA4/Meta Pixel 계측이 실제로 동작하는지 최종 확인이 필요하다.
- 사용자는 배포 URL 기준 E2E 검증을 요청했고, AGENTS 규칙상 headed browser 검증과 QA 산출물 보관이 필요하다.

## 목표
- `https://parrotkit-deploy.vercel.app/` 기준으로 로그인 후 Pro checkout 진입 및 결제 흐름을 검증한다.
- GTM 로딩, GA4/Meta Pixel 이벤트 송신 여부를 브라우저 증거로 확인한다.
- 검증 결과를 스크린샷, Markdown, PDF로 남기고 가능하면 Notion까지 업로드한다.

## 범위
- 포함: deploy login, pricing CTA, Lemon checkout 이동, webhook/success 상태 확인, GTM/GA4/Meta network 확인
- 제외: 코드 변경, live mode 판매 활성화, 운영 결제 수금

## 변경 파일
- `plans/20260309_deploy_checkout_tracking_qa.md`
- `output/playwright/20260309_deploy_checkout_tracking_qa/*`
- `output/reports/20260309_parrotkit_deploy_checkout_tracking_qa_report.md`
- `output/pdf/20260309_parrotkit_deploy_checkout_tracking_qa_report.pdf`
- `context/context_20260309_*_deploy_checkout_tracking_qa.md`

## 테스트
- headed browser deploy smoke
- Lemon checkout redirect 확인
- GTM container request 확인
- GA4 collect request 확인
- Meta Pixel request 확인

## 롤백
- QA 산출물/문서만 생성하므로 코드 롤백 없음

## 리스크
- 외부 결제/광고 콘솔 상태에 따라 일부 검증이 환경설정 의존적일 수 있음
- GA4/Meta는 브라우저 네트워크 흔적은 보이더라도 실콘솔 반영은 지연될 수 있음
- Lemon test card 정보가 UI에서 바뀌면 결제 완료까지 추가 확인이 필요할 수 있음

## 결과
- Deploy login and pricing render passed on `https://parrotkit-deploy.vercel.app/`.
- GTM container script loaded and `view_pricing`, `begin_checkout` were confirmed in `dataLayer`.
- Lemon checkout did not open because deployed client-side `variantId` was missing; `/api/checkout` returned `500`, and a direct authenticated browser fetch returned `400 Product variant ID is required`.
- GA4 and Meta Pixel outbound requests were not observed in the tested flow.
- QA artifacts generated:
  - `output/playwright/20260309_deploy_checkout_tracking_qa/*`
  - `output/reports/20260309_parrotkit_deploy_checkout_tracking_qa_report.md`
  - `output/pdf/20260309_parrotkit_deploy_checkout_tracking_qa_report.pdf`
- Markdown report uploaded to Notion page:
  - `https://www.notion.so/31efdc54bb7281418673ed89e055c5e9`

## 연결 Context
- `context/context_20260309_193922_deploy_checkout_tracking_qa.md`
