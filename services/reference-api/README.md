# ParrotKit Reference API

Go runtime for live short-form reference analysis.

The mobile Paste drawer calls:

```text
POST /v1/reference-analysis
```

The service keeps Super Data/Supadata and Replicate credentials server-side, then returns the canonical `parrotkit.reference_analysis_response.v1` contract. The Expo app only consumes usable `ready` or `partial_ready` responses; it does not silently create fake analyzed boards unless local dev fallback is explicitly enabled.

## Local Run

From the repo root, start the Go API with root `.env.local` loaded:

```bash
npm run dev:reference-api
```

That command hides secret values, defaults `PORT=8787`, and sets
`PARROTKIT_ALLOW_DEV_UNAUTH=true` for the local process only.

Manual equivalent:

```bash
cd services/reference-api
SUPERDATA_API_KEY="..." \
REPLICATE_API_TOKEN="..." \
PARROTKIT_ALLOW_DEV_UNAUTH=true \
go run ./cmd/reference-api
```

Health check:

```bash
curl http://localhost:8787/healthz
```

Analyze a link:

```bash
curl -X POST http://localhost:8787/v1/reference-analysis \
  -H 'Content-Type: application/json' \
  -d '{
    "clientSchemaVersion": "parrotkit.expo.reference_recipe_generation.v1",
    "referenceUrl": "https://www.youtube.com/shorts/example",
    "niche": "beauty",
    "goal": "ad",
    "languageHint": "ko"
  }'
```

## Env

Required:

```bash
SUPERDATA_API_KEY="..."
REPLICATE_API_TOKEN="..."
```

Supported aliases:

```bash
SUPADATA_API_KEY="..."
SUPADATA_API_TOKEN="..."
```

Optional:

```bash
PORT="8787"
SUPERDATA_API_BASE_URL="https://api.supadata.ai/v1"
REPLICATE_API_BASE_URL="https://api.replicate.com/v1"
REPLICATE_REFERENCE_MODEL="google/gemini-2.5-flash"
REFERENCE_ANALYSIS_TIMEOUT_MS="90000"
PARROTKIT_ALLOW_DEV_UNAUTH="true"
```

`PARROTKIT_ALLOW_DEV_UNAUTH=true` is only for local testing. Without it, the endpoint requires a Bearer auth header placeholder so the service is not accidentally exposed unauthenticated.

## Expo Wiring

In `parrotkit-app/.env.local`:

```bash
EXPO_PUBLIC_PARROTKIT_API_URL="http://localhost:8787"
EXPO_PUBLIC_REFERENCE_ANALYSIS_DEV_FALLBACK=""
```

For a physical iPhone on the same network, run Expo from the repo root with the
Go API port:

```bash
PARROTKIT_LAN_IP=192.168.0.10 npm run dev:mobile:lan
```

If `PARROTKIT_LAN_IP` is omitted, the script attempts to detect a LAN IPv4
address. The script refuses `:3000` because reference analysis must call the Go
API on `:8787`, not the old Next dev server.

Keep `EXPO_PUBLIC_REFERENCE_ANALYSIS_DEV_FALLBACK` blank unless you are deliberately testing the old local fallback board.

## Docker

```bash
cd services/reference-api
docker build -t parrotkit-reference-api .
docker run --rm -p 8787:8787 \
  -e SUPERDATA_API_KEY \
  -e REPLICATE_API_TOKEN \
  -e PARROTKIT_ALLOW_DEV_UNAUTH=true \
  parrotkit-reference-api
```
