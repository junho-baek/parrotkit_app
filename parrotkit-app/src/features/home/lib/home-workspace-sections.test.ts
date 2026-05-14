import { getHomeWorkspaceSectionOrder } from '@/features/home/lib/home-workspace-sections';

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
