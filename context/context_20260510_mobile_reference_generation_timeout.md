# 2026-05-10 Mobile Reference Generation Timeout

## Background
- On the iPhone Release local bundle, pasting a YouTube URL showed the `AI Breakdown` screen but did not quickly open the generated recipe.
- Local Next logs confirmed the mobile API was reachable and returned `200`, but response latency was about 30-35 seconds.
- For the phone demo, the app should not feel stuck behind server-side transcript/LLM latency.

## Changes
- Exported `buildLocalFallbackResult` from the RN reference generation helper.
- Updated the recipe create Link mode flow to race the API result against a 10 second local fallback.
- Preserved the existing behavior when the API responds before the timeout.
- Added a guarded `safelyOpenGeneratedRecipe` path so route/open errors are surfaced on the generation splash.
- Added a ready-state `Open recipe board` CTA as a manual recovery path.
- Passed `videoUrl` into `createRecipeDraft` for generated YouTube recipes so the draft platform/source are correct.

## Verification
- Ran `cd parrotkit-app && npx tsx src/features/recipes/lib/reference-recipe-generation.test.ts`: passed.
- Ran `cd parrotkit-app && npx tsc --noEmit`: passed.
- Built iOS Release local bundle with:
  - `EXPO_PUBLIC_PARROTKIT_API_URL=http://172.30.1.31:3000`
  - `ENTRY_FILE=node_modules/expo-router/entry.js`
- Installed the Release app directly with `xcrun devicectl device install app`.
- Launched `com.anonymous.parrotkitapp` on `iPhone 13 Pro (3)` successfully.

## Notes
- `ENTRY_FILE=node_modules/expo-router/entry.js` is required for this local Release build because the project path contains Korean characters and Xcode/Metro can disagree on Unicode path normalization.
- The local Next API server still needs to be running at `http://172.30.1.31:3000` for live server generation. If it is slow, the app now opens a local fallback recipe instead of waiting indefinitely.
