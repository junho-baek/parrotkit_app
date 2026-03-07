# 20260307 Parrotkit Deployment Login QA Report

## Summary
- Result: Login failure was not reproduced on the deployed environment.
- Target URL: https://parrotkit-deploy.vercel.app/
- Test window: 2026-03-07 20:55:37 KST to 2026-03-07 20:57:24 KST
- Primary account used: shared smoke-test account stored in local `AGENTS.md`
- Overall verdict: Deployed email login and username login both succeeded and routed to `/interests`.

## Purpose
- Verify the user-reported deployed login issue on the live Vercel URL.
- Capture browser evidence from the real deployed environment.
- Produce a written QA record with concrete next actions.

## Scope
- Live landing page access
- `/signin` page render
- Email login with the shared smoke-test account
- Username login with the same account
- Post-login route and token persistence check

## Environment
- Deployment URL: https://parrotkit-deploy.vercel.app/
- Browser: Playwright Chromium, headed
- Viewport: 1440 x 980
- Test date: 2026-03-07

## QA Inventory
- Home page load
- Sign-in form render
- Email login submit
- Username login submit
- Post-login redirect
- Browser-side token persistence

## Results

### 1. Home and sign-in UI rendered normally
- Home page loaded without visible runtime error.
- Sign-in form rendered with expected email/username and password inputs.

### 2. Email login succeeded on the deployed environment
- API request: `POST /api/auth/signin`
- Response status: `200`
- Observed result: browser redirected to `/interests`
- Browser state: access token, refresh token, expiry, and user payload were stored in `localStorage`
- Visible post-login state: interests selection screen rendered normally

### 3. Username login also succeeded on the deployed environment
- Identifier used: shared smoke-test account username
- API request: `POST /api/auth/signin`
- Response status: `200`
- Observed result: browser redirected to `/interests`
- Browser state: token persisted successfully

## Evidence
- Home: `output/playwright/20260307_deploy_qa/01-home.png`
- Sign-in form: `output/playwright/20260307_deploy_qa/02-signin-form.png`
- Filled sign-in form: `output/playwright/20260307_deploy_qa/03-signin-filled.png`
- Email login post-submit: `output/playwright/20260307_deploy_qa/04-after-submit.png`
- Email login post-login: `output/playwright/20260307_deploy_qa/05-post-login.png`
- Username login post-submit: `output/playwright/20260307_deploy_qa/06-username-login-after-submit.png`
- Raw structured result: `output/playwright/20260307_deploy_qa/deploy-login-qa-result.json`
- Username check result: `output/playwright/20260307_deploy_qa/username-login-check.json`

## Findings
- The originally reported issue was not reproduced with the shared smoke-test account.
- `Supabase Site URL` mismatch is unlikely to be the root cause of this specific password login flow because the deployed password login path completed normally.
- The current deployed build appears to have the required auth env values and a working Supabase connection for this account.

## Plausible Explanations For The User-Observed Failure
1. A different account is failing while the smoke-test account is healthy.
2. The failing account may have profile or migration inconsistencies not shared by the smoke-test account.
3. The failure may have occurred on an older deployment or with stale browser state.
4. The issue may occur after login in a later step, while the user interpreted it as a login failure.

## Risk / Gaps
- This QA pass verified the shared smoke-test account only.
- It did not validate every production user account shape.
- It did not validate signup, refresh-token renewal over time, or signout behavior in the deployed environment.

## Recommended Next Actions
1. Re-test the exact failing account on the deployed URL and capture the `/api/auth/signin` response body.
2. If the failing account uses username login, compare its `profiles.username` and auth user record against the smoke-test account.
3. Test in a clean browser profile or incognito window to rule out stale localStorage/session state.
4. If failure still reproduces for a specific account, inspect Supabase `profiles` row, auth user state, and any legacy migration path for that account.

## Conclusion
- As of 2026-03-07 20:57 KST, the deployed environment accepted both email login and username login for the shared smoke-test account and redirected to `/interests` successfully.
- The reported deployed login issue remains unconfirmed and should be narrowed to a specific account or browser condition.
