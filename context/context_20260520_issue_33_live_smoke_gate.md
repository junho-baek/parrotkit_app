# 2026-05-20 Issue 33 Live Smoke Gate

## Scope

- GitHub issue #33 only.
- No work on #31 or #32.
- No frontend/UI changes, deployed QA, Notion upload, staging, commit, push, GitHub comment, or issue close.
- Existing unrelated untracked QA/context/plan/generated outputs were preserved.

## Result

- Final status classification: `partial_ready`.
- Fixture 2 gate passed with deterministic backend evidence for:
  - `sourceFaithful` default recipe and board variants.
  - `goalAdapted` variant present.
  - Shared variant cut ids and source timestamp spans.
  - Transcript-derived source ranges: `1400-4200`, `9000-13200`, `21000-24600`.
  - Breakdown transcript and mappings grounded in Fixture 2 transcript text.
- Live smoke gate found existing credentials/env present without printing values:
  - Super Data/Supadata key: present.
  - Replicate token: present.
  - Reference model provider: `replicate`.
- Live smoke ran against `https://youtube.com/shorts/ySDpL4wUX7Y?si=mSIY3VG1KRWiLaaH`.
- Live API response was contract-valid `partial_ready`, not `failed` or `model_invalid_output`.
- Redacted live summary:
  - responseStatus: `partial_ready`
  - statusClassification: `partial_ready`
  - missingArtifacts: `["visual_extract"]`
  - cutCount: `4`
  - transcriptPresent: `true`
  - default variants: `sourceFaithful`
- The response contained usable transcript-grounded `sourceFaithful` and `goalAdapted` recipe/board variants, timestamp ranges, and compact board projection.

## Evidence Artifact

- `output/reference-api/issue-33-live-smoke-gate.json`
- Artifact contains only redacted status/check/error summary. It does not include raw secrets, provider traces, prompts, or model payloads.

## Verification

- PASS: `cd services/reference-api && GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/analysis -run TestIssue33Fixture2TimestampMappingAndVariants -count=1`
- PASS: `node scripts/reference-api-issue-33-smoke.cjs --output output/reference-api/issue-33-live-smoke-gate.json`
  - Fixture 2 sub-gate passed.
  - Live smoke produced status classification `partial_ready`.
  - Redacted limitation: `missingArtifacts=["visual_extract"]`.
- PASS: `cd services/reference-api && GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./...`
- PASS: `git diff --check`
- NOT RUN: TypeScript checks, because no TypeScript/app files changed.

## Changed Files

- `services/reference-api/internal/analysis/issue33_fixture2_test.go`
- `services/reference-api/cmd/issue33-live-smoke/main.go`
- `scripts/reference-api-issue-33-smoke.cjs`
- `output/reference-api/issue-33-live-smoke-gate.json`
- `plans/20260520_issue_33_live_smoke_gate_superpowers.md`
- `context/context_20260520_issue_33_live_smoke_gate.md`

## Blocker / Limitation

- No blocking failure remains for issue #33. The live vertical-slice smoke returned usable `partial_ready` because transcript, variants, timestamps, and compact board projection were present; only optional `visual_extract` was missing.
