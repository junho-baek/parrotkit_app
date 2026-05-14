import { persistPublishCompletionResult } from './publish-completion-success-path';

const markedRecipeIds: string[] = [];
const markRecipeBoardComplete = (recipeId: string) => {
  markedRecipeIds.push(recipeId);
  return recipeId === 'recipe-success';
};

const successResult = persistPublishCompletionResult({
  markRecipeBoardComplete,
  publishSucceeded: true,
  recipeId: 'recipe-success',
});

if (successResult !== true) {
  throw new Error('Successful publish should return the persisted completion result.');
}

if (markedRecipeIds.join(',') !== 'recipe-success') {
  throw new Error('Successful publish should persist the explicit completion marker for the recipe board.');
}

const failedResult = persistPublishCompletionResult({
  markRecipeBoardComplete,
  publishSucceeded: false,
  recipeId: 'recipe-failed',
});

if (failedResult !== false) {
  throw new Error('Failed publish should not report persisted completion.');
}

if (markedRecipeIds.includes('recipe-failed')) {
  throw new Error('Failed publish must not persist an explicit completion marker.');
}

const missingRecipeResult = persistPublishCompletionResult({
  markRecipeBoardComplete,
  publishSucceeded: true,
  recipeId: null,
});

if (missingRecipeResult !== false) {
  throw new Error('Publish completion without a recipe should not report persisted completion.');
}

if (markedRecipeIds.length !== 1) {
  throw new Error('Only successful publish with a recipe should call the completion marker action.');
}
