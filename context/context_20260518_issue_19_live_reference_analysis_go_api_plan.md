# 2026-05-18 Issue 19 Live Reference Analysis Go API Plan

## Request

User asked to turn the Ouroboros interview/seed for issue #19 into a Superpowers implementation plan.

## Inputs

- Ouroboros interview: `interview_20260517_181956`
- Seed: `/Users/junho/.ouroboros/seeds/seed_ee7758998b02.yaml`
- Superpowers skill used: `superpowers:writing-plans`

## Plan Created

- `plans/20260518_issue_19_live_reference_analysis_go_api.md`

## Key Plan Decisions

- Add Go service under `services/reference-api/`.
- Use synchronous `POST /v1/reference-analysis` for the first quality spike.
- Keep SuperData/Supadata and Replicate secrets server-side.
- Return canonical `parrotkit.reference_analysis_response.v1`.
- Gate local mock fallback behind explicit dev env; production must not silently create fake analyzed boards.
- Wire Expo Paste drawer to the Go API through `EXPO_PUBLIC_PARROTKIT_API_URL`.
- Defer payment/subscription entitlement and durable Supabase persistence.

## Verification

- `git diff --check` PASS.
- Placeholder scan on the plan found no unresolved plan placeholders such as `TBD`, `TODO`, `implement later`, fake provider stubs, or secret-value placeholders.

## Notes

- The plan follows project `plans/` convention rather than the default Superpowers `docs/superpowers/plans/` path because `AGENTS.md` requires `plans/YYYYMMDD_topic.md`.
- Existing untracked QA output `parrotkit-app/output/playwright/release-media-qa-20260517/` was left untouched.
