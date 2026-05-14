export type ExploreTemplateOrigin = "partner" | "community" | "brand";
export type ExploreTemplateAction = "apply" | "copy" | "shoot";
export type ExploreTemplateActionAffordanceKind = "deferred" | "copy" | "filming";
export type ExploreTemplateDetailCopyAffordanceKind = "copy" | "copied";
export type ExploreTemplateDetailCopyLanguage = "en" | "ko";

export type ExploreTemplateActionInput = {
  downloaded: boolean;
  hasRecipe: boolean;
  origin: ExploreTemplateOrigin;
};

export type ExploreTemplateActionAffordance = {
  iconName: "briefcase-outline" | "content-copy" | "movie-open-play-outline";
  kind: ExploreTemplateActionAffordanceKind;
};

export type ExploreTemplateDetailCopyAffordance = {
  iconName: "check-circle" | "content-copy";
  kind: ExploreTemplateDetailCopyAffordanceKind;
  label: string;
};

export type ExploreTemplateDetailCopyAffordanceInput = {
  copied: boolean;
  language: ExploreTemplateDetailCopyLanguage;
};

export function getExploreTemplateAction({
  downloaded,
  hasRecipe,
  origin,
}: ExploreTemplateActionInput): ExploreTemplateAction {
  if (!hasRecipe || origin === "brand") {
    return "apply";
  }

  return downloaded ? "shoot" : "copy";
}

export function getExploreTemplateActionAffordance(
  action: ExploreTemplateAction
): ExploreTemplateActionAffordance {
  if (action === "copy") {
    return {
      iconName: "content-copy",
      kind: "copy",
    };
  }

  if (action === "shoot") {
    return {
      iconName: "movie-open-play-outline",
      kind: "filming",
    };
  }

  return {
    iconName: "briefcase-outline",
    kind: "deferred",
  };
}

export function getExploreTemplateDetailCopyAffordance({
  copied,
  language,
}: ExploreTemplateDetailCopyAffordanceInput): ExploreTemplateDetailCopyAffordance {
  if (copied) {
    return {
      iconName: "check-circle",
      kind: "copied",
      label: language === "ko" ? "복사됨" : "Copied",
    };
  }

  return {
    iconName: "content-copy",
    kind: "copy",
    label: language === "ko" ? "템플릿 복사" : "Copy template",
  };
}
