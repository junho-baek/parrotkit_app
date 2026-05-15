import {
  exploreRecipeSeeds,
  markRecipeBoardExplicitCompletion,
  recipesSeed,
} from "./parrotkit-data";
import { normalizeNativeRecipe } from "../../features/recipes/lib/recipe-domain-normalizer";
import { createShootBoardRecipe } from "../../domain/shoot-board/shoot-board-model";

const runnableRecipe = recipesSeed.find(
  (recipe) => recipe.id === "recipe-english-expert-shortcut",
);
const exploreRecipe = exploreRecipeSeeds.find(
  (recipe) => recipe.id === "market-recipe-english-expert-shortcut",
);

const expectedHook =
  "Everyone, here is the [method] I learned after spending [cost/time] with [expert/place] that makes [problem/struggle] disappear.";
const expectedSaveLine =
  "Save this and just do it during [repeat schedule/situation], and I seriously guarantee [specific benefit/change].";
const expectedWarning = "Never [what not to do].";

if (!exploreRecipe) {
  throw new Error("Explore recipes should include the English expert shortcut template.");
}

if (!runnableRecipe) {
  throw new Error("Runnable recipes should include the English expert shortcut template.");
}

if (!exploreRecipe.summary.includes("English")) {
  throw new Error("Explore card should make the English template version clear.");
}

if (runnableRecipe.scenes.length < 4 || exploreRecipe.scenes.length < 4) {
  throw new Error("English template should include enough scenes for hook, tool, steps, and warning.");
}

if (!runnableRecipe.scenes[0]?.recipeLines.includes(expectedHook)) {
  throw new Error("Runnable recipe should preserve the translated opening hook.");
}

if (!exploreRecipe.scenes[0]?.recipeLines.includes(expectedSaveLine)) {
  throw new Error("Explore recipe should preserve the translated save/repeat promise.");
}

const board = createShootBoardRecipe(normalizeNativeRecipe(runnableRecipe), {
  isSaved: true,
  shotCutIds: [],
});

if (board.cuts[0]?.speakingLine !== expectedHook) {
  throw new Error("Shoot Board should expose the English hook as the first line to say.");
}

if (!board.cuts.some((cut) => cut.speakingLine.includes(expectedWarning))) {
  throw new Error("Shoot Board should include the English warning in the execution flow.");
}

const explicitCompletionRecipes = markRecipeBoardExplicitCompletion(
  recipesSeed,
  runnableRecipe.id,
);
const explicitlyCompletedRecipe = explicitCompletionRecipes.find(
  (recipe) => recipe.id === runnableRecipe.id,
);
const unchangedSiblingRecipe = explicitCompletionRecipes.find(
  (recipe) => recipe.id !== runnableRecipe.id,
);

if (explicitCompletionRecipes === recipesSeed) {
  throw new Error("Marking explicit board completion should return updated persistent recipe state.");
}

if (explicitlyCompletedRecipe?.explicitCompletion !== true) {
  throw new Error("Explicit board completion should persist on the mock recipe record.");
}

if (
  unchangedSiblingRecipe &&
  unchangedSiblingRecipe !== recipesSeed.find((recipe) => recipe.id === unchangedSiblingRecipe.id)
) {
  throw new Error("Marking explicit board completion should not rewrite unrelated recipe records.");
}
