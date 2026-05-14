import {
  getPrompterSavedTakeReturnHref,
  getPrompterTakeReviewCopy,
} from './prompter-take-save-state';

const idleCopy = getPrompterTakeReviewCopy('idle');

if (idleCopy.primaryActionLabel !== 'Save take') {
  throw new Error('Recorded prompter takes should offer an explicit save action.');
}

const savedCopy = getPrompterTakeReviewCopy('kept');

if (savedCopy.title !== 'Saved to recipe') {
  throw new Error('Saved prompter takes should show a recipe-local saved state.');
}

if (savedCopy.primaryActionLabel !== 'Back to cut') {
  throw new Error('Saved prompter takes should return users to the current cut board context.');
}

const returnHref = getPrompterSavedTakeReturnHref({
  cutId: 'cut-toast-hook',
  recipeId: 'recipe-toast',
  sceneId: 'scene-toast-hook',
  takeId: 'take-toast-1',
});

if (returnHref !== '/recipe/recipe-toast?tab=shoot&sceneId=cut-toast-hook&takeId=take-toast-1') {
  throw new Error('Saved prompter takes should return to the same cut board and selected take.');
}
