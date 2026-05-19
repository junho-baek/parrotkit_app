# Issue 33 Live Smoke Gate Superpowers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish GitHub issue #33 only by adding deterministic Fixture 2 evidence and a redacted live smoke gate for the ParrotKit Superpowers reference recipe vertical slice.

**Architecture:** Keep the existing Go reference API contract and providers intact. Add a focused backend fixture test that proves a second transcript fixture preserves timestamp mapping and both variants, then add a small issue-scoped smoke runner that loads existing local env without printing values, runs the live provider path only when credentials are present, classifies the result as `ready`, `partial_ready`, `failed`, or `model_invalid_output`, and writes a redacted local artifact.

**Tech Stack:** Go reference API tests and command, Node.js wrapper script for env loading and artifact orchestration, Markdown context evidence.

---

## 배경

- GitHub issue #33 is scoped to the live smoke gate/evidence for the ParrotKit Superpowers reference recipe vertical slice.
- Issues #31 and #32 are already closed at commits `73b8c1e` and `f9c0617`; this work must not change those issue scopes.
- Existing reference API tests cover ready/partial contracts, two variants, breakdown IA, timestamp mapping, and provider adapters, but there is no issue #33 script that combines Fixture 2 plus a live smoke status classification artifact.
- The repository has unrelated modified/untracked QA/context/plan/generated files. Preserve them and only add/update files for issue #33.
- User instruction overrides normal repository push rules: do not stage, commit, push, comment on GitHub, close issues, upload to Notion, or delete unrelated outputs.

## 목표

- Add a deterministic Fixture 2 gate that validates a second transcript fixture with:
  - `sourceFaithful` default recipe and board variants.
  - `goalAdapted` variant present and mapped to the same cut ids.
  - Cut board timestamp ranges derived from transcript segments instead of generated duration accumulation.
  - Breakdown transcript and source mappings grounded in the Fixture 2 transcript text.
- Add a live smoke gate that:
  - Uses existing env only when present.
  - Never prints raw secrets/tokens.
  - Records exact non-secret missing prerequisites as `partial_ready` when credentials/env are absent.
  - Records `model_invalid_output` when the live path reports structurally invalid/model-invalid output.
  - Records `ready` when fixture and live checks pass with a ready response.
  - Records `partial_ready` when live checks pass with a usable partial response.
  - Records `failed` for other live provider/runtime failures.
- Produce issue-scoped redacted evidence and context for Hermes to verify later.

## 범위

- In scope:
  - `services/reference-api` Fixture 2 Go test.
  - Issue-scoped live smoke Go command and Node wrapper script.
  - Redacted issue #33 artifact under `output/reference-api/`.
  - Issue #33 context/evidence Markdown.
  - Final update to this plan with result and context link.
- Out of scope:
  - Issues #31/#32, frontend UI changes, deployed QA, screenshots, Notion, GitHub comments, commits, pushes, staging, and unrelated QA outputs.

## 변경 파일

- Create: `services/reference-api/internal/analysis/issue33_fixture2_test.go`
- Create: `services/reference-api/cmd/issue33-live-smoke/main.go`
- Create: `scripts/reference-api-issue-33-smoke.cjs`
- Create: `context/context_20260520_issue_33_live_smoke_gate.md`
- Create when script runs: `output/reference-api/issue-33-live-smoke-gate.json`
- Update at completion: `plans/20260520_issue_33_live_smoke_gate_superpowers.md`

## 테스트

- Fixture 2 gate:
  - `cd services/reference-api && GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/analysis -run TestIssue33Fixture2TimestampMappingAndVariants -count=1`
- Issue #33 smoke gate:
  - `node scripts/reference-api-issue-33-smoke.cjs --output output/reference-api/issue-33-live-smoke-gate.json`
- Required minimum:
  - `cd services/reference-api && GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./...`
  - `git diff --check`
- TypeScript checks are not required unless TypeScript/app files change.

## 롤백

- Remove only the issue #33 files listed under `변경 파일`.
- Do not modify or delete unrelated `output/playwright`, `output/reports`, older context files, old plans, or generated artifacts not created for #33.
- No database, env, deployment, Notion, GitHub, staging, commit, or push state is changed by this plan.

## 리스크

- Live smoke may be unable to run if `SUPERDATA_API_KEY`/`SUPADATA_API_KEY`/`SUPADATA_API_TOKEN` or required model credentials are missing. In that case the correct issue #33 classification is `partial_ready` with exact non-secret missing prerequisites.
- Live smoke may fail because network access or provider APIs are unavailable. If credentials are present but the provider path fails, classify as `failed` unless the response error code is `model_invalid_output`.
- The artifact must summarize provider output without raw provider payloads or secrets.
- The existing sandbox may fail `go test ./...` in provider tests if loopback `httptest` binding is blocked. Run the required command anyway and record the exact non-secret failure.

---

### Task 1: Add Deterministic Fixture 2 Gate

**Files:**
- Create: `services/reference-api/internal/analysis/issue33_fixture2_test.go`

- [x] **Step 1: Create the Fixture 2 test file**

Create `services/reference-api/internal/analysis/issue33_fixture2_test.go` with one test named `TestIssue33Fixture2TimestampMappingAndVariants`. The test will call `BuildReferenceAnalysisResponse` using a second transcript fixture about a skincare routine, then assert source-faithful default, goal-adapted variant presence, shared cut ids, transcript-derived timestamp spans, and Breakdown transcript/source mappings.

- [x] **Step 2: Run the Fixture 2 gate**

Run:

```bash
cd services/reference-api && GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/analysis -run TestIssue33Fixture2TimestampMappingAndVariants -count=1
```

Expected: PASS.

### Task 2: Add Redacted Live Smoke Command

**Files:**
- Create: `services/reference-api/cmd/issue33-live-smoke/main.go`

- [x] **Step 1: Create the live smoke command**

Create a Go `main` package that:
- Loads existing env through `config.Load()`.
- Constructs the same live provider stack as `cmd/reference-api/main.go`.
- Runs `pipeline.Analyze` against `https://youtube.com/shorts/ySDpL4wUX7Y?si=mSIY3VG1KRWiLaaH`.
- Classifies the response as `ready`, `partial_ready`, `failed`, or `model_invalid_output`.
- Checks sourceFaithful/goalAdapted variants, transcript presence, cut count, and timestamp ranges.
- Writes only redacted summary JSON to `--output`.

- [x] **Step 2: Run the Go command through the wrapper in Task 3**

Do not run the Go command directly unless debugging the wrapper, because the wrapper is responsible for loading `.env.local` safely and converting missing env to `partial_ready`.

### Task 3: Add Issue-Scoped Smoke Wrapper

**Files:**
- Create: `scripts/reference-api-issue-33-smoke.cjs`

- [x] **Step 1: Create the Node wrapper**

Create a Node script that:
- Parses root `.env.local` if it exists and merges it with `process.env`.
- Prints only env presence/missing labels.
- Runs the Fixture 2 Go test.
- If live prerequisites are missing, writes `statusClassification: "partial_ready"` with `missingPrerequisites`.
- If live prerequisites are present, runs `go run ./cmd/issue33-live-smoke --output <path>`.
- Exits nonzero only when the fixture gate fails or the live path returns `failed`/`model_invalid_output`.

- [x] **Step 2: Run the issue #33 smoke wrapper**

Run:

```bash
node scripts/reference-api-issue-33-smoke.cjs --output output/reference-api/issue-33-live-smoke-gate.json
```

Expected: PASS with `ready`/`partial_ready`, or a recorded `failed`/`model_invalid_output` artifact if the live provider path itself fails.

### Task 4: Required Verification

**Files:**
- No new files expected unless verification updates the smoke artifact.

- [x] **Step 1: Run all Go tests**

Run:

```bash
cd services/reference-api && GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./...
```

Expected: PASS, or record the exact sandbox/provider failure if the environment blocks required networking.

- [x] **Step 2: Run diff whitespace check**

Run:

```bash
git diff --check
```

Expected: PASS.

### Task 5: Document Evidence and Final Result

**Files:**
- Create: `context/context_20260520_issue_33_live_smoke_gate.md`
- Update: `plans/20260520_issue_33_live_smoke_gate_superpowers.md`

- [x] **Step 1: Write context evidence**

Create the context file with:
- Issue #33 scope.
- Final status classification.
- Fixture 2 result.
- Live smoke result or missing prerequisites.
- Redacted artifact path.
- Verification commands and outcomes.
- Confirmation that no staging, commit, push, GitHub comment/close, Notion upload, or unrelated output cleanup was performed.

- [x] **Step 2: Update this plan with result**

Mark completed task checkboxes, add a final result section, and link `context/context_20260520_issue_33_live_smoke_gate.md`.

---

## 최종 결과

- Final status classification: `partial_ready`.
- Linked context/evidence file: `context/context_20260520_issue_33_live_smoke_gate.md`.
- Redacted local artifact: `output/reference-api/issue-33-live-smoke-gate.json`.
- Fixture 2 gate passed.
- Live smoke used existing present credentials without printing secret values, then returned contract-valid usable `partial_ready`.
- Live limitation: optional `visual_extract` is listed in missingArtifacts, while transcript, variants, timestamp ranges, and compact board projection are present.
- No staging, commit, push, GitHub comment/close, Notion upload, or unrelated QA output cleanup was performed by Codex; Hermes supervisor will perform the issue workflow after verification.

## 최종 검증

- PASS: `cd services/reference-api && GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/analysis -run TestIssue33Fixture2TimestampMappingAndVariants -count=1`
- PASS: `node scripts/reference-api-issue-33-smoke.cjs --output output/reference-api/issue-33-live-smoke-gate.json`
  - Fixture 2 sub-gate passed.
  - Live status classification: `partial_ready`.
  - Redacted limitation: `missingArtifacts=["visual_extract"]`.
- PASS: `cd services/reference-api && GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./...`
- PASS: `git diff --check`
- NOT RUN: TypeScript checks because no TypeScript/app files changed.
