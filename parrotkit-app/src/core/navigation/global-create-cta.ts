import type { AppLanguage } from "@/core/i18n/app-language";

export type GlobalCreateCta = {
  accessibilityHint: string;
  accessibilityLabel: string;
  label: string;
};

const hiddenCreateCtaPaths = new Set([
  "/",
  "/explore",
  "/recipe-create",
  "/recipes",
]);

export function getGlobalCreateCta(language: AppLanguage): GlobalCreateCta {
  if (language === "ko") {
    return {
      accessibilityHint: "빈 레시피 생성 화면 열기",
      accessibilityLabel: "레시피 생성",
      label: "레시피 생성",
    };
  }

  return {
    accessibilityHint: "Open blank recipe creation",
    accessibilityLabel: "Create recipe",
    label: "Create recipe",
  };
}

export function getGlobalCreateCtaDestination() {
  return "/recipe-create?mode=manual" as const;
}

export function shouldShowGlobalCreateCta(pathname: string) {
  return !hiddenCreateCtaPaths.has(pathname);
}
