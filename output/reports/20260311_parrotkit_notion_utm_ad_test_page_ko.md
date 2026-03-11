# Parrotkit 광고 테스트 링크 (UTM)

## 목적
- 외부 링크에 붙는 UTM 파라미터가 앱에 정상 전달되고, GA4 및 내부 이벤트 로그에서 유입 출처를 구분할 수 있는지 빠르게 확인하기 위한 테스트 페이지.
- 이 페이지의 링크는 모두 `https://parrotkit-deploy.vercel.app/` 기준이다.

## 사용 원칙
- UTM은 외부에서 앱으로 들어오는 링크에만 붙인다.
- 앱 내부 이동 링크에는 UTM을 붙이지 않는다.
- first touch 테스트를 하려면 새 시크릿 창 또는 새 브라우저 프로필에서 링크를 여는 것이 좋다.

## 홈 진입 테스트 링크
- Notion 문서 CTA
  - https://parrotkit-deploy.vercel.app/?utm_source=notion&utm_medium=docs&utm_campaign=ad_test_page&utm_content=cta_primary
- 커뮤니티 게시글 유입
  - https://parrotkit-deploy.vercel.app/?utm_source=community&utm_medium=organic_post&utm_campaign=ad_test_page&utm_content=post_link
- 이메일 뉴스레터 유입
  - https://parrotkit-deploy.vercel.app/?utm_source=email&utm_medium=newsletter&utm_campaign=beta_launch&utm_content=issue_01
- 인스타 프로필 유입
  - https://parrotkit-deploy.vercel.app/?utm_source=instagram&utm_medium=social_bio&utm_campaign=ad_test_page&utm_content=bio_link
- Meta 유료 광고 가정 링크
  - https://parrotkit-deploy.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=creative_test&utm_content=creative_a

## Pricing 직행 테스트 링크
- Notion 문서 -> Pricing 직행
  - https://parrotkit-deploy.vercel.app/pricing?utm_source=notion&utm_medium=docs&utm_campaign=pricing_test&utm_content=cta_pricing
- Meta 광고 -> Pricing 직행
  - https://parrotkit-deploy.vercel.app/pricing?utm_source=meta&utm_medium=paid_social&utm_campaign=pricing_test&utm_content=creative_b
- 검색 광고 가정 링크
  - https://parrotkit-deploy.vercel.app/pricing?utm_source=google&utm_medium=cpc&utm_campaign=pricing_test&utm_content=keyword_brand

## 확인 방법
1. 새 시크릿 창에서 원하는 링크를 연다.
2. 로그인 또는 회원가입을 진행한다.
3. 필요 시 온보딩, 레퍼런스 입력, Recipe 생성, 저장, Pricing 진입, 결제를 진행한다.
4. GA4 실시간/DebugView에서 이벤트를 확인한다.
5. 내부 이벤트 로그 기준으로는 `utm_*`, `gclid`, `fbclid`, `ttclid` 값이 함께 저장되는지 확인한다.

## 기대 결과
- GA4 실시간에서 `login`, `view_pricing`, `begin_checkout`, `purchase_success` 같은 이벤트가 보인다.
- 앱 이벤트 payload에는 last touch / first touch UTM 문맥이 자동 포함된다.
- 같은 링크를 다른 브라우저 세션에서 열면 source/medium/campaign를 서로 구분할 수 있다.
