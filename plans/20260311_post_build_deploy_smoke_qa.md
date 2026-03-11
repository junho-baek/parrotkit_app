# Post-build Deploy Smoke QA (2026-03-11)

## 배경
- `fix(build): wrap tracking initializer in suspense` 적용 후 Vercel 배포 빌드가 통과했다.
- 사용자는 실제 배포환경에서 다시 테스트를 요청했다.
- 배포 QA 규칙상 headed browser 기준 테스트, 스크린샷/Markdown/PDF 리포트, Notion 업로드까지 한 턴에 마무리해야 한다.

## 목표
- 배포 URL `https://parrotkit-deploy.vercel.app/`에서 빌드 수정 이후 핵심 동작이 깨지지 않았는지 확인한다.
- 가능하면 로그인 -> Pricing -> Checkout -> Billing success -> My Page 반영까지 다시 검증한다.
- 테스트 결과를 한국어 리포트(MD + PDF)로 남기고 Notion 업로드 후 git push한다.

## 범위
- 포함: headed 배포 QA, 스크린샷/로그 수집, 보고서 작성, PDF 생성, Notion 업로드, context/plan 갱신, git push
- 제외: GTM/GA4/Meta 설정 변경, 애플리케이션 코드 변경(필요시 별도 작업으로 분리)

## 변경 파일
- `plans/20260311_post_build_deploy_smoke_qa.md`
- `output/playwright/20260311_post_build_deploy_smoke_qa/*`
- `output/reports/20260311_parrotkit_post_build_deploy_smoke_qa_report_ko.md`
- `output/pdf/20260311_parrotkit_post_build_deploy_smoke_qa_report_ko.pdf`
- `context/context_20260311_*_post_build_deploy_smoke_qa.md`

## 테스트
- Headed Playwright 배포 QA
- 로그인 상태 확인
- Pricing/Checkout/Billing success/My Page smoke
- 스크린샷/네트워크 증거 수집

## 롤백
- 코드 변경이 없는 작업이므로 산출물 커밋 revert로만 정리 가능.

## 리스크
- 외부 Lemon checkout 자산/응답 상태에 따라 자동화 성공률이 낮아질 수 있다.
- 기존 테스트 계정이 이미 Pro 상태일 경우 재결제 경로가 일부 달라질 수 있다.

## 결과
- build fix 이후 배포환경에서 로그인 -> Pricing -> Lemon checkout -> `/billing/success` -> `/my` 흐름을 headed browser로 재검증했다.
- 테스트 계정 기준 `Pro Plan` 상태 확인, test mode 결제 submit 성공, `Pro is active` 및 `/my` 반영까지 모두 통과했다.
- Markdown/PDF 리포트를 생성했고 Notion 업로드를 완료했다.
- 연결 context: `context/context_20260311_154905_post_build_deploy_smoke_qa.md`
