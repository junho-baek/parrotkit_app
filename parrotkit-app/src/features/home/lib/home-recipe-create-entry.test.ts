import { getHomeRecipeCreateEntry } from "./home-recipe-create-entry";

const koreanEntry = getHomeRecipeCreateEntry("ko");

if (koreanEntry.label !== "레시피 생성") {
  throw new Error("Home recipe creation entry must use Korean recipe creation language.");
}

if (koreanEntry.destination !== "/recipe-create?mode=manual") {
  throw new Error("Home recipe creation entry must open the blank/manual recipe creation flow.");
}

if (koreanEntry.accessibilityLabel !== "레시피 생성") {
  throw new Error("Home recipe creation entry accessibility label must use Korean recipe creation language.");
}

if (/슛|촬영/.test(`${koreanEntry.label} ${koreanEntry.accessibilityLabel}`)) {
  throw new Error("Home recipe creation entry must not use Korean shoot-language for the blank creation CTA.");
}

const englishEntry = getHomeRecipeCreateEntry("en");

if (englishEntry.label !== "Create recipe") {
  throw new Error("Home recipe creation entry should use English recipe creation language.");
}

if (englishEntry.destination !== "/recipe-create?mode=manual") {
  throw new Error("Home recipe creation entry should use the same blank/manual destination in English.");
}

if (englishEntry.accessibilityLabel !== "Create recipe") {
  throw new Error("Home recipe creation entry accessibility label must use English recipe creation language.");
}

if (/shoot/i.test(`${englishEntry.label} ${englishEntry.accessibilityLabel}`)) {
  throw new Error("Home recipe creation entry must not use English shoot-language for the blank creation CTA.");
}
