import type {
  ListSavedRecipeTakesOptions,
  SavedRecipeTakeRecord,
} from "@/features/recipes/lib/saved-take-storage";
import {
  getNextRequiredShootBoardCutWithoutSavedMyTake,
  type ShootBoardCut,
  type ShootBoardRecipe,
  type ShootBoardTake,
} from "@/features/recipes/lib/shoot-board-model";
import type { NativeRecipe } from "@/features/recipes/types/recipe-domain";

export type GetSavedRecipeTakes = (
  recipeId?: string,
  options?: Omit<ListSavedRecipeTakesOptions, "recipeId">,
) => SavedRecipeTakeRecord[];

export type BoardOverviewHighlightState =
  | "next-required-missing-mytake"
  | "requested-cut"
  | "none";

export type BoardOverviewUiState = {
  nextRequiredCutId: string | null;
  routeHighlightCutId: string | null;
  highlightCutId: string | null;
  highlightState: BoardOverviewHighlightState;
  cameraEntryRequiresTap: true;
};

export function getBoardOverviewUiState({
  board,
  getSavedRecipeTakes,
  nativeRecipe,
  routeHighlightCutId,
}: {
  board: ShootBoardRecipe | null;
  getSavedRecipeTakes: GetSavedRecipeTakes;
  nativeRecipe: NativeRecipe | null;
  routeHighlightCutId: string | null;
}): BoardOverviewUiState {
  if (!board || !nativeRecipe) {
    return {
      nextRequiredCutId: null,
      routeHighlightCutId,
      highlightCutId: null,
      highlightState: "none",
      cameraEntryRequiresTap: true,
    };
  }

  const nextRequiredCut = getNextRequiredShootBoardCutWithoutSavedMyTake({
    board,
    recipe: nativeRecipe,
    savedTakes: getSavedRecipeTakes(nativeRecipe.id),
  });
  const nextRequiredCutId = nextRequiredCut?.id ?? null;
  const routeHighlightExists =
    routeHighlightCutId !== null &&
    board.cuts.some((cut) => cut.id === routeHighlightCutId);
  const highlightCutId =
    nextRequiredCutId ?? (routeHighlightExists ? routeHighlightCutId : null);
  const highlightState: BoardOverviewHighlightState = nextRequiredCutId
    ? "next-required-missing-mytake"
    : routeHighlightExists
      ? "requested-cut"
      : "none";

  return {
    nextRequiredCutId,
    routeHighlightCutId,
    highlightCutId,
    highlightState,
    cameraEntryRequiresTap: true,
  };
}

export function getExplicitSceneExpansionCutId({
  board,
  sceneId,
}: {
  board: Pick<ShootBoardRecipe, "cuts"> | null;
  sceneId?: string | null;
}): string | null {
  if (!sceneId || !board?.cuts.length) {
    return null;
  }

  return (
    board.cuts.find((cut) => cut.sceneId === sceneId || cut.id === sceneId)
      ?.id ?? null
  );
}

export function hydrateShootBoardWithWorkspaceTakes(
  board: ShootBoardRecipe,
  recipeId: string,
  getSavedRecipeTakes: GetSavedRecipeTakes,
): ShootBoardRecipe {
  let foundWorkspaceTakes = false;
  const cuts = board.cuts.map((cut) => {
    if (!cut.sceneId) return cut;

    const savedTakes = getSavedRecipeTakes(recipeId, {
      cutId: cut.id,
      sceneId: cut.sceneId,
    });
    if (!savedTakes.length) return cut;

    foundWorkspaceTakes = true;
    const finalTakeId =
      savedTakes.find((take) => take.isFinalTake)?.takeId ??
      savedTakes[0]?.takeId;
    const hasExplicitWorkspaceTakeState =
      cut.takeStatus !== "none" || cut.takes.length > 0 || Boolean(cut.finalTakeId);
    const requiredChecklist = hasExplicitWorkspaceTakeState
      ? cut.requiredChecklist
      : cut.requiredChecklist.map((item) => ({
          ...item,
          checked: true,
        }));

    return {
      ...cut,
      finalTakeId,
      isShot: hasExplicitWorkspaceTakeState ? cut.isShot : true,
      requiredChecklist,
      requiredChecks: requiredChecklist.map((item) => item.label),
      requiredChecksKo: requiredChecklist.map((item) => item.labelKo),
      takeStatus: finalTakeId ? ("final" as const) : ("saved" as const),
      takes: savedTakes.map((take) =>
        mapWorkspaceTakeToBoardTake(take, cut, finalTakeId),
      ),
    };
  });

  if (!foundWorkspaceTakes) {
    return board;
  }

  return {
    ...board,
    cuts,
    shotCount: cuts.filter((cut) => cut.isShot).length,
  };
}

function mapWorkspaceTakeToBoardTake(
  take: SavedRecipeTakeRecord,
  cut: ShootBoardCut,
  finalTakeId?: string,
): ShootBoardTake {
  return {
    durationSeconds: take.durationSeconds ?? cut.durationSeconds,
    id: take.takeId,
    label: take.label,
    recordedAtLabel: take.recordedAtLabel,
    status: take.takeId === finalTakeId ? "final" : "saved",
  };
}
