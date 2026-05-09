export type RecipeCreateMode = "manual" | "reference" | "brand";

export type RecipeCreatePrimaryAction =
  | "open-brand-context"
  | "open-reference-drawer"
  | "open-shoot-board";

export const recipeCreateModes: RecipeCreateMode[] = [
  "manual",
  "reference",
  "brand",
];

export function isRecipeCreateMode(value: string | undefined): value is RecipeCreateMode {
  return value === "manual" || value === "reference" || value === "brand";
}

export function getInitialRecipeCreateMode(value: string | undefined): RecipeCreateMode {
  return isRecipeCreateMode(value) ? value : "manual";
}

export function getRecipeCreateHref(mode: RecipeCreateMode = "manual") {
  return `/recipe-create?mode=${mode}`;
}

export function isRecipeCreateModePro(mode: RecipeCreateMode) {
  return mode === "reference" || mode === "brand";
}

export function getRecipeCreatePrimaryAction(
  mode: RecipeCreateMode,
): RecipeCreatePrimaryAction {
  if (mode === "reference") return "open-reference-drawer";
  if (mode === "brand") return "open-brand-context";
  return "open-shoot-board";
}
