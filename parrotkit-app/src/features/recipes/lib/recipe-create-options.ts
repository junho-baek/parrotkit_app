export type RecipeCreateMode = "manual" | "reference" | "brand";

export type RecipeCreateOption = {
  displayName: "Create manually" | "Reference link" | "Brand context";
  id: RecipeCreateMode;
  isPrimary: boolean;
  isProLocked: boolean;
  lockedGuidanceLabel?: "Pro / coming soon";
  proBadgeLabel?: "Pro";
};

export type RecipeCreateLockedGuidanceMode = Exclude<RecipeCreateMode, "manual">;

export type RecipeCreateInteractionState = {
  lockedGuidanceMode?: RecipeCreateLockedGuidanceMode;
  selectedMode: RecipeCreateMode;
};

const RECIPE_CREATE_OPTIONS: RecipeCreateOption[] = [
  {
    displayName: "Create manually",
    id: "manual",
    isPrimary: true,
    isProLocked: false,
  },
  {
    displayName: "Reference link",
    id: "reference",
    isPrimary: false,
    isProLocked: true,
    lockedGuidanceLabel: "Pro / coming soon",
    proBadgeLabel: "Pro",
  },
  {
    displayName: "Brand context",
    id: "brand",
    isPrimary: false,
    isProLocked: true,
    lockedGuidanceLabel: "Pro / coming soon",
    proBadgeLabel: "Pro",
  },
];

export function getRecipeCreateOptions(): RecipeCreateOption[] {
  return RECIPE_CREATE_OPTIONS;
}

export function getRecipeCreateInitialState(value: string | undefined): RecipeCreateInteractionState {
  if (isLockedRecipeCreateMode(value)) {
    return {
      lockedGuidanceMode: value,
      selectedMode: "manual",
    };
  }

  return {
    selectedMode: getRecipeCreateSelectedMode(value),
  };
}

export function getRecipeCreateOptionPressState(
  currentSelectedMode: RecipeCreateMode,
  pressedMode: RecipeCreateMode
): RecipeCreateInteractionState {
  if (isLockedRecipeCreateMode(pressedMode)) {
    return {
      lockedGuidanceMode: pressedMode,
      selectedMode: currentSelectedMode,
    };
  }

  return {
    selectedMode: pressedMode,
  };
}

export function getRecipeCreateSelectedMode(value: string | undefined): RecipeCreateMode {
  return isRecipeCreateMode(value) && !isLockedRecipeCreateMode(value) ? value : "manual";
}

export function isRecipeCreateMode(value: string | undefined): value is RecipeCreateMode {
  return value === "manual" || value === "reference" || value === "brand";
}

function isLockedRecipeCreateMode(value: string | undefined): value is RecipeCreateLockedGuidanceMode {
  if (!isRecipeCreateMode(value)) {
    return false;
  }

  return RECIPE_CREATE_OPTIONS.some((option) => option.id === value && option.isProLocked);
}
