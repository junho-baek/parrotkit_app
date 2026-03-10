# ParrotKit 이벤트 운영 모델

## 문서 목적
이 문서는 ParrotKit의 현재 이벤트 추적 구조를 "운영 모델" 관점에서 설명한다.  
단순히 GTM을 붙이는 방법이 아니라, 어떤 원리로 분석할 것인지, 실제 구현은 어떻게 되어 있는지, 개발자와 마케터가 어디까지를 각각 책임져야 하는지, 그리고 현재 표준 이벤트 설계가 어느 정도 수준인지까지 한 번에 정리하는 문서다.

작성 기준 시점은 2026-03-11 KST이고, 배포 검증 기준 URL은 `https://parrotkit-deploy.vercel.app/`이다.

## 1. 결론 먼저
현재 ParrotKit의 이벤트 구조는 방향은 맞다.  
특히 아래 세 가지는 이미 좋은 기반이다.

- 앱 코드가 직접 `gtag()`를 뿌리지 않고 `dataLayer` 중심 구조를 가진다.
- 클라이언트 분석 이벤트와 서버 운영 로그를 동시에 남긴다.
- 결제 성공을 단순 redirect가 아니라 "실제 Pro 반영 확인 후" 처리한다.

하지만 아직 "운영 가능한 표준 이벤트 계약"까지 끝난 상태는 아니다.  
현재 수준은 **작동하는 이벤트 모음**에 가깝고, 다음 단계에서 **정의된 이벤트 계약**으로 올려야 한다.

평가를 숫자로 정리하면 이렇다.

- 이벤트 이름 설계: `7/10`
- 이벤트 파이프라인 구조: `7/10`
- payload 표준화 수준: `4/10`
- 마케팅 attribution 준비도: `4/10`
- 운영 문서화/역할 분리 준비도: `6/10`

즉, 지금 당장 MVP 운영 추적은 가능하다.  
다만 3/13 이후에도 계속 쓸 시스템으로 만들려면 payload 계약, UTM 저장, 실패 이벤트, 역할 분리 규칙을 더 분명히 해야 한다.

## 2. 어떤 원리로 분석할 것인가
ParrotKit는 단순 페이지뷰 분석이 아니라 **퍼널 분석**으로 봐야 한다.

핵심 퍼널은 다음 순서다.

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
11. Pro 반영 후 재사용

이 퍼널을 분석할 때 원리는 네 가지다.

### 2-1. 제품 행동과 마케팅 이벤트를 분리하지 않는다
ParrotKit는 마케팅 유입이 바로 제품 사용과 결제까지 이어지는 구조다.  
따라서 GA4 이벤트는 랜딩 전환만 보지 않고, 제품 핵심 행동까지 연결해서 봐야 한다.

예시:
- `signup_success`만 보면 "가입"까지만 보인다.
- `recipe_generated`, `recipe_saved`까지 이어서 봐야 "이 유저가 실제 가치를 경험했는지"가 보인다.
- `begin_checkout`, `purchase_success`까지 이어서 봐야 "사용이 결제로 이어졌는지"가 보인다.

### 2-2. 클라이언트 추적과 서버 운영 로그를 같이 본다
GA4 / Meta는 마케팅과 퍼널 분석용이다.  
하지만 운영 디버깅과 정확한 결제 상태 반영은 서버 로그 없이는 불안정하다.

그래서 ParrotKit는 두 층을 같이 가진다.

- 클라이언트 층
  - `dataLayer`
  - GTM
  - GA4
  - Meta Pixel
- 서버 층
  - `/api/events`
  - Supabase `event_logs`
  - Lemon webhook 처리 로그

이 구조는 맞다.  
마케팅 도구가 틀리거나 늦어도, 내부 `event_logs`로 실제 흐름을 다시 복구할 수 있기 때문이다.

### 2-3. 결제 성공은 redirect가 아니라 entitlement 기준으로 본다
ParrotKit의 결제 분석에서 가장 중요한 원칙이다.

`begin_checkout`는 결제 시작 시도일 뿐이다.  
`purchase_success`는 외부 결제창을 열었다는 뜻이 아니라, **우리 앱 기준으로 Pro 권한 반영이 확인되었다는 뜻**이어야 한다.

이 원칙이 맞는 이유:
- 외부 결제창에서 성공처럼 보여도 webhook 반영이 실패할 수 있다.
- redirect만으로 성공 처리하면 실제 구독 상태와 분석 지표가 어긋난다.
- 제품 기준으로는 "결제 완료"가 아니라 "기능 사용 가능 상태"가 진실값이다.

### 2-4. 유입 attribution은 나중이 아니라 초기에 심어야 한다
현재 ParrotKit에는 UTM 저장 로직이 없다.  
이 말은 지금은 GA4에서만 유입을 보고 있고, 제품 DB 기준으로는 "어떤 캠페인에서 온 유저인지"를 안정적으로 붙잡지 못하고 있다는 뜻이다.

이건 3/13 MVP 운영에 바로 치명타는 아니지만, 이후 광고나 크리에이터 캠페인을 돌리면 빠르게 한계가 온다.

따라서 운영 원리는 이렇게 잡아야 한다.

- GA4는 빠른 마케팅 가시성
- Supabase는 제품/결제 운영 진실값
- UTM first-touch / latest-touch는 제품 DB에 저장

## 3. 현재 실제 구현은 어떻게 되어 있는가

### 3-1. GTM 베이스 설치
GTM 스니펫은 루트 레이아웃에서 `NEXT_PUBLIC_GTM_ID`가 있을 때만 로드된다.

- 구현 위치: `src/app/layout.tsx`

즉 앱은 GTM 컨테이너를 먼저 올리고, 이벤트는 그 위에서 처리하는 구조다.

### 3-2. 공통 이벤트 허브
클라이언트 이벤트는 `logClientEvent()`를 통해 처리된다.

- 구현 위치: `src/lib/client-events.ts:33-74`

이 함수가 하는 일은 두 가지다.

1. `window.dataLayer.push({ event, ...payload })`
2. `/api/events`로 같은 이벤트를 서버에 POST

그리고 공통 payload로 자동 주입되는 값은 현재 두 개다.

- `page_path`
- `auth_user_id`

이건 좋은 출발점이다.  
다만 아직 `utm_source`, `utm_medium`, `utm_campaign`, `gclid`, `fbclid` 같은 attribution 필드는 없다.

### 3-3. 서버 이벤트 로그 적재
클라이언트에서 보낸 이벤트는 `/api/events`를 거쳐 Supabase `event_logs`에 저장된다.

- API: `src/app/api/events/route.ts:6-37`
- insert 유틸: `src/lib/event-logs.ts:12-28`

즉 분석 구조는 이렇게 흐른다.

```text
브라우저 행동
  -> logClientEvent()
    -> dataLayer
      -> GTM
        -> GA4 / Meta
    -> /api/events
      -> Supabase event_logs
```

### 3-4. 가입 / 로그인 / 온보딩
현재 핵심 유저 획득 이벤트는 아래 위치에서 발생한다.

- `signup_start`
  - `src/components/auth/SignUpForm.tsx:31-39`
- `signup_success`
  - `src/components/auth/SignUpForm.tsx:77-90`
- `login`
  - `src/components/auth/SignInForm.tsx:57-70`
- `onboarding_complete`
  - `src/components/auth/InterestsForm.tsx:97-101`

여기서 좋은 점은 이름이 비교적 직관적이라는 점이다.  
특히 `activation`처럼 모호한 이름 대신 `onboarding_complete`를 쓰는 편이 훨씬 낫다.

### 3-5. Recipe 퍼널
Recipe 관련 이벤트는 `URLInputForm`에 모여 있다.

- `reference_submitted`
  - `src/components/auth/URLInputForm.tsx:32-36`
- `recipe_generated`
  - `src/components/auth/URLInputForm.tsx:58-62`
- `recipe_saved`
  - `src/components/auth/URLInputForm.tsx:83-88`

이 퍼널은 현재 구조상 가장 중요하다.  
가입만 하고 떠나는 사용자가 아니라, 실제로 레퍼런스를 넣고 결과를 얻고 저장하는 사용자를 제품 가치 경험 유저로 봐야 하기 때문이다.

### 3-6. Pricing / Checkout
결제 전 퍼널은 다음 두 이벤트다.

- `view_pricing`
  - `src/app/pricing/page.tsx:10-15`
- `begin_checkout`
  - `src/components/auth/PricingCard.tsx:83-89`

`begin_checkout`는 실제 `/api/checkout` 요청 직전에 발생한다.

- checkout 생성 요청: `src/components/auth/PricingCard.tsx:91-111`

즉 이 이벤트는 "결제를 시작하려고 시도함"을 뜻한다.

### 3-7. Purchase Success
클라이언트 쪽 `purchase_success`는 `/billing/success`에서 찍힌다.

- 구현 위치: `src/app/billing/success/page.tsx:66-80`

동작 순서는 이렇다.

1. success 페이지 진입
2. `/api/user/profile` 폴링
3. `planType === 'pro'` 또는 `subscriptionStatus === 'active'` 확인
4. pending checkout 상태가 있으면
5. `purchase_success` 이벤트 발생

이 구조는 맞다.  
결제 success redirect만으로 성공 처리하지 않고, 실제 Pro 반영을 확인한 뒤 찍기 때문이다.

### 3-8. Lemon webhook 서버 이벤트
서버 측에서도 결제 관련 이벤트를 따로 기록한다.

- 구현 위치: `src/app/api/webhooks/lemonsqueezy/route.ts:182-360`

현재 처리하는 주요 webhook 이벤트:
- `subscription_created`
- `subscription_updated`
- `subscription_cancelled`
- `subscription_payment_success`
- `subscription_expired`

그리고 이 과정에서 내부 서버 이벤트 로그도 남긴다.

예:
- `purchase_success`
- `subscription_updated`
- `subscription_cancelled`

즉 `purchase_success`는 현재 두 층에 존재한다.

- 클라이언트 `purchase_success`
  - GA4 / Meta로 보낼 수 있는 마케팅 이벤트
- 서버 `purchase_success`
  - webhook 기준 운영 로그

이건 괜찮다.  
다만 문서와 리포트에서는 두 층을 구분해서 해석해야 한다.

## 4. 현재 표준 이벤트 설계는 잘 되어 있는가
정답은 이렇다.

**이벤트 이름은 비교적 괜찮다.  
하지만 payload 계약은 아직 약하다.**

### 4-1. 좋은 점
- 핵심 퍼널 이름이 읽기 쉽다.
- 제품 행동과 결제 행동이 한 흐름으로 연결된다.
- 공통 허브가 있어서 GTM fan-out 구조로 확장하기 쉽다.
- 클라이언트 로그와 서버 로그가 이중화되어 있다.

### 4-2. 아쉬운 점

#### 1. 타입 계약이 없다
`logClientEvent(eventName: string, payload: Record<...>)` 구조라서 오타나 payload 누락을 타입으로 막지 못한다.

결과:
- 개발자가 이벤트명을 잘못 적어도 빌드에서 안 잡힌다.
- payload 필드가 이벤트마다 흔들려도 통과된다.

#### 2. payload 구조가 제각각이다
예를 들면:

- `signup_start`는 `event_category`, `event_label`
- `signup_success`는 `method`
- `recipe_generated`는 `source_url`, `scenes_count`
- `recipe_saved`는 `recipe_id`
- `begin_checkout`는 `plan_name`, `value`, `currency`

이 상태에서도 작동은 한다.  
하지만 운영 문서와 GA4 리포트를 깔끔하게 만들기 어렵다.

#### 3. raw URL을 그대로 보내고 있다
`reference_submitted`, `recipe_generated`에서 `source_url`을 그대로 보내고 있다.

이건 두 가지 이유로 좋지 않다.

- GA4 차원 cardinality가 커질 수 있다.
- 개인정보/민감 URL 관리 이슈가 생길 수 있다.

권장 방식은:
- `platform`
- `video_id`
- `recipe_id`

중심으로 바꾸는 것이다.

#### 4. UTM / referrer / ad click id가 없다
현재 공통 payload에는 마케팅 attribution 필드가 없다.

즉 지금 구조로는:
- 어떤 광고나 크리에이터 링크에서 들어왔는지
- 가입/레시피/결제로 실제 연결되었는지

를 제품 DB 기준으로 강하게 묶지 못한다.

#### 5. 실패 이벤트가 거의 없다
지금은 성공 이벤트 중심이다.

하지만 운영 관점에서 꼭 필요한 건 실패와 이탈이다.

예:
- `signup_failed`
- `login_failed`
- `recipe_generate_failed`
- `checkout_failed`
- `billing_sync_pending`

이게 있어야 퍼널 이탈을 진짜로 분석할 수 있다.

## 5. 개발자와 마케터는 어떻게 일을 나눠야 하는가
이 부분이 가장 중요하다.  
GTM을 쓴다고 해서 마케터가 이벤트 체계를 마음대로 바꾸면 안 된다.

운영 원칙은 이렇게 잡는 것이 맞다.

### 5-1. 개발자가 책임질 것
개발자는 **이벤트 계약과 진실값**을 책임진다.

구체적으로:
- 이벤트 이름 정의
- 이벤트 발생 시점 정의
- 공통 payload 구조 정의
- 제품 상태와 결제 상태의 진실값 정의
- `dataLayer`로 밀 payload 설계
- `/api/events`와 `event_logs` 적재
- UTM 저장 로직
- webhook / billing success 로직

즉 개발자는 "무슨 이벤트가 어떤 의미를 가지는지"를 결정해야 한다.

### 5-2. 마케터가 책임질 것
마케터는 **fan-out과 콘솔 운영**을 책임진다.

구체적으로:
- GTM에서 태그 생성
- GTM trigger 연결
- GA4 이벤트 등록 / 확인
- Meta Pixel 매핑
- 광고 채널별 UTM naming rule 운영
- DebugView / Test Events 확인
- 캠페인 해석 및 리포트 작성

즉 마케터는 "정의된 이벤트를 어디로 어떻게 보낼지"를 책임져야 한다.

### 5-3. 서로 넘지 말아야 할 선

개발자가 넘지 말아야 할 선:
- 앱 코드에 `fbq`, `gtag`를 직접 여기저기 박아 넣는 것
- 이벤트 의미를 문서 없이 ad-hoc으로 늘리는 것

마케터가 넘지 말아야 할 선:
- GTM에서 이벤트 이름을 코드와 다르게 바꾸는 것
- 제품 진실값을 콘솔 기준으로 재정의하는 것
- payload를 문서 없이 임의로 해석하는 것

### 5-4. 가장 건강한 운영 모델

```text
개발자
  -> dataLayer 이벤트 계약 정의
  -> 서버 로그 / webhook / 프로필 반영 책임

마케터
  -> GTM에서 GA4 / Meta / Ads 연결
  -> 캠페인 UTM 규칙 운영
  -> 콘솔 검증과 성과 해석 책임
```

이 분리가 ParrotKit에 가장 적합하다.

## 6. 권장 표준 이벤트 v1
현재 구조를 크게 뒤엎을 필요는 없다.  
다만 아래처럼 최소 공통 계약을 두는 것이 좋다.

### 공통 필드
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

모든 이벤트가 이 필드를 다 가져야 한다는 뜻은 아니다.  
다만 공통적으로 들어갈 수 있는 기본 필드를 허브에서 자동 주입하는 구조가 좋다.

### 핵심 이벤트 세트

#### User acquisition
- `signup_start`
- `signup_success`
- `login`
- `onboarding_complete`

#### Product activation
- `reference_submitted`
- `recipe_generated`
- `recipe_saved`

#### Monetization
- `view_pricing`
- `begin_checkout`
- `purchase_success`

#### Failure / recovery
- `signup_failed`
- `login_failed`
- `recipe_generate_failed`
- `checkout_failed`
- `billing_sync_pending`

## 7. GA4 / GTM / Meta 운영 전략

### 7-1. GTM
원칙:
- 앱은 `dataLayer`만 책임진다.
- GTM은 fan-out 계층이다.
- GTM에서 이벤트 이름을 바꾸지 않는다.

현재 Preview 기준으로 연결된 핵심 이벤트:
- `view_pricing`
- `begin_checkout`
- `purchase_success`

### 7-2. GA4
GA4는 퍼널 분석 기준으로 본다.

최소 확인 세트:
- `signup_success`
- `login`
- `onboarding_complete`
- `recipe_generated`
- `recipe_saved`
- `view_pricing`
- `begin_checkout`
- `purchase_success`

### 7-3. Meta Pixel
Meta는 앱 코드에 직접 넣지 않고 GTM에서 관리하는 것이 맞다.

권장 매핑:
- `view_pricing` -> `ViewContent`
- `begin_checkout` -> `InitiateCheckout`
- `purchase_success` -> `Purchase`

### 7-4. UTM
ParrotKit는 지금 UTM 저장 로직이 없으므로, 다음 순서로 보강하는 것이 가장 현실적이다.

1. 최초 유입 시 UTM 캡처
2. `logClientEvent()` 공통 payload에 자동 주입
3. `signup_success`, `purchase_success` 시점에 프로필 레벨로 승격 저장

## 8. 지금 상태에서의 해석
현재 ParrotKit는 다음까지는 도달했다.

- 배포환경에서 GTM base가 로드된다.
- Pricing 진입과 checkout 시작 이벤트는 Preview 기준으로 확인됐다.
- Lemon Squeezy test checkout은 수동 브라우저 기준 성공했다.
- `/my`에서 Pro Plan 반영이 확인됐다.

즉 결제와 구독 반영 자체는 실제로 이어진 상태다.

하지만 아직 남은 과제는 분명하다.

- GTM live publish 상태 최종 확인
- GA4 DebugView 기준 최소 이벤트 세트 최종 확인
- Meta Pixel 연결 및 테스트
- UTM first-touch 저장 구현
- 실패 이벤트 추가

## 9. 3/13 전까지 추천 액션

### 가장 먼저
1. GTM publish
2. GA4 DebugView로 최소 이벤트 세트 확인
3. Meta Pixel base + 3개 핵심 이벤트 연결

### 그다음
4. UTM first-touch / latest-touch 저장 추가
5. 실패 이벤트 추가
6. 이벤트 타입 계약 정리

### 3/13 기준 MVP 운영선
이 선까지만 닫혀도 MVP 운영 추적은 충분히 가능하다.

- 가입 / 로그인 / 온보딩 추적
- Recipe 생성 / 저장 추적
- Pricing / Checkout / Purchase 추적
- GA4 DebugView 확인
- Meta Pixel 3개 핵심 이벤트 확인
- 결제 성공 후 Pro 반영 확인

## 10. 최종 판단
ParrotKit의 현재 이벤트 구조는 **방향은 맞고, 기반도 괜찮다.**  
특히 GTM 중심 구조, 서버 운영 로그 병행, entitlement 기준 결제 성공 처리라는 세 가지는 좋은 설계다.

다만 아직 "표준 이벤트 설계가 잘 끝났다"라고 말하기에는 이르다.  
현재는 **잘 작동하는 1차 버전**이고, 운영 가능한 체계로 가려면 아래 네 가지가 더 필요하다.

1. 이벤트 타입 계약
2. 공통 payload 정리
3. UTM attribution 저장
4. 실패 이벤트 추가

이 네 가지를 정리하면, 그다음부터는 개발자와 마케터가 각자 역할을 분리해서 안정적으로 운영할 수 있다.
