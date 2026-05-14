export type HomeWorkspaceSectionId =
  | 'continueRecentRecipe'
  | 'welcome'
  | 'quickStartRecipes'
  | 'recentRecipes'
  | 'savedTakes';

const HOME_WORKSPACE_SECTION_ORDER: HomeWorkspaceSectionId[] = [
  'continueRecentRecipe',
  'welcome',
  'quickStartRecipes',
  'recentRecipes',
  'savedTakes',
];

export function getHomeWorkspaceSectionOrder(_: {
  hasContinueOrRecentRecipe: boolean;
  hasSavedTakes: boolean;
}): HomeWorkspaceSectionId[] {
  return HOME_WORKSPACE_SECTION_ORDER;
}
