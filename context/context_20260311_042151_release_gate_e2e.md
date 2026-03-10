# Release Gate E2E Context (2026-03-11 04:21:51 KST)

## Summary
- Target URL: `https://parrotkit-deploy.vercel.app/`
- Branch / base commit during test: `dev` / `4fc0058`
- Purpose: deploy release-gate E2E, pricing funnel verification, March 13 checklist progress assessment, Notion report upload

## What was verified
- Shared smoke account login succeeded.
- Reference submission succeeded with `https://www.youtube.com/shorts/8qUUuVkhtYQ`.
- Analyze request succeeded (`POST /api/analyze -> 200`).
- Recipe save succeeded (`POST /api/recipes -> 201`).
- Saved recipe appeared in `/recipes` and could be reopened.
- Pricing page rendered and `Get Access Now` initiated checkout at least once (`POST /api/checkout -> 200`).
- Browser network showed repeated `/api/events` logging during login, recipe generation, save, and pricing steps.

## What was not stable
- Playwright automation could not complete Lemon checkout reliably.
- On the external Lemon page, `ButtonToggle-*.css` asset requests returned `522`, causing a blank checkout render in Playwright.
- After the broken external render, a retry from pricing produced `POST /api/checkout -> 500` and the in-app error dialog `결제 페이지를 열 수 없습니다. 다시 시도해주세요.`.
- Home dashboard summary cards stayed stale after recipe creation (`Recipes = 0`) even though `/recipes` showed the saved recipe.

## Tracking status
- GTM base script is installed from `NEXT_PUBLIC_GTM_ID`.
- GTM workspace currently contains:
  - `GA4 - Google tag`
  - `GA4 - view_pricing`
  - `GA4 - begin_checkout`
  - `GA4 - purchase_success`
- GTM Preview evidence previously observed `view_pricing` and `begin_checkout` firing.
- Full GA4 minimum set is still not publish/debug-verified.
- Meta Pixel is still strategy-defined but not publish-verified.
- UTM capture/persistence is still not implemented in app code.

## Generated artifacts
- Markdown: `output/reports/20260311_parrotkit_release_gate_report_ko.md`
- PDF: `output/pdf/20260311_parrotkit_release_gate_report_ko.pdf`
- Screenshots:
  - `output/playwright/20260311_release_gate_e2e/free-plan-before-upgrade.png`
  - `output/playwright/20260311_release_gate_e2e/recipe-generated.png`
  - `output/playwright/20260311_release_gate_e2e/recipes-list.png`
  - `output/playwright/20260311_release_gate_e2e/pricing-page.png`
  - `output/playwright/20260311_release_gate_e2e/lemonsqueezy-checkout.png`
- Network log: `output/playwright/20260311_release_gate_e2e/network.txt`

## Notion upload
- Page URL: `https://www.notion.so/20260311-Parrotkit-Release-Gate-E2E-Report-31ffdc54bb7281acbfc3d1651b17b53d`
- Data source ID: `5ffa971d-cbf9-4729-a904-ca5845dc7b91`

## Recommended next actions before 2026-03-13
1. Publish GTM container and verify GA4 DebugView for `signup_success`, `login`, `onboarding_complete`, `recipe_generated`, `recipe_saved`, `view_pricing`, `begin_checkout`, `purchase_success`.
2. Add/publish Meta Pixel base + `ViewContent`, `InitiateCheckout`, `Purchase` mappings in GTM.
3. Run one manual full-browser checkout success flow and capture `/billing/success` or Pro reflection evidence on the shared QA account.
4. Fix stale Home counters after recipe save.
5. Execute release-gate sample QA with at least 3-5 users and store screenshots/logs.
