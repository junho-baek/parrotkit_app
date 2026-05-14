import type { SavedRecipeTakeRecord } from "@/features/recipes/lib/saved-take-storage";
import type {
  ShootBoardCut,
  ShootBoardRecipe,
  ShootBoardTake,
} from "@/features/recipes/lib/shoot-board-model";

export type SavedTakeReloadFlow = {
  cut: ShootBoardCut;
  cutId: string;
  recipeId: string;
  recipeTitle: string;
  sceneId: string;
  selectedTake: ShootBoardTake;
  takeId: string;
};

export function resolveSavedTakeReloadFlow({
  board,
  take,
}: {
  board: Pick<ShootBoardRecipe, "cuts" | "id" | "title">;
  take: Pick<
    SavedRecipeTakeRecord,
    "cardIds" | "recipeId" | "recipeTitle" | "sceneId" | "takeId"
  >;
}): SavedTakeReloadFlow | null {
  if (board.id !== take.recipeId) {
    return null;
  }

  const targetCutOrSceneId = take.cardIds[0] ?? take.sceneId;
  const cut = board.cuts.find(
    (candidate) =>
      candidate.id === targetCutOrSceneId || candidate.sceneId === targetCutOrSceneId,
  );

  if (!cut) {
    return null;
  }

  const selectedTake = cut.takes.find((candidate) => candidate.id === take.takeId);

  if (!selectedTake) {
    return null;
  }

  return {
    cut,
    cutId: cut.id,
    recipeId: board.id,
    recipeTitle: board.title || take.recipeTitle,
    sceneId: cut.sceneId ?? take.sceneId,
    selectedTake,
    takeId: selectedTake.id,
  };
}
