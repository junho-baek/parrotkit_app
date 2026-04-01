# 20260327 KPI Tracking Hardening + Dashboard Redesign

## 배경
- 현재 GTM/dataLayer 구조는 동작하지만 `purchase_success`가 클라이언트/웹훅 양쪽에서 기록되어 KPI 과대집계 위험이 있다.
- 관리자 대시보드는 기본 지표는 제공하지만 심층 퍼널/품질 KPI와 운영 신뢰성 지표(중복/식별/소스 커버리지)가 부족하다.
- 사용자 요청: 추적 체계를 확장하고, Dashboard를 전문적/세련된 디자인으로 대폭 업그레이드.

## 목표
- 결제 성공 KPI를 웹훅 기준 단일 진실원으로 정리한다.
- 퍼널 확장(Checkout 단계 포함) 및 KPI 확장(획득/활성/전환/리텐션/데이터품질).
- 실패/보조 이벤트를 추가해 분석 해상도를 높인다.
- 관리자 대시보드 UI를 정보 밀도와 가독성을 모두 갖춘 실무형 화면으로 개편한다.

## 범위
- 이벤트 계약 확장 및 호출부 일부 수정.
- Admin KPI API 집계 로직 개선.
- Dashboard 프론트엔드 전면 리디자인.
- 컨텍스트 문서 업데이트.

## 변경 파일
- `src/lib/tracking/events.ts`
- `src/components/auth/SignUpForm.tsx`
- `src/components/auth/PricingCard.tsx`
- `src/app/billing/success/page.tsx`
- `src/app/api/admin/kpi/route.ts`
- `src/app/dashboard/page.tsx`
- `context/context_20260327_*.md` (작업 후)

## 테스트
- `npm run lint -- <changed files>`
- `get_errors`로 변경 파일 문제 확인
- `npm run dev` 기준 로컬 대시보드 수동 QA (레이아웃/지표 렌더링)

## 롤백
- 변경 커밋 revert
- 필요시 이벤트명 추가분(`purchase_success_client`, `checkout_failed` 등) 호출부 원복

## 리스크
- 기존 분석 대시보드/리포트가 `purchase_success` 단일 카운트 가정 시 지표 변동이 발생할 수 있음.
- 이벤트 스키마 확장으로 GTM/GA4 태그 매핑(변수/트리거) 동기화가 필요할 수 있음.

## 결과
- 구현 완료
	- 이벤트 계약 확장: `signup_failed`, `checkout_redirected`, `checkout_failed`, `purchase_success_client`
	- 구매 KPI 집계를 `lemonsqueezy_webhook` 소스 기반으로 분리
	- 퍼널에 Checkout 단계를 추가하고 전환 KPI 확장
	- 데이터 품질 KPI(identified ratio, event coverage, utm coverage) 추가
	- 관리자 Dashboard UI를 executive 콘솔 스타일로 전면 리디자인
	- 이벤트 적재 실패 시 API 500 응답으로 관측 가능성 강화
- 연결 context: `context/context_20260327_analytics_hardening_and_dashboard_redesign.md`
