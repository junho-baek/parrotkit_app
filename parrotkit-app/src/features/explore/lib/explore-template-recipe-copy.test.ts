import { exploreRecipeSeeds, profileSeed } from "@/core/mocks/parrotkit-data";

import {
  createOwnedRecipeFromExploreTemplate,
  EXPLORE_TEMPLATE_START_SOURCE,
  getExploreTemplateCardStartShootingHref,
  getExploreTemplateDetailStartShootingHref,
  getExploreTemplateStartFilmingHref,
  getOwnedExploreTemplateRecipeId,
  hydrateExploreTemplateFilmingRecipe,
  isOwnedExploreTemplateRecipe,
} from "./explore-template-recipe-copy";

const sourceRecipe = exploreRecipeSeeds[0];

if (!sourceRecipe) {
  throw new Error("Explore template fixture is required for copy validation.");
}

const ownedRecipe = createOwnedRecipeFromExploreTemplate(sourceRecipe);
const expectedOwnedRecipeId = getOwnedExploreTemplateRecipeId(sourceRecipe.id);

if (ownedRecipe.id !== expectedOwnedRecipeId) {
  throw new Error("Copied Explore templates should receive a stable user-owned recipe id.");
}

if (ownedRecipe.id === sourceRecipe.id) {
  throw new Error("Copied Explore templates must not reuse the source template id.");
}

if (ownedRecipe.ownership !== "owned") {
  throw new Error("Copied Explore templates should become user-owned recipes.");
}

if (ownedRecipe.ownerName !== "You" || ownedRecipe.ownerHandle !== "@parrotkitcodextest") {
  throw new Error("Copied Explore templates should be attributed to the local user.");
}

const authenticatedOwnedRecipe = createOwnedRecipeFromExploreTemplate(sourceRecipe, profileSeed);

if (
  authenticatedOwnedRecipe.ownerName !== profileSeed.name ||
  authenticatedOwnedRecipe.ownerHandle !== profileSeed.handle
) {
  throw new Error("Explore copy actions should save generated recipes for the authenticated user.");
}

if (ownedRecipe.remixOfRecipeId !== sourceRecipe.id) {
  throw new Error("Copied Explore templates should preserve the source template id.");
}

if (ownedRecipe.shootStatus !== "ready" || ownedRecipe.shotSceneCount !== 0) {
  throw new Error("Copied Explore templates should start ready for a fresh local shoot.");
}

if (ownedRecipe.totalSceneCount !== sourceRecipe.scenes.length) {
  throw new Error("Copied Explore templates should preserve the template cut count.");
}

if (ownedRecipe.scenes !== sourceRecipe.scenes) {
  throw new Error("Copied Explore templates should reuse mock template scenes without mutating the source.");
}

if (!isOwnedExploreTemplateRecipe(ownedRecipe, sourceRecipe.id)) {
  throw new Error("Owned Explore template copies should be detectable from the source id.");
}

if (isOwnedExploreTemplateRecipe(sourceRecipe, sourceRecipe.id)) {
  throw new Error("The original Explore template should not be detected as its owned copy.");
}

const startFilmingHref = getExploreTemplateStartFilmingHref({
  savedRecipeId: ownedRecipe.id,
  sceneId: ownedRecipe.scenes[0]?.id,
  sourceRecipeId: sourceRecipe.id,
});
const startFilmingUrl = new URL(startFilmingHref, "https://parrotkit.local");

if (startFilmingUrl.pathname !== `/recipe/${ownedRecipe.id}/prompter`) {
  throw new Error("Explore start-filming should open the saved template recipe's filming flow.");
}

if (startFilmingUrl.searchParams.get("savedTemplateRecipeId") !== ownedRecipe.id) {
  throw new Error("Explore start-filming should pass the saved template recipe id.");
}

if (startFilmingUrl.searchParams.get("source") !== EXPLORE_TEMPLATE_START_SOURCE) {
  throw new Error("Explore start-filming should pass Explore template source metadata.");
}

if (startFilmingUrl.searchParams.get("sourceRecipeId") !== sourceRecipe.id) {
  throw new Error("Explore start-filming should pass the original source recipe id.");
}

if (startFilmingUrl.searchParams.get("sceneId") !== ownedRecipe.scenes[0]?.id) {
  throw new Error("Explore start-filming should enter filming on the first saved template cut.");
}

const cardStartShootingHref = getExploreTemplateCardStartShootingHref({
  savedRecipe: ownedRecipe,
  sourceRecipe,
});
const cardStartShootingUrl = new URL(cardStartShootingHref, "https://parrotkit.local");

if (cardStartShootingUrl.pathname !== `/recipe/${ownedRecipe.id}/prompter`) {
  throw new Error("Explore template card start-shooting should open the creator workflow for the saved template.");
}

if (cardStartShootingUrl.searchParams.get("sourceRecipeId") !== sourceRecipe.id) {
  throw new Error("Explore template card start-shooting should preserve the selected source template id.");
}

if (cardStartShootingUrl.searchParams.get("sceneId") !== ownedRecipe.scenes[0]?.id) {
  throw new Error("Explore template card start-shooting should enter on the first selected template cut.");
}

const detailStartShootingHref = getExploreTemplateDetailStartShootingHref({
  savedRecipe: ownedRecipe,
  selectedTemplateRecipe: sourceRecipe,
});
const detailStartShootingUrl = new URL(detailStartShootingHref, "https://parrotkit.local");

if (detailStartShootingUrl.pathname !== `/recipe/${ownedRecipe.id}/prompter`) {
  throw new Error("Explore template detail start-shooting should open the saved template creator workflow.");
}

if (detailStartShootingUrl.searchParams.get("savedTemplateRecipeId") !== ownedRecipe.id) {
  throw new Error("Explore template detail start-shooting should pass the saved template recipe id.");
}

if (detailStartShootingUrl.searchParams.get("sourceRecipeId") !== sourceRecipe.id) {
  throw new Error("Explore template detail start-shooting should preserve the selected template id.");
}

if (detailStartShootingUrl.searchParams.get("sceneId") !== ownedRecipe.scenes[0]?.id) {
  throw new Error("Explore template detail start-shooting should enter on the first selected template cut.");
}

const directHydratedRecipe = hydrateExploreTemplateFilmingRecipe({
  getRecipeById: (recipeId) => (recipeId === ownedRecipe.id ? ownedRecipe : null),
  routeRecipeId: ownedRecipe.id,
  savedTemplateRecipeId: ownedRecipe.id,
  sourceRecipeId: sourceRecipe.id,
});

if (directHydratedRecipe?.id !== ownedRecipe.id) {
  throw new Error("Explore template filming should hydrate from the saved owned recipe first.");
}

const fallbackHydratedRecipe = hydrateExploreTemplateFilmingRecipe({
  getRecipeById: (recipeId) => (recipeId === sourceRecipe.id ? sourceRecipe : null),
  routeRecipeId: ownedRecipe.id,
  savedTemplateRecipeId: ownedRecipe.id,
  sourceRecipeId: sourceRecipe.id,
});

if (!fallbackHydratedRecipe) {
  throw new Error("Explore template filming should hydrate from the source template when saved state is not visible yet.");
}

if (fallbackHydratedRecipe.id !== ownedRecipe.id) {
  throw new Error("Source-hydrated Explore template filming should still use the saved recipe id.");
}

if (fallbackHydratedRecipe.scenes.length !== sourceRecipe.scenes.length) {
  throw new Error("Source-hydrated Explore template filming should preserve template cut cards before recording.");
}

if (
  fallbackHydratedRecipe.scenes[0]?.recipe?.keyLine !== sourceRecipe.scenes[0]?.recipe?.keyLine ||
  fallbackHydratedRecipe.scenes[0]?.prompterLines?.[0] !== sourceRecipe.scenes[0]?.prompterLines?.[0]
) {
  throw new Error("Source-hydrated Explore template filming should preserve prompter content before recording.");
}
