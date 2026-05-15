import { readFileSync } from 'node:fs';

import type { MockRecipe } from '@/core/mocks/parrotkit-data';
import {
  getHomeContinueWorkflowCard,
  getHomeContinueWorkflowDestination,
  getHomeContinueWorkflowEntry,
  getHomeContinueWorkflowHref,
  getHomeEmptyWorkflowFallback,
} from './home-continue-workflow-card';
import { getHomeWorkflowSelection } from './home-workflow-resolution';

const homeWorkspaceSurfaceSource = readFileSync(
  'src/features/home/components/home-workspace-surface.tsx',
  'utf8',
);
const recipeDetailScreenSource = readFileSync(
  'src/features/recipes/screens/recipe-detail-screen.tsx',
  'utf8',
);
const shootBoardDraggableListSource = readFileSync(
  'src/features/recipes/components/shoot-board-draggable-list.tsx',
  'utf8',
);
const shootBoardSceneCardSource = readFileSync(
  'src/features/recipes/components/shoot-board-scene-card.tsx',
  'utf8',
);

if (
  !/getHomeWorkflowSelection\(\s*recipes,\s*\{\s*savedTakes\s*\}/s.test(homeWorkspaceSurfaceSource)
) {
  throw new Error('Home surface workflow selection must pass saved My Takes into Continue board lookup.');
}

if (!/getHomeContinueWorkflowEntry/.test(homeWorkspaceSurfaceSource)) {
  throw new Error('Home surface must derive a Continue overview entry that includes the next required cut highlight.');
}

if (!/getHomeContinueWorkflowHref/.test(homeWorkspaceSurfaceSource)) {
  throw new Error('Home surface must push the Continue href with highlightCutId metadata.');
}

if (!/router\.push\(continueWorkflowHref as Href\)/.test(homeWorkspaceSurfaceSource)) {
  throw new Error('Home Continue primary action must open the overview route with highlightCutId metadata.');
}

if (
  !/<Pressable(?=[\s\S]*accessibilityLabel=\{card\.accessibilityLabel\})(?=[\s\S]*onPress=\{onOpenRecipe\})(?=[\s\S]*style=\{styles\.continueCard\})/.test(homeWorkspaceSurfaceSource)
) {
  throw new Error('Home Continue card itself must be the tappable recipe CTA.');
}

if (/>\{card\.actionLabel\}<\/Text>/.test(homeWorkspaceSurfaceSource)) {
  throw new Error('Home Continue card must not render a duplicate actionLabel CTA when the card itself is tappable.');
}

if (!/highlightCutId\?: string/.test(recipeDetailScreenSource)) {
  throw new Error('Recipe overview route params must accept highlightCutId metadata.');
}

if (!/highlightedCutId=\{boardOverviewState\.highlightCutId \?\? undefined\}/.test(recipeDetailScreenSource)) {
  throw new Error('Recipe overview must pass the board overview state highlight into the shoot board list.');
}

if (!/setExpandedCutIds\(\[targetCut\.id\]\)/.test(recipeDetailScreenSource)) {
  throw new Error('Recipe overview must expand the highlighted next required cut.');
}

if (!/type BoardOverviewUiState = \{[\s\S]*nextRequiredCutId: string \| null;[\s\S]*highlightState: BoardOverviewHighlightState;[\s\S]*cameraEntryRequiresTap: true;[\s\S]*\}/.test(recipeDetailScreenSource)) {
  throw new Error('Recipe overview must model next required cut guidance in an explicit UI state shape.');
}

if (!/getNextRequiredShootBoardCutWithoutSavedMyTake\(\{[\s\S]*savedTakes: getSavedRecipeTakes\(nativeRecipe\.id\),[\s\S]*\}\)/.test(recipeDetailScreenSource)) {
  throw new Error('Recipe overview state must compute the next required cut missing a saved My Take.');
}

if (!/highlightedCutId\?: string/.test(shootBoardDraggableListSource)) {
  throw new Error('Shoot board list must accept a highlighted cut id.');
}

if (!/highlighted=\{highlightedCutId === cut\.id\}/.test(shootBoardDraggableListSource)) {
  throw new Error('Shoot board list must mark only the selected cut card as highlighted.');
}

if (!/highlighted: boolean/.test(shootBoardSceneCardSource)) {
  throw new Error('Shoot board cut card must accept a highlighted state.');
}

if (!/styles\.highlightedCard/.test(shootBoardSceneCardSource)) {
  throw new Error('Shoot board cut card must render a visual highlighted state.');
}

const baseRecipe: MockRecipe = {
  creator: '@creator',
  downloadCount: 0,
  goal: 'Create a reusable recipe workflow.',
  id: 'recipe-launch-hook',
  niche: 'Creator',
  notes: '',
  ownerHandle: '@parrotkitcodextest',
  ownerName: 'You',
  ownership: 'owned',
  platform: 'TikTok',
  savedAt: 'Saved just now',
  scenes: [],
  shootStatus: 'ready',
  shotSceneCount: 2,
  sourceUrl: '',
  summary: 'Local recipe',
  thumbnail: 'mock://thumbnail',
  title: '런칭 훅',
  totalSceneCount: 4,
  verification: 'community',
};

const inProgressRecipe: MockRecipe = {
  ...baseRecipe,
  lastShotAt: 'Last shot just now',
  shootStatus: 'continue',
};

const completedRequiredCutRecipe: MockRecipe = {
  ...baseRecipe,
  id: 'completed-required-cut-board',
  scenes: [
    {
      analysisLines: [],
      id: 'completed-required-hook',
      prompterLines: [],
      recipeLines: [],
      summary: 'Required hook cut',
      title: 'Required hook cut',
    },
    {
      analysisLines: [],
      id: 'completed-required-proof',
      prompterLines: [],
      recipeLines: [],
      summary: 'Required proof cut',
      title: 'Required proof cut',
    },
  ],
  shootStatus: 'continue',
  shotSceneCount: 2,
  totalSceneCount: 2,
};

const inProgressCard = getHomeContinueWorkflowCard({
  language: 'ko',
  selection: getHomeWorkflowSelection([inProgressRecipe]),
});

function assertNoWorkflowCopy(fields: string[], label: string) {
  const copy = fields.join(' ');

  if (/workflow|워크플로우/i.test(copy)) {
    throw new Error(`${label} must use recipe language and must not expose workflow copy.`);
  }
}

if (!inProgressCard) {
  throw new Error('Home must render a continue card when a selected workflow exists.');
}

if (inProgressCard.reason !== 'inProgress') {
  throw new Error('Home continue card must preserve that the selected workflow is in progress.');
}

if (inProgressCard.sectionTitle !== '이어갈 레시피') {
  throw new Error('Home continue section must clearly label an in-progress selected recipe.');
}

if (inProgressCard.stateLabel !== '진행 중') {
  throw new Error('Home continue card must expose selected workflow state copy.');
}

if (inProgressCard.title !== '런칭 훅 이어하기') {
  throw new Error('Home continue card must present the selected workflow as a Korean continue path.');
}

if (inProgressCard.actionLabel !== '레시피 이어가기') {
  throw new Error('Home continue card primary action must use recipe language.');
}

if (/Shoot|New Shoot|Start Shoot/i.test(inProgressCard.actionLabel)) {
  throw new Error('Home continue card must not use Shoot/New Shoot/Start Shoot copy.');
}

assertNoWorkflowCopy(
  [
    inProgressCard.accessibilityLabel,
    inProgressCard.actionLabel,
    inProgressCard.body,
    inProgressCard.sectionTitle,
    inProgressCard.stateLabel,
    inProgressCard.title,
  ],
  'Home in-progress Continue card',
);

const recentCard = getHomeContinueWorkflowCard({
  language: 'en',
  selection: getHomeWorkflowSelection([baseRecipe]),
});

if (!recentCard) {
  throw new Error('Home must render a continue card for the selected recent workflow.');
}

if (recentCard.reason !== 'recent') {
  throw new Error('Home continue card must preserve that the selected workflow is recent.');
}

if (recentCard.sectionTitle !== 'Recent recipe') {
  throw new Error('Home continue section must clearly label a recent selected recipe.');
}

if (recentCard.stateLabel !== 'Recent') {
  throw new Error('Home continue card must expose recent selected workflow state copy.');
}

if (recentCard.title !== 'Continue 런칭 훅') {
  throw new Error('Home continue card must present a recent workflow as a continue path.');
}

if (/in progress/i.test(recentCard.body)) {
  throw new Error('Home recent workflow card must not describe a ready recent workflow as in progress.');
}

assertNoWorkflowCopy(
  [
    recentCard.accessibilityLabel,
    recentCard.actionLabel,
    recentCard.body,
    recentCard.sectionTitle,
    recentCard.stateLabel,
    recentCard.title,
  ],
  'Home recent Continue card',
);

const checklistCompleteButMyTakeMissingRecipe: MockRecipe = {
  ...baseRecipe,
  id: 'checklist-complete-mytake-missing',
  scenes: [
    {
      analysisLines: [],
      id: 'checklist-hook',
      prompterLines: [],
      recipeLines: [],
      summary: 'Hook',
      title: 'Hook',
    },
    {
      analysisLines: [],
      id: 'checklist-proof',
      prompterLines: [],
      recipeLines: [],
      summary: 'Proof',
      title: 'Proof',
    },
    {
      analysisLines: [],
      id: 'checklist-cta',
      prompterLines: [],
      recipeLines: [],
      summary: 'CTA',
      title: 'CTA',
    },
  ],
  shootStatus: 'continue',
  shotSceneCount: 3,
  title: '체크리스트 완료 레시피',
  totalSceneCount: 3,
};

const checklistSupportingSelection = getHomeWorkflowSelection(
  [checklistCompleteButMyTakeMissingRecipe],
  {
    savedTakes: [
      {
        cardIds: ['checklist-hook'],
        recipeId: 'checklist-complete-mytake-missing',
        sceneId: 'checklist-hook',
      },
      {
        cardIds: ['checklist-proof'],
        recipeId: 'checklist-complete-mytake-missing',
        sceneId: 'checklist-proof',
      },
    ],
  },
);

const checklistSupportingCard = getHomeContinueWorkflowCard({
  language: 'ko',
  selection: checklistSupportingSelection,
});

if (!checklistSupportingCard) {
  throw new Error('Home must still render Continue when checklist progress is complete but a required My Take is missing.');
}

if (checklistSupportingCard.supportingProgressLabel !== '체크리스트 3/3컷') {
  throw new Error('Home continue card must expose checklist progress as a supporting progress label.');
}

if (!/체크리스트 3\/3컷/.test(checklistSupportingCard.body)) {
  throw new Error('Home continue card may display checklist progress as supporting context.');
}

const emptyCard = getHomeContinueWorkflowCard({
  language: 'ko',
  selection: {
    reason: 'none',
    recipe: null,
  },
});

if (emptyCard !== null) {
  throw new Error('Home continue card should be absent when no local workflow is selected.');
}

const completedRequiredCutCard = getHomeContinueWorkflowCard({
  language: 'ko',
  selection: getHomeWorkflowSelection(
    [completedRequiredCutRecipe],
    {
      savedTakes: [
        {
          cardIds: ['completed-required-hook'],
          recipeId: 'completed-required-cut-board',
          sceneId: 'completed-required-hook',
        },
        {
          cardIds: ['completed-required-proof'],
          recipeId: 'completed-required-cut-board',
          sceneId: 'completed-required-proof',
        },
      ],
    },
  ),
});

if (completedRequiredCutCard !== null) {
  throw new Error('Home Continue must exclude a board when every required cut has a saved My Take.');
}

const continueDestination = getHomeContinueWorkflowDestination({
  createDestination: '/recipe-create?mode=manual',
  selection: getHomeWorkflowSelection([inProgressRecipe]),
});

if (continueDestination !== '/recipe/recipe-launch-hook') {
  throw new Error('Home continue action must open the selected workflow recipe board.');
}

const continueEntry = getHomeContinueWorkflowEntry({
  createDestination: '/recipe-create?mode=manual',
  savedTakes: [
    {
      cardIds: ['recipe-launch-hook-scene-1'],
      recipeId: 'recipe-launch-hook',
      sceneId: 'recipe-launch-hook-scene-1',
    },
  ],
  selection: getHomeWorkflowSelection([
    {
      ...inProgressRecipe,
      scenes: [
        {
          analysisLines: [],
          id: 'recipe-launch-hook-scene-1',
          prompterLines: [],
          recipeLines: [],
          summary: 'Hook',
          title: 'Hook',
        },
        {
          analysisLines: [],
          id: 'recipe-launch-hook-scene-2',
          prompterLines: [],
          recipeLines: [],
          summary: 'Proof',
          title: 'Proof',
        },
      ],
    },
  ]),
});

if (continueEntry.screen !== 'shooting-board-overview') {
  throw new Error('Home continue must enter the shooting board overview screen.');
}

if (continueEntry.cameraEntryRequiresTap !== true) {
  throw new Error('Home continue overview entry must keep camera entry gated behind an explicit cut tap.');
}

if (continueEntry.destination !== '/recipe/recipe-launch-hook') {
  throw new Error('Home continue overview entry must use the selected recipe board route.');
}

if (continueEntry.highlightCutId !== 'recipe-launch-hook-scene-2') {
  throw new Error('Home continue overview entry must expose the next required cut missing a saved My Take for highlight.');
}

const continueHref = getHomeContinueWorkflowHref(continueEntry);

if (continueHref !== '/recipe/recipe-launch-hook?highlightCutId=recipe-launch-hook-scene-2') {
  throw new Error('Home continue href must pass the selected next missing required cut to the board overview.');
}

const noMissingCutContinueEntry = getHomeContinueWorkflowEntry({
  createDestination: '/recipe-create?mode=manual',
  savedTakes: [
    {
      cardIds: ['completed-required-hook'],
      recipeId: 'completed-required-cut-board',
      sceneId: 'completed-required-hook',
    },
    {
      cardIds: ['completed-required-proof'],
      recipeId: 'completed-required-cut-board',
      sceneId: 'completed-required-proof',
    },
  ],
  selection: {
    reason: 'recent',
    recipe: completedRequiredCutRecipe,
  },
});

if (noMissingCutContinueEntry.screen !== 'shooting-board-overview') {
  throw new Error('Home continue no-missing-cut fixture must still land on the shooting board overview.');
}

if (noMissingCutContinueEntry.cameraEntryRequiresTap !== true) {
  throw new Error('Home continue no-missing-cut fixture must keep camera entry user-initiated.');
}

if (noMissingCutContinueEntry.highlightCutId !== null) {
  throw new Error('Home continue must not expose a next cut highlight when every required cut has a saved My Take.');
}

if (getHomeContinueWorkflowHref(noMissingCutContinueEntry) !== '/recipe/completed-required-cut-board') {
  throw new Error('Home continue no-missing-cut href must omit highlight metadata and remain on the board overview.');
}

if (/prompter|camera|checklist|cutId|sceneId|retakeTakeId/i.test(continueEntry.destination)) {
  throw new Error('Home continue destination must not deep link into camera, checklist detail, prompter, or restored cut state.');
}

if (/prompter|camera|checklist|sceneId|retakeTakeId/i.test(continueHref)) {
  throw new Error('Home continue href must not open camera/prompter or restore scene/take state before a cut tap.');
}

const emptyDestination = getHomeContinueWorkflowDestination({
  createDestination: '/recipe-create?mode=manual',
  selection: {
    reason: 'none',
    recipe: null,
  },
});

if (emptyDestination !== '/recipe-create?mode=manual') {
  throw new Error('Home continue fallback must open the manual recipe creation route.');
}

const emptyFallback = getHomeEmptyWorkflowFallback({
  createDestination: '/recipe-create?mode=manual',
  language: 'ko',
  selection: {
    reason: 'none',
    recipe: null,
  },
});

if (emptyFallback === null) {
  throw new Error('Home must expose an empty workflow fallback when no in-progress or recent workflow exists.');
}

if (emptyFallback.actionLabel !== '레시피 생성') {
  throw new Error('Home empty workflow fallback must use the corrected Korean recipe creation CTA.');
}

if (emptyFallback.destination !== '/recipe-create?mode=manual') {
  throw new Error('Home empty workflow fallback must open manual blank recipe creation.');
}

if (/Shoot|New Shoot|Start Shoot/i.test(emptyFallback.actionLabel)) {
  throw new Error('Home empty workflow fallback must not use Shoot/New Shoot/Start Shoot copy.');
}

const nonEmptyFallback = getHomeEmptyWorkflowFallback({
  createDestination: '/recipe-create?mode=manual',
  language: 'ko',
  selection: getHomeWorkflowSelection([inProgressRecipe]),
});

if (nonEmptyFallback !== null) {
  throw new Error('Home empty workflow fallback must be absent when a workflow exists.');
}
