# Creator Persona QA Sprint

Date: 2026-05-18
Branch: codex/native-app-dev
Scope: Creator satisfaction, web preview usability, and app review readiness foundation.

## Summary

ParrotKit now presents recipe outputs closer to a shoot-ready plan instead of a passive content card. The QA focus was whether a creator can open a guide, understand what to shoot first, move into the cuts board, and see review-safe permission and navigation behavior.

Status: Ready for internal creator QA. Not yet store-submit-ready until external store assets, privacy URLs, production credentials, and device permission checks are completed.

## Implemented During This Sprint

- Added shot-ready fields to generated shoot-board cuts: frame, first action, and setup cue.
- Added a ready-to-shoot plan card on recipe detail pages.
- Added a scene-level shooting brief rail on the cuts board.
- Reworded camera and library permission copy to avoid native/debug terminology.
- Added review foundation files and metadata: app identifiers, permission copy, privacy manifest, and EAS config.
- Replaced web-unstable tab rendering with stable Expo Router tabs for browser preview.
- Removed nested interactive controls in home and explore surfaces where web QA flagged them.

## Persona QA

### 1. Beauty UGC Creator

Profile: A short-form beauty creator preparing a purchase-conversion clip for a cosmetic product.

Flow tested:
- `/explore`
- Beauty partner recipe detail
- Shoot board from the recipe

Result: Pass with improvements applied.

Findings:
- The hero, hook, partner/verified state, and structure preview made the guide feel credible.
- The earlier gap was that the creator still had to mentally translate "Scene #1: Hook" into camera action.
- The new ready-to-shoot plan and scene brief make the first shot more concrete: what frame to start with, what action happens first, and what setup is needed.

Remaining risk:
- Store screenshots and recipe copy should avoid implying guaranteed cosmetic results.

### 2. Food Shorts Creator

Profile: A creator filming a food or diet recipe clip with fast visual proof.

Flow tested:
- Recipe list
- Korean diet hook recipe
- Cuts board
- Prompter route

Result: Pass.

Findings:
- The creator can now see each cut as a filming unit, not only as a narrative beat.
- Shot-ready metadata helps answer "What do I point the camera at first?"
- Prompter permission copy is review-safe and understandable.

Remaining risk:
- Actual camera capture still needs physical device QA before store submission.

### 3. App Demo Creator

Profile: A founder or product creator making a problem-hook app demo.

Flow tested:
- Explore product/demo-style guides
- Recipe create manual/remix route
- Shoot board structure

Result: Internal pass, production caveat.

Findings:
- The product-demo recipe model is discoverable and remixable.
- The workflow supports turning a reference into a concrete shot plan.

Remaining risk:
- Some create/remix surfaces remain mock or scaffold-level. This is acceptable for internal QA but should be explicitly finished or scoped before public launch.

### 4. Brand Marketer

Profile: A brand-side user checking whether a creator can follow a branded brief.

Flow tested:
- Explore brand/partner cards
- Apply action
- Verified guide presentation

Result: Pass for concept validation.

Findings:
- Partner and brand contexts are visible enough for a marketer to understand the intended workflow.
- The recipe format encourages consistent deliverables: hook, proof, CTA, timing, and required checklist.

Remaining risk:
- Brand request submission, moderation, and legal copy need product decisions before store launch if exposed publicly.

### 5. First-Time Creator / App Reviewer

Profile: A first-time user or app reviewer opening the app without creator context.

Flow tested:
- `/`
- `/explore`
- `/recipes`
- `/source`
- `/my`
- `/quick-shoot`

Result: Pass after navigation stabilization.

Findings:
- Main tab routes render in web preview after replacing unstable native tab rendering.
- Camera permission copy explains the user-facing reason for access.
- No developer-only wording remains in the tested camera permission surfaces.

Remaining risk:
- Reviewer account, privacy policy URL, screenshots, and data-safety declarations are external launch blockers.

## Browser QA Evidence

| Route | Expected | Result |
| --- | --- | --- |
| `/` | Home workspace loads | Pass |
| `/explore` | Explore catalog loads without nested buttons | Pass after fix |
| `/explore-recipe/market-recipe-beauty-proof-routine` | Public recipe detail loads | Pass |
| `/recipe/recipe-korean-diet-hook` | Shoot board loads with shoot-ready plan | Pass |
| `/recipe/recipe-korean-diet-hook/prompter?sceneId=scene-1` | Prompter loads with review-safe permission copy | Pass |
| `/quick-shoot` | Quick shoot loads with review-safe permission copy | Pass |
| `/recipe-create?mode=reference` | Recipe creation entry loads | Pass |
| `/recipes` | Recipe library loads | Pass |
| `/source` | Source library loads | Pass |
| `/my` | Profile/settings route loads | Pass |

## App Review Readiness

Prepared:
- App display identity and package identifiers.
- Camera and media-library permission descriptions.
- Apple privacy manifest baseline.
- EAS build profile baseline.
- Internal app review checklist.
- Creator persona QA evidence.

Still required outside code:
- Apple Developer app record and App Store Connect metadata.
- Google Play Console app content and Data Safety form.
- Privacy policy URL and support URL.
- Production Supabase/API/Gemini credentials.
- Licensed screenshot and preview media set.
- Physical iOS and Android device permission QA.
- Final decision on analytics, account deletion, and user-generated content moderation if those features are enabled for review.

## Recommendation

Proceed with one more device QA pass using a real creator flow:

1. Open a recipe from Explore.
2. Save or apply it.
3. Enter the shoot board.
4. Start prompter or quick shoot.
5. Grant and deny permissions once each.
6. Confirm captured media behavior on iOS and Android.

Once that pass is clean and store metadata is prepared, this branch is a reasonable base for a draft PR toward app review readiness.
