# Context - 2026-03-07 21:05 KST - deploy signup QA

## Summary
- User clarified that the deployed issue is signup failure, not login failure.
- Reproduced the failure on `https://parrotkit-deploy.vercel.app/` with a fresh mailinator account.
- `POST /api/auth/signup` returned `500` and the UI displayed `Internal server error`.
- No token / refresh token / user payload was persisted in localStorage.
- Separate deploy login QA completed immediately beforehand showed login itself works for the shared smoke-test account.

## Evidence
- Screenshots under `output/playwright/20260307_deploy_signup_qa/`
- Structured result: `output/playwright/20260307_deploy_signup_qa/deploy-signup-qa-result.json`
- Markdown report: `output/reports/20260307_parrotkit_deploy_signup_qa_report.md`
- PDF report: `output/pdf/20260307_parrotkit_deploy_signup_qa_report.pdf`

## Likely Cause
- Code-path inference: signup always calls `legacyUserExistsByEmailOrUsername()` before Supabase signUp.
- That helper depends on `getDb()` and therefore `DATABASE_URL`.
- If `DATABASE_URL` is absent or unreachable in Vercel, signup can hard-fail with 500 even while existing-user login still works.
- This is an inference from code paths and QA evidence, not yet a confirmed server-log diagnosis.

## Next Actions
1. Check Vercel `DATABASE_URL`.
2. Inspect Vercel logs for `/api/auth/signup`.
3. Make legacy DB lookup non-blocking for new signup if optional.
