import {
  getExploreTemplateAction,
  getExploreTemplateActionAffordance,
  getExploreTemplateDetailCopyAffordance,
  type ExploreTemplateActionInput,
} from "./explore-template-copy-action";

const unsavedRecipeAction = getExploreTemplateAction({
  downloaded: false,
  hasRecipe: true,
  origin: "partner",
} satisfies ExploreTemplateActionInput);

if (unsavedRecipeAction !== "copy") {
  throw new Error("Unsaved recipe-backed Explore cards should offer template copy.");
}

const savedRecipeAction = getExploreTemplateAction({
  downloaded: true,
  hasRecipe: true,
  origin: "partner",
} satisfies ExploreTemplateActionInput);

if (savedRecipeAction !== "shoot") {
  throw new Error("Saved recipe-backed Explore cards should move to shooting access.");
}

const communityRecipeAction = getExploreTemplateAction({
  downloaded: false,
  hasRecipe: true,
  origin: "community",
} satisfies ExploreTemplateActionInput);

if (communityRecipeAction !== "copy") {
  throw new Error("Community template cards should use the same local copy/save path.");
}

const copyAffordance = getExploreTemplateActionAffordance(communityRecipeAction);

if (copyAffordance.kind !== "copy" || copyAffordance.iconName !== "content-copy") {
  throw new Error("Available Explore template copy should expose an explicit copy affordance.");
}

const detailCopyAffordance = getExploreTemplateDetailCopyAffordance({
  copied: false,
  language: "en",
});

if (
  detailCopyAffordance.label !== "Copy template" ||
  detailCopyAffordance.iconName !== "content-copy" ||
  detailCopyAffordance.kind !== "copy"
) {
  throw new Error("Explore detail should expose unsaved selected templates as copyable template content.");
}

const copiedDetailAffordance = getExploreTemplateDetailCopyAffordance({
  copied: true,
  language: "ko",
});

if (
  copiedDetailAffordance.label !== "복사됨" ||
  copiedDetailAffordance.iconName !== "check-circle" ||
  copiedDetailAffordance.kind !== "copied"
) {
  throw new Error("Explore detail should show a copied state after template copy.");
}

const brandAction = getExploreTemplateAction({
  downloaded: false,
  hasRecipe: false,
  origin: "brand",
} satisfies ExploreTemplateActionInput);

if (brandAction !== "apply") {
  throw new Error("Static brand cards should remain Pro/deferred instead of template copy.");
}
