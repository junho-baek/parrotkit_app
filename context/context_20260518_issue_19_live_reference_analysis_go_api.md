# 2026-05-18 Issue 19 Live Reference Analysis Go API

## Request

Implement the issue #19 reference-analysis path so the Expo Paste drawer can call a server-side API that uses Super Data/Supadata plus Replicate-hosted models to generate a real Breakdown, recipe, and cut board.

## Result

- Added `services/reference-api/`, a separate Go HTTP service with `GET /healthz` and `POST /v1/reference-analysis`.
- Added canonical `parrotkit.reference_analysis_response.v1` structs and validation rules:
  - `ready` and `partial_ready` require real media, breakdown, recipe, and usable cut board artifacts.
  - `failed` returns user-safe recovery copy and no board artifacts.
  - `fallback` cannot contain fake analyzed Breakdown or cut board content.
- Added Super Data/Supadata provider boundary for metadata, transcript, and extract artifacts.
- Added Replicate provider boundary for model predictions.
- Added prompt/schema layer that asks for Sandcastle-style whole-video analysis and compact shooting-board projection.
- Added deploy files:
  - `services/reference-api/Dockerfile`
  - `services/reference-api/README.md`
- Updated Expo Paste flow:
  - Calls `/v1/reference-analysis`.
  - Accepts `ready` and `partial_ready` only.
  - Keeps the drawer open with concise recovery copy on failure.
  - Uses local mock fallback only when `EXPO_PUBLIC_REFERENCE_ANALYSIS_DEV_FALLBACK=true`.
- Updated `parrotkit-app/.env.local.example` so local reference analysis points at the Go service.

## Files

- `services/reference-api/**`
- `parrotkit-app/.env.local.example`
- `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.ts`
- `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.test.ts`
- `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-create/recipe-create-copy.ts`
- `parrotkit-app/src/features/recipes/screens/recipe-create/reference-analysis-state.test.ts`

## Verification

- `cd services/reference-api && go test ./...` passed.
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-recipe-generation.test.ts` passed.
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-create/reference-analysis-state.test.ts` passed.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` passed.
- `npm run check:architecture` passed.

## Notes

- Real provider smoke testing still needs valid `SUPERDATA_API_KEY` and `REPLICATE_API_TOKEN`.
- Subscription, entitlement, durable Supabase jobs, and stored provider artifacts are intentionally deferred.
