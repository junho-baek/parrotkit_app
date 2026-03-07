# 20260307_deploy_login_qa

## Background
- User requested deployment-environment QA for `https://parrotkit-deploy.vercel.app/`.
- Login reportedly fails only in the deployed environment.

## Goal
- Reproduce the deployed login behavior in a real browser.
- Capture screenshots and evidence.
- Produce a Markdown/PDF report and upload it to Notion.

## Scope
- Deployed sign-in flow using the shared smoke-test account.
- Basic post-login routing/behavior if login succeeds.
- Evidence capture and reporting.

## Changed Files
- output/playwright/*
- output/reports/*
- output/pdf/*
- context/*

## Test
- Headed Playwright against deployed URL.
- Response/error observation from browser behavior.
- Notion upload dry-run and real upload.

## Rollback
- Remove generated artifacts if needed.

## Risk
- Deployed env may differ from local env.
- Browser automation may expose a production-facing auth/config issue rather than code-only issue.
