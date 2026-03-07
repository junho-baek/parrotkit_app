# 20260307 Parrotkit Deployment Signup QA Report

## Summary
- Result: Signup failure was reproduced on the deployed environment.
- Target URL: https://parrotkit-deploy.vercel.app/
- Test window: 2026-03-07 21:00:37 KST to 2026-03-07 21:00:49 KST
- Test account used: unique mailinator account generated for this QA pass
- Overall verdict: deployed `/api/auth/signup` returned `500`, the UI showed `Internal server error`, and no auth state was persisted in the browser.

## Purpose
- Verify the user-reported signup failure on the live Vercel deployment.
- Capture concrete browser evidence from the deployed environment.
- Narrow the failure scope and document the most likely next debugging step.

## Scope
- `/signup` page render
- New account creation on the deployed environment
- API response status capture
- Post-submit route and localStorage persistence check

## Environment
- Deployment URL: https://parrotkit-deploy.vercel.app/
- Browser: Playwright Chromium, headed
- Viewport: 1440 x 980
- Test date: 2026-03-07

## QA Inventory
- Signup page render
- Form fill with a fresh account
- Signup submit
- API response capture for `/api/auth/signup`
- UI error state capture
- Browser-side token persistence check

## Results

### 1. Signup page rendered normally before submit
- The deployed `/signup` page loaded correctly.
- Email, username, password, and confirm-password fields were visible and interactive.

### 2. Fresh-account signup failed on submit
- API request: `POST /api/auth/signup`
- Response status: `500`
- Response body: `{ "error": "Internal server error" }`
- Browser route after submit: remained on `/signup`
- Visible UI state: red error banner with `Internal server error`

### 3. No authenticated state was created in the browser
- `localStorage token`: absent
- `localStorage refreshToken`: absent
- `localStorage user`: absent
- Conclusion: the deployed signup flow did not create a usable authenticated session

## Evidence
- Signup form: `output/playwright/20260307_deploy_signup_qa/01-signup-form.png`
- Filled signup form: `output/playwright/20260307_deploy_signup_qa/02-signup-filled.png`
- Failed post-submit state: `output/playwright/20260307_deploy_signup_qa/03-signup-after-submit.png`
- Structured result: `output/playwright/20260307_deploy_signup_qa/deploy-signup-qa-result.json`

## Findings
- The issue is real and reproducible on the deployed environment.
- The problem is isolated to signup, not to the entire password-auth path, because the deployed login flow was separately verified as healthy in the preceding QA pass.
- The user-reported symptom matches the deployed behavior: signup shows `Internal server error` and does not advance to onboarding.

## Most Likely Root Cause (Code-Based Inference)
- The deployed signup route calls `legacyUserExistsByEmailOrUsername(email, username)` before attempting Supabase signup.
- That helper depends on `getDb()` and therefore on `DATABASE_URL`.
- Unlike login, signup executes this legacy DB check on every request, even for brand-new users.
- If `DATABASE_URL` is missing, invalid, or unreachable in Vercel, signup will throw and fall into the route-level `500 Internal server error` path.
- This is an inference from the current code, not a direct server-log confirmation.

## Supporting Code References
- Signup route: [src/app/api/auth/signup/route.ts](/Volumes/T7/플젝/deundeunApp/Parrotkit/src/app/api/auth/signup/route.ts)
- Legacy lookup helper: [src/lib/auth/legacy-migration.ts](/Volumes/T7/플젝/deundeunApp/Parrotkit/src/lib/auth/legacy-migration.ts)
- DB bootstrap: [src/lib/db.ts](/Volumes/T7/플젝/deundeunApp/Parrotkit/src/lib/db.ts)

## Risk / Gaps
- This QA pass reproduced the user-facing failure but did not inspect server logs directly.
- The exact thrown exception is still unconfirmed without Vercel function logs.
- There may be more than one signup failure mode, but the current deployment clearly has at least one blocking server-side failure.

## Recommended Next Actions
1. Check Vercel runtime env for `DATABASE_URL` first.
2. If `DATABASE_URL` is present, verify that the value is reachable from Vercel and correctly encoded.
3. Inspect the Vercel function log for `/api/auth/signup` to confirm the exact thrown error.
4. Consider changing the signup path so legacy DB lookup failure degrades safely instead of hard-failing new-user signup.

## Conclusion
- As of 2026-03-07 21:00 KST, deployed signup is failing with `500 Internal server error`.
- The strongest current hypothesis is a legacy DB dependency in the signup path, with `DATABASE_URL` or legacy DB reachability as the first thing to verify.
