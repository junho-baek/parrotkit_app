# 20260311 ParrotKit 배포 릴리즈 게이트 E2E 보고서

## 요약
- 테스트 시간: 2026-03-11 04:10-04:20 KST
- 대상 URL: `https://parrotkit-deploy.vercel.app/`
- 기준 브랜치 / 커밋: `dev` / `4fc0058`
- 목적: 배포환경 기준 핵심 플로우와 결제 직전/직후 상태, GTM/GA4 진행 상태, 3월 13일 체크리스트 달성도를 한 번에 점검

## 테스트 범위
- 재사용 테스트 계정 로그인
- 레퍼런스 입력
- Recipe 생성
- 저장 후 재접속/재열람
- Pricing 진입 및 checkout 시작
- Lemon checkout 외부 도메인 진입 확인
- GTM Preview 및 브라우저 네트워크 기준 이벤트 흔적 확인
- 3월 13일 MVP 체크리스트 달성도 산정

## 테스트 계정
- Email: `parrotkitcodextest@mailinator.com`
- Username: `parrotkitcodextest`

## E2E 결과
### 통과
- 로그인: 통과
- 레퍼런스 URL 제출: 통과
- `recipe_generated` 발생 경로: 통과
- Recipe DB 저장 및 `recipe_saved` 경로: 통과
- `Recipes` 탭에서 저장된 Recipe 재열람: 통과
- Pricing 페이지 진입: 통과
- `view_pricing` 이벤트 경로: 통과
- `begin_checkout` 이벤트 경로: 통과
- Lemon checkout URL 생성 및 외부 도메인 이동: 1회 통과

### 부분 통과
- 최종 결제 완료 자동화: 부분 통과
  - 앱 내부에서는 checkout 시작까지 재현됨
  - 외부 Lemon checkout은 Playwright 세션에서 정적 자산 `522`가 발생해 폼 렌더링이 깨짐
  - 같은 배포 빌드에서 사용자의 수동 브라우저 테스트로는 테스트 결제 성공과 Pro 반영이 이미 확인됨

### 실패/리스크
- Playwright 기준 외부 Lemon checkout 폼 렌더링 안정성: 실패
  - `https://assets.lemonsqueezy.com/.../ButtonToggle-*.css` 요청이 `522`를 반환
  - 자동화 브라우저에서는 checkout 화면이 blank로 보이거나 재시도 시 `/api/checkout`이 `500`으로 깨지는 케이스가 관측됨
- Home 대시보드 요약 카드 즉시 반영: 실패
  - Recipe 생성 직후 `/home`으로 돌아오면 Recipes 카드가 `0`으로 유지됨
  - 실제 저장 결과는 `/recipes` 화면에서 정상 확인됨

## 증거
### 1. Free Plan 상태
![Free plan before upgrade](/Volumes/T7/플젝/deundeunApp/Parrotkit/output/playwright/20260311_release_gate_e2e/free-plan-before-upgrade.png)

### 2. Recipe 생성 결과
![Recipe generated](/Volumes/T7/플젝/deundeunApp/Parrotkit/output/playwright/20260311_release_gate_e2e/recipe-generated.png)

### 3. Recipes 목록에서 재열람 가능
![Recipes list](/Volumes/T7/플젝/deundeunApp/Parrotkit/output/playwright/20260311_release_gate_e2e/recipes-list.png)

### 4. Pricing 페이지 렌더링
![Pricing page](/Volumes/T7/플젝/deundeunApp/Parrotkit/output/playwright/20260311_release_gate_e2e/pricing-page.png)

### 5. Lemon checkout blank 케이스
![Lemon checkout blank](/Volumes/T7/플젝/deundeunApp/Parrotkit/output/playwright/20260311_release_gate_e2e/lemonsqueezy-checkout.png)

### 6. 네트워크 로그
- 파일: `output/playwright/20260311_release_gate_e2e/network.txt`
- 확인 포인트:
  - `POST /api/analyze` -> `200`
  - `POST /api/recipes` -> `201`
  - `POST /api/events` 반복 적재 확인
  - `POST /api/checkout` -> `200` 1회 확인
  - 이후 Lemon 자산 `ButtonToggle-*.css` -> `522`
  - 재시도 시 `POST /api/checkout` -> `500`

## 코드 기준 이벤트 맵 확인
- GTM base 설치: `/src/app/layout.tsx`
- 공통 이벤트 허브(dataLayer + /api/events): `/src/lib/client-events.ts`
- `signup_success`: `/src/components/auth/SignUpForm.tsx`
- `login`: `/src/components/auth/SignInForm.tsx`
- `onboarding_complete`: `/src/components/auth/InterestsForm.tsx`
- `reference_submitted`: `/src/components/auth/URLInputForm.tsx`
- `recipe_generated`: `/src/components/auth/URLInputForm.tsx`
- `recipe_saved`: `/src/components/auth/URLInputForm.tsx`
- `view_pricing`: `/src/app/pricing/page.tsx`
- `begin_checkout`: `/src/components/auth/PricingCard.tsx`
- `purchase_success` 클라이언트 이벤트: `/src/app/billing/success/page.tsx`
- `purchase_success` 서버 로그(webhook): `/src/app/api/webhooks/lemonsqueezy/route.ts`

## GTM / GA4 / Meta Pixel 상태
### 현재 확인된 것
- GTM 컨테이너 로드: 확인
- `GA4 - Google tag` 생성: 확인
- GTM workspace 기준 `view_pricing`, `begin_checkout`, `purchase_success` 이벤트 태그 생성: 확인
- GTM Preview 기준 `view_pricing`, `begin_checkout` 발생: 확인

### 아직 남은 것
- GTM 컨테이너 publish 여부 최종 확인 필요
- GA4 DebugView에서 `signup_success`, `login`, `onboarding_complete`, `recipe_generated`, `recipe_saved`, `purchase_success`까지 확인 필요
- Meta Pixel base tag + `ViewContent`, `InitiateCheckout`, `Purchase` 매핑 및 publish 필요

### 현재 판정
- GTM/GA4는 `pricing funnel` 기준 최소 골격까지는 올라옴
- Meta Pixel은 아직 실사용 검증 단계 전
- UTM attribution은 앱 내부 저장 로직이 없어 아직 미구현 상태

## 3월 13일 체크리스트 달성도
| 항목 | 현재 판정 | 체감 진척도 | 근거 |
| --- | --- | ---: | --- |
| MVP v1 프로덕션 배포 (배포 링크 확보) | 달성 | 100% | `https://parrotkit-deploy.vercel.app/` 운영 링크 확보 |
| 핵심 플로우 완성: 가입/온보딩 → 레퍼런스 입력 → Recipe 생성 → 저장/재접속 | 거의 달성 | 85% | 이번 턴에서 레퍼런스 입력/생성/저장/재열람 재검증 완료. signup/onboarding은 코드 존재 + 기존 배포 QA 이력 있음. 다만 최신 배포 기준 전 구간 1회 회귀가 남음 |
| 모바일 UI/반응형 안정화 (촬영 현장 사용 기준) | 부분 달성 | 65% | 모바일 viewport에서 주요 화면은 사용 가능. 하지만 Home 요약 카드 stale, 외부 checkout 자동화 안정성 이슈가 남음 |
| GA4 이벤트 최소 세트 동작 확인 | 부분 달성 | 45% | 코드상 8개 이벤트 모두 존재. GTM workspace에서 실제 확인한 것은 `view_pricing`, `begin_checkout` 2개. 나머지는 DebugView/Preview 재검증 필요 |
| Meta Pixel 확인 세트 | 미달성 | 10% | 전략과 매핑은 정리됐지만 GTM publish 및 실측 증거 없음 |
| 릴리즈 게이트 QA: 랜덤 유저 5명 테스트(성공률 80%+) + 로그/스크린샷 저장 | 미달성 | 20% | 공유 계정 1개 기준 자동화 검증과 사용자의 수동 결제 확인은 있음. 5명 표본 테스트는 아직 미실행 |

## GA4 최소 세트 세부 판정
| 이벤트 | 코드 존재 | 이번 배포 검증 | 비고 |
| --- | --- | --- | --- |
| `signup_success` | 있음 | 미확인 | signup 회귀 1회 필요 |
| `login` | 있음 | 부분 확인 | 로그인 후 `/api/events` 적재는 보였지만 GTM Preview 재측정 미실시 |
| `onboarding_complete` | 있음 | 미확인 | interests 제출 회귀 필요 |
| `recipe_generated` | 있음 | 부분 확인 | `/api/analyze 200` 및 화면 결과 확인, GTM Preview 미연결 |
| `recipe_saved` | 있음 | 부분 확인 | `/api/recipes 201` 및 `/recipes` 재열람 확인, GTM Preview 미연결 |
| `view_pricing` | 있음 | 확인 | GTM Preview firing 확인 |
| `begin_checkout` | 있음 | 확인 | GTM Preview firing 확인 |
| `purchase_success` | 있음 | 미확인 | success 페이지 자동화 재현 불가. manual/browser 측 성공 근거는 있음 |

## Meta Pixel 확인 세트 판정
| Meta 이벤트 | 앱 원본 이벤트 | 상태 |
| --- | --- | --- |
| `ViewContent` | `view_pricing` | GTM에 추가 필요 |
| `InitiateCheckout` | `begin_checkout` | GTM에 추가 필요 |
| `Purchase` | `purchase_success` | GTM에 추가 필요 |

## 추가해야 할 태그 / 마케팅 모먼트 / 개발 모먼트
### 1. 태그
- UTM first-touch: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- ad click ids: `gclid`, `fbclid`, `ttclid`
- landing context: `landing_page`, `referrer_host`, `first_page_path`
- product usage: `recipe_viewed`, `script_assistant_opened`, `download_clicked`, `export_zip_success`, `capture_uploaded`
- subscription lifecycle: `subscription_payment_failed`, `subscription_cancelled`, `subscription_resumed`, `refund_requested`

### 2. 마케팅 모먼트
- 랜딩 -> signup_start -> signup_success 전환율
- pricing page 재방문 횟수
- `begin_checkout` 후 이탈률
- 결제 성공 후 첫 Recipe 생성까지의 activation 시간
- 구매 7일 후 재방문/재생성 여부

### 3. 개발 모먼트
- Home 요약 카드가 recipe 저장 직후 즉시 갱신되도록 상태 동기화
- UTM을 profile/event_logs에 함께 저장하는 first-touch/last-touch 설계
- `/billing/success`에서 `purchase_success`가 실제 fired 되었는지 DebugView 재검증
- GTM publish 후 Meta Pixel test events 검증
- 랜덤 유저 5명 릴리즈 게이트 QA 실행

## 3월 13일까지의 우선순위 제안
1. GTM 컨테이너 publish + GA4 DebugView로 8개 이벤트 중 최소 5개를 당일 확인
2. Meta Pixel base + 3개 표준 이벤트(ViewContent/InitiateCheckout/Purchase) 추가
3. signup -> onboarding -> recipe -> pricing -> checkout -> success 전체 회귀를 수동 브라우저 1회 완주
4. Home stale counter 버그 수정
5. 랜덤 유저 5명 QA 또는 최소 3명 빠른 표본 테스트로 릴리즈 게이트 근거 확보

## 최종 판정
- 배포 링크와 핵심 product flow의 중간 구간은 이미 실사용 가능한 수준이다.
- 결제는 운영 빌드 기준 수동 테스트 성공 근거가 있으나, 자동화 브라우저에서는 Lemon 자산 `522`로 인해 완전 자동 E2E가 아직 안정적이지 않다.
- 3월 13일 전까지 가장 중요한 남은 일은 `GA4/Meta publish`, `signup/onboarding 포함 전체 회귀 1회`, `릴리즈 게이트 표본 QA` 세 가지다.
