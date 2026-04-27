import type { MockRecipe } from '@/core/mocks/parrotkit-data';

export function getRecipeOwnershipLabel(recipe: MockRecipe) {
  if (recipe.ownership === 'owned') return 'Yours';
  if (recipe.ownership === 'downloaded') return 'Saved';
  if (recipe.ownership === 'remixed') return 'Remix';
  return 'Community';
}

export function getRecipeVerificationLabel(recipe: MockRecipe) {
  return recipe.verification === 'verified_creator' ? 'Verified creator' : 'Community recipe';
}

export function getRecipeShootProgressLabel(recipe: MockRecipe) {
  if (recipe.shootStatus === 'continue') {
    return `${recipe.shotSceneCount}/${recipe.totalSceneCount} shot`;
  }

  if (recipe.shootStatus === 'draft') {
    return 'Draft';
  }

  return `${recipe.totalSceneCount} scenes ready`;
}

export function getRecipePrimaryActionLabel(recipe: MockRecipe) {
  return recipe.shootStatus === 'continue' ? 'Continue Shoot' : 'Shoot';
}

export function isVerifiedCreatorRecipe(recipe: MockRecipe) {
  return recipe.verification === 'verified_creator';
}

export function sortShootableRecipes(recipes: MockRecipe[]) {
  return [...recipes].sort((first, second) => {
    if (first.shootStatus === 'continue' && second.shootStatus !== 'continue') return -1;
    if (first.shootStatus !== 'continue' && second.shootStatus === 'continue') return 1;
    if (first.ownership === 'owned' && second.ownership !== 'owned') return -1;
    if (first.ownership !== 'owned' && second.ownership === 'owned') return 1;
    return second.downloadCount - first.downloadCount;
  });
}

export function getContinueShootRecipe(recipes: MockRecipe[]) {
  return sortShootableRecipes(recipes).find((recipe) => recipe.shootStatus === 'continue') ?? null;
}

export function getLatestShootableRecipe(recipes: MockRecipe[]) {
  return sortShootableRecipes(recipes).find((recipe) => recipe.shootStatus !== 'draft') ?? null;
}
