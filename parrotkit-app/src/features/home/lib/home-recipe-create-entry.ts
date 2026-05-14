import type { AppLanguage } from "@/core/i18n/app-language";

export type HomeRecipeCreateEntry = {
  accessibilityLabel: string;
  destination: "/recipe-create?mode=manual";
  label: string;
};

export function getHomeRecipeCreateEntry(language: AppLanguage): HomeRecipeCreateEntry {
  return {
    accessibilityLabel: language === "ko" ? "레시피 생성" : "Create recipe",
    destination: "/recipe-create?mode=manual",
    label: language === "ko" ? "레시피 생성" : "Create recipe",
  };
}
