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
  cameraEntryRequiresTap: true;
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
        ? '이어갈 레시피'
        : '최근 레시피'
      : isInProgress
        ? 'Continue recipe'
        : 'Recent recipe';
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
        ? `${supportingProgressLabel}`
        : `${supportingProgressLabel}`
      : isInProgress
        ? `${supportingProgressLabel}`
        : `${supportingProgressLabel}`;
  const title = language === 'ko' ? `${recipeTitle} 이어하기` : `Continue ${recipeTitle}`;

  return {
    actionLabel: language === 'ko' ? '레시피 이어가기' : 'Continue recipe',
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
    cameraEntryRequiresTap: true,
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
        ? '빈 레시피를 만들고 컷 보드를 채워보세요.'
        : 'Create a blank recipe and fill the cut board.',
    destination: createDestination,
    title: language === 'ko' ? '새 레시피 만들기' : 'Create a new recipe',
  };
}
