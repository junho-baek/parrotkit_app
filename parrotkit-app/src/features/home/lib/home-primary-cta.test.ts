import {
  getHomePrimaryCta,
  getHomePrimaryCtaDestination,
} from "./home-primary-cta";

const continuingEnglish = getHomePrimaryCta({
  hasContinueRecipe: true,
  language: "en",
  recipeTitle: "Morning Launch Hook",
});

if (continuingEnglish.workflowLabel !== "Creator workflow") {
  throw new Error("Home primary CTA must label the creator workflow in English.");
}

if (continuingEnglish.title !== "Continue Morning Launch Hook") {
  throw new Error("Home primary CTA must clearly name the recipe workflow to continue.");
}

if (continuingEnglish.actionLabel !== "Continue workflow") {
  throw new Error("Home primary CTA must use a continuation-oriented primary action.");
}

const startingEnglish = getHomePrimaryCta({
  hasContinueRecipe: false,
  language: "en",
});

if (startingEnglish.title !== "Start blank recipe workflow") {
  throw new Error("Home primary CTA must name the blank workflow when there is no recent recipe.");
}

if (startingEnglish.actionLabel !== "Create recipe") {
  throw new Error("Home primary CTA empty state must open the manual recipe creation path.");
}

const continuingKorean = getHomePrimaryCta({
  hasContinueRecipe: true,
  language: "ko",
  recipeTitle: "런칭 훅",
});

if (continuingKorean.workflowLabel !== "크리에이터 워크플로우") {
  throw new Error("Home primary CTA must label the creator workflow in Korean.");
}

if (continuingKorean.title !== "런칭 훅 이어하기") {
  throw new Error("Home primary CTA Korean title must clearly name the workflow to continue.");
}

const startingKorean = getHomePrimaryCta({
  hasContinueRecipe: false,
  language: "ko",
});

if (startingKorean.actionLabel !== "레시피 생성") {
  throw new Error("Home primary CTA Korean blank creation action must use 레시피 생성.");
}

const continueDestination = getHomePrimaryCtaDestination({
  createDestination: "/recipe-create?mode=manual",
  recipeId: "recipe-korean-diet-hook",
});

if (continueDestination !== "/recipe/recipe-korean-diet-hook") {
  throw new Error("Home primary CTA must open the selected creator workflow shoot board directly.");
}

const createDestination = getHomePrimaryCtaDestination({
  createDestination: "/recipe-create?mode=manual",
});

if (createDestination !== "/recipe-create?mode=manual") {
  throw new Error("Home primary CTA must open the manual creation step when no workflow exists.");
}
