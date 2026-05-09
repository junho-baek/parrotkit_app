import {
  recipeCreateVisuals,
  type RecipeCreateImageSource,
} from "@/features/recipes/lib/recipe-create-visuals";

export type RecipeCreateMode = "manual" | "reference" | "brand";
export type RecipeCreateNicheId =
  | "beauty"
  | "fitness"
  | "food"
  | "home"
  | "other"
  | "tech";
export type RecipeCreateGoalId =
  | "ad"
  | "conversion"
  | "personal"
  | "recipe-product"
  | "sell"
  | "viral";

export type RecipeCreatePrimaryAction =
  | "open-brand-context"
  | "open-reference-drawer"
  | "open-shoot-board";

export const recipeCreateModes: RecipeCreateMode[] = [
  "manual",
  "reference",
  "brand",
];

export const recipeCreateNiches: Array<{
  id: RecipeCreateNicheId;
  label: string;
  labelKo: string;
}> = [
  {
    id: "beauty",
    label: "Beauty",
    labelKo: "뷰티",
  },
  {
    id: "food",
    label: "Food",
    labelKo: "푸드",
  },
  {
    id: "fitness",
    label: "Fitness",
    labelKo: "피트니스",
  },
  {
    id: "home",
    label: "Home",
    labelKo: "홈",
  },
  {
    id: "tech",
    label: "Tech",
    labelKo: "테크",
  },
  {
    id: "other",
    label: "Other",
    labelKo: "기타",
  },
];

export const recipeCreateGoals: Array<{
  id: RecipeCreateGoalId;
  imageSource: RecipeCreateImageSource;
  label: string;
  labelKo: string;
}> = [
  {
    id: "ad",
    imageSource: recipeCreateVisuals.goalAd,
    label: "Ad",
    labelKo: "광고",
  },
  {
    id: "sell",
    imageSource: recipeCreateVisuals.goalSell,
    label: "Sell",
    labelKo: "판매",
  },
  {
    id: "recipe-product",
    imageSource: recipeCreateVisuals.goalRecipeProduct,
    label: "UGC Recipe 판매",
    labelKo: "UGC Recipe 판매",
  },
  {
    id: "personal",
    imageSource: recipeCreateVisuals.goalPersonal,
    label: "Personal",
    labelKo: "개인용",
  },
  {
    id: "viral",
    imageSource: recipeCreateVisuals.goalViral,
    label: "Viral",
    labelKo: "바이럴용",
  },
  {
    id: "conversion",
    imageSource: recipeCreateVisuals.goalConversion,
    label: "Conversion",
    labelKo: "전환용",
  },
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
  void mode;
  return "open-shoot-board";
}

export function getRecipeCreateInitialScenes(
  mode: RecipeCreateMode,
): [] | undefined {
  return mode === "manual" ? [] : undefined;
}

export function getRecipeCreateDraftContext({
  goalId,
  mode,
  nicheId,
  referenceUrl = "",
}: {
  goalId: RecipeCreateGoalId;
  mode: RecipeCreateMode;
  nicheId: RecipeCreateNicheId;
  referenceUrl?: string;
}) {
  const niche =
    recipeCreateNiches.find((item) => item.id === nicheId) ??
    recipeCreateNiches[0];
  const goal =
    recipeCreateGoals.find((item) => item.id === goalId) ??
    recipeCreateGoals[0];
  const modeLabel =
    mode === "reference" ? "Reference" : mode === "brand" ? "Brand" : "Blank";

  return {
    goal: goal.label,
    niche: niche.label,
    notes: `${modeLabel} recipe draft. Niche: ${niche.label}. Goal: ${goal.label}.`,
    title: `${niche.label} ${goal.label} Recipe`,
    videoUrl: mode === "reference" ? referenceUrl.trim() : "",
  };
}
