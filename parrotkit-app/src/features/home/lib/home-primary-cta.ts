import type { AppLanguage } from "@/core/i18n/app-language";

export type HomePrimaryCta = {
  actionLabel: string;
  body: string;
  title: string;
  workflowLabel: string;
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
      actionLabel: hasContinueRecipe ? "워크플로우 계속하기" : "레시피 생성",
      body: hasContinueRecipe
        ? "최근 컷 보드로 돌아가 대본 확인, 촬영, 테이크 저장을 이어가세요."
        : "빈 레시피에서 컷을 만들고 바로 촬영 흐름으로 이어가세요.",
      title: hasContinueRecipe && recipeTitle ? `${recipeTitle} 이어하기` : "빈 레시피 워크플로우 시작",
      workflowLabel: "크리에이터 워크플로우",
    };
  }

  return {
    actionLabel: hasContinueRecipe ? "Continue workflow" : "Create recipe",
    body: hasContinueRecipe
      ? "Return to the recent cut board to review the script, film, and save takes."
      : "Create a blank recipe, write the cuts, and move straight into filming.",
    title: hasContinueRecipe && recipeTitle ? `Continue ${recipeTitle}` : "Start blank recipe workflow",
    workflowLabel: "Creator workflow",
  };
}

export function getHomePrimaryCtaDestination({
  createDestination,
  recipeId,
}: HomePrimaryCtaDestinationInput) {
  return recipeId ? `/recipe/${recipeId}` : createDestination;
}
