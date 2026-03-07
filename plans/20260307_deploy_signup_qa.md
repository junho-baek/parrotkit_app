# 20260307_deploy_signup_qa

## Background
- User clarified that the deployed issue is signup failure, not login failure.
- Deployment target is `https://parrotkit-deploy.vercel.app/`.

## Goal
- Reproduce the deployed signup behavior in a real browser.
- Capture response and visual evidence.
- Produce an updated report and upload it to Notion.

## Scope
- `/signup` render
- New account creation on deployed URL
- Post-signup redirect and token persistence check
- Evidence capture and reporting

## Changed Files
- output/playwright/*
- output/reports/*
- output/pdf/*
- context/*

## Test
- Headed Playwright against deployed signup page.
- Capture `/api/auth/signup` response status and visible UI state.

## Rollback
- Remove generated artifacts if needed.

## Risk
- Unique account generation is required to avoid duplicate-user false failures.
- Production rate limits or email settings may affect signup independently of login.
