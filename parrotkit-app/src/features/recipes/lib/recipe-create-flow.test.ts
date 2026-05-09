import {
  getRecipeCreateDraftContext,
  getRecipeCreateHref,
  getInitialRecipeCreateMode,
  getRecipeCreatePrimaryAction,
  isRecipeCreateModePro,
  recipeCreateGoals,
  recipeCreateModes,
  recipeCreateNiches,
} from "@/features/recipes/lib/recipe-create-flow";

if (getInitialRecipeCreateMode(undefined) !== "manual") {
  throw new Error("New recipe creation should default to manual shoot-board start.");
}

if (getInitialRecipeCreateMode("reference") !== "reference") {
  throw new Error("Explicit reference mode query params should still be respected.");
}

if (getInitialRecipeCreateMode("unknown") !== "manual") {
  throw new Error("Invalid create mode params should fall back to manual.");
}

if (recipeCreateModes.join(",") !== "manual,reference,brand") {
  throw new Error("Create mode tabs should put manual first, then reference and brand.");
}

if (!isRecipeCreateModePro("reference") || !isRecipeCreateModePro("brand")) {
  throw new Error("Reference link and Brand context modes should be marked Pro.");
}

if (isRecipeCreateModePro("manual")) {
  throw new Error("Manual shoot-board start should not be marked Pro.");
}

if (getRecipeCreatePrimaryAction("manual") !== "open-shoot-board") {
  throw new Error("Manual creation should open the recipe execution board.");
}

if (getRecipeCreatePrimaryAction("reference") !== "open-shoot-board") {
  throw new Error("Reference creation should also continue into the shoot board after context selection.");
}

if (getRecipeCreatePrimaryAction("brand") !== "open-shoot-board") {
  throw new Error("Brand context creation should also continue into the shoot board after context selection.");
}

if (getRecipeCreateHref() !== "/recipe-create?mode=manual") {
  throw new Error("Global plus buttons should open the manual recipe-create drawer by default.");
}

if (getRecipeCreateHref("brand") !== "/recipe-create?mode=brand") {
  throw new Error("Create mode links should preserve explicit modes.");
}

if (recipeCreateNiches.map((niche) => niche.id).join(",") !== "beauty,food,fitness,home,tech,other") {
  throw new Error("Recipe creation should ask for the expected niche set.");
}

if (recipeCreateGoals.map((goal) => goal.id).join(",") !== "ad,sell,recipe-product,personal,viral,conversion") {
  throw new Error("Recipe creation should ask for the expected goal set.");
}

const draftContext = getRecipeCreateDraftContext({
  goalId: "recipe-product",
  mode: "reference",
  nicheId: "beauty",
  referenceUrl: " https://example.com/reel ",
});

if (
  draftContext.niche !== "Beauty" ||
  draftContext.goal !== "UGC Recipe 판매" ||
  draftContext.videoUrl !== "https://example.com/reel"
) {
  throw new Error("Draft context should preserve selected niche, goal, and trimmed reference URL.");
}
