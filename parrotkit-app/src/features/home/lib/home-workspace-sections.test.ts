import { getHomeWorkspaceSectionOrder } from './home-workspace-sections';

const populatedOrder = getHomeWorkspaceSectionOrder({
  hasContinueOrRecentRecipe: true,
  hasSavedTakes: true,
});

if (populatedOrder[0] !== 'continueRecentRecipe') {
  throw new Error('Home must show continue/recent recipe board access before welcome or secondary sections.');
}

const emptyOrder = getHomeWorkspaceSectionOrder({
  hasContinueOrRecentRecipe: false,
  hasSavedTakes: false,
});

if (emptyOrder[0] !== 'continueRecentRecipe') {
  throw new Error('Home empty state must still reserve the first section for blank/recent recipe board access.');
}

const myRecipesIndex = populatedOrder.indexOf('myRecipes');
const createRecipeIndex = populatedOrder.indexOf('createRecipe');

if (myRecipesIndex < 0) {
  throw new Error('Home section order must include My recipes as an explicit section.');
}

if (createRecipeIndex < 0) {
  throw new Error('Home section order must include the lower Create recipe entry as an explicit section.');
}

if (myRecipesIndex >= createRecipeIndex) {
  throw new Error('Home must show My recipes above the lower Create recipe entry.');
}
