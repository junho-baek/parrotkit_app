# Context - 2026-03-09 20:49 KST - tracking strategy and Notion report

## Summary
- GTM/GA4/Lemon Squeezy 수동 테스트 이후, 현재 코드 기준 이벤트 발생 위치와 GTM 트리거 연결 방식을 문서화했다.
- `view_pricing`, `begin_checkout`, `purchase_success`의 실제 코드 경로를 확인했다.
- 현재 앱에는 UTM 저장 로직이 없고, Meta Pixel 코드도 앱 내부에는 없으며 GTM fan-out 전략이 적절하다는 점을 정리했다.
- 한국어 운영 문서를 작성해 Notion reports 데이터소스에 업로드했다.

## Code findings
- GTM base install: `src/app/layout.tsx:22-77`
- 공통 이벤트 허브: `src/lib/client-events.ts:33-74`
- 가격 페이지 view event: `src/app/pricing/page.tsx:9-16`
- checkout start event: `src/components/auth/PricingCard.tsx:68-111`
- billing success purchase event: `src/app/billing/success/page.tsx:66-80`
- server event logging: `src/app/api/events/route.ts:6-37`
- Lemon webhook purchase_success event log: `src/app/api/webhooks/lemonsqueezy/route.ts:182-209`, `294-331`

## Operational conclusions
- GTM Preview가 Lemon checkout 외부 도메인으로 이동하면서 끊기는 것은 정상이다.
- 결제 성공 후 `purchase_success`는 `/billing/success`에서 profile active 확인 이후 발생하는 구조다.
- UTM attribution은 현재 GA4 콘솔 기준으로만 가능하고, 앱 내부 DB 기준 attribution은 아직 불가능하다.
- Meta Pixel은 앱 코드 직접 삽입보다 GTM에서 `ViewContent / InitiateCheckout / Purchase` 매핑으로 운영하는 것이 맞다.

## Artifacts
- Markdown report: `output/reports/20260309_parrotkit_tracking_strategy_ko.md`
- Notion page: `https://www.notion.so/31efdc54bb72815182f1ed977785d2f6`

## Next actions
1. GTM에서 Meta Pixel base tag와 3개 표준 이벤트를 추가한다.
2. GA4 DebugView에서 `purchase_success`까지 최종 확인한다.
3. `logClientEvent()`에 UTM first-touch / session-touch 주입 로직을 설계하고 구현한다.
