import { recipesSeed } from "@/core/mocks/parrotkit-data";
import {
  createRecipeProductDemoModel,
  getRecipeProductDemoHref,
} from "@/features/recipes/lib/recipe-product-demo";

const recipe = recipesSeed.find(
  (candidate) => candidate.id === "recipe-english-expert-shortcut",
);

if (!recipe) {
  throw new Error("Fixture recipe should exist for Recipe Product demo tests.");
}

const draftProduct = createRecipeProductDemoModel(recipe, false);

if (getRecipeProductDemoHref(recipe.id) !== "/recipes?view=publish&recipeId=recipe-english-expert-shortcut") {
  throw new Error("Recipe Product CTA should route to the Recipes publish view for the source recipe.");
}

if (draftProduct.title !== "English Expert Shortcut Template") {
  throw new Error("Recipe Product demo model should use the source recipe title.");
}

if (draftProduct.priceLabel !== "$19") {
  throw new Error("Recipe Product demo model should expose the demo sell price.");
}

if (!draftProduct.modes.some((mode) => mode.id === "reuse" && mode.enabled)) {
  throw new Error("Recipe Product demo model should make reuse enabled by default.");
}

if (!draftProduct.modes.some((mode) => mode.id === "sell" && mode.enabled)) {
  throw new Error("Recipe Product demo model should make sell enabled by default.");
}

if (
  !draftProduct.includedItems.some(
    (item) => item.title === "Cut-by-cut recipe" && item.body.includes("4 scenes"),
  )
) {
  throw new Error("Recipe Product demo model should include the cut-by-cut recipe with scene count.");
}

if (draftProduct.statusLabel !== "Ready to productize") {
  throw new Error("Draft product should be ready to productize before publishing.");
}

const createdProduct = createRecipeProductDemoModel(recipe, true);

if (createdProduct.statusLabel !== "Recipe product created") {
  throw new Error("Created product should expose a completed status label.");
}

if (createdProduct.primaryActionLabel !== "Product created") {
  throw new Error("Created product should update the primary action label.");
}
