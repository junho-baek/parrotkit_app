# Recipe Product Demo Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a demo-ready in-app flow that continues from shooting/export into "Reuse or sell as a Recipe Product."

**Architecture:** Keep this as a frontend-only demo slice. Add a small pure model/link helper for testable copy and routing, place a productization CTA at the end of the Shoot Board, and reuse the existing Recipes publish surface as a Recipe Product preview/publish screen.

**Tech Stack:** Expo Router, React Native, NativeWind, TypeScript, existing mock workspace provider, `tsx` file-level tests.

---

## Files
- Create: `parrotkit-app/src/features/recipes/lib/recipe-product-demo.ts`
- Create: `parrotkit-app/src/features/recipes/lib/recipe-product-demo.test.ts`
- Create: `parrotkit-app/src/features/recipes/components/shoot-board-product-cta.tsx`
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-draggable-list.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- Create: `context/context_20260510_recipe_product_demo_flow.md`

## Tasks
- [x] Write failing test for Recipe Product demo model and route helper.
- [x] Implement the pure model/helper.
- [x] Add a Shoot Board footer CTA that routes to the Recipe Product screen.
- [x] Convert the existing publish surface into a demo Recipe Product screen with reuse/sell, price, included items, and created state.
- [x] Run `recipe-product-demo.test.ts`, existing Shoot Board tests, TypeScript, and `git diff --check`.
- [x] Record context and commit/push only this task's files.

## Test Commands
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-product-demo.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## Rollback
- Remove the added CTA component/helper/test and restore the small route/publish-screen changes.

## Risks
- This is intentionally demo-only: it does not create a persisted marketplace product or payment listing.
- The existing worktree has unrelated dirty files (`package.json`, `parrotkit-app/package-lock.json`, `.superpowers/`); do not include them in the commit.

## Result
- Added a tested Recipe Product demo model and route helper.
- Added a Shoot Board footer CTA for "Turn into Recipe Product."
- Reworked the existing Recipes publish view into a demo Recipe Product screen with reuse/sell modes, price, included package items, and a local created state.
- Connected `Save/Edit/Export -> Reuse or sell as Recipe Product` for demo recording without backend marketplace persistence.
- Context: `context/context_20260510_recipe_product_demo_flow.md`
