const fallbackImages = {
  goalAd:
    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&h=1200&q=86",
  goalConversion:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&h=1200&q=86",
  goalPersonal:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&h=1200&q=86",
  goalRecipeProduct:
    "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&h=1200&q=86",
  goalSell:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&h=1200&q=86",
  goalViral:
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&h=1200&q=86",
};

export type RecipeCreateImageSource = number | { uri: string };

function resolveImage(asset: () => number, fallbackUri: string): RecipeCreateImageSource {
  try {
    return asset();
  } catch {
    return { uri: fallbackUri };
  }
}

export const recipeCreateVisuals = {
  goalAd: resolveImage(
    () => require("../../../../assets/recipe-create/generated-goal-ad.jpg"),
    fallbackImages.goalAd,
  ),
  goalConversion: resolveImage(
    () => require("../../../../assets/recipe-create/generated-goal-conversion.jpg"),
    fallbackImages.goalConversion,
  ),
  goalPersonal: resolveImage(
    () => require("../../../../assets/recipe-create/generated-goal-personal.jpg"),
    fallbackImages.goalPersonal,
  ),
  goalRecipeProduct: resolveImage(
    () => require("../../../../assets/recipe-create/generated-goal-recipe-product.jpg"),
    fallbackImages.goalRecipeProduct,
  ),
  goalSell: resolveImage(
    () => require("../../../../assets/recipe-create/generated-goal-sell.jpg"),
    fallbackImages.goalSell,
  ),
  goalViral: resolveImage(
    () => require("../../../../assets/recipe-create/generated-goal-viral.jpg"),
    fallbackImages.goalViral,
  ),
} as const;
