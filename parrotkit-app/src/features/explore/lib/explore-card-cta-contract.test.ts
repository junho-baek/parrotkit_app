import { readFileSync } from 'fs';
import { join } from 'path';

const exploreScreenSource = readFileSync(join(__dirname, '../screens/explore-screen.tsx'), 'utf8');
const copyActionSource = readFileSync(join(__dirname, './explore-template-copy-action.ts'), 'utf8');
const recipeCopySource = readFileSync(join(__dirname, './explore-template-recipe-copy.ts'), 'utf8');

function assertSourceDoesNotContain(pattern: string, message: string) {
  if (exploreScreenSource.includes(pattern)) {
    throw new Error(message);
  }
}

function assertSourceMatches(pattern: RegExp, message: string) {
  if (!pattern.test(exploreScreenSource)) {
    throw new Error(message);
  }
}

function assertFileDoesNotContain(source: string, pattern: string, message: string) {
  if (source.includes(pattern)) {
    throw new Error(message);
  }
}

assertSourceDoesNotContain(
  'getExploreTemplateAction',
  'Explore cards should not use getExploreTemplateAction; the whole card opens detail.'
);
assertFileDoesNotContain(
  copyActionSource,
  'getExploreTemplateAction',
  'Explore action helper should be removed from the copy action library.'
);

assertSourceDoesNotContain(
  'getExploreTemplateActionAffordance',
  'Explore cards should not use getExploreTemplateActionAffordance; nested action affordances are duplicate CTAs.'
);
assertFileDoesNotContain(
  copyActionSource,
  'getExploreTemplateActionAffordance',
  'Explore action affordance helper should be removed from the copy action library.'
);

assertSourceDoesNotContain(
  'getExploreTemplateCardStartShootingHref',
  'Explore cards should not use a nested start-shooting route helper; the whole card opens detail.'
);
assertFileDoesNotContain(
  recipeCopySource,
  'getExploreTemplateCardStartShootingHref',
  'Explore card start-shooting helper should be removed from the recipe copy library.'
);

assertSourceMatches(
  /function RecommendedRecipeCard[\s\S]*?openGuideAccessibilityLabel[\s\S]*?<Pressable[\s\S]*?accessibilityLabel=\{openGuideAccessibilityLabel\}[\s\S]*?accessibilityRole="button"[\s\S]*?onPress=\{onPress\}/,
  'Recommended Explore cards must use the whole card press surface to open detail.'
);

assertSourceMatches(
  /function BrowseRecipeRow[\s\S]*?openGuideAccessibilityLabel[\s\S]*?<Pressable[\s\S]*?accessibilityLabel=\{openGuideAccessibilityLabel\}[\s\S]*?accessibilityRole="button"[\s\S]*?onPress=\{onPress\}/,
  'Browse Explore rows must use the whole row press surface to open detail.'
);

[
  'Start shooting',
  'Save recipe',
  'Open recipe',
  'copy.actions',
  'handleAction',
  'saveRecipe',
  'shootRecipe',
  'recommendedShootCta',
  'rowShootCta',
].forEach((duplicateActionLabel) => {
  assertSourceDoesNotContain(
    duplicateActionLabel,
    `Explore cards and rows should not render duplicate action controls: ${duplicateActionLabel}`
  );
});
