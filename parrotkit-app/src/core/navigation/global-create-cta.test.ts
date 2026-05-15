import {
  getGlobalCreateCta,
  getGlobalCreateCtaDestination,
  shouldShowGlobalCreateCta,
} from "./global-create-cta";

const koreanCta = getGlobalCreateCta("ko");

if (koreanCta.label !== "레시피 생성") {
  throw new Error("Floating creation CTA must use the corrected Korean recipe creation label.");
}

if (koreanCta.accessibilityLabel !== "레시피 생성") {
  throw new Error("Floating creation CTA accessibility label must use the corrected Korean label.");
}

if (getGlobalCreateCtaDestination() !== "/recipe-create?mode=manual") {
  throw new Error("Floating creation CTA must open the blank/manual recipe creation flow.");
}

if (shouldShowGlobalCreateCta("/")) {
  throw new Error("Floating creation CTA should hide on Home because Home has its own recipe creation entry.");
}

if (shouldShowGlobalCreateCta("/recipe-create")) {
  throw new Error("Floating creation CTA should hide while the create flow is open.");
}

const englishCta = getGlobalCreateCta("en");

if (englishCta.label.includes("Shoot") || englishCta.label.includes("Source")) {
  throw new Error("Floating creation CTA must not use Shoot or Source language.");
}
