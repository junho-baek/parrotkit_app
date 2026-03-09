# ParrotKit GTM / UTM / Meta Pixel 운영 정리

## 문서 목적
이 문서는 현재 ParrotKit 앱에서 이벤트가 코드 기준으로 어떻게 발생하는지, GTM에서 어떤 방식으로 받아야 하는지, 그리고 앞으로 UTM / Meta Pixel을 어떤 원칙으로 운영해야 하는지를 한 번에 정리한 운영용 문서다.

작성 기준 시각은 2026-03-09 KST이며, 배포 URL은 `https://parrotkit-deploy.vercel.app/` 기준이다.

## 1. 현재 구조 한 줄 요약
- 앱은 개별 화면/행동에서 `logClientEvent()`를 호출한다.
- `logClientEvent()`는 같은 이벤트를 두 군데로 보낸다.
  - 브라우저 `window.dataLayer`
  - 서버 `/api/events` -> Supabase `event_logs`
- GTM은 `dataLayer`를 받아 GA4 / Meta Pixel로 fan-out 하는 구조다.
- 결제 성공은 Lemon Squeezy webhook으로 구독 상태를 반영하고, `/billing/success` 화면에서 최종 `purchase_success` 클라이언트 이벤트를 발생시키는 구조다.

## 2. 코드 기준 이벤트 파이프라인
### 2-1. GTM 베이스 설치
GTM 스니펫은 루트 레이아웃에서 `NEXT_PUBLIC_GTM_ID`가 있을 때만 삽입된다.

- 파일: `src/app/layout.tsx:22-77`
- 의미:
  - `NEXT_PUBLIC_GTM_ID`를 읽는다.
  - `gtm.js` 스크립트를 삽입한다.
  - `noscript iframe`도 같이 넣는다.

즉, 앱 코드에는 더 이상 하드코딩된 `gtag()` 직접 호출이 중심이 아니라, GTM 컨테이너가 먼저 올라오고 그 위에서 이벤트를 받아 처리하는 구조다.

### 2-2. 공통 이벤트 허브
모든 클라이언트 이벤트는 `logClientEvent()`로 정규화된다.

- 파일: `src/lib/client-events.ts:33-74`
- 핵심 동작:
  - `page_path` 자동 주입
  - `auth_user_id` 자동 주입
  - `window.dataLayer.push({ event, ...payload })`
  - 동시에 `/api/events`로 POST

즉, 하나의 이벤트 호출이 다음 두 역할을 같이 수행한다.
- 마케팅/분석용 클라이언트 추적
- 내부 운영 로그 적재

### 2-3. 서버 이벤트 로그 적재
클라이언트에서 보낸 이벤트는 `/api/events`를 통해 Supabase `event_logs`에 저장된다.

- 파일: `src/app/api/events/route.ts:6-37`
- 실제 insert: `src/lib/event-logs.ts:10-23`

이 경로는 GTM/GA4용이 아니라 내부 운영 추적과 검증용이다.

## 3. 현재 핵심 트리거가 코드에서 발생하는 위치
### 3-1. `view_pricing`
가격 페이지가 처음 열릴 때 발생한다.

- 파일: `src/app/pricing/page.tsx:9-16`
- payload:
  - `event_category: 'ecommerce'`
  - `page_title: 'Pricing Page'`
  - `plan_count`

GTM에서는 `event = view_pricing` 맞춤 이벤트 트리거로 받으면 된다.

### 3-2. `begin_checkout`
Pro 플랜 CTA 클릭 후, 로그인/토큰 확인을 통과하고 실제 checkout 생성 요청 직전에 발생한다.

- 파일: `src/components/auth/PricingCard.tsx:68-99`
- payload:
  - `plan_name`
  - `plan_price`
  - `currency: 'USD'`
  - `value`

중요한 점:
- 이 이벤트는 "결제를 시작하려고 시도했다"는 뜻이다.
- 결제 성공 확정 이벤트가 아니다.
- 이후 `/api/checkout`이 성공하면 Lemon checkout URL로 이동한다.

### 3-3. `purchase_success`
이 이벤트는 결제창에서 바로 찍히는 것이 아니라, 우리 앱의 `/billing/success` 페이지에서 구독 상태를 확인한 뒤 발생한다.

- 파일: `src/app/billing/success/page.tsx:66-80`
- 동작 순서:
  1. `/api/user/profile` 폴링
  2. `planType === 'pro'` 또는 `subscriptionStatus === 'active'` 확인
  3. `sessionStorage`에 pending checkout이 남아 있고 중복 기록이 아니면
  4. `logClientEvent('purchase_success', ...)` 호출

즉, `purchase_success`는 단순 redirect 기준이 아니라 **프로필에 Pro 반영이 확인된 뒤** 발생한다.

### 3-4. 서버 측 `purchase_success`
Lemon Squeezy webhook도 별도로 `purchase_success` 성격의 서버 로그를 남긴다.

- 파일: `src/app/api/webhooks/lemonsqueezy/route.ts:182-209`
- 파일: `src/app/api/webhooks/lemonsqueezy/route.ts:294-331`

여기서의 `purchase_success`는 브라우저 `dataLayer`가 아니라 Supabase `event_logs` 기준의 서버 이벤트다.

정리하면 `purchase_success`에는 두 층이 있다.
- 클라이언트 층: GTM/GA4/Meta 전송용
- 서버 층: webhook 반영 및 내부 운영 로그용

## 4. signup / login / onboarding / recipe 이벤트 코드 맵
### 4-1. `signup_start`, `signup_success`
- 파일: `src/components/auth/SignUpForm.tsx:31-39`, `77-92`
- 의미:
  - `signup_start`: 폼 제출 시작
  - `signup_success`: 실제 회원가입 성공 후 토큰 저장 완료 시점

### 4-2. `login`
- 파일: `src/components/auth/SignInForm.tsx:41-76`
- 의미:
  - 로그인 성공 후 토큰/유저 저장 완료 시점

### 4-3. `onboarding_complete`
- 파일: `src/components/auth/InterestsForm.tsx:54-103`
- 의미:
  - 관심사 저장 API 성공 후 `/paste`로 넘어가기 직전

참고:
- 실무적으로 `activation`보다 `onboarding_complete`가 훨씬 좋다.
- 이유는 이벤트 의미가 코드와 1:1로 대응되기 때문이다.

### 4-4. `reference_submitted`, `recipe_generated`, `recipe_saved`
- 파일: `src/components/auth/URLInputForm.tsx:24-36`, `58-62`, `83-89`
- 의미:
  - `reference_submitted`: 레퍼런스 URL 제출
  - `recipe_generated`: 분석 API 응답을 받아 scene 수를 확보한 시점
  - `recipe_saved`: DB 저장까지 성공한 시점

## 5. 지금 GTM에서 만든 트리거가 코드와 연결되는 방식
현재 사용자가 GTM에서 만든 맞춤 이벤트 트리거는 이 코드 이벤트명을 그대로 사용한다.

- `view_pricing` <- `src/app/pricing/page.tsx`
- `begin_checkout` <- `src/components/auth/PricingCard.tsx`
- `purchase_success` <- `src/app/billing/success/page.tsx`

즉 GTM에서 맞춤 이벤트 이름을 정확히 다음처럼 써야 한다.
- `view_pricing`
- `begin_checkout`
- `purchase_success`

언더스코어까지 포함해 정확히 일치해야 한다.

## 6. 이번 테스트에서 확인된 사실
### 확인된 것
- GTM base container는 배포환경에서 로드된다.
- `view_pricing`는 GTM Preview에서 확인됐다.
- `begin_checkout`는 GTM Preview에서 확인됐다.
- Lemon Squeezy test checkout은 최종 성공했다.
- 결제 후 `/my`에서 Pro Plan 반영이 확인됐다.

### 주의할 점
Tag Assistant가 외부 결제 도메인으로 이동하면서 끊기는 것은 정상이다.

이유:
- Preview는 `parrotkit-deploy.vercel.app` 탭에 붙는다.
- 결제 시 `parrotkit-app.lemonsqueezy.com`으로 이동한다.
- 이 페이지는 우리 GTM 컨테이너가 설치된 페이지가 아니므로 연결이 끊긴다.

즉, 외부 결제창 내부를 GTM Preview로 보려 하지 말고 우리 도메인 기준으로 이렇게 봐야 한다.
- checkout 진입 전: `begin_checkout`
- 결제 완료 후 `/billing/success` 복귀: `purchase_success`

## 7. 현재 상태에서 아쉬운 점
### 7-1. UTM 저장 로직이 아직 없다
현재 코드베이스에는 `utm_source`, `utm_medium`, `utm_campaign` 등을 읽어서 저장하는 로직이 없다.

즉 지금은:
- GTM/GA4 이벤트는 받을 수 있지만
- 어떤 유입 캠페인에서 온 사용자인지 앱 내부 DB 기준으로 계속 들고 가는 구조는 아직 없다.

### 7-2. Meta Pixel은 앱 코드가 아니라 GTM에서 연결해야 한다
현재 코드에 `fbq()` 또는 Meta Pixel base code는 없다.
이 방향은 맞다. Meta는 앱 코드에 직접 넣지 말고 GTM에서 관리하는 편이 운영상 훨씬 낫다.

### 7-3. `purchase_success` 검증은 DebugView 보조 확인이 필요하다
외부 checkout 도메인으로 나갔다 돌아오는 구조 때문에 GTM Preview만으로는 놓칠 수 있다.
따라서 `purchase_success`는 다음 두 경로로 같이 확인하는 것이 좋다.
- GTM Preview 재연결 후 success 페이지 재방문
- GA4 DebugView 확인

## 8. 앞으로의 GTM 운영 전략
### 원칙
- 앱 코드는 `dataLayer`만 책임진다.
- GA4 / Meta Pixel fan-out은 GTM이 책임진다.
- 이벤트명은 코드와 동일하게 유지한다.
- GTM에서 이벤트명을 바꾸지 않는다.

### 추천 구조
- Base tag
  - `GA4 - Google tag` -> `All Pages`
  - `Meta Pixel - Base` -> `All Pages`
- GA4 이벤트 태그
  - `signup_success`
  - `login`
  - `onboarding_complete`
  - `reference_submitted`
  - `recipe_generated`
  - `recipe_saved`
  - `view_pricing`
  - `begin_checkout`
  - `purchase_success`
- Meta 표준 이벤트 매핑
  - `view_pricing` -> `ViewContent`
  - `begin_checkout` -> `InitiateCheckout`
  - `purchase_success` -> `Purchase`

### 운영 규칙
- 새 이벤트를 추가할 때는 먼저 코드 이벤트명을 확정한다.
- GTM에서는 같은 문자열로 trigger를 만든다.
- 태그 이름은 사람이 읽기 쉽게 붙이고, 이벤트 이름은 코드와 같게 둔다.

예시:
- 태그 이름: `GA4 - begin_checkout`
- GTM trigger 이름: `CE - begin_checkout`
- 실제 event 이름: `begin_checkout`

## 9. 앞으로의 UTM 전략
### 현재 상태
- 현재 앱은 UTM을 저장하지 않는다.
- 유입 채널 attribution이 GA4 콘솔에만 남고 앱 내부 user / profile / event_logs와 직접 연결되지 않는다.

### 권장안
최소 MVP 기준으로는 아래 3단계면 충분하다.

#### 1단계. 최초 유입 시 UTM 캡처
랜딩 시 아래 파라미터를 읽는다.
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid`
- `fbclid`

이 값은 다음 두 곳 중 하나에 저장한다.
- `localStorage` first-touch
- `sessionStorage` current-session

#### 2단계. 주요 이벤트 payload에 UTM 주입
`logClientEvent()`에서 추후 아래 필드를 자동 합치는 방향이 가장 깔끔하다.
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `landing_page`
- `referrer`

그러면 GTM/GA4에도 들어가고 `/api/events`를 통해 `event_logs`에도 같이 남는다.

#### 3단계. 회원가입/결제 완료 시 프로필 레벨로 승격
아래 시점에 first-touch attribution을 profile 또는 별도 attribution 테이블로 저장한다.
- `signup_success`
- `purchase_success`

이렇게 해야 나중에 "어떤 캠페인에서 가입했고 어떤 캠페인이 결제로 이어졌는지"를 제품 DB 기준으로도 볼 수 있다.

### UTM 운영 원칙
- first-touch와 latest-touch를 분리한다.
- 내부 링크에는 UTM을 새로 덮어쓰지 않는다.
- paid 채널만이 아니라 influencer, creator, affiliate 링크도 동일 규칙으로 태깅한다.

추천 네이밍 예시:
- `utm_source=instagram`
- `utm_medium=creator`
- `utm_campaign=202603_launch`
- `utm_content=creator_jane_reel_01`

## 10. 앞으로의 Meta Pixel 전략
### 원칙
- Meta Pixel ID는 앱 env에 두지 않는다.
- GTM container 안에서만 관리한다.
- 앱은 `dataLayer` 이벤트만 보낸다.

### 최소 태그 구성
#### 1. Base Pixel
- Custom HTML 또는 Meta Pixel 템플릿 사용
- `All Pages`

#### 2. 이벤트 태그
- `ViewContent`
  - trigger: `view_pricing`
- `InitiateCheckout`
  - trigger: `begin_checkout`
- `Purchase`
  - trigger: `purchase_success`

### payload 권장안
Meta Pixel 태그에 다음 값을 넘기면 좋다.
- `value`
- `currency`
- `content_name`
- 가능하면 `event_id`도 추후 추가 고려

현재 코드에서 이미 `begin_checkout`, `purchase_success`는 `value`와 `currency`를 가지고 있으므로 GTM 매핑이 가능하다.

## 11. 3/13 전까지 닫아야 하는 최소 체크리스트
### GA4
- `signup_success`
- `login`
- `onboarding_complete`
- `recipe_generated`
- `recipe_saved`
- `view_pricing`
- `begin_checkout`
- `purchase_success`

### Meta Pixel
- `ViewContent`
- `InitiateCheckout`
- `Purchase`

### 결제
- test checkout 성공
- webhook 후 profile에 Pro 반영
- `/billing/success`에서 `purchase_success` 확인

### 운영
- GTM publish
- GA4 DebugView 확인
- Meta Test Events 확인
- 배포환경 재검증

## 12. 결론
현재 ParrotKit의 추적 구조는 방향이 맞다.
- 앱은 `dataLayer`와 내부 `event_logs`를 동시에 적재한다.
- GTM은 이벤트 fan-out 계층으로 사용하기 적합하다.
- Lemon Squeezy 결제도 test mode 기준으로 성공했고 Pro 반영까지 확인됐다.

지금 남은 핵심은 세 가지다.
1. `purchase_success`를 GA4 DebugView와 GTM Preview 재연결 기준으로 최종 확인
2. Meta Pixel base + 3개 핵심 이벤트 publish
3. UTM first-touch 저장 로직을 추가해 앱 내부 attribution을 확보

이 세 가지만 닫으면 3/13 기준 MVP 운영 추적 체계는 충분히 실무 가능한 수준에 도달한다.
