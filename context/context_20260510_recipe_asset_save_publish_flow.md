# 2026-05-10 Recipe Asset Save / Publish Flow

## Background
- User requested replacing the current Recipe Product creation screens with a creator-first save/publish flow based on the supplied PRD and visual direction.
- The intended product meaning changed from direct selling to saving a reusable Recipe Asset first, then optionally sharing, publishing, submitting to marketplace, or monetizing.
- User said the implementation does not have to be dark as long as it fits the current app concept.

## Changes
- Reworked `RecipesScreen` publish view into a local multi-step flow:
  - STEP 5-1 `Recipe complete!`
  - STEP 5-2 `Saved to My Recipes`
  - STEP 6-1 usage destination selection
  - STEP 6-2 marketplace / publish settings
  - submitted / ready state
- Added creator-first UI hierarchy:
  - large recipe cover preview
  - included asset list
  - Preview / Edit / Export actions
  - destination cards for Private, Client / Team Share, Profile Publish, Marketplace Submission
  - publish settings for category, visibility, access mode, optional paid price, and product includes
- Updated the Recipes tab CTA from Productize/sell copy to Recipe Asset packaging copy.
- Updated the shoot board CTA from Recipe Product / Sell-ready to Recipe Asset / marketplace optional copy.
- Updated `createRecipeProductDemoModel`:
  - includes `Sample takes`
  - modes now represent reuse/share/publish/marketplace destinations
  - status and action labels emphasize saving a Recipe Asset before publishing.
- Updated the demo model test expectations for the new asset package semantics.

## Verification
- Ran `cd parrotkit-app && npx tsc --noEmit`: passed.
- Ran `git diff --check`: passed.
- Verified in iOS Simulator with Metro:
  - Recipes tab CTA opens STEP 5-1.
  - `Save as Recipe Asset` advances to STEP 5-2.
  - `Choose usage option` advances to STEP 6-1.
  - Selecting `Marketplace Submission` then `Continue` advances to STEP 6-2.
  - Selecting `Paid` reveals the price setting and changes the bottom CTA to `Publish Recipe Product`.

## Notes
- This remains a mock/demo flow. Save, publish, and marketplace submission state is local screen state only.
- Actual share link generation, profile publish persistence, marketplace review status, and monetization backend are out of scope for this pass.
