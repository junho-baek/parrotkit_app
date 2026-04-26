# ParrotKit App Web Recipe Parity Plan Context

## Date
2026-04-26

## Summary
Analyzed the web recipe implementation and wrote a detailed native app parity plan. The key finding is that the web product is scene-first and layered: `analysis`, `recipe`, and `prompter.blocks`. The app currently flattens this into mock summary strings and separates cue selection into a prompter planner, which makes the experience feel like a console instead of a creator shooting workflow.

## Web Findings
- `src/types/recipe.ts` defines `RecipeScene` with `analysis`, `recipe`, and `prompter.blocks`.
- `src/lib/recipe-scene.ts` normalizes legacy and generated payloads into that structure.
- `src/components/common/RecipeResult.tsx` renders a scene card list, then a selected scene workspace with Analysis, Recipe, and Shooting tabs.
- The web Recipe tab is a prompter cue selection/editing board, not just a script summary.
- `src/components/common/CameraShooting.tsx` displays only `PrompterBlock` items where `visible === true`.

## App Findings
- `parrotkit-app/src/core/mocks/parrotkit-data.ts` uses flat `analysisLines`, `recipeLines`, and `prompterLines`.
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx` shows console-like recipe summary metadata before the scene workflow.
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx` already has a useful native camera surface, but it consumes flat mock elements instead of web-compatible `prompter.blocks`.

## Plan
- Saved full implementation plan at `docs/superpowers/plans/2026-04-26-parrotkit-app-web-recipe-parity.md`.
- Also saved project plan at `plans/20260426_parrotkit_app_web_recipe_parity_plan.md`.

## Verification
- No app code was changed.
- Git status should show only the three plan/context documents before commit.
