# Context 2026-05-14 Preserve Completed Fixes Inventory

## Task

Sub-AC 1: Identify and document the completed fixes from `job_46a1bf0280ed` that must be preserved.

## Source artifacts checked

- `context/parrotkit_v1_nav_realignment_followup_seed_20260514.yaml`
- `context/parrotkit_v1_nav_realignment_seed_20260514.yaml`
- `context/context_20260514_failed_items_followup.md`
- `AGENT.md`

`src/AGENTS.md` was requested by the Seed constraints but is not present in this checkout.

## Completed fixes from `job_46a1bf0280ed` to preserve

Based on `previous_run_results.completed` in the follow-up Seed:

1. Explore and Explore detail still expose template copy/start-shooting affordances.
2. Create screen lower cards are readable and tappable above the sticky CTA.
3. My/Profile content is not obscured by bottom nav or FAB.
4. Metro ENOENT for `assets/recipe-create` was addressed.
5. Reference link and Brand context remain locked Pro/coming-soon guidance.

## Additional preservation context already present in this worktree

`context/context_20260514_failed_items_followup.md` records subsequent completed follow-up fixes that should also be treated as preservation-sensitive while future failed/pending items are handled:

- Locked Reference link and Brand context creation options stay on manual blank flow and show Pro/coming-soon guidance instead of starting API/paid flows.
- Prompter save flow keeps local saved-take state, returns to the same cut board with selected take query params, and refreshes My Take/take status through local mock state.
- Saved takes and saved/copied recipes expose Home/My/Profile access destinations.
- Explore recipe template copy creates a local owned recipe and exposes start-filming destination into the copied recipe prompter.
- Expanded take viewer final-take assertion checks the explicitly selected final take id.

## Scope decision

No implementation changes were made for this Sub-AC. This document is an inventory used to prevent regressions in later failed/pending navigation follow-up work.

## Verification

- Confirmed the previous job id, status, completed list, failed/pending list, and corrected CTA language in `context/parrotkit_v1_nav_realignment_followup_seed_20260514.yaml`.
- Confirmed the original run’s preservation context in `context/parrotkit_v1_nav_realignment_seed_20260514.yaml`.
- Confirmed the later follow-up completed-fixes note in `context/context_20260514_failed_items_followup.md`.
