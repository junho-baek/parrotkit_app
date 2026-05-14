import type { MockRecipe, MockRecipeOwnership } from '@/core/mocks/parrotkit-data';

const HOME_WORKFLOW_OWNERSHIPS = new Set<MockRecipeOwnership>([
  'owned',
  'downloaded',
  'remixed',
]);

export type RecipeBoardSavedMyTake = {
  cardIds?: string[];
  recipeId: string;
  sceneId?: string;
};

export type HomeWorkflowResolutionOptions = {
  savedTakes?: RecipeBoardSavedMyTake[];
};

function isHomeWorkflowRecipe(recipe: MockRecipe) {
  return HOME_WORKFLOW_OWNERSHIPS.has(recipe.ownership) && recipe.shootStatus !== 'draft';
}

function isUnfinishedWorkflowRecipe(
  recipe: MockRecipe,
  options: HomeWorkflowResolutionOptions = {},
) {
  if (!isHomeWorkflowRecipe(recipe)) {
    return false;
  }

  if (recipe.explicitCompletion) {
    return false;
  }

  if (!options.savedTakes) {
    return true;
  }

  return isRecipeBoardUnfinishedByRequiredMyTakes({
    recipe,
    savedTakes: options.savedTakes,
  });
}

function isInProgressWorkflowRecipe(
  recipe: MockRecipe,
  options: HomeWorkflowResolutionOptions = {},
) {
  return isUnfinishedWorkflowRecipe(recipe, options) && recipe.shootStatus === 'continue';
}

export type HomeWorkflowSelection =
  | {
      reason: 'inProgress' | 'recent';
      recipe: MockRecipe;
    }
  | {
      reason: 'none';
      recipe: null;
    };

export function getHomeInProgressWorkflowRecipe(
  recipes: MockRecipe[],
  options: HomeWorkflowResolutionOptions = {},
) {
  return getLatestWorkflowRecipe(recipes.filter((recipe) => isInProgressWorkflowRecipe(recipe, options)));
}

export function getHomeRecentWorkflowRecipe(
  recipes: MockRecipe[],
  options: HomeWorkflowResolutionOptions = {},
) {
  return getLatestWorkflowRecipe(recipes.filter((recipe) => isUnfinishedWorkflowRecipe(recipe, options)));
}

export function getHomePrimaryWorkflowRecipe(
  recipes: MockRecipe[],
  options: HomeWorkflowResolutionOptions = {},
) {
  return getHomeInProgressWorkflowRecipe(recipes, options) ?? getHomeRecentWorkflowRecipe(recipes, options);
}

export function getHomeWorkflowSelection(
  recipes: MockRecipe[],
  options: HomeWorkflowResolutionOptions = {},
): HomeWorkflowSelection {
  const inProgressRecipe = getHomeInProgressWorkflowRecipe(recipes, options);

  if (inProgressRecipe) {
    return {
      reason: 'inProgress',
      recipe: inProgressRecipe,
    };
  }

  const recentRecipe = getHomeRecentWorkflowRecipe(recipes, options);

  if (recentRecipe) {
    return {
      reason: 'recent',
      recipe: recentRecipe,
    };
  }

  return {
    reason: 'none',
    recipe: null,
  };
}

export function isRecipeBoardUnfinishedByRequiredMyTakes({
  recipe,
  savedTakes,
}: {
  recipe: Pick<MockRecipe, 'id' | 'scenes'>;
  savedTakes: RecipeBoardSavedMyTake[];
}) {
  const requiredCutIds = getRequiredCutIds(recipe);

  if (requiredCutIds.length === 0) {
    return false;
  }

  const savedCutIds = getSavedMyTakeCutIds(recipe.id, savedTakes);

  return requiredCutIds.some((cutId) => !savedCutIds.has(cutId));
}

export function getNextRequiredCutWithoutSavedMyTakeId({
  recipe,
  savedTakes,
}: {
  recipe: Pick<MockRecipe, 'id' | 'scenes'>;
  savedTakes: RecipeBoardSavedMyTake[];
}) {
  const savedCutIds = getSavedMyTakeCutIds(recipe.id, savedTakes);

  return getRequiredCutIds(recipe).find((cutId) => !savedCutIds.has(cutId)) ?? null;
}

function getRequiredCutIds(recipe: Pick<MockRecipe, 'scenes'>) {
  return recipe.scenes
    .filter((scene) => !scene.isOptional)
    .map((scene) => scene.id);
}

function getSavedMyTakeCutIds(recipeId: string, savedTakes: RecipeBoardSavedMyTake[]) {
  return new Set(
    savedTakes
      .filter((take) => take.recipeId === recipeId)
      .flatMap((take) => [
        take.sceneId,
        ...(take.cardIds ?? []),
      ])
      .filter((cutId): cutId is string => typeof cutId === 'string' && cutId.length > 0),
  );
}

type WorkflowActivityRecipe = MockRecipe & {
  createdAt?: string;
  lastMeaningfulActivityAt?: string;
  updatedAt?: string;
};

function getLatestWorkflowRecipe(recipes: MockRecipe[]) {
  return recipes
    .map((recipe, index) => ({
      index,
      recipe,
      timestamp: getWorkflowActivityTimestamp(recipe),
    }))
    .sort((first, second) => {
      if (first.timestamp !== second.timestamp) {
        return second.timestamp - first.timestamp;
      }

      return first.index - second.index;
    })[0]?.recipe ?? null;
}

function getWorkflowActivityTimestamp(recipe: WorkflowActivityRecipe) {
  const activityAt = recipe.lastMeaningfulActivityAt ?? recipe.updatedAt ?? recipe.createdAt;

  if (!activityAt) {
    return 0;
  }

  const timestamp = Date.parse(activityAt);

  return Number.isNaN(timestamp) ? 0 : timestamp;
}
