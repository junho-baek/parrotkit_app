import type { MockProfile, MockRecipe } from "@/core/mocks/parrotkit-data";

export type ExploreTemplateRecipeOwner = Pick<MockProfile, "handle" | "name">;

export const EXPLORE_TEMPLATE_START_SOURCE = "explore-template" as const;

export type ExploreTemplateStartSource = typeof EXPLORE_TEMPLATE_START_SOURCE;

export type ExploreTemplateStartFilmingInput = {
  savedRecipeId: string;
  sceneId?: string;
  sourceRecipeId: string;
};

export type ExploreTemplateCardStartShootingInput = {
  savedRecipe: Pick<MockRecipe, "id" | "scenes">;
  sourceRecipe: Pick<MockRecipe, "id" | "remixOfRecipeId">;
};

export type ExploreTemplateDetailStartShootingInput = {
  savedRecipe: Pick<MockRecipe, "id" | "scenes">;
  selectedTemplateRecipe: Pick<MockRecipe, "id" | "remixOfRecipeId">;
};

export type ExploreTemplateFilmingHydrationInput = {
  getRecipeById: (recipeId: string) => MockRecipe | null;
  routeRecipeId?: string | null;
  savedTemplateRecipeId?: string | null;
  source?: string | null;
  sourceRecipeId?: string | null;
};

export const LOCAL_EXPLORE_TEMPLATE_OWNER: ExploreTemplateRecipeOwner = {
  handle: "@parrotkitcodextest",
  name: "You",
} as const;

export function getOwnedExploreTemplateRecipeId(sourceRecipeId: string) {
  return `owned-${sourceRecipeId}`;
}

export function createOwnedRecipeFromExploreTemplate(
  sourceRecipe: MockRecipe,
  owner: ExploreTemplateRecipeOwner = LOCAL_EXPLORE_TEMPLATE_OWNER
): MockRecipe {
  return {
    ...sourceRecipe,
    id: getOwnedExploreTemplateRecipeId(sourceRecipe.id),
    ownerHandle: owner.handle,
    ownerName: owner.name,
    ownership: "owned",
    remixOfRecipeId: sourceRecipe.id,
    savedAt: "Saved just now",
    shootStatus: "ready",
    shotSceneCount: 0,
    totalSceneCount: sourceRecipe.scenes.length,
  };
}

export function isOwnedExploreTemplateRecipe(recipe: MockRecipe, sourceRecipeId: string) {
  return (
    recipe.id === getOwnedExploreTemplateRecipeId(sourceRecipeId) &&
    recipe.ownership === "owned" &&
    recipe.remixOfRecipeId === sourceRecipeId
  );
}

export function getExploreTemplateStartFilmingHref({
  savedRecipeId,
  sceneId,
  sourceRecipeId,
}: ExploreTemplateStartFilmingInput) {
  const query = new URLSearchParams({
    savedTemplateRecipeId: savedRecipeId,
    source: EXPLORE_TEMPLATE_START_SOURCE,
    sourceRecipeId,
  });

  if (sceneId) {
    query.set("sceneId", sceneId);
  }

  return `/recipe/${encodeURIComponent(savedRecipeId)}/prompter?${query.toString()}`;
}

export function getExploreTemplateCardStartShootingHref({
  savedRecipe,
  sourceRecipe,
}: ExploreTemplateCardStartShootingInput) {
  return getExploreTemplateStartFilmingHref({
    savedRecipeId: savedRecipe.id,
    sceneId: savedRecipe.scenes[0]?.id,
    sourceRecipeId: sourceRecipe.remixOfRecipeId ?? sourceRecipe.id,
  });
}

export function getExploreTemplateDetailStartShootingHref({
  savedRecipe,
  selectedTemplateRecipe,
}: ExploreTemplateDetailStartShootingInput) {
  return getExploreTemplateStartFilmingHref({
    savedRecipeId: savedRecipe.id,
    sceneId: savedRecipe.scenes[0]?.id,
    sourceRecipeId: selectedTemplateRecipe.remixOfRecipeId ?? selectedTemplateRecipe.id,
  });
}

export function hydrateExploreTemplateFilmingRecipe({
  getRecipeById,
  routeRecipeId,
  savedTemplateRecipeId,
  source,
  sourceRecipeId,
}: ExploreTemplateFilmingHydrationInput): MockRecipe | null {
  const directRecipeIds = [routeRecipeId, savedTemplateRecipeId]
    .map((recipeId) => recipeId?.trim())
    .filter((recipeId): recipeId is string => Boolean(recipeId));

  for (const recipeId of directRecipeIds) {
    const recipe = getRecipeById(recipeId);

    if (recipe) {
      return recipe;
    }
  }

  if (source && source !== EXPLORE_TEMPLATE_START_SOURCE) {
    return null;
  }

  const sourceRecipe = sourceRecipeId ? getRecipeById(sourceRecipeId) : null;

  if (!sourceRecipe) {
    return null;
  }

  const hydratedRecipe = createOwnedRecipeFromExploreTemplate(sourceRecipe);
  const savedRecipeId = savedTemplateRecipeId?.trim() || routeRecipeId?.trim() || hydratedRecipe.id;

  return {
    ...hydratedRecipe,
    id: savedRecipeId,
  };
}
