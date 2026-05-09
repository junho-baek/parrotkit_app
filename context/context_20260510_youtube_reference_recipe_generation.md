# 2026-05-10 YouTube Reference Recipe Generation

## Background
- User requested a minimal Paste Reference flow for recipe creation, starting with YouTube Shorts only.
- The goal was not frame-level video analysis yet. The demo requirement was: paste a Shorts URL, show AI breakdown, generate a practical Hook / Proof / Demonstration / CTA UGC recipe, then open the Recipe Board.
- Existing web-side Supadata and Replicate Gemini helpers were available and reused through a mobile-friendly API route.

## Changes
- Added `POST /api/mobile/reference-recipe`:
  - accepts `referenceUrl`, `niche`, and `goal`
  - supports YouTube Shorts/watch/youtu.be URLs
  - attempts Supadata metadata/transcript extraction
  - calls Replicate `google/gemini-2.5-flash` for strict JSON recipe generation
  - falls back to a local 4-scene recipe if transcript or LLM generation fails
  - returns canonical scene titles: `Hook`, `Proof`, `Demonstration`, `CTA`
- Added RN reference generation helper:
  - YouTube URL parsing
  - YouTube thumbnail fallback
  - generation API client with 45s timeout
  - local fallback result
  - generated recipe to `MockRecipeScene` mapping
- Updated New Recipe drawer Link mode:
  - CTA becomes `Generate recipe`
  - empty/non-YouTube URL disables generation
  - helper copy states this demo supports YouTube Shorts only
  - generation shows a thumbnail-led AI Breakdown splash with six steps
  - generated recipe is saved into the mock workspace and routed to the existing Recipe Board
- Extended `createRecipeDraft` with optional generated recipe fields:
  - `description`
  - `thumbnail`
  - `generationStatus`
  - `shootStatus`
  - custom generated scenes

## Verification
- Ran `cd parrotkit-app && npx tsx src/features/recipes/lib/reference-recipe-generation.test.ts`: passed.
- Ran `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`: passed.
- Ran `cd parrotkit-app && npx tsc --noEmit`: passed.
- Ran `npx eslint src/app/api/mobile/reference-recipe/route.ts`: passed.
- Ran local Next API smoke against `http://localhost:3100/api/mobile/reference-recipe` with `https://www.youtube.com/shorts/dtnIqkMmbs0`:
  - returned 4 scenes
  - scene titles were `Hook`, `Proof`, `Demonstration`, `CTA`
  - `generation.status` returned `generated`
  - `fallbackUsed` returned `false`
- Ran iOS Simulator smoke with Metro:
  - opened New recipe drawer
  - selected Link mode
  - pasted the supplied YouTube Shorts URL
  - verified `Generate recipe` enabled
  - verified AI Breakdown splash
  - verified generated 4-cut Recipe Board opened
- Ran root `npx tsc --noEmit --pretty false`; it still fails because the root project includes existing RN alias/FormData/pdf-parse issues unrelated to this change. The targeted app typecheck and API route lint passed.

## Notes
- The mobile app uses `EXPO_PUBLIC_PARROTKIT_API_URL` when configured, otherwise falls back to `https://parrotkit-deploy.vercel.app`.
- Until the new API route is deployed, simulator builds pointed at the deployed URL will use the local app fallback after the API response fails.
- Supadata may fail or rate-limit per request; the API still attempts Gemini generation from available title/URL/niche/goal context and falls back only if LLM generation fails.
