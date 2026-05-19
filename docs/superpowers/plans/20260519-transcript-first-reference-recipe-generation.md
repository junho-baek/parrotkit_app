# Transcript-first Reference Recipe Generation Plan

## Goal

Fix ParrotKit reference recipe generation so `POST /v1/reference-analysis` can return a usable `ready` or `partial_ready` recipe board from Supadata metadata/transcript data even when Supadata `/extract` fails. Keep the Expo UI unchanged.

## Constraints

- Use existing Expo contract: `ready | partial_ready` plus usable `recipe.scenes`, `cutBoard.items`, and thumbnail.
- No Expo UI redesign.
- No raw API keys, raw transcript dumps, or full raw model output in logs.
- No fake analyzed board when transcript is unavailable.
- Preserve existing local changes.
- Do not commit, push, comment, or close issues.
- Tests first; implementation follows tests.

## Current Failure Summary

Live link `https://youtube.com/shorts/KalfC-2x-CQ?si=kZqrREZaoPxCFzIJ` reached the Go API but returned HTTP 200 with `status: failed`, `error.code: model_invalid_output` after roughly 32-40 seconds.

Observed provider behavior:

- Supadata metadata succeeded.
- Supadata transcript succeeded.
- Supadata `/extract` failed.
- Replicate Gemini returned malformed or wrong-shape JSON, sometimes wrapped in `{ "analysis": ... }` and sometimes truncated.

Root issue: the backend asks the LLM to emit the full `ReferenceAnalysisResponse`. That response is too large and contract-heavy. The LLM should only emit a small draft; Go should assemble the canonical API response deterministically.

## Target Architecture

```txt
Supadata metadata/transcript
  -> optional Supadata extract
  -> ModelProvider generates small transcript-derived draft
  -> Go normalizes draft and deterministically builds ReferenceAnalysisResponse
  -> Expo consumes unchanged ready/partial_ready response
```

Supadata is primary for metadata/transcript/script ingestion. `/extract` is optional enrichment, not a required visual-analysis gate.

## Phase 1 — Tests and Observability

### Tests first

Add or update Go tests before implementation:

1. `LiveProvider` transcript-first partial success:
   - fake Supadata metadata succeeds.
   - fake Supadata transcript succeeds.
   - fake Supadata extract fails.
   - fake model provider returns a valid small draft.
   - expect `status == partial_ready`.
   - expect `generation.missingArtifacts` includes `visual_extract`.
   - expect `recipe.scenes` and `cutBoard.items` are non-empty.
   - expect `response.Validate()` passes.

2. Draft-to-response mapper test:
   - given metadata, transcript segments, and a small draft.
   - expect deterministic `referenceMedia`, `breakdown`, `recipe`, `cutBoard`, and `generation`.
   - ensure cut IDs, scene indexes, durations, and media refs are stable.

3. Model output parsing tests:
   - plain JSON draft parses.
   - fenced markdown JSON parses.
   - wrapper JSON such as `{ "analysis": ... }` is normalized if it contains a valid draft.
   - truncated JSON fails with a clear internal `model_invalid_output` reason.

4. Supadata client tests:
   - transcript `content` as string.
   - transcript `content` as array.
   - polling statuses: queued, active, completed, failed.
   - extract failed maps to optional missing artifact rather than total failure when transcript exists.

5. HTTP route test:
   - `languageHint` and `productContext` are passed into the analysis request/model context.

6. Expo adapter smoke/unit test if needed:
   - `partial_ready` with `missingArtifacts:["visual_extract"]`, usable `recipe`, usable `cutBoard`, and thumbnail maps successfully.
   - `failed` still shows the current error path.

### Observability

Add redacted bounded provider trace fields for local debugging:

- request id.
- provider stage name.
- duration ms.
- success/failure status.
- metadata present fields only, not full raw payload.
- transcript segment count and total character count only, not full transcript.
- extract status and error code/message summary.
- model provider and model name.
- model output byte length and top-level shape preview only.
- parse/validation error reason.

Do not log secrets, full transcripts, full model outputs, or authorization headers.

## Phase 2 — Transcript-first Draft Generation

Introduce a small model draft contract. Example shape:

```json
{
  "title": "string",
  "oneLineDescription": "string",
  "scenes": [
    {
      "title": "string",
      "durationSec": 5,
      "lineToSay": "string",
      "shootingGuideline": "string",
      "referenceObservation": "string",
      "referenceUsage": "string",
      "myTakeRelationship": "string",
      "successCriteria": ["string"]
    }
  ]
}
```

Implementation steps:

1. Add Go types for transcript-derived recipe draft.
2. Update prompt construction so the LLM is asked only for the small draft, not the full `ReferenceAnalysisResponse`.
3. Feed metadata, transcript segments, optional extract summary, niche, goal, language hint, and product context into the draft prompt.
4. Treat `/extract` failure as `missingArtifacts:["visual_extract"]` when transcript exists.
5. Build canonical `ReferenceAnalysisResponse` in Go:
   - `referenceMedia` from metadata and URL.
   - `breakdown` from transcript, draft, and optional extract summary.
   - `recipe` from draft scenes.
   - `cutBoard` from draft scenes with deterministic cut IDs and media refs.
   - `generation` from provider trace and missing artifacts.
6. Return `partial_ready` when transcript exists but visual extract is missing.
7. Return `ready` only when all required artifacts are present and no critical missing artifacts remain.

## Phase 3 — ModelProvider Abstraction

Add a backend model abstraction while keeping the first pass compatible with current Replicate config.

Suggested interface:

```go
type ModelProvider interface {
    GenerateJSON(ctx context.Context, req ModelRequest) (ModelResult, error)
}
```

Suggested config:

```txt
REFERENCE_MODEL_PROVIDER=replicate|openai|gemini|anthropic
REFERENCE_MODEL_NAME=...
REPLICATE_API_TOKEN=...
OPENAI_API_KEY=...
GEMINI_API_KEY=...
ANTHROPIC_API_KEY=...
```

First implementation can:

- Keep existing Replicate provider working.
- Add scaffolding/interfaces for OpenAI, Gemini, and Anthropic.
- Avoid requiring all new providers to be fully live in the first pass if scope gets too large.
- Make provider selection explicit and testable.

## Phase 4 — Robust Parse/Repair and Fallback Policy

Parsing behavior:

- Strip markdown code fences.
- Accept valid wrapper shapes only if they contain a valid draft object.
- Reject unrecoverable truncated JSON with clear internal reason.
- Never silently accept empty scenes.

Fallback policy:

- metadata + transcript + model draft success + extract failure => `partial_ready` with usable board.
- metadata + transcript + model output repairable => success/partial success.
- metadata + transcript + model unrecoverable => `failed` with user-safe error and internal trace.
- metadata only, transcript unavailable => no fake analyzed board; return `failed` or board-less fallback according to existing contract.

## Phase 5 — Verification

Run bounded checks:

```bash
cd services/reference-api && go test ./...
```

If mobile tests are touched:

```bash
cd parrotkit-app
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-recipe-generation.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-provider.test.ts
```

If credentials are present, run a local real-link smoke test without printing secrets:

```bash
curl -sS -X POST http://127.0.0.1:8787/v1/reference-analysis \
  -H 'Content-Type: application/json' \
  -d '{
    "clientSchemaVersion":"parrotkit.expo.reference_recipe_generation.v1",
    "referenceUrl":"https://youtube.com/shorts/KalfC-2x-CQ?si=kZqrREZaoPxCFzIJ",
    "niche":"beauty",
    "goal":"ad",
    "languageHint":"en"
  }'
```

Expected smoke result after implementation:

- `status` is `ready` or `partial_ready`.
- `recipe.scenes` is non-empty.
- `cutBoard.items` is non-empty.
- if Supadata `/extract` still fails, `missingArtifacts` contains `visual_extract`.
- response is accepted by existing Expo mapping.

## Non-goals

- Do not redesign the Expo UI.
- Do not move provider secrets into Expo public env.
- Do not log raw secrets or full raw transcripts/model outputs.
- Do not create fake analyzed boards when transcript is unavailable.
- Do not commit, push, comment, or close issues.
