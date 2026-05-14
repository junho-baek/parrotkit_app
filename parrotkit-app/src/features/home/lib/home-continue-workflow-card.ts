import type { AppLanguage } from '@/core/i18n/app-language';
import type { MockRecipe } from '@/core/mocks/parrotkit-data';
import type {
  HomeWorkflowSelection,
  RecipeBoardSavedMyTake,
} from './home-workflow-resolution';
import { getNextRequiredCutWithoutSavedMyTakeId } from './home-workflow-resolution';

export type HomeContinueWorkflowCard = {
  actionLabel: string;
  accessibilityLabel: string;
  body: string;
  reason: Exclude<HomeWorkflowSelection['reason'], 'none'>;
  recipe: MockRecipe;
  sectionTitle: string;
  stateLabel: string;
  supportingProgressLabel: string;
  title: string;
};

export type HomeEmptyWorkflowFallback = {
  actionLabel: string;
  body: string;
  destination: '/recipe-create?mode=manual';
  title: string;
};

export type HomeContinueWorkflowEntry = {
  destination: string;
  highlightCutId: string | null;
  screen: 'manual-recipe-create' | 'shooting-board-overview';
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
  const supportingProgressLabel =
    language === 'ko'
      ? `체크리스트 ${selection.recipe.shotSceneCount}/${selection.recipe.totalSceneCount}컷`
      : `Checklist ${selection.recipe.shotSceneCount}/${selection.recipe.totalSceneCount} cuts`;
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
        ? `${supportingProgressLabel} 진행 중. 선택한 레시피 보드로 돌아가 다음 컷을 이어갑니다.`
        : `${supportingProgressLabel} 구성됨. 최근 레시피 보드로 돌아가 촬영 흐름을 이어갑니다.`
      : isInProgress
        ? `${supportingProgressLabel} in progress. Return to the selected recipe board and continue the next cut.`
        : `${supportingProgressLabel} prepared. Return to the recent recipe board and continue the workflow.`;
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
    supportingProgressLabel,
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

export function getHomeContinueWorkflowEntry({
  createDestination,
  savedTakes = [],
  selection,
}: {
  createDestination: '/recipe-create?mode=manual';
  savedTakes?: RecipeBoardSavedMyTake[];
  selection: HomeWorkflowSelection;
}): HomeContinueWorkflowEntry {
  return {
    destination: getHomeContinueWorkflowDestination({
      createDestination,
      selection,
    }),
    highlightCutId:
      selection.reason === 'none'
        ? null
        : getNextRequiredCutWithoutSavedMyTakeId({
            recipe: selection.recipe,
            savedTakes,
          }),
    screen: selection.reason === 'none' ? 'manual-recipe-create' : 'shooting-board-overview',
  };
}

export function getHomeContinueWorkflowHref(entry: HomeContinueWorkflowEntry) {
  if (entry.highlightCutId === null) {
    return entry.destination;
  }

  return `${entry.destination}?highlightCutId=${encodeURIComponent(entry.highlightCutId)}`;
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
