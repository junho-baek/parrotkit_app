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

export type RecipeCreateModeInputConfig =
  | { visible: false }
  | {
      editable: boolean;
      inputMode: "text" | "url";
      keyboardType: "default" | "url";
      placeholder: string;
      value: string;
      visible: true;
    };

export type RecipeCreateSubmitState = {
  enabled: boolean;
  referenceLinkError: "invalid-url" | null;
};

export type RecipeCreateReferenceLinkValidationState =
  | "empty"
  | "invalid"
  | "valid";

export function getRecipeCreateReferenceLinkValidationState(
  referenceUrl: string,
): RecipeCreateReferenceLinkValidationState {
  const trimmedUrl = referenceUrl.trim();

  if (!trimmedUrl) {
    return "empty";
  }

  try {
    const parsedUrl = new URL(trimmedUrl);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
      ? "valid"
      : "invalid";
  } catch {
    return "invalid";
  }
}

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

export function getRecipeCreateModeInputConfig({
  brandPlaceholder,
  linkPlaceholder,
  mode,
  referenceUrl,
}: {
  brandPlaceholder: string;
  linkPlaceholder: string;
  mode: RecipeCreateMode;
  referenceUrl: string;
}): RecipeCreateModeInputConfig {
  if (mode === "manual") {
    return { visible: false };
  }

  if (mode === "reference") {
    return {
      editable: true,
      inputMode: "url",
      keyboardType: "url",
      placeholder: linkPlaceholder,
      value: referenceUrl,
      visible: true,
    };
  }

  return {
    editable: false,
    inputMode: "text",
    keyboardType: "default",
    placeholder: brandPlaceholder,
    value: "",
    visible: true,
  };
}

export function getRecipeCreateSubmitState({
  mode,
  referenceUrl,
}: {
  mode: RecipeCreateMode;
  referenceUrl: string;
}): RecipeCreateSubmitState {
  if (mode === "reference") {
    const validationState =
      getRecipeCreateReferenceLinkValidationState(referenceUrl);

    return {
      enabled: validationState === "valid",
      referenceLinkError: validationState === "invalid" ? "invalid-url" : null,
    };
  }

  return { enabled: true, referenceLinkError: null };
}

export function getRecipeCreateInitialScenes(
  mode: RecipeCreateMode,
): [] | undefined {
  return mode === "manual" ? [] : undefined;
}

export function getRecipeCreateDraftContext({
  customNicheLabel = "",
  goalId,
  mode,
  nicheId,
  referenceUrl = "",
}: {
  customNicheLabel?: string;
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
  const normalizedCustomNiche = customNicheLabel.trim();
  const nicheLabel = niche.id === "other" && normalizedCustomNiche ? normalizedCustomNiche : niche.label;

  return {
    goal: goal.label,
    niche: nicheLabel,
    notes: `${modeLabel} recipe draft. Niche: ${nicheLabel}. Goal: ${goal.label}.`,
    title: `${nicheLabel} ${goal.label} Recipe`,
    videoUrl: mode === "reference" ? referenceUrl.trim() : "",
  };
}
