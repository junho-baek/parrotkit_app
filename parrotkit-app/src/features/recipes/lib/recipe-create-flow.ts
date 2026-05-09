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
  imageUrl?: string;
  label: string;
  labelKo: string;
}> = [
  {
    id: "beauty",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=240&q=80",
    label: "Beauty",
    labelKo: "뷰티",
  },
  {
    id: "food",
    imageUrl:
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=240&q=80",
    label: "Food",
    labelKo: "푸드",
  },
  {
    id: "fitness",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=240&q=80",
    label: "Fitness",
    labelKo: "피트니스",
  },
  {
    id: "home",
    imageUrl:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=240&q=80",
    label: "Home",
    labelKo: "홈",
  },
  {
    id: "tech",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=240&q=80",
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
  imageUrl: string;
  label: string;
  labelKo: string;
}> = [
  {
    id: "ad",
    imageUrl:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=500&q=82",
    label: "Ad",
    labelKo: "광고",
  },
  {
    id: "sell",
    imageUrl:
      "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=500&q=82",
    label: "Sell",
    labelKo: "판매",
  },
  {
    id: "recipe-product",
    imageUrl:
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=500&q=82",
    label: "UGC Recipe 판매",
    labelKo: "UGC Recipe 판매",
  },
  {
    id: "personal",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=82",
    label: "Personal",
    labelKo: "개인용",
  },
  {
    id: "viral",
    imageUrl:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=500&q=82",
    label: "Viral",
    labelKo: "바이럴용",
  },
  {
    id: "conversion",
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=500&q=82",
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
