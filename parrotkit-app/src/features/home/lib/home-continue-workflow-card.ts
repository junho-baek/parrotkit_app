import type { AppLanguage } from '@/core/i18n/app-language';
import type { MockRecipe } from '@/core/mocks/parrotkit-data';
import type { HomeWorkflowSelection } from '@/features/home/lib/home-workflow-resolution';

export type HomeContinueWorkflowCard = {
  actionLabel: string;
  accessibilityLabel: string;
  body: string;
  reason: Exclude<HomeWorkflowSelection['reason'], 'none'>;
  recipe: MockRecipe;
  sectionTitle: string;
  stateLabel: string;
  title: string;
};

export type HomeEmptyWorkflowFallback = {
  actionLabel: string;
  body: string;
  destination: '/recipe-create?mode=manual';
  title: string;
};

export function getHomeContinueWorkflowCard({
  language,
  selection,
}: {
  language: AppLanguage;
  selection: HomeWorkflowSelection;
}): HomeContinueWorkflowCard | null {
  if (selection.reason === 'none') {
    return null;
  }

  const recipeTitle = selection.recipe.title.trim() || (language === 'ko' ? '선택한 레시피' : 'selected recipe');
  const progressLabel =
    language === 'ko'
      ? `${selection.recipe.shotSceneCount}/${selection.recipe.totalSceneCount}컷`
      : `${selection.recipe.shotSceneCount}/${selection.recipe.totalSceneCount} cuts`;
  const isInProgress = selection.reason === 'inProgress';
  const sectionTitle =
    language === 'ko'
      ? isInProgress
        ? '이어갈 워크플로우'
        : '최근 워크플로우'
      : isInProgress
        ? 'Continue workflow'
        : 'Recent workflow';
  const stateLabel =
    language === 'ko'
      ? isInProgress
        ? '진행 중'
        : '최근 작업'
      : isInProgress
        ? 'In progress'
        : 'Recent';
  const body =
    language === 'ko'
      ? isInProgress
        ? `${progressLabel} 진행 중. 선택한 레시피 보드로 돌아가 다음 컷을 이어갑니다.`
        : `${progressLabel} 구성됨. 최근 레시피 보드로 돌아가 촬영 흐름을 이어갑니다.`
      : isInProgress
        ? `${progressLabel} in progress. Return to the selected recipe board and continue the next cut.`
        : `${progressLabel} prepared. Return to the recent recipe board and continue the workflow.`;
  const title = language === 'ko' ? `${recipeTitle} 이어하기` : `Continue ${recipeTitle}`;

  return {
    actionLabel: language === 'ko' ? '워크플로우 계속하기' : 'Continue workflow',
    accessibilityLabel:
      language === 'ko'
        ? `${sectionTitle}: ${title}`
        : `${sectionTitle}: ${title}`,
    body,
    reason: selection.reason,
    recipe: selection.recipe,
    sectionTitle,
    stateLabel,
    title,
  };
}

export function getHomeContinueWorkflowDestination({
  createDestination,
  selection,
}: {
  createDestination: '/recipe-create?mode=manual';
  selection: HomeWorkflowSelection;
}) {
  return selection.reason === 'none' ? createDestination : `/recipe/${selection.recipe.id}`;
}

export function getHomeEmptyWorkflowFallback({
  createDestination,
  language,
  selection,
}: {
  createDestination: '/recipe-create?mode=manual';
  language: AppLanguage;
  selection: HomeWorkflowSelection;
}): HomeEmptyWorkflowFallback | null {
  if (selection.reason !== 'none') {
    return null;
  }

  return {
    actionLabel: language === 'ko' ? '레시피 생성' : 'Create recipe',
    body:
      language === 'ko'
        ? '아직 이어갈 레시피가 없어요. 빈 레시피를 만들고 컷 보드를 채워 촬영을 시작하세요.'
        : 'No in-progress or recent workflow yet. Create a blank recipe, fill the cut board, and start filming.',
    destination: createDestination,
    title: language === 'ko' ? '새 레시피 워크플로우 시작' : 'Start a new recipe workflow',
  };
}
