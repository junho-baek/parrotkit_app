import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(resolve(__dirname, 'recipes-screen.tsx'), 'utf8');

const forbiddenVisibleCopy = [
  'Search recipes',
  'Collections',
  'Continue shooting',
  'Publish to community',
  'Share my recipe with other creators',
  'Prompter workspaces',
  'Open guide',
  'Publish recipe',
  '레시피 검색',
  '커뮤니티로 발행',
  '계속 촬영',
];

for (const copy of forbiddenVisibleCopy) {
  if (source.includes(copy)) {
    throw new Error(`Recipes tab should not render redundant copy: ${copy}`);
  }
}

const forbiddenComponents = [
  'FilterRail',
  'ContinueShootCard',
  'CollectionFolderCard',
  'PublishRecipeScreen',
  'PublishBottomCta',
  'RecipeCreateFab',
  'SearchRow',
];

for (const component of forbiddenComponents) {
  if (source.includes(`function ${component}`) || source.includes(`<${component}`)) {
    throw new Error(`Recipes tab should not keep ${component} in the simplified list surface.`);
  }
}

if (!source.includes('getShootBoardHref(recipe.id)')) {
  throw new Error('Recipe rows should open the recipe board directly.');
}

if (source.includes('TextInput')) {
  throw new Error('Recipes tab should not render search input in the simplified list surface.');
}
