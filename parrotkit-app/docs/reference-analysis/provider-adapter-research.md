# Provider Adapter Research For Reference Analysis

Date: 2026-05-17

## Decision

Keep ParrotKit's core contract provider-neutral:

1. `ReferenceMediaExtractionAdapter` turns a public reference URL into `NormalizedReferenceMediaInput` plus optional transcript segments and frame descriptions.
2. `ReferenceAnalysisModelAdapter` accepts normalized media plus the ParrotKit prompt contract and returns validated `ReferenceBreakdownArtifact` and `ShootingBoardProjection`.
3. Provider request IDs, logs, queue IDs, raw errors, raw outputs, and model names stay in `internalTrace`. Client read models only receive stable statuses, stable error codes, artifact IDs, and user-safe messages.

## Provider Notes

### Supadata / SuperData Assumption

The user called this "SuperData"; the official service that matches the described transcript/video structured extraction API appears to be Supadata. Keep `superdata` as an alias in app-level wording if needed, but implement the adapter under a generic provider name.

Supadata facts from official docs:

- API base URL: `https://api.supadata.ai/v1`; auth uses the `x-api-key` header.
- Transcript endpoint: `GET /transcript` with `url`, optional `lang`, `text`, `chunkSize`, and `mode` query params. It supports YouTube, TikTok, Instagram, X/Twitter, Facebook, and public file URLs. It can return HTTP 200 with transcript content or HTTP 202 with a job ID; job results are fetched from `/transcript/{jobId}`.
- Extract endpoint: `POST /extract` with `url` plus `prompt`, `schema`, or both. It returns a job ID and results are polled from `/extract/{jobId}`. The endpoint analyzes video content and can return structured data matching a JSON Schema.
- Important boundary: Supadata's `/extract` docs say it analyzes what is seen/heard, but does not retrieve transcripts, titles, descriptions, or platform metrics. Use dedicated Transcript/Metadata endpoints for those.

Sources:

- https://docs.supadata.ai/api-reference/introduction
- https://docs.supadata.ai/api-reference/endpoint/transcript/transcript
- https://docs.supadata.ai/api-reference/endpoint/transcript/transcript-get
- https://docs.supadata.ai/get-extract
- https://docs.supadata.ai/api-reference/endpoint/extract/extract
- https://docs.supadata.ai/api-reference/endpoint/extract/extract-get

### Replicate

Replicate should be treated as a model runner, not the product contract. Model-specific input schemas vary, so each Replicate model needs a request mapper.

Replicate facts from official docs:

- Auth uses `Authorization: Bearer $REPLICATE_API_TOKEN`.
- Predictions can be created and then fetched by prediction ID.
- Prediction objects include status, output, error, logs, metrics, and URLs. Terminal statuses include succeeded, failed, and canceled.
- Webhooks can be requested on prediction creation using `webhook` and `webhook_events_filter`; `completed` webhooks are the clean fit for worker-based analysis.
- Input schemas depend on the specific model/version, so the adapter should not assume one universal video field name.
- API prediction inputs/outputs/logs are removed after an hour by default, so the worker must persist the generated Breakdown/projection immediately.

Sources:

- https://replicate.com/docs/reference/http/
- https://replicate.com/docs/topics/predictions/create-a-prediction
- https://replicate.com/docs/topics/webhooks/setup-webhook
- https://replicate.com/docs/topics/webhooks/receive-webhook

### Gemini

Gemini is the strongest direct video-analysis path for this feature.

Gemini facts from official docs:

- Gemini can process video and understand visual/audio streams.
- Inputs can be uploaded with the File API, passed inline for smaller videos, or passed as YouTube URLs.
- Supported video MIME types include MP4, MPEG, MOV, AVI, FLV, MPG, WEBM, WMV, and 3GPP.
- File API processing samples video frames and audio, and adds timestamps.
- Structured output is available through `responseMimeType: "application/json"` and a `responseSchema`.

Sources:

- https://ai.google.dev/gemini-api/docs/video-understanding
- https://ai.google.dev/gemini-api/docs/structured-output

### OpenAI

OpenAI is a good structured-output model adapter after media has been normalized into transcript, frame descriptions, and thumbnails/still frames. Keep raw video handling behind a separate media extraction/sampling step unless the selected model/API explicitly supports the required video input path.

OpenAI facts from official docs:

- The Responses API supports text and image inputs and text/JSON outputs.
- Structured Outputs use JSON Schema and strict schema adherence. JSON mode alone only guarantees valid JSON, not schema conformance.

Sources:

- https://platform.openai.com/docs/api-reference/responses?api-mode=responses
- https://platform.openai.com/docs/guides/structured-outputs?api-mode=responses

### Claude / Anthropic

Claude is useful for transcript+image-frame analysis and structured JSON, but should not be the first raw-video adapter unless the chosen runtime provides sampled frames/video preprocessing.

Anthropic facts from official docs:

- Claude Messages supports image inputs using base64, URL image source blocks, or Files API references.
- Current Claude models support text and image input with text output.
- Structured outputs are available through `output_format` with JSON Schema in beta, or strict tool use for validated tool inputs.

Sources:

- https://docs.claude.com/en/docs/build-with-claude/vision
- https://platform.claude.com/docs/en/api/messages-examples
- https://docs.claude.com/en/docs/build-with-claude/structured-outputs
- https://docs.claude.com/en/docs/about-claude/models/overview

## Adapter Shape

```ts
type ReferenceMediaExtractionAdapter = {
  provider: ReferenceAnalysisProviderKind;
  normalizeLink(input: ReferenceLinkNormalizationInput): Promise<ReferenceMediaExtractionResult>;
};

type ReferenceAnalysisModelAdapter = {
  provider: ReferenceAnalysisProviderKind;
  analyze(input: ReferenceAnalysisModelAdapterInput): Promise<ReferenceAnalysisProviderResult>;
};
```

## Env Names

- Required for the current live v1 path:
  - `SUPERDATA_API_KEY` for reference URL metadata/transcript/extract. `SUPADATA_API_KEY` remains a supported legacy alias because the vendor docs use Supadata naming.
  - `REPLICATE_API_TOKEN` for Replicate-hosted Gemini/Claude/OpenAI models.
- Not required for the current Replicate-based v1:
  - `GEMINI_API_KEY`
  - `OPENAI_API_KEY`
  - `ANTHROPIC_API_KEY`

These must live server-side only. The Expo client should call a ParrotKit backend endpoint that creates/polls jobs.

## Recommended First Live Implementation

1. Start with Supadata `/extract` using ParrotKit's JSON Schema and prompt because it can accept a reference URL directly and return structured video analysis.
2. In parallel call Supadata `/transcript` for richer transcript segments and partial recovery if `/extract` omits transcript detail.
3. Persist returned JSON immediately, validate with `createReferenceAnalysisProviderResult`, and map failure cases through stable error codes.
4. Add Replicate/Gemini as the next adapter when we need more control over model choice or direct Gemini video understanding.
5. Use OpenAI/Claude adapters on normalized transcript+sampled frame inputs, not as the first raw link ingestion path.
