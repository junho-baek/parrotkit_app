# Purchase Success E2E Validation (2026-03-11)

## 배경
- 사용자는 GTM에서 `purchase_success` 이벤트 이름을 수정하고 다시 배포했다.
- 이전 QA에서 `view_pricing`, `begin_checkout`는 정상 수집됐지만 결제 성공 이벤트가 `GA4-purchase_success`처럼 비표준 이름으로 들어온 흔적이 있었다.
- 배포환경 QA 규칙상 headed browser 기준 테스트, 스크린샷/Markdown/PDF 리포트, Notion 업로드까지 같은 턴에서 완료해야 한다.

## 목표
- 배포 URL `https://parrotkit-deploy.vercel.app/`에서 로그인 -> Pricing -> Lemon checkout -> Billing success -> My Page 흐름을 다시 자동화한다.
- 결제 완료 후 클라이언트/네트워크 기준으로 `purchase_success`가 표준 이름으로 수집되는지 확인한다.
- 결과를 한국어 QA 리포트(MD + PDF)로 남기고 Notion 업로드 후 git push한다.

## 범위
- 포함: headed deploy QA, checkout 자동화, 네트워크/콘솔 증거 수집, GA4 수집명 확인, 보고서 작성, PDF 생성, Notion 업로드, context/plan 갱신, git push
- 제외: GTM/GA4/Meta 추가 설정 변경, 애플리케이션 기능 코드 수정(필요 시 별도 작업으로 분리)

## 변경 파일
- `plans/20260311_purchase_success_e2e_validation.md`
- `output/playwright/20260311_purchase_success_e2e_validation/*`
- `output/reports/20260311_parrotkit_purchase_success_e2e_validation_report_ko.md`
- `output/pdf/20260311_parrotkit_purchase_success_e2e_validation_report_ko.pdf`
- `context/context_20260311_*_purchase_success_e2e_validation.md`

## 테스트
- Headed Playwright 배포 QA
- 로그인 상태 확인
- Pricing/Checkout/Billing success/My Page smoke
- 네트워크 로그에서 이벤트명 확인 (`view_pricing`, `begin_checkout`, `purchase_success`)
- 스크린샷/콘솔/네트워크 증거 수집

## 롤백
- 코드 변경이 없는 QA 작업이면 산출물 커밋 revert로만 정리 가능.

## 리스크
- Lemon checkout 외부 자산/응답 상태에 따라 자동화 성공률이 낮아질 수 있다.
- GA4 UI 리포트 반영은 지연될 수 있으므로 이번 판정은 브라우저 네트워크/Tag 경로를 우선 진실값으로 본다.

## 결과
- 완료
- 결론: 배포환경 결제 E2E에서 GA4 collect 기준 `purchase_success` 표준 이벤트명이 확인됐다. legacy 이름은 재관측되지 않았다.
- 산출물:
  - `output/reports/20260311_parrotkit_purchase_success_e2e_validation_report_ko.md`
  - `output/pdf/20260311_parrotkit_purchase_success_e2e_validation_report_ko.pdf`
  - `context/context_20260311_200200_purchase_success_e2e_validation.md`
  - Notion: `https://www.notion.so/20260311-Parrotkit-Purchase-Success-E2E-Validation-Report-320fdc54bb728178bcc4dbcebad071ff`
