# 20260307 Parrotkit Deployment E2E Retest Report

## Summary
- Target URL: https://parrotkit-deploy.vercel.app/
- Test window: 2026-03-07 21:15 KST to 2026-03-07 21:20 KST
- Result: deployment-wide auth is not fully broken, but `signup` is still failing while the downstream logged-in creator flow is working.

## Purpose
- Re-run deployed E2E after the reported environment-variable fix.
- Verify whether signup is healthy again.
- Verify the main creator flow, including camera recording and capture upload, on the deployed environment.

## Scope
- Fresh-account signup on deployed `/signup`
- Existing-account login
- Interests and reference submission
- Recipe generation and persistence
- Camera shooting flow
- Capture upload for one scene

## Key Outcome
1. Fresh-account signup is still failing on the deployed environment.
2. Existing-account login works.
3. Recipe generation works.
4. Camera recording works.
5. Capture upload works.

## Detailed Results

### 1. Deployed signup still fails
- Endpoint: `POST /api/auth/signup`
- Observed status: `500`
- Visible result: `Internal server error`
- Browser route stayed on: `/signup`
- No auth state was created in localStorage

Evidence:
- `output/playwright/20260307_deploy_e2e_retest/03-after-signup.png`
- `output/playwright/20260307_deploy_e2e_retest/deploy-full-e2e-retest.json`

### 2. Existing-account login works
- Shared smoke-test account logged in successfully
- Redirect target: `/home` or `/interests` depending on current profile state
- Response status: `200`

### 3. Reference input and recipe generation work
- Reference URL used: `https://www.youtube.com/shorts/8qUUuVkhtYQ`
- `/api/analyze`: `200`
- `/api/recipes`: `201`
- Recipe page loaded successfully with a saved `recipeId`

### 4. Camera recording is the main capture flow
- The deployed app uses `CameraShooting` with `getUserMedia()` and `MediaRecorder`
- After recording, the app immediately calls the capture upload endpoint
- In other words, camera recording is not separate from upload validation; recording success is upstream of upload success

### 5. Camera shooting and capture upload passed in deployed QA
- Shooting tab opened successfully
- Camera preview was present
- One scene was recorded with a fake media stream in headed Chromium
- `/api/recipes/{recipeId}/captures`: `200`
- Progress update endpoints also returned `200`
- UI showed one captured scene as done

Evidence:
- `output/playwright/20260307_deploy_capture_flow_retry/03-recipe-home.png`
- `output/playwright/20260307_deploy_capture_flow_retry/05-shooting-tab.png`
- `output/playwright/20260307_deploy_capture_flow_retry/06-after-recording.png`
- `output/playwright/20260307_deploy_capture_flow_retry/deploy-capture-flow-retry.json`

## Findings
- The deployed environment is partially healthy.
- The failure is currently concentrated in the signup path.
- The main creator workflow after login is working through recipe generation, camera recording, capture upload, and capture progress update.

## Likely Interpretation
- The environment-variable adjustment alone did not fully resolve deployed signup.
- If the current deployed URL is still running an older server bundle, the TLS-related signup fix may not be live yet.
- If the latest bundle is already live, there is still a server-side signup dependency failing independently of the downstream creator flow.

## Recommended Next Actions
1. Confirm the deployed site is actually running the latest commit that preserves `sslmode=require` for legacy DB connections.
2. Re-check Vercel function logs for `/api/auth/signup` after the latest deploy is live.
3. Re-run fresh-account signup immediately after that deploy.
4. Keep camera recording in the release checklist, but treat it as currently passing on the deployed environment.

## Conclusion
- As of this retest, deployed `signup` remains broken.
- Deployed `login -> interests/reference -> recipe -> camera recording -> capture upload` is working.
- Camera recording should remain part of the E2E checklist because it is the primary capture path and it already validates upload at the same time.
