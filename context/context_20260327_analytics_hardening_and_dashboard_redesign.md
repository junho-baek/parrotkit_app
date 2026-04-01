# Context: Analytics Hardening + Dashboard Redesign (2026-03-27)

## 작업 배경
- 사용자 요청: GA4/GTM 기반 추적을 퍼널/KPI 심층분석 가능 수준으로 확장하고, 관리자 대시보드 디자인을 전문적으로 대폭 업그레이드.

## 주요 변경

### 1) 이벤트 계약 확장 (`src/lib/tracking/events.ts`)
- 신규 이벤트 추가
  - `signup_failed` (reason 포함)
  - `checkout_redirected` (checkout provider 포함)
  - `checkout_failed` (reason 포함)
  - `purchase_success_client` (클라이언트 보조 성공 이벤트)
- 목적
  - `purchase_success`를 웹훅 진실원으로 유지하면서 클라이언트 성공 이벤트를 분리해 KPI 왜곡 감소
  - 실패 이벤트까지 수집해 퍼널 이탈 원인 분석 가능

### 2) 호출부 추적 개선
- `src/components/auth/SignUpForm.tsx`
  - `signup_start`를 유효성 통과 후로 이동
  - validation/API 실패 시 `signup_failed` 기록
- `src/components/auth/PricingCard.tsx`
  - checkout URL 수신 후 `checkout_redirected` 기록
  - 예외 시 `checkout_failed` 기록
- `src/app/billing/success/page.tsx`
  - 기존 `purchase_success` -> `purchase_success_client`로 변경

### 3) 이벤트 수집 신뢰성 (`src/app/api/events/route.ts`)
- 적재 실패 시 200 대신 500 반환 + `EVENT_LOGGING_FAILED` 에러 코드 반환
- 목적: 데이터 누락을 조기 탐지 가능하도록 개선

### 4) KPI API 확장 (`src/app/api/admin/kpi/route.ts`)
- 결제 진실원 분리
  - `purchase_success` 중 `payload.source === lemonsqueezy_webhook`만 구매 KPI 계산에 반영
- 퍼널 확장
  - Signup -> Onboarding -> Reference -> Recipe -> Checkout -> Purchase
- 신규 KPI
  - `signupToCheckoutRate`, `checkoutToPaidRate`, `recipeToCheckoutRate`
  - `totalEventsInPeriod`, `identifiedEventsInPeriod`, `anonymousEventsInPeriod`
  - `identifiedEventRatio`, `eventCoverageRate`, `utmCoverageRate`
  - `purchaseEventsRaw`, `purchaseEventsWebhook`, `purchaseEventsClient`
  - `checkoutUsersFromSignup`, stage coverage 계열(`signupSuccessUsers`, `onboardingEventUsers`, ...)
- Source 성과 확장
  - source별 `checkoutUsers`, `checkoutRate` 추가
- trend 확장
  - 일별 `checkouts` 추가
- insight 확장
  - Checkout bottleneck, event identity quality, UTM coverage

### 5) Dashboard UI 대폭 리디자인 (`src/app/dashboard/page.tsx`)
- 비주얼 방향
  - executive 콘솔 스타일, 고급 배경/카드 계층, 정보 밀도 강화
- 정보 구조
  - Executive KPI strip
  - Full Funnel (checkout 포함)
  - Revenue Integrity 패널 (raw/webhook/client purchase 분해)
  - KPI Matrix (획득/활성/전환/리텐션/품질)
  - Source Performance + Top source mix
  - Top Events
  - Daily multi-metric trend(signup/checkout/purchase/active/recipes)

## 검증
- 실행: `npm run lint -- src/lib/tracking/events.ts src/components/auth/SignUpForm.tsx src/components/auth/PricingCard.tsx src/app/billing/success/page.tsx src/app/api/admin/kpi/route.ts src/app/dashboard/page.tsx src/app/api/events/route.ts`
- 결과: 통과
- `get_errors` 결과: 변경 파일 오류 없음
- `npm run dev` 기반 확인
  - `/dashboard` 렌더링은 동작
  - `/api/admin/kpi`는 현재 `.env.local`의 Supabase 호스트 placeholder(`your-parrotkit-project-ref.supabase.co`)로 인해 401/ENOTFOUND 발생 (환경 설정 이슈)

## 운영 메모
- 실제 KPI 데이터 확인을 위해 `.env.local`의 Supabase URL/키를 실 프로젝트 값으로 교체 필요.
- GTM 측에서도 신규 이벤트명(`signup_failed`, `checkout_redirected`, `checkout_failed`, `purchase_success_client`)을 트리거/태그에 매핑해야 분석 반영 가능.

## 연계 문서
- plan: `plans/20260327_kpi_tracking_hardening_dashboard_redesign.md`
