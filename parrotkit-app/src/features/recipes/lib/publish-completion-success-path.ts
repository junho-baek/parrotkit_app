type PersistPublishCompletionResultInput = {
  markRecipeBoardComplete: (recipeId: string) => boolean;
  publishSucceeded: boolean;
  recipeId: string | null | undefined;
};

export function persistPublishCompletionResult({
  markRecipeBoardComplete,
  publishSucceeded,
  recipeId,
}: PersistPublishCompletionResultInput) {
  if (!publishSucceeded || !recipeId) {
    return false;
  }

  return markRecipeBoardComplete(recipeId);
}
