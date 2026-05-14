const CREATE_FOOTER_TOP_PADDING = 14;
const CREATE_CTA_MIN_HEIGHT = 56;
const CREATE_CARD_TAP_CLEARANCE = 68;

export function getRecipeCreateScrollBottomPadding(bottomInset: number): number {
  return bottomInset + CREATE_FOOTER_TOP_PADDING + CREATE_CTA_MIN_HEIGHT + CREATE_CARD_TAP_CLEARANCE;
}
