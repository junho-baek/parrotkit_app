import {
  getSavedRecipeAccessEntries,
  type SavedRecipeAccessEntry,
} from '@/features/recipes/lib/saved-take-home-access';

type HomeOwnedRecipeInput = {
  id: string;
  ownership?: string;
  scenes?: Array<{ id: string }>;
  shotSceneCount?: number;
  title: string;
  totalSceneCount?: number;
};

export type HomeOwnedRecipeCardEntry<TRecipe extends HomeOwnedRecipeInput = HomeOwnedRecipeInput> =
  SavedRecipeAccessEntry<TRecipe>;

export function getHomeOwnedRecipeCardEntries<TRecipe extends HomeOwnedRecipeInput>(
  recipes: TRecipe[]
): Array<HomeOwnedRecipeCardEntry<TRecipe>> {
  return getSavedRecipeAccessEntries(recipes.filter((recipe) => recipe.ownership === 'owned'));
}

export function getHomeOwnedRecipeCardsDestination() {
  return '/recipes?filter=owned';
}
