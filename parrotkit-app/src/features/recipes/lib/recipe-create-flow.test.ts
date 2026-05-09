import {
  getRecipeCreateHref,
  getInitialRecipeCreateMode,
  getRecipeCreatePrimaryAction,
  isRecipeCreateModePro,
  recipeCreateModes,
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

if (getRecipeCreateHref() !== "/recipe-create?mode=manual") {
  throw new Error("Global plus buttons should open the manual recipe-create drawer by default.");
}

if (getRecipeCreateHref("brand") !== "/recipe-create?mode=brand") {
  throw new Error("Create mode links should preserve explicit modes.");
}
