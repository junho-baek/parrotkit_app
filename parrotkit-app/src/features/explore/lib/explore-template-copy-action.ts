export type ExploreTemplateDetailCopyAffordanceKind = "copy" | "copied";
export type ExploreTemplateDetailCopyLanguage = "en" | "ko";

export type ExploreTemplateDetailCopyAffordance = {
  iconName: "check-circle" | "content-copy";
  kind: ExploreTemplateDetailCopyAffordanceKind;
  label: string;
};

export type ExploreTemplateDetailCopyAffordanceInput = {
  copied: boolean;
  language: ExploreTemplateDetailCopyLanguage;
};

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
