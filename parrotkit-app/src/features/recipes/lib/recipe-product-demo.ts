import type { Href } from "expo-router";

import type { MockRecipe } from "@/core/mocks/parrotkit-data";

export type RecipeProductDemoModeId = "reuse" | "share" | "publish" | "marketplace";

export type RecipeProductDemoModel = {
  description: string;
  includedItems: Array<{
    body: string;
    title: string;
  }>;
  modes: Array<{
    body: string;
    enabled: boolean;
    id: RecipeProductDemoModeId;
    title: string;
  }>;
  priceLabel: string;
  primaryActionLabel: string;
  sourceRecipeId: string;
  statusLabel: string;
  title: string;
};

export function getRecipeProductDemoHref(recipeId: string): Href {
  return `/recipes?view=publish&recipeId=${encodeURIComponent(recipeId)}` as Href;
}

export function createRecipeProductDemoModel(
  recipe: MockRecipe,
  created: boolean,
): RecipeProductDemoModel {
  const sceneCount = recipe.totalSceneCount || recipe.scenes.length;

  return {
    description:
      recipe.summary ||
      "Reusable short-form recipe package with reference analysis, cut plan, script, and shooting guide.",
    includedItems: [
      {
        body: "Hook, pacing, reference signals, and creator direction are packaged for reuse.",
        title: "Reference breakdown",
      },
      {
        body: `${sceneCount} scenes with shot order, required checks, and line-to-say guidance.`,
        title: "Cut-by-cut recipe",
      },
      {
        body: "Narration, on-screen text, and prompter-ready copy travel with the recipe.",
        title: "Script and prompter",
      },
      {
        body: "Camera angle, action cues, and final take guidance make it shootable again.",
        title: "Shooting guide",
      },
      {
        body: "Best-take previews and recorded references can be carried into the package.",
        title: "Sample takes",
      },
    ],
    modes: [
      {
        body: "Save it as a repeatable internal recipe for future shoots.",
        enabled: true,
        id: "reuse",
        title: "Reuse",
      },
      {
        body: "Send a private package to teammates, brands, or clients.",
        enabled: true,
        id: "share",
        title: "Share",
      },
      {
        body: "Show it on your creator profile without forcing a sale.",
        enabled: true,
        id: "publish",
        title: "Publish",
      },
      {
        body: "Submit it for discovery and optional monetization.",
        enabled: true,
        id: "marketplace",
        title: "Marketplace",
      },
    ],
    priceLabel: "$19",
    primaryActionLabel: created ? "Recipe asset saved" : "Save as Recipe Asset",
    sourceRecipeId: recipe.id,
    statusLabel: created ? "Saved to My Recipes" : "Ready to save as Recipe Asset",
    title: recipe.title,
  };
}
