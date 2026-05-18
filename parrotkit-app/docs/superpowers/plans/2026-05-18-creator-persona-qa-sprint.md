# Creator Persona QA Sprint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run ParrotKit as five creator personas, record QA findings, and implement the smallest changes that improve creator confidence and app-review readiness.

**Architecture:** Keep QA evidence in `docs/qa/creator-persona-qa.md`. Keep product fixes scoped to existing feature surfaces: Explore, recipe detail, shoot board, camera/prompter, recipe creation, and app-review config/docs. Use model-level tests for new review/readiness rules where behavior is data-driven.

**Tech Stack:** Expo Router, React Native, TypeScript, NativeWind, Expo Camera, Expo Media Library, EAS config.

---

### Task 1: Persona QA Matrix

**Files:**
- Create: `docs/qa/creator-persona-qa.md`

- [ ] **Step 1: Define five personas**

Create personas for beauty UGC, food shorts, app demo, brand marketer, and first-time creator.

- [ ] **Step 2: Walk each route**

Visit `/`, `/explore`, `/explore-recipe/<id>`, `/recipe/<id>`, `/recipe/<id>/prompter`, `/quick-shoot`, `/recipe-create`, `/recipes`, `/source`, and `/my`.

- [ ] **Step 3: Record findings**

For each persona, record what felt ready to shoot, what blocked confidence, what could fail app review, and what to change.

### Task 2: Review-Safe Product Copy And Metadata

**Files:**
- Modify: `app.json`
- Modify: `docs/app-review-readiness.md`
- Modify or create: app UI files only if review-critical copy appears in the app

- [ ] **Step 1: Verify permission copy**

Run `node node_modules/expo/bin/cli config --type public` and confirm camera, microphone, and media library copy is specific to user-initiated recording/export.

- [ ] **Step 2: Document store review gaps**

Keep unresolved external requirements such as App Store Connect app record, privacy policy URL, screenshots, and device permission verification in `docs/app-review-readiness.md`.

### Task 3: Creator Confidence Fixes

**Files:**
- Modify: `src/features/recipes/lib/shoot-board-model.ts`
- Modify: `src/features/recipes/components/shoot-board-scene-card.tsx`
- Modify: `src/features/recipes/screens/recipe-detail-screen.tsx`
- Test: `src/features/recipes/lib/shoot-board-model.test.ts`

- [ ] **Step 1: Add failing model checks**

Add checks that every generated cut exposes a frame cue, first action, and setup cue, while custom added cuts remain blank.

- [ ] **Step 2: Implement data and UI**

Expose the cues in the shoot board header and each expanded cut.

- [ ] **Step 3: Verify**

Run `node ./node_modules/typescript/bin/tsc --noEmit`, `node node_modules/expo/bin/cli config --type public`, and confirm `http://localhost:8081/recipe/recipe-korean-diet-hook` returns 200.

### Task 4: Final QA Evidence

**Files:**
- Modify: `docs/qa/creator-persona-qa.md`

- [ ] **Step 1: Update pass/fail status**

Record implemented fixes, deferred risks, and review blockers.

- [ ] **Step 2: Leave next decisions explicit**

Document the next work: privacy policy page/link, store screenshots, physical-device camera/media permission QA, and any backend data-safety update once real accounts or analytics are added.
