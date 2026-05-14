import type { ShootBoardRecipe } from "@/features/recipes/lib/shoot-board-model";

export type RecipeEditorBoardState = Record<string, ShootBoardRecipe>;

export function createRecipeEditorBoardState(): RecipeEditorBoardState {
  return {};
}

export function getRecipeEditorBoard(
  state: RecipeEditorBoardState,
  recipeId: string,
): ShootBoardRecipe | null {
  return state[recipeId] ?? null;
}

export function setRecipeEditorBoard(
  state: RecipeEditorBoardState,
  board: ShootBoardRecipe,
): RecipeEditorBoardState {
  return {
    ...state,
    [board.id]: board,
  };
}

export function copyRecipeEditorBoard(
  state: RecipeEditorBoardState,
  sourceRecipeId: string,
  targetRecipeId: string,
): RecipeEditorBoardState {
  const sourceBoard = getRecipeEditorBoard(state, sourceRecipeId);

  if (!sourceBoard) {
    return state;
  }

  if (getRecipeEditorBoard(state, targetRecipeId)) {
    return state;
  }

  return setRecipeEditorBoard(state, {
    ...sourceBoard,
    id: targetRecipeId,
    isSaved: true,
    cuts: sourceBoard.cuts.map((cut) => ({ ...cut })),
  });
}

export function updateRecipeEditorBoard(
  state: RecipeEditorBoardState,
  recipeId: string,
  updater: (board: ShootBoardRecipe) => ShootBoardRecipe,
): RecipeEditorBoardState {
  const currentBoard = getRecipeEditorBoard(state, recipeId);

  if (!currentBoard) {
    return state;
  }

  return setRecipeEditorBoard(state, updater(currentBoard));
}
