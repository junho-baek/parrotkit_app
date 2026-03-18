# ParrotKit UI QA Follow-ups Batch

- Project: Parrotkit
- Report Type: qa
- Artifact: output/playwright/20260318_ui_qa_my_order_and_session.png

## Purpose
- Capture the March 18 UI QA follow-up fixes for bottom navigation, paste form styling, session refresh, My Page ordering, Pricing navigation, and recipe CTA updates.

## Scope
- Bottom tab icon treatment and active state cleanup
- Paste form text/placeholder contrast and Analyze Video CTA color
- Session refresh behavior after token expiry on My Page
- My Page section order and Pricing back navigation
- Recipes and Recipe view CTA gradient updates

## Results
- Bottom navigation now shows icon-only tabs without the inner icon box.
- Paste form inputs render dark text with softer placeholder contrast.
- Analyze Video, View Recipe, and Download now use the Instagram-tone gradient CTA treatment.
- Liked Videos now appears above Quick Actions on My Page.
- Pricing top and bottom back links both return to My Page.
- Expired access token state recovered on My Page when a refresh token was present.
- Recipe capture/export flow now keeps local captures available for download even if sync fails.

## Evidence
- `output/playwright/20260318_ui_qa_paste_gradient_button.png`
- `output/playwright/20260318_ui_qa_my_order_and_session.png`
- `output/playwright/20260318_ui_qa_pricing_back_to_my.png`
- `output/playwright/20260318_ui_qa_recipes_view_recipe_gradient.png`
- `output/playwright/20260318_ui_qa_recipe_result_download_and_shoot.png`

## Verification Notes
- `npx tsc --noEmit` passed
- `npx eslint ...` completed with warnings only for existing `img` usage
- Dev QA executed on `http://127.0.0.1:3000`
- Session refresh was validated by forcing `localStorage.tokenExpiresAt` into the past before reopening `/my`

## Next Steps
- Run a live manual camera capture pass to validate the `Saved locally` UX during an actual upload failure path.
