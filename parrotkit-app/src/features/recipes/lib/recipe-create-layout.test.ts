import { getRecipeCreateScrollBottomPadding } from "./recipe-create-layout";

const iphoneSePadding = getRecipeCreateScrollBottomPadding(0);
const iphoneHomeIndicatorPadding = getRecipeCreateScrollBottomPadding(34);

if (iphoneSePadding !== 138) {
  throw new Error("Create screen needs enough bottom padding to lift lower cards above the sticky CTA on compact iPhones.");
}

if (iphoneHomeIndicatorPadding !== 172) {
  throw new Error("Create screen needs home-indicator-aware bottom padding above the sticky CTA.");
}

if (iphoneHomeIndicatorPadding - iphoneSePadding !== 34) {
  throw new Error("Create screen bottom padding should preserve safe-area bottom inset exactly once.");
}
