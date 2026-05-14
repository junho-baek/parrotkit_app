import type { SavedRecipeTakeRecord } from "@/features/recipes/lib/saved-take-storage";

type ProfileSavedRecipeInput = {
  id: string;
  title: string;
  scenes?: Array<{ id: string }>;
  shotSceneCount?: number;
  totalSceneCount?: number;
};

export type SavedTakeProfileAccessEntry = {
  destination: string;
  recipeId: string;
  recipeTitle: string;
  sceneTitle: string;
  takeId: string;
  takeLabel: string;
  cutOrder?: number;
  cutTitle: string;
  isFinalTake: boolean;
};

export type SavedRecipeAccessEntry<TRecipe extends ProfileSavedRecipeInput = ProfileSavedRecipeInput> = {
  destination: string;
  recipe: TRecipe;
  recipeId: string;
  recipeTitle: string;
  startFilmingDestination: string;
  shotSceneCount?: number;
  totalSceneCount?: number;
};

export type SavedRecipeProfileAccessEntry = SavedRecipeAccessEntry;

export type SavedTakeProfileAccessEntries = {
  savedRecipes: SavedRecipeProfileAccessEntry[];
  savedTakes: SavedTakeProfileAccessEntry[];
};

export function getSavedTakeHomeDestination(take: Pick<
  SavedRecipeTakeRecord,
  "cardIds" | "recipeId" | "sceneId" | "takeId"
>) {
  const targetCutOrSceneId = take.cardIds[0] ?? take.sceneId;
  const query = [
    `sceneId=${encodeURIComponent(targetCutOrSceneId)}`,
    `takeId=${encodeURIComponent(take.takeId)}`,
  ].join("&");

  return `/recipe/${encodeURIComponent(take.recipeId)}?${query}`;
}

export function getSavedTakeProfileDestination(take: Pick<
  SavedRecipeTakeRecord,
  "cardIds" | "recipeId" | "sceneId" | "takeId"
>) {
  return getSavedTakeHomeDestination(take);
}

export function getSavedRecipeAccessEntries<TRecipe extends ProfileSavedRecipeInput>(
  recipes: TRecipe[]
): Array<SavedRecipeAccessEntry<TRecipe>> {
  return recipes.map((recipe) => {
    const destination = `/recipe/${encodeURIComponent(recipe.id)}`;
    const firstSceneId = recipe.scenes?.[0]?.id;
    const startFilmingDestination = firstSceneId
      ? `${destination}/prompter?sceneId=${encodeURIComponent(firstSceneId)}`
      : `${destination}/prompter`;

    return {
      destination,
      recipe,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      startFilmingDestination,
      shotSceneCount: recipe.shotSceneCount,
      totalSceneCount: recipe.totalSceneCount,
    };
  });
}

export function getSavedTakeProfileAccessEntries({
  recipes,
  savedTakes,
}: {
  recipes: ProfileSavedRecipeInput[];
  savedTakes: SavedRecipeTakeRecord[];
}): SavedTakeProfileAccessEntries {
  return {
    savedRecipes: getSavedRecipeAccessEntries(recipes),
    savedTakes: savedTakes.map((take) => {
      const primaryCard = take.cards[0];

      return {
        cutOrder: primaryCard?.order,
        cutTitle: primaryCard?.title || take.sceneTitle,
        destination: getSavedTakeProfileDestination(take),
        isFinalTake: take.isFinalTake,
        recipeId: take.recipeId,
        recipeTitle: take.recipeTitle,
        sceneTitle: take.sceneTitle,
        takeId: take.takeId,
        takeLabel: take.label,
      };
    }),
  };
}
