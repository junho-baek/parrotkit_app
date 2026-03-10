# Release Gate E2E + Progress Report Plan (2026-03-11)

## 배경
- 사용자는 배포환경 기준 현재 빌드가 최종 결제까지 동작하는지 다시 확인하고 싶어 한다.
- 동시에 2026년 3월 13일까지의 핵심 MVP 체크리스트가 얼마나 달성되었는지 운영 관점 보고가 필요하다.
- 보고서는 스크린샷/Markdown/PDF 산출물로 남기고 Notion reports 데이터소스에도 업로드해야 한다.

## 목표
- `https://parrotkit-deploy.vercel.app/` 기준으로 핵심 플로우와 결제까지 재검증한다.
- GTM/GA4/Meta Pixel 관련 증거를 브라우저 기준으로 확인한다.
- 3/13 체크리스트 달성도와 남은 리스크, 추가해야 할 태그/마케팅/개발 모먼트를 정리한다.

## 범위
- 포함: deploy login, 핵심 플로우 smoke, pricing, Lemon checkout, subscription reflected, GTM/GA4/Meta evidence, 진행률 보고, Notion 업로드
- 제외: 코드 기능 변경, GTM/Meta 대규모 재설계, 랜덤 유저 5명 전체 실행

## 변경 파일
- `plans/20260311_release_gate_e2e_and_progress_report.md`
- `output/playwright/20260311_release_gate_e2e/*`
- `output/reports/20260311_parrotkit_release_gate_report_ko.md`
- `output/pdf/20260311_parrotkit_release_gate_report_ko.pdf`
- `context/context_20260311_*_release_gate_e2e.md`

## 테스트
- headed browser deploy smoke
- 결제 완료 및 Pro 반영 확인
- GTM Preview/브라우저 네트워크 기반 GA4/Meta 흔적 확인
- 핵심 플로우 진행률 근거 수집

## 롤백
- 산출물/문서만 생성하므로 코드 롤백 없음

## 리스크
- Meta Pixel은 아직 GTM publish 상태에 따라 관측 실패 가능
- 외부 결제 도메인 이탈 때문에 GTM preview 세션이 중간에 끊길 수 있음
- 랜덤 유저 5명 테스트는 이번 턴에서 대체 보고로만 평가될 수 있음

## 결과
- Deploy smoke account 기준 login -> reference submit -> recipe generate/save -> recipe reopen까지 재검증 완료
- Pricing 진입과 checkout start는 확인했으나, Playwright에서 Lemon 자산 522로 외부 결제 폼 자동화는 불안정했다
- Markdown/PDF 보고서와 스크린샷을 생성하고 Notion reports 데이터소스에 업로드했다

## 연결 Context
- context/context_20260311_042151_release_gate_e2e.md
