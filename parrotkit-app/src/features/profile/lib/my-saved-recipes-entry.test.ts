import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const profileScreenPath = resolve(__dirname, '../screens/profile-screen.tsx');
const profileScreenSource = readFileSync(profileScreenPath, 'utf8');

assert.match(
  profileScreenSource,
  /<Text className="text-\[18px\] font-black text-ink">\{profileCopy\.savedRecipesSection\}<\/Text>/,
  'The My/Profile screen must expose the localized Saved Recipes section heading.'
);

assert.match(
  profileScreenSource,
  /profileEntries\.savedRecipes\.map\(\(recipe\) => \([\s\S]*<SavedRecipeRow[\s\S]*onPress=\{\(\) => openDestination\(recipe\.destination\)\}[\s\S]*onStartFilming=\{\(\) => openDestination\(recipe\.startFilmingDestination\)\}[\s\S]*recipe=\{recipe\}[\s\S]*\/>/,
  'The Saved Recipes section must render recipe rows with detail and start-filming entry points.'
);

assert.match(
  profileScreenSource,
  /profileEntries = getSavedTakeProfileAccessEntries\(\{[\s\S]*recipes,[\s\S]*savedTakes: getSavedRecipeTakes\(\),[\s\S]*\}\)/,
  'The My/Profile screen must derive saved recipe entries from the shared saved-recipe access contract.'
);

const accessContractPath = resolve(__dirname, '../../recipes/lib/saved-take-home-access.ts');
const accessContractSource = readFileSync(accessContractPath, 'utf8');

assert.match(
  accessContractSource,
  /savedRecipes: getSavedRecipeAccessEntries\(recipes\)/,
  'The shared My/Profile access contract must include saved recipe entries.'
);

const appLanguagePath = resolve(__dirname, '../../../core/i18n/app-language.tsx');
const appLanguageSource = readFileSync(appLanguagePath, 'utf8');

assert.match(
  appLanguageSource,
  /savedRecipesSection: 'Saved recipes'/,
  'English profile copy must keep the Saved recipes label.'
);

assert.match(
  appLanguageSource,
  /savedRecipesSection: '저장한 레시피'/,
  'Korean profile copy must keep the Saved Recipes label.'
);
