# Context - 2026-03-09 19:39 KST - deploy checkout + tracking QA

## Summary
- Deployed QA was run against `https://parrotkit-deploy.vercel.app/` with the shared smoke account.
- Login and pricing page rendering passed.
- GTM base install loaded correctly and `view_pricing`, `begin_checkout` were pushed into `dataLayer`.
- Pro checkout did not open because the deployed client did not send a variant ID.
- GA4 and Meta Pixel outbound requests were not observed during the tested flow.

## Key evidence
- `POST /api/checkout` returned `500` after clicking `Get Access Now`.
- A direct authenticated browser fetch returned `400` with `Product variant ID is required`.
- Network logs showed `https://www.googletagmanager.com/gtm.js?id=GTM-WNHB8L5J => 200`.
- No requests matching GA4 collection or Meta Pixel endpoints were observed.

## Likely cause
- `NEXT_PUBLIC_VARIANT_PRO` is not present in the deployed client bundle.
- Most likely explanation: the Production env was not saved on the deployed target or the site was not redeployed after the env update.

## Artifacts
- Screenshots: `output/playwright/20260309_deploy_checkout_tracking_qa/`
- Markdown report: `output/reports/20260309_parrotkit_deploy_checkout_tracking_qa_report.md`
- PDF report: `output/pdf/20260309_parrotkit_deploy_checkout_tracking_qa_report.pdf`
- PDF renders: `tmp/pdfs/20260309_parrotkit_deploy_checkout_tracking_qa/rendered/`

## Notion
- Markdown page uploaded via Notion MCP:
  - `https://www.notion.so/31efdc54bb7281418673ed89e055c5e9`
- The token-based upload script path was not usable in this turn because `.env.local` did not contain `NOTION_API_KEY`.

## Next actions
1. Fix `NEXT_PUBLIC_VARIANT_PRO` in Vercel Production and redeploy.
2. Re-run checkout smoke and verify Lemon checkout opens.
3. Publish GTM after GA4 / Meta tag setup.
4. Re-run pricing flow and confirm GA4 / Meta outbound requests appear.
