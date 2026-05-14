import {
  getRecipeCreateInitialState,
  getRecipeCreateOptionPressState,
  getRecipeCreateOptions,
  getRecipeCreateSelectedMode,
} from "./recipe-create-options";

const options = getRecipeCreateOptions();

if (options.length !== 3) {
  throw new Error("Recipe creation entry must keep exactly three creation options.");
}

const optionIds = options.map((option) => option.id).join(",");

if (optionIds !== "manual,reference,brand") {
  throw new Error("Creation options must prioritize blank/manual while preserving reference and brand options.");
}

const manualOption = options.find((option) => option.id === "manual");
const referenceOption = options.find((option) => option.id === "reference");
const brandOption = options.find((option) => option.id === "brand");

if (!manualOption || manualOption.isProLocked) {
  throw new Error("Blank/manual creation must remain the unlocked v1 default option.");
}

if (!referenceOption?.isProLocked || !brandOption?.isProLocked) {
  throw new Error("Reference link and brand context options must remain visible but Pro-locked.");
}

if (referenceOption.proBadgeLabel !== "Pro") {
  throw new Error("Reference link option must expose an explicit Pro badge label.");
}

if (referenceOption.lockedGuidanceLabel !== "Pro / coming soon") {
  throw new Error("Reference link option must show only Pro/coming-soon guidance while locked.");
}

if (brandOption.proBadgeLabel !== "Pro") {
  throw new Error("Brand context option must expose an explicit Pro badge label.");
}

if (brandOption.displayName !== "Brand context") {
  throw new Error("Brand option must identify itself as the user-facing Brand context option.");
}

if (getRecipeCreateSelectedMode(undefined) !== "manual") {
  throw new Error("Creation entry must default to blank/manual mode when no valid mode is supplied.");
}

if (getRecipeCreateSelectedMode("reference") !== "manual") {
  throw new Error("Reference link route must not make the locked link flow the active creation mode.");
}

if (getRecipeCreateSelectedMode("brand") !== "manual") {
  throw new Error("Brand context route must not make the locked upload flow the active creation mode.");
}

const referencePressState = getRecipeCreateOptionPressState("manual", "reference");

if (referencePressState.selectedMode !== "manual" || referencePressState.lockedGuidanceMode !== "reference") {
  throw new Error("Tapping Reference link must keep manual selected and expose reference Pro guidance.");
}

const brandPressState = getRecipeCreateOptionPressState("manual", "brand");

if (brandPressState.selectedMode !== "manual" || brandPressState.lockedGuidanceMode !== "brand") {
  throw new Error("Tapping Brand context must keep manual selected and expose brand Pro guidance.");
}

const referenceInitialState = getRecipeCreateInitialState("reference");

if (referenceInitialState.selectedMode !== "manual" || referenceInitialState.lockedGuidanceMode !== "reference") {
  throw new Error("Opening the Reference link route must show guidance while keeping manual selected.");
}

const brandInitialState = getRecipeCreateInitialState("brand");

if (brandInitialState.selectedMode !== "manual" || brandInitialState.lockedGuidanceMode !== "brand") {
  throw new Error("Opening the Brand context route must show only Pro/coming-soon guidance while keeping manual selected.");
}

if (brandOption.lockedGuidanceLabel !== "Pro / coming soon") {
  throw new Error("Brand context option must show Pro/coming-soon guidance instead of an upload affordance.");
}

if (/upload|brief/i.test(brandOption.lockedGuidanceLabel)) {
  throw new Error("Brand context locked guidance must not expose upload or brief-flow wording.");
}
