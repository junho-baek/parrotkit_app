import {
  getHomePrimaryCta,
  getHomePrimaryCtaDestination,
} from "./home-primary-cta";

const continuingEnglish = getHomePrimaryCta({
  hasContinueRecipe: true,
  language: "en",
  recipeTitle: "Morning Launch Hook",
});

function assertStableHomeCopy(copy: Record<string, string>, label: string) {
  const userFacingCopy = Object.values(copy).join(" ");

  if (/workflow|워크플로우|Shoot|New Shoot|Start Shoot|console|debug/i.test(userFacingCopy)) {
    throw new Error(`${label} must stay concise, recipe-oriented, and free of workflow/debug wording.`);
  }
}

if (continuingEnglish.recipeLabel !== "Creator recipe") {
  throw new Error("Home primary CTA must label the creator recipe in English.");
}

if (continuingEnglish.title !== "Continue Morning Launch Hook") {
  throw new Error("Home primary CTA must clearly name the recipe to continue.");
}

if (continuingEnglish.actionLabel !== "Continue recipe") {
  throw new Error("Home primary CTA must use recipe-oriented continuation copy.");
}

assertStableHomeCopy(continuingEnglish, "Continuing English Home primary CTA");

const startingEnglish = getHomePrimaryCta({
  hasContinueRecipe: false,
  language: "en",
});

if (startingEnglish.title !== "Create a blank recipe") {
  throw new Error("Home primary CTA must name the blank recipe when there is no recent recipe.");
}

if (startingEnglish.actionLabel !== "Create recipe") {
  throw new Error("Home primary CTA empty state must open the manual recipe creation path.");
}

assertStableHomeCopy(startingEnglish, "Starting English Home primary CTA");

const continuingKorean = getHomePrimaryCta({
  hasContinueRecipe: true,
  language: "ko",
  recipeTitle: "런칭 훅",
});

if (continuingKorean.recipeLabel !== "크리에이터 레시피") {
  throw new Error("Home primary CTA must label the creator recipe in Korean.");
}

if (continuingKorean.title !== "런칭 훅 이어하기") {
  throw new Error("Home primary CTA Korean title must clearly name the recipe to continue.");
}

assertStableHomeCopy(continuingKorean, "Continuing Korean Home primary CTA");

const startingKorean = getHomePrimaryCta({
  hasContinueRecipe: false,
  language: "ko",
});

if (startingKorean.actionLabel !== "레시피 생성") {
  throw new Error("Home primary CTA Korean blank creation action must use 레시피 생성.");
}

assertStableHomeCopy(startingKorean, "Starting Korean Home primary CTA");

const continueDestination = getHomePrimaryCtaDestination({
  createDestination: "/recipe-create?mode=manual",
  recipeId: "recipe-korean-diet-hook",
});

if (continueDestination !== "/recipe/recipe-korean-diet-hook") {
  throw new Error("Home primary CTA must open the selected creator recipe board directly.");
}

const createDestination = getHomePrimaryCtaDestination({
  createDestination: "/recipe-create?mode=manual",
});

if (createDestination !== "/recipe-create?mode=manual") {
  throw new Error("Home primary CTA must open the manual creation step when no recipe exists.");
}
