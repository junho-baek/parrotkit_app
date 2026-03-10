# ParrotKit 이벤트 운영 모델 요약

## 한 줄 결론
ParrotKit의 현재 이벤트 구조는 방향은 맞다.  
`dataLayer -> GTM -> GA4/Meta`와 `/api/events -> Supabase event_logs`를 병행하는 구조는 실무적으로 괜찮다.  
다만 아직 "표준 이벤트 계약"까지 끝난 상태는 아니고, payload 표준화와 UTM 저장이 부족하다.

## 현재 평가
현재 평가는 이렇다. 이벤트 이름 설계 `7/10`, 이벤트 파이프라인 구조 `7/10`, payload 표준화 수준 `4/10`, 마케팅 attribution 준비도 `4/10`.  
즉 MVP 운영 추적은 가능하지만, 장기 운영을 위해서는 이벤트 계약과 attribution을 보강해야 한다.

## 어떤 원리로 분석할 것인가
ParrotKit는 페이지뷰 분석보다 퍼널 분석이 중요하다.  
핵심 퍼널은 아래 순서다.

1. 가입 시작
2. 가입 성공
3. 로그인
4. 온보딩 완료
5. 레퍼런스 제출
6. Recipe 생성
7. Recipe 저장
8. Pricing 진입
9. Checkout 시작
10. 결제 성공

이 퍼널을 볼 때 원칙은 네 가지다.

- 제품 행동과 마케팅 이벤트를 분리하지 않는다.
- 클라이언트 추적과 서버 운영 로그를 같이 본다.
- 결제 성공은 redirect가 아니라 entitlement 반영 기준으로 본다.
- 유입 attribution은 초기에 심어야 한다.

## 현재 구현 구조
현재 구현은 아래처럼 동작한다.

- 브라우저 행동 -> `logClientEvent()` -> `dataLayer` -> GTM -> GA4 / Meta
- 브라우저 행동 -> `logClientEvent()` -> `/api/events` -> Supabase `event_logs`
- 결제 성공 -> Lemon webhook -> profile / `event_logs` 갱신
- 결제 성공 후 복귀 -> `/billing/success` -> `purchase_success` 클라이언트 이벤트

핵심 구현 위치:
- 공통 이벤트 허브: `src/lib/client-events.ts`
- 서버 이벤트 수집: `src/app/api/events/route.ts`
- 이벤트 로그 저장: `src/lib/event-logs.ts`
- Pricing 진입: `src/app/pricing/page.tsx`
- Checkout 시작: `src/components/auth/PricingCard.tsx`
- 구매 성공 확인: `src/app/billing/success/page.tsx`
- Lemon webhook: `src/app/api/webhooks/lemonsqueezy/route.ts`

## 지금 좋은 점
앱 코드가 직접 `gtag()` 중심이 아니라 `dataLayer` 중심이고, GTM fan-out 구조라 GA4 / Meta / Ads 확장이 쉽다.  
또한 서버 `event_logs`가 있어 운영 디버깅에 강하고, 결제 성공도 단순 redirect가 아니라 Pro 반영 후 처리한다.

## 지금 부족한 점
이벤트 타입 계약이 없고, payload 구조가 이벤트마다 제각각이다.  
또한 `utm_source`, `utm_medium`, `utm_campaign`, `gclid`, `fbclid` 저장이 없고, `reference_submitted`, `recipe_generated`에서 raw URL을 그대로 보내고 있으며, 실패 이벤트도 부족하다.

## 개발자와 마케터 역할 분리
개발자와 마케터는 책임이 분리되어야 한다.

### 개발자 책임
- 이벤트 이름 정의
- 이벤트 발생 시점 정의
- 공통 payload 구조 정의
- `dataLayer` payload 설계
- 서버 로그 적재
- webhook / billing success 진실값 관리
- UTM 저장 로직 구현

### 마케터 책임
- GTM 태그/트리거 운영
- GA4 이벤트 검증
- Meta Pixel 매핑
- 캠페인 UTM naming rule 운영
- DebugView / Test Events 확인
- 성과 리포트 작성

운영 원칙은 이렇다.

- 앱은 이벤트 계약을 책임진다.
- GTM은 fan-out과 배포를 책임진다.
- GTM에서 이벤트 이름을 코드와 다르게 바꾸지 않는다.

## 권장 표준 이벤트 v1
최소 핵심 세트는 아래다.

### User acquisition
`signup_start`, `signup_success`, `login`, `onboarding_complete`

### Product activation
`reference_submitted`, `recipe_generated`, `recipe_saved`

### Monetization
`view_pricing`, `begin_checkout`, `purchase_success`

### Failure / recovery
`signup_failed`, `login_failed`, `recipe_generate_failed`, `checkout_failed`, `billing_sync_pending`

권장 공통 필드:
- `event`
- `page_path`
- `auth_user_id`
- `recipe_id`
- `plan_name`
- `value`
- `currency`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `landing_page`
- `referrer`

## GTM / GA4 / Meta 운영 전략
운영 방향은 명확하다.

- 앱 코드는 `dataLayer`만 책임진다.
- GTM은 GA4 / Meta로 fan-out 한다.
- GA4는 퍼널 분석 기준으로 본다.
- Meta Pixel은 GTM에서만 관리한다.

Meta 매핑 최소 세트:
- `view_pricing` -> `ViewContent`
- `begin_checkout` -> `InitiateCheckout`
- `purchase_success` -> `Purchase`

## 3/13 전까지 닫아야 할 것
1. GTM publish
2. GA4 DebugView로 핵심 이벤트 세트 확인
3. Meta Pixel base + 핵심 3개 이벤트 연결
4. UTM first-touch / latest-touch 저장 설계
5. 실패 이벤트 최소 세트 정의

## 최종 판단
ParrotKit의 현재 이벤트 구조는 "잘못된 구조"는 아니다.  
오히려 MVP 단계에서는 꽤 괜찮은 출발점이다.  
다만 아직 운영 계약이 완성된 것은 아니므로, 다음 단계에서는 이벤트 타입 계약, 공통 payload, UTM 저장, 실패 이벤트를 보강해야 한다.

상세 설명과 코드 경로는 첨부한 전체 문서를 기준으로 본다.
