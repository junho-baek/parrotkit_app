import {
  getHomeOwnedRecipeCardEntries,
  getHomeOwnedRecipeCardsDestination,
} from '@/features/home/lib/home-owned-recipe-cards';

const entries = getHomeOwnedRecipeCardEntries([
  {
    id: 'recipe-owned',
    ownership: 'owned',
    scenes: [{ id: 'scene-owned-hook' }],
    title: 'Owned workflow recipe',
  },
  {
    id: 'recipe-downloaded',
    ownership: 'downloaded',
    scenes: [{ id: 'scene-downloaded-hook' }],
    title: 'Downloaded template',
  },
  {
    id: 'recipe-remixed',
    ownership: 'remixed',
    scenes: [{ id: 'scene-remixed-hook' }],
    title: 'Remixed template',
  },
]);

if (entries.length !== 1 || entries[0]?.recipeId !== 'recipe-owned') {
  throw new Error('Home owned recipe cards must only expose recipes owned by the creator.');
}

if (entries[0]?.destination !== '/recipe/recipe-owned') {
  throw new Error('Home owned recipe cards must reopen the owned recipe board.');
}

if (entries[0]?.managementDestination !== '/recipe/recipe-owned') {
  throw new Error('Home owned recipe cards must expose a clear management destination for each owned recipe.');
}

if (entries[0]?.startFilmingDestination !== '/recipe/recipe-owned/prompter?sceneId=scene-owned-hook') {
  throw new Error('Home owned recipe cards must keep the direct start-filming path.');
}

if (getHomeOwnedRecipeCardsDestination() !== '/recipes?filter=owned') {
  throw new Error('Home owned recipe cards view-all path must open the owned recipe card filter.');
}
