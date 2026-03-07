# GTM/Meta/LemonSqueezy Go-Live 플랜 (2026-03-11)

## 배경
- 현재 클라이언트 이벤트는 앱 코드 안에서 `gtag`를 직접 호출하는 구간이 많다.
- 이 상태로는 GA4는 볼 수 있어도 Meta Pixel, 전환 이벤트 관리, 운영 중 태그 변경이 비효율적이다.
- 결제는 LemonSqueezy checkout/webhook 코드가 존재하지만, 실제 출시 기준으로는 결제 성공, 웹훅 반영, 구독 상태 동기화, 리다이렉트/환불/취소 시나리오까지 닫혀야 한다.

## 목표
- 클라이언트 추적은 `dataLayer -> GTM -> GA4 + Meta Pixel` 구조로 통합한다.
- 결제 진실(source of truth)은 LemonSqueezy webhook + Supabase 상태값으로 유지한다.
- 출시 직전 기준으로 `signup -> onboarding -> recipe -> pricing -> checkout -> webhook -> entitlement/profile 반영` 흐름을 검증 가능하게 만든다.

## 권장 구조
- 클라이언트 태깅
  - 앱 코드는 `window.dataLayer.push()` 또는 공통 이벤트 헬퍼만 호출
  - GTM에서 GA4와 Meta Pixel로 fan-out
  - 하드코딩된 `gtag` 직접 호출은 점진적으로 제거
- 서버/결제 태깅
  - 구매 시작(`begin_checkout`)은 클라이언트 이벤트로 기록
  - 구매 완료/구독 활성화는 webhook 수신 이후 서버 기준으로 확정
  - 필요하면 서버 이벤트를 `/api/events`와 Supabase `event_logs`에도 함께 적재

## 범위
- 포함
  - GTM container 도입
  - GA4 config를 GTM로 이전
  - Meta Pixel base code + 표준 이벤트 매핑
  - 공통 이벤트 taxonomy 정리
  - LemonSqueezy test/live mode 체크리스트
  - checkout 성공/취소/실패 리다이렉트 검증
  - webhook signature 검증 및 profile/subscription 반영 확인
- 제외
  - 고도화된 attribution 모델링
  - Conversions API(server-side Meta CAPI) 도입

## 이벤트 설계
- 필수 funnel 이벤트
  - `view_home`
  - `view_signup`
  - `signup_start`
  - `signup_success`
  - `view_interests`
  - `onboarding_complete`
  - `reference_submitted`
  - `recipe_generated`
  - `recipe_saved`
  - `capture_uploaded`
  - `export_zip_success`
  - `view_pricing`
  - `begin_checkout`
  - `purchase_success`
- Meta Pixel 매핑 후보
  - `view_pricing` -> `ViewContent`
  - `begin_checkout` -> `InitiateCheckout`
  - `purchase_success` -> `Purchase`

## 변경 파일
- `src/app/layout.tsx`
- `src/lib/client-events.ts`
- `src/components/**/*` (`gtag` 직접 호출 제거/정리)
- `src/app/api/events/route.ts`
- `src/app/api/checkout/route.ts`
- `src/app/api/webhooks/lemonsqueezy/route.ts`
- `.env.local.example`
- `README.md`
- `context/context_*`

## 환경 변수
- `NEXT_PUBLIC_GTM_ID`
- `LEMONSQUEEZY_API_KEY`
- `LEMONSQUEEZY_STORE_ID`
- `LEMONSQUEEZY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_VARIANT_PRO`
- `NEXT_PUBLIC_APP_URL`
- 주의: GA4 Measurement ID와 Meta Pixel ID는 앱 env가 아니라 GTM container 안에서 관리한다.

## 테스트
- GTM/분석
  - GTM Preview에서 `signup_success`, `onboarding_complete`, `begin_checkout` 확인
  - GA4 DebugView에서 핵심 funnel 이벤트 확인
  - Meta Pixel Helper 또는 Test Events에서 `InitiateCheckout`, `Purchase` 확인
- 결제
  - test mode checkout 생성
  - 결제 성공 후 success redirect 확인
  - webhook 수신 후 Supabase profile/subscription 상태 반영 확인
  - checkout 취소 시 cancel redirect 확인
  - 기존 무료 유저 -> Pro 전환 시나리오 확인

## 완료 기준
- GTM에서 GA4/Meta가 동일 이벤트 taxonomy로 동작
- 앱 코드에서 직접 `gtag` 호출이 핵심 funnel 기준으로 제거 또는 헬퍼 뒤로 캡슐화
- LemonSqueezy webhook 처리 후 UI/profile 상태가 일관되게 갱신
- 배포환경에서 `pricing -> checkout -> webhook -> subscription reflected`가 1회 이상 검증됨

## 리스크
- GTM/Meta 이벤트 명 불일치로 분석 데이터가 분산될 수 있음
- 클라이언트 `begin_checkout`와 서버 `purchase_success`를 같은 진실로 오해할 수 있음
- LemonSqueezy live 승인/KYC 일정이 개발 완료보다 느릴 수 있음

## 결과
- 구현 완료
  - 앱 레벨 `gtag` 직접 호출 제거, `window.dataLayer` 공통 이벤트 허브로 전환
  - `NEXT_PUBLIC_GTM_ID` 기반 GTM 스니펫 도입
  - LemonSqueezy checkout success redirect를 `/billing/success`로 고정
  - `/billing/success`, `/billing/cancel` 페이지 추가
  - webhook 기준 Supabase `profiles` 반영 + `event_logs` billing 이벤트 적재 추가
- 남은 운영 작업
  - GTM container에서 GA4/Meta tag 및 trigger publish
  - LemonSqueezy test/live mode 실제 결제 smoke
  - 배포환경 기준 `begin_checkout -> purchase_success -> profile reflected` E2E 검증

## 연결 Context
- (작업 완료 후 기입)
