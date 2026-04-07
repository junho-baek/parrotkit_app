# Deploy Smoke Report

- Test time: 2026-04-08 03:39 UTC / 2026-04-08 12:39 KST
- Target URL: https://parrotkit-deploy.vercel.app/
- Purpose: Confirm the pushed `dev` deployment still serves the main app shell after the prompter persistence and custom cue changes.
- Scope: Home page load, title check, viewport screenshot capture

## Result
- `curl -I -L` returned `HTTP/2 200`
- Playwright opened the deploy URL successfully
- Page title loaded as `ParrotKit - Viral Recipe for UGC Creators`
- Screenshot captured: `output/playwright/20260408_deploy_home_smoke.png`

## Failures / Risks
- This was a home-page smoke only. Login, recipe detail, prompter editing, and capture flows were not re-run on deploy in this pass.
- No PDF QA report was generated in this quick smoke pass.

## Next Action
- If we want higher confidence, run a headed deploy QA on recipe detail and prompter editing with the reusable test account.
