import type { MockRecipe } from '@/core/mocks/parrotkit-data';
import {
  getHomeContinueWorkflowCard,
  getHomeContinueWorkflowDestination,
  getHomeEmptyWorkflowFallback,
} from './home-continue-workflow-card';
import { getHomeWorkflowSelection } from './home-workflow-resolution';

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

const inProgressCard = getHomeContinueWorkflowCard({
  language: 'ko',
  selection: getHomeWorkflowSelection([inProgressRecipe]),
});

if (!inProgressCard) {
  throw new Error('Home must render a continue card when a selected workflow exists.');
}

if (inProgressCard.reason !== 'inProgress') {
  throw new Error('Home continue card must preserve that the selected workflow is in progress.');
}

if (inProgressCard.sectionTitle !== '이어갈 워크플로우') {
  throw new Error('Home continue section must clearly label an in-progress selected workflow.');
}

if (inProgressCard.stateLabel !== '진행 중') {
  throw new Error('Home continue card must expose selected workflow state copy.');
}

if (inProgressCard.title !== '런칭 훅 이어하기') {
  throw new Error('Home continue card must present the selected workflow as a Korean continue path.');
}

if (inProgressCard.actionLabel !== '워크플로우 계속하기') {
  throw new Error('Home continue card primary action must be continuation-oriented.');
}

if (/Shoot|New Shoot|Start Shoot/i.test(inProgressCard.actionLabel)) {
  throw new Error('Home continue card must not use Shoot/New Shoot/Start Shoot copy.');
}

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

if (recentCard.sectionTitle !== 'Recent workflow') {
  throw new Error('Home continue section must clearly label a recent selected workflow.');
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

const continueDestination = getHomeContinueWorkflowDestination({
  createDestination: '/recipe-create?mode=manual',
  selection: getHomeWorkflowSelection([inProgressRecipe]),
});

if (continueDestination !== '/recipe/recipe-launch-hook') {
  throw new Error('Home continue action must open the selected workflow recipe board.');
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
