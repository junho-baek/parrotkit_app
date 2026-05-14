import type { MockRecipe, MockRecipeOwnership } from '@/core/mocks/parrotkit-data';

const HOME_WORKFLOW_OWNERSHIPS = new Set<MockRecipeOwnership>([
  'owned',
  'downloaded',
  'remixed',
]);

function isHomeWorkflowRecipe(recipe: MockRecipe) {
  return HOME_WORKFLOW_OWNERSHIPS.has(recipe.ownership) && recipe.shootStatus !== 'draft';
}

function isInProgressWorkflowRecipe(recipe: MockRecipe) {
  return isHomeWorkflowRecipe(recipe) && recipe.shootStatus === 'continue';
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

export function getHomeInProgressWorkflowRecipe(recipes: MockRecipe[]) {
  return recipes.find(isInProgressWorkflowRecipe) ?? null;
}

export function getHomeRecentWorkflowRecipe(recipes: MockRecipe[]) {
  return recipes.find(isHomeWorkflowRecipe) ?? null;
}

export function getHomePrimaryWorkflowRecipe(recipes: MockRecipe[]) {
  return getHomeInProgressWorkflowRecipe(recipes) ?? getHomeRecentWorkflowRecipe(recipes);
}

export function getHomeWorkflowSelection(recipes: MockRecipe[]): HomeWorkflowSelection {
  const inProgressRecipe = getHomeInProgressWorkflowRecipe(recipes);

  if (inProgressRecipe) {
    return {
      reason: 'inProgress',
      recipe: inProgressRecipe,
    };
  }

  const recentRecipe = getHomeRecentWorkflowRecipe(recipes);

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
