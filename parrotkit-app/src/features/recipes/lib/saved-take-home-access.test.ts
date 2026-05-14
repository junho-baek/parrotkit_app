import {
  getSavedRecipeAccessEntries,
  getSavedTakeHomeDestination,
  getSavedTakeProfileAccessEntries,
  getSavedTakeProfileDestination,
} from "@/features/recipes/lib/saved-take-home-access";
import { exploreRecipeSeeds, profileSeed } from "@/core/mocks/parrotkit-data";
import { createOwnedRecipeFromExploreTemplate } from "@/features/explore/lib/explore-template-recipe-copy";
import type { SavedRecipeTakeRecord } from "@/features/recipes/lib/saved-take-storage";

const savedTake = {
  cardIds: ["cut-toast-hook"],
  cards: [],
  createdAtIso: "2026-05-14T10:00:00.000Z",
  dataSource: "local_mock",
  exportStatus: "local",
  isFinalTake: false,
  label: "Take 1",
  recordedAtLabel: "Just now",
  recipeId: "recipe toast/1",
  recipeTitle: "Toast Recipe",
  sceneId: "scene-toast-hook",
  sceneTitle: "Toast payoff hook",
  takeId: "take toast/1",
  takeStatus: "saved",
  uri: "file:///tmp/toast-take.mov",
} satisfies SavedRecipeTakeRecord;

const destination = getSavedTakeHomeDestination(savedTake);

if (
  destination !==
  "/recipe/recipe%20toast%2F1?sceneId=cut-toast-hook&takeId=take%20toast%2F1"
) {
  throw new Error("Home saved take destination must target the recipe cut and selected take.");
}

const sceneFallbackDestination = getSavedTakeHomeDestination({
  ...savedTake,
  cardIds: [],
});

if (
  sceneFallbackDestination !==
  "/recipe/recipe%20toast%2F1?sceneId=scene-toast-hook&takeId=take%20toast%2F1"
) {
  throw new Error("Home saved take destination must fall back to scene id when a card id is unavailable.");
}

const profileDestination = getSavedTakeProfileDestination(savedTake);

if (
  profileDestination !==
  "/recipe/recipe%20toast%2F1?sceneId=cut-toast-hook&takeId=take%20toast%2F1"
) {
  throw new Error("Profile saved take destination must target the recipe cut and selected take.");
}

const profileEntries = getSavedTakeProfileAccessEntries({
  recipes: [
    {
      id: "recipe toast/1",
      title: "Toast Recipe",
      totalSceneCount: 3,
      shotSceneCount: 1,
    },
  ],
  savedTakes: [savedTake],
});

if (profileEntries.savedRecipes[0]?.destination !== "/recipe/recipe%20toast%2F1") {
  throw new Error("Profile saved recipe entry must reopen the saved recipe board.");
}

if (
  profileEntries.savedTakes[0]?.destination !==
  "/recipe/recipe%20toast%2F1?sceneId=cut-toast-hook&takeId=take%20toast%2F1"
) {
  throw new Error("Profile saved take entry must reopen the selected take.");
}

const exploreTemplate = exploreRecipeSeeds[0];

if (!exploreTemplate) {
  throw new Error("Explore template fixture is required for saved recipe access validation.");
}

const copiedExploreRecipe = createOwnedRecipeFromExploreTemplate(exploreTemplate, profileSeed);
const savedRecipeEntries = getSavedRecipeAccessEntries([copiedExploreRecipe]);

if (savedRecipeEntries[0]?.recipeId !== copiedExploreRecipe.id) {
  throw new Error("Copied Explore recipes should appear in saved recipe access lists.");
}

if (savedRecipeEntries[0]?.destination !== `/recipe/${encodeURIComponent(copiedExploreRecipe.id)}`) {
  throw new Error("Copied Explore saved recipe entries should reopen the owned recipe board.");
}

if (
  savedRecipeEntries[0]?.startFilmingDestination !==
  `/recipe/${encodeURIComponent(copiedExploreRecipe.id)}/prompter?sceneId=${encodeURIComponent(copiedExploreRecipe.scenes[0]?.id ?? "")}`
) {
  throw new Error("Copied Explore saved recipe entries should start filming the copied owned recipe in the prompter.");
}

const copiedProfileEntries = getSavedTakeProfileAccessEntries({
  recipes: [copiedExploreRecipe],
  savedTakes: [],
});

if (copiedProfileEntries.savedRecipes[0]?.recipeId !== copiedExploreRecipe.id) {
  throw new Error("My/Profile saved recipes should include copied Explore recipes.");
}

if (
  copiedProfileEntries.savedRecipes[0]?.startFilmingDestination !==
  `/recipe/${encodeURIComponent(copiedExploreRecipe.id)}/prompter?sceneId=${encodeURIComponent(copiedExploreRecipe.scenes[0]?.id ?? "")}`
) {
  throw new Error("My/Profile copied Explore recipe entries should start filming from the copied owned recipe.");
}
