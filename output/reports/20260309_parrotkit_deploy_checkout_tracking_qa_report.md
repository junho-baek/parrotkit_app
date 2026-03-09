# 20260309 Parrotkit Deploy Checkout + Tracking QA Report

## Summary
- Test time: 2026-03-09 19:34:40 KST
- Target URL: `https://parrotkit-deploy.vercel.app/`
- Branch / commit: `dev` / `b1008a9`
- Purpose: deployed pricing, Lemon Squeezy checkout, GTM, GA4, Meta Pixel verification

## Scope
- Reused shared smoke account login
- Pricing page render and plan display check
- Pro CTA click and checkout start attempt
- `dataLayer` event emission check
- Browser network check for GTM, GA4, Meta Pixel

## Test account
- Email: `parrotkitcodextest@mailinator.com`
- Username: `parrotkitcodextest`

## Result
- Login: pass
- Pricing page render: pass
- GTM container load: pass
- `view_pricing` dataLayer event: pass
- `begin_checkout` dataLayer event: pass
- Lemon checkout open: fail
- GA4 outbound request observed: fail
- Meta Pixel outbound request observed: fail

## Findings
### 1. Checkout is blocked before Lemon checkout opens
- Clicking `Get Access Now` produced an in-app error dialog: `결제 페이지를 열 수 없습니다. 다시 시도해주세요.`
- Network evidence shows `POST /api/checkout` returned `500`.
- Console evidence shows `Checkout error: Error: Failed to create checkout - invalid response`.

### 2. Deployed client is missing `NEXT_PUBLIC_VARIANT_PRO`
- Browser-side direct verification showed `variantId` was not present in the deployed client bundle.
- A manual authenticated fetch from the browser returned:
  - status `400`
  - body `{ "error": "Product variant ID is required" }`
- This strongly indicates the deployed build does not have `NEXT_PUBLIC_VARIANT_PRO` injected, or it was not redeployed after the env update.

### 3. GTM is installed, but GA4 and Meta Pixel were not observed firing
- Browser network logs show:
  - `https://www.googletagmanager.com/gtm.js?id=GTM-WNHB8L5J` loaded with `200`
- Browser `dataLayer` contained:
  - `view_pricing`
  - `begin_checkout`
- No outbound requests matching GA4 collection endpoints or Meta Pixel endpoints were observed during the tested flow.
- Interpretation: GTM base install is present, but GA4 / Meta tags are either not configured, not published, or not triggered by the current container rules.

## Evidence
- Screenshot: `output/playwright/20260309_deploy_checkout_tracking_qa/01_home.png`
- Screenshot: `output/playwright/20260309_deploy_checkout_tracking_qa/02_home_logged_in.png`
- Screenshot: `output/playwright/20260309_deploy_checkout_tracking_qa/03_pricing.png`
- Network log: `output/playwright/20260309_deploy_checkout_tracking_qa/network_pricing.txt`
- Network log: `output/playwright/20260309_deploy_checkout_tracking_qa/network_after_checkout_attempt.txt`

## Key technical evidence
### dataLayer snapshot on pricing page
```json
[
  {
    "event": "view_pricing",
    "event_category": "ecommerce",
    "page_title": "Pricing Page",
    "plan_count": 3,
    "page_path": "/pricing",
    "auth_user_id": "0d46c43d-56cf-49c7-ba95-4ce6f7ce37dd"
  },
  {
    "event": "begin_checkout",
    "event_category": "ecommerce",
    "plan_name": "Pro Plan",
    "plan_price": 9.99,
    "currency": "USD",
    "value": 9.99,
    "page_path": "/pricing",
    "auth_user_id": "0d46c43d-56cf-49c7-ba95-4ce6f7ce37dd"
  }
]
```

### Browser fetch verification of checkout config
```json
{
  "status": 400,
  "data": {
    "error": "Product variant ID is required"
  }
}
```

## Recommended next actions
1. Confirm `NEXT_PUBLIC_VARIANT_PRO` is set in Vercel Production env and redeploy Production.
2. Re-run deploy checkout smoke after redeploy and verify that Lemon checkout opens.
3. In GTM, publish the container after adding GA4 Configuration and Meta Pixel tags.
4. Re-run the same pricing flow and confirm outbound requests to GA4 and Meta endpoints.

## Current verdict
- Deploy is not yet ready for paid checkout.
- Root blocker is missing deployed `NEXT_PUBLIC_VARIANT_PRO`.
- Tracking fan-out is not yet verified beyond GTM base install and `dataLayer` events.
