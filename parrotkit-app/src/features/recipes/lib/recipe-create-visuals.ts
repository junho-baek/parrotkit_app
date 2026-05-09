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
  nicheBeauty:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&h=500&q=86",
  nicheFitness:
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&h=500&q=86",
  nicheFood:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&h=500&q=86",
  nicheHome:
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&h=500&q=86",
  nicheTech:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&h=500&q=86",
};

function isReactNativeRuntime() {
  return (
    typeof navigator !== "undefined" && navigator.product === "ReactNative"
  );
}

function resolveImage(asset: () => number, fallbackUri: string) {
  if (!isReactNativeRuntime()) return fallbackUri;
  const { Image } = require("react-native") as typeof import("react-native");
  return Image.resolveAssetSource(asset()).uri;
}

export const recipeCreateVisuals = {
  goalAd: resolveImage(
    () => require("../../../../assets/recipe-create/generated-goal-ad.png"),
    fallbackImages.goalAd,
  ),
  goalConversion: resolveImage(
    () => require("../../../../assets/recipe-create/generated-goal-conversion.png"),
    fallbackImages.goalConversion,
  ),
  goalPersonal: resolveImage(
    () => require("../../../../assets/recipe-create/generated-goal-personal.png"),
    fallbackImages.goalPersonal,
  ),
  goalRecipeProduct: resolveImage(
    () => require("../../../../assets/recipe-create/generated-goal-recipe-product.png"),
    fallbackImages.goalRecipeProduct,
  ),
  goalSell: resolveImage(
    () => require("../../../../assets/recipe-create/generated-goal-sell.png"),
    fallbackImages.goalSell,
  ),
  goalViral: resolveImage(
    () => require("../../../../assets/recipe-create/generated-goal-viral.png"),
    fallbackImages.goalViral,
  ),
  nicheBeauty: resolveImage(
    () => require("../../../../assets/recipe-create/generated-niche-beauty.png"),
    fallbackImages.nicheBeauty,
  ),
  nicheFitness: resolveImage(
    () => require("../../../../assets/recipe-create/generated-niche-fitness.png"),
    fallbackImages.nicheFitness,
  ),
  nicheFood: resolveImage(
    () => require("../../../../assets/recipe-create/generated-niche-food.png"),
    fallbackImages.nicheFood,
  ),
  nicheHome: resolveImage(
    () => require("../../../../assets/recipe-create/generated-niche-home.png"),
    fallbackImages.nicheHome,
  ),
  nicheTech: resolveImage(
    () => require("../../../../assets/recipe-create/generated-niche-tech.png"),
    fallbackImages.nicheTech,
  ),
} as const;
