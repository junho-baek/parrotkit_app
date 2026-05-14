import { createBlankShootBoardRecipeDraft } from "./blank-shoot-board-recipe";
import { getGlobalCreateCta, getGlobalCreateCtaDestination } from "../../../core/navigation/global-create-cta";
import { getHomeRecipeCreateEntry } from "../../home/lib/home-recipe-create-entry";
import { getRecipeCreateInitialState } from "./recipe-create-options";

const globalCta = getGlobalCreateCta("ko");
const homeEntry = getHomeRecipeCreateEntry("ko");

if (globalCta.label !== "레시피 생성") {
  throw new Error("Primary floating CTA must keep the corrected Korean recipe creation label.");
}

if (getGlobalCreateCtaDestination() !== "/recipe-create?mode=manual") {
  throw new Error("Primary floating CTA must reuse the existing manual blank recipe creation flow.");
}

if (homeEntry.destination !== getGlobalCreateCtaDestination()) {
  throw new Error("Home recipe creation entry and floating CTA must share the same manual creation destination.");
}

const manualCreateState = getRecipeCreateInitialState("manual");

if (manualCreateState.selectedMode !== "manual" || manualCreateState.lockedGuidanceMode) {
  throw new Error("Manual creation route must open the unlocked blank recipe creation state.");
}

const created = createBlankShootBoardRecipeDraft({
  id: "recipe-blank-local",
  title: "새 촬영 레시피",
});

if (created.recipe.id !== "recipe-blank-local") {
  throw new Error("Blank recipe creation should preserve the generated recipe id.");
}

if (created.recipe.title !== "새 촬영 레시피") {
  throw new Error("Blank recipe creation should use the provided recipe title.");
}

if (created.recipe.ownership !== "owned" || created.recipe.sourceUrl !== "") {
  throw new Error("Blank recipe creation should create a local owned recipe without source extraction.");
}

if (created.recipe.shootStatus !== "continue" || created.recipe.shotSceneCount !== 0) {
  throw new Error("Blank recipe creation should start as an unshot local shoot-board recipe.");
}

if (created.recipe.scenes.length < 3) {
  throw new Error("Blank recipe creation should include editable starter cuts.");
}

const firstCut = created.recipe.scenes[0];

if (!firstCut) {
  throw new Error("Blank recipe should include a first cut.");
}

if (
  !firstCut.recipe?.appealPoint &&
  !firstCut.recipe?.objective
) {
  throw new Error("Blank recipe starter cuts should include hook/note-ready recipe context.");
}

if (!firstCut.recipe?.keyLine || !firstCut.recipe?.keyAction) {
  throw new Error("Blank recipe starter cuts should include line-to-say and shot-action-ready fields.");
}

if (created.destination !== "/recipe/recipe-blank-local") {
  throw new Error("Blank recipe creation should return the shoot-board destination.");
}
