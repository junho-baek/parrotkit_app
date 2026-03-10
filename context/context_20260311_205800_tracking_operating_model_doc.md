# Tracking Operating Model Context (2026-03-11 20:58:00 KST)

## Summary
- Purpose: document ParrotKit event operating model in Korean, including analysis principles, current implementation, event quality assessment, and developer/marketer role split.
- Target upload destination: Notion reports data source `5ffa971d-cbf9-4729-a904-ca5845dc7b91`
- Deployment reference URL used in the document: `https://parrotkit-deploy.vercel.app/`

## What was created
- Full document:
  - `output/reports/20260311_parrotkit_event_operating_model_ko.md`
- Notion body summary:
  - `output/reports/20260311_parrotkit_event_operating_model_notion_summary_ko.md`
- Uploadable text artifact:
  - `output/reports/20260311_parrotkit_event_operating_model_ko.txt`

## Main conclusions captured in the document
- Current tracking direction is correct: `dataLayer -> GTM -> GA4/Meta` plus `/api/events -> Supabase event_logs` is a workable MVP operating structure.
- Current event design is usable but not yet a strict event contract.
- Strengths:
  - central event hub
  - readable funnel naming
  - dual-path logging (client + server)
  - entitlement-based purchase success
- Weaknesses:
  - no typed event contract
  - inconsistent payload schema
  - no UTM / attribution persistence
  - raw URL payload usage
  - sparse failure events

## Verified implementation references used in the document
- Event hub: `src/lib/client-events.ts:33-74`
- Event ingest API: `src/app/api/events/route.ts:6-37`
- Event log insert utility: `src/lib/event-logs.ts:12-28`
- Signup events: `src/components/auth/SignUpForm.tsx:31-90`
- Login event: `src/components/auth/SignInForm.tsx:41-70`
- Onboarding complete: `src/components/auth/InterestsForm.tsx:97-101`
- Reference / recipe events: `src/components/auth/URLInputForm.tsx:32-88`
- Pricing view: `src/app/pricing/page.tsx:10-15`
- Checkout start: `src/components/auth/PricingCard.tsx:83-111`
- Billing success client event: `src/app/billing/success/page.tsx:66-80`
- Lemon webhook billing events: `src/app/api/webhooks/lemonsqueezy/route.ts:182-360`

## Notion upload result
- First upload attempt failed because raw `.md` artifact resolved to `application/octet-stream`, which Notion File Upload API rejected.
- Second upload attempt failed because the summary contained a fenced code block that Notion converted to an invalid `code.language = "text"` block.
- Resolved by:
  - attaching the full document as `.txt`
  - replacing the fenced architecture block in the Notion summary with bulleted text
- Final Notion page:
  - `https://www.notion.so/20260311-ParrotKit-31ffdc54bb7281b19fdec33331a62e8c`

## Suggested next actions from this document
1. Publish GTM live container and confirm GA4 DebugView events.
2. Add Meta Pixel base + `ViewContent` / `InitiateCheckout` / `Purchase` mappings in GTM.
3. Implement UTM first-touch / latest-touch capture in app code.
4. Add failure events and typed event contract.
