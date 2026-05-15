import {
  getRecipeCreateDraftContext,
  getRecipeCreateHref,
  getInitialRecipeCreateMode,
  getRecipeCreateInitialScenes,
  getRecipeCreateModeInputConfig,
  getRecipeCreatePrimaryAction,
  getRecipeCreateReferenceLinkValidationState,
  getRecipeCreateSubmitState,
  isRecipeCreateModePro,
  recipeCreateGoals,
  recipeCreateModes,
  recipeCreateNiches,
} from "@/features/recipes/lib/recipe-create-flow";

if (getInitialRecipeCreateMode(undefined) !== "manual") {
  throw new Error("New recipe creation should default to manual shoot-board start.");
}

if (getInitialRecipeCreateMode("reference") !== "reference") {
  throw new Error("Explicit reference mode query params should still be respected.");
}

if (getInitialRecipeCreateMode("unknown") !== "manual") {
  throw new Error("Invalid create mode params should fall back to manual.");
}

if (recipeCreateModes.join(",") !== "manual,reference,brand") {
  throw new Error("Create mode tabs should put manual first, then reference and brand.");
}

if (!isRecipeCreateModePro("reference") || !isRecipeCreateModePro("brand")) {
  throw new Error("Reference link and Brand context modes should be marked Pro.");
}

if (isRecipeCreateModePro("manual")) {
  throw new Error("Manual shoot-board start should not be marked Pro.");
}

if (getRecipeCreatePrimaryAction("manual") !== "open-shoot-board") {
  throw new Error("Manual creation should open the recipe execution board.");
}

if (getRecipeCreatePrimaryAction("reference") !== "open-shoot-board") {
  throw new Error("Reference creation should also continue into the shoot board after context selection.");
}

if (getRecipeCreatePrimaryAction("brand") !== "open-shoot-board") {
  throw new Error("Brand context creation should also continue into the shoot board after context selection.");
}

if (getRecipeCreateHref() !== "/recipe-create?mode=manual") {
  throw new Error("Global plus buttons should open the manual recipe-create drawer by default.");
}

if (getRecipeCreateHref("brand") !== "/recipe-create?mode=brand") {
  throw new Error("Create mode links should preserve explicit modes.");
}

if (recipeCreateNiches.map((niche) => niche.id).join(",") !== "beauty,food,fitness,home,tech,other") {
  throw new Error("Recipe creation should ask for the expected niche set.");
}

if (recipeCreateNiches.some((niche) => "imageSource" in niche)) {
  throw new Error("Niche selection should stay text-only without thumbnail images.");
}

if (recipeCreateGoals.map((goal) => goal.id).join(",") !== "ad,sell,recipe-product,personal,viral,conversion") {
  throw new Error("Recipe creation should ask for the expected goal set.");
}

if (getRecipeCreateInitialScenes("manual")?.length !== 0) {
  throw new Error("Blank creation should start with no scenes.");
}

if (getRecipeCreateInitialScenes("reference") !== undefined || getRecipeCreateInitialScenes("brand") !== undefined) {
  throw new Error("Reference and Brand creation should keep generated scene seeding.");
}

const hiddenManualInput = getRecipeCreateModeInputConfig({
  brandPlaceholder: "Add brand context",
  linkPlaceholder: "Paste a reference link",
  mode: "manual",
  referenceUrl: "https://example.com/video",
});

if (hiddenManualInput.visible) {
  throw new Error("Manual creation should not show a reference-link input field.");
}

const referenceInput = getRecipeCreateModeInputConfig({
  brandPlaceholder: "Add brand context",
  linkPlaceholder: "Paste a reference link",
  mode: "reference",
  referenceUrl: "https://example.com/video",
});

if (!referenceInput.visible || !referenceInput.editable) {
  throw new Error("Reference creation should show an editable paste input.");
}

if (referenceInput.placeholder !== "Paste a reference link") {
  throw new Error("Reference creation should expose the reference-link placeholder.");
}

if (referenceInput.value !== "https://example.com/video") {
  throw new Error("Reference creation input should use the controlled reference URL value.");
}

if (referenceInput.inputMode !== "url" || referenceInput.keyboardType !== "url") {
  throw new Error("Reference creation input should use URL entry affordances.");
}

if (getRecipeCreateReferenceLinkValidationState("   ") !== "empty") {
  throw new Error("Empty Paste links should be treated as an empty validation state.");
}

if (getRecipeCreateReferenceLinkValidationState("not a link") !== "invalid") {
  throw new Error("Paste links should reject plain text before recipe creation.");
}

if (getRecipeCreateReferenceLinkValidationState("ftp://example.com/video") !== "invalid") {
  throw new Error("Paste links should only accept web URLs.");
}

if (getRecipeCreateReferenceLinkValidationState(" https://example.com/video ") !== "valid") {
  throw new Error("Paste links should accept trimmed http/https URLs.");
}

const emptyReferenceSubmit = getRecipeCreateSubmitState({
  mode: "reference",
  referenceUrl: "   ",
});

if (emptyReferenceSubmit.enabled) {
  throw new Error("Paste creation should require a reference link before enabling the primary CTA.");
}

if (emptyReferenceSubmit.referenceLinkError !== null) {
  throw new Error("Empty Paste links should keep the CTA disabled without showing an invalid-link error.");
}

const invalidReferenceSubmit = getRecipeCreateSubmitState({
  mode: "reference",
  referenceUrl: "not a link",
});

if (invalidReferenceSubmit.enabled || invalidReferenceSubmit.referenceLinkError !== "invalid-url") {
  throw new Error("Invalid Paste links should disable the primary CTA and expose an error state.");
}

const readyReferenceSubmit = getRecipeCreateSubmitState({
  mode: "reference",
  referenceUrl: " https://example.com/video ",
});

if (!readyReferenceSubmit.enabled) {
  throw new Error("Paste creation should enable the primary CTA after a reference link is entered.");
}

if (readyReferenceSubmit.referenceLinkError !== null) {
  throw new Error("Valid Paste links should clear the invalid-link error state.");
}

const manualSubmit = getRecipeCreateSubmitState({
  mode: "manual",
  referenceUrl: "",
});

if (!manualSubmit.enabled) {
  throw new Error("Manual creation should keep the primary CTA enabled without a reference link.");
}

if (manualSubmit.referenceLinkError !== null) {
  throw new Error("Manual creation should not inherit Paste link errors.");
}

const brandInput = getRecipeCreateModeInputConfig({
  brandPlaceholder: "Add brand context",
  linkPlaceholder: "Paste a reference link",
  mode: "brand",
  referenceUrl: "https://example.com/video",
});

if (!brandInput.visible || brandInput.editable || brandInput.value !== "") {
  throw new Error("Brand mode should keep its own placeholder without reusing the controlled reference value.");
}

const draftContext = getRecipeCreateDraftContext({
  goalId: "recipe-product",
  mode: "reference",
  nicheId: "beauty",
  referenceUrl: " https://example.com/video ",
});

if (draftContext.title !== "Beauty UGC Recipe 판매 Recipe") {
  throw new Error("Draft context should derive a recipe title from the selected niche and goal.");
}

if (draftContext.videoUrl !== "https://example.com/video") {
  throw new Error("Reference mode should trim and forward the provided reference URL.");
}

const customOtherDraftContext = getRecipeCreateDraftContext({
  customNicheLabel: "Pet care",
  goalId: "viral",
  mode: "manual",
  nicheId: "other",
});

if (customOtherDraftContext.title !== "Pet care Viral Recipe") {
  throw new Error("Other niche should use the custom niche input when provided.");
}

if (!customOtherDraftContext.notes.includes("Niche: Pet care")) {
  throw new Error("Other niche custom input should be reflected in the generated notes.");
}
