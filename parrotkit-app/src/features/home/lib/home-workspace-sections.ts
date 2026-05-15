export type HomeWorkspaceSectionId =
  | 'continueRecentRecipe'
  | 'welcome'
  | 'myRecipes'
  | 'savedTakes'
  | 'createRecipe';

const HOME_WORKSPACE_SECTION_ORDER: HomeWorkspaceSectionId[] = [
  'continueRecentRecipe',
  'welcome',
  'myRecipes',
  'savedTakes',
  'createRecipe',
];

export function getHomeWorkspaceSectionOrder(_: {
  hasContinueOrRecentRecipe: boolean;
  hasSavedTakes: boolean;
}): HomeWorkspaceSectionId[] {
  return HOME_WORKSPACE_SECTION_ORDER;
}
