import type { AppLanguage } from "@/core/i18n/app-language";

export type HomePrimaryCta = {
  actionLabel: string;
  body: string;
  recipeLabel: string;
  title: string;
};

export type HomePrimaryCtaDestinationInput = {
  createDestination: "/recipe-create?mode=manual";
  recipeId?: string;
};

export function getHomePrimaryCta({
  hasContinueRecipe,
  language,
  recipeTitle,
}: {
  hasContinueRecipe: boolean;
  language: AppLanguage;
  recipeTitle?: string;
}): HomePrimaryCta {
  if (language === "ko") {
    return {
      actionLabel: hasContinueRecipe ? "레시피 이어가기" : "레시피 생성",
      body: hasContinueRecipe
        ? "최근 컷 보드로 돌아가 대본 확인, 촬영, 테이크 저장을 이어가세요."
        : "빈 레시피에서 컷을 만들고 바로 촬영을 준비하세요.",
      recipeLabel: "크리에이터 레시피",
      title: hasContinueRecipe && recipeTitle ? `${recipeTitle} 이어하기` : "빈 레시피 만들기",
    };
  }

  return {
    actionLabel: hasContinueRecipe ? "Continue recipe" : "Create recipe",
    body: hasContinueRecipe
      ? "Return to the recent cut board to review the script, film, and save takes."
      : "Create a blank recipe, write the cuts, and prepare to film.",
    recipeLabel: "Creator recipe",
    title: hasContinueRecipe && recipeTitle ? `Continue ${recipeTitle}` : "Create a blank recipe",
  };
}

export function getHomePrimaryCtaDestination({
  createDestination,
  recipeId,
}: HomePrimaryCtaDestinationInput) {
  return recipeId ? `/recipe/${recipeId}` : createDestination;
}
