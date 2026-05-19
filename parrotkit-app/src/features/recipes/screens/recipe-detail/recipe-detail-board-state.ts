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
import type { ReferenceBreakdownBoardVariantId } from "@/domain/recipes/reference-breakdown";

export type ShootBoardRecipeVariantId = ReferenceBreakdownBoardVariantId;

export type ShootBoardVariantOption = {
  id: ShootBoardRecipeVariantId;
  label: string;
};

const shootBoardVariantLabels: Record<ShootBoardRecipeVariantId, string> = {
  sourceFaithful: "Original style",
  goalAdapted: "Adapted",
};

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

export type CutReferencePlaybackOpenData = {
  cutId: string;
  url: string;
};

export function getCutReferencePlaybackOpenData(
  cut: ShootBoardCut | null,
): CutReferencePlaybackOpenData | null {
  if (!cut) {
    return null;
  }

  const source = cut.referenceVideoUrl;
  if (typeof source !== "string") {
    return null;
  }

  const trimmed = source.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return null;
  }

  return {
    cutId: cut.id,
    url: trimmed,
  };
}

export function getShootBoardVariantOptions(
  nativeRecipe: NativeRecipe | null,
): ShootBoardVariantOption[] {
  const breakdown = nativeRecipe?.referenceBreakdown;
  if (!breakdown?.shooting_board_projection) {
    return [];
  }

  const variants = breakdown.shooting_board_projection_variants;
  const options: ShootBoardVariantOption[] = [
    {
      id: "sourceFaithful",
      label: shootBoardVariantLabels.sourceFaithful,
    },
  ];

  if (variants?.goalAdapted?.items.length) {
    options.push({
      id: "goalAdapted",
      label: shootBoardVariantLabels.goalAdapted,
    });
  }

  return options;
}

export function projectNativeRecipeForShootBoardVariant({
  nativeRecipe,
  variantId,
}: {
  nativeRecipe: NativeRecipe;
  variantId: ShootBoardRecipeVariantId;
}): NativeRecipe {
  const breakdown = nativeRecipe.referenceBreakdown;
  if (!breakdown?.shooting_board_projection) {
    return nativeRecipe;
  }

  const variantProjection =
    variantId === "sourceFaithful"
      ? (breakdown.shooting_board_projection_variants?.sourceFaithful ??
        breakdown.shooting_board_projection)
      : breakdown.shooting_board_projection_variants?.goalAdapted;

  if (!variantProjection) {
    return nativeRecipe;
  }

  if (variantProjection === breakdown.shooting_board_projection) {
    return nativeRecipe;
  }

  return {
    ...nativeRecipe,
    referenceBreakdown: {
      ...breakdown,
      shooting_board_projection: variantProjection,
    },
  };
}

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
      cut.takeStatus !== "none" ||
      cut.takes.length > 0 ||
      Boolean(cut.finalTakeId);
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

export function hydrateShootBoardReferenceMedia({
  board,
  sourceBoard,
}: {
  board: ShootBoardRecipe;
  sourceBoard: ShootBoardRecipe;
}): ShootBoardRecipe {
  let foundMissingMedia = false;
  const sourceCutsById = new Map(sourceBoard.cuts.map((cut) => [cut.id, cut]));
  const sourceCutsByOrder = new Map(
    sourceBoard.cuts.map((cut) => [cut.order, cut]),
  );

  const cuts = board.cuts.map((cut) => {
    const sourceCut =
      sourceCutsById.get(cut.id) ?? sourceCutsByOrder.get(cut.order);

    if (!sourceCut) {
      return cut;
    }

    const nextCut = {
      ...cut,
      referenceVideoUrl: cut.referenceVideoUrl ?? sourceCut.referenceVideoUrl,
      sceneId: cut.sceneId ?? sourceCut.sceneId,
      sourceTimeRangeMs: cut.sourceTimeRangeMs ?? sourceCut.sourceTimeRangeMs,
      takeThumbnailSource:
        cut.takeThumbnailSource ?? sourceCut.takeThumbnailSource,
      takeThumbnailUrl: cut.takeThumbnailUrl || sourceCut.takeThumbnailUrl,
      thumbnailSource: cut.thumbnailSource ?? sourceCut.thumbnailSource,
      thumbnailUrl: cut.thumbnailUrl || sourceCut.thumbnailUrl,
    };

    if (
      nextCut.referenceVideoUrl !== cut.referenceVideoUrl ||
      nextCut.sceneId !== cut.sceneId ||
      nextCut.sourceTimeRangeMs !== cut.sourceTimeRangeMs ||
      nextCut.takeThumbnailSource !== cut.takeThumbnailSource ||
      nextCut.takeThumbnailUrl !== cut.takeThumbnailUrl ||
      nextCut.thumbnailSource !== cut.thumbnailSource ||
      nextCut.thumbnailUrl !== cut.thumbnailUrl
    ) {
      foundMissingMedia = true;
      return nextCut;
    }

    return cut;
  });

  if (!foundMissingMedia) {
    return board;
  }

  return {
    ...board,
    cuts,
  };
}

export function reconcileShootBoardWithLatestSource({
  candidateBoard,
  latestBoard,
}: {
  candidateBoard: ShootBoardRecipe;
  latestBoard: ShootBoardRecipe;
}): ShootBoardRecipe {
  if (isCandidateBoardOlderThanLatestSource({ candidateBoard, latestBoard })) {
    return latestBoard;
  }

  return hydrateShootBoardReferenceMedia({
    board: candidateBoard,
    sourceBoard: latestBoard,
  });
}

function isCandidateBoardOlderThanLatestSource({
  candidateBoard,
  latestBoard,
}: {
  candidateBoard: ShootBoardRecipe;
  latestBoard: ShootBoardRecipe;
}) {
  const latestHasFreshness =
    Boolean(latestBoard.sourceGeneratedAt) ||
    Boolean(latestBoard.sourceProjectionId) ||
    Boolean(latestBoard.sourceRequestId);

  if (!latestHasFreshness) {
    return false;
  }

  const latestTime = parseFreshnessTime(latestBoard.sourceGeneratedAt);
  const candidateTime = parseFreshnessTime(candidateBoard.sourceGeneratedAt);

  if (latestTime !== null && candidateTime !== null) {
    if (latestTime > candidateTime) {
      return true;
    }

    if (candidateTime > latestTime) {
      return false;
    }
  }

  if (
    latestBoard.sourceRequestId &&
    candidateBoard.sourceRequestId &&
    latestBoard.sourceRequestId !== candidateBoard.sourceRequestId
  ) {
    return true;
  }

  if (
    latestBoard.sourceProjectionId &&
    candidateBoard.sourceProjectionId &&
    latestBoard.sourceProjectionId !== candidateBoard.sourceProjectionId
  ) {
    return true;
  }

  if (latestTime !== null && candidateTime === null) {
    return !hasSameBoardCutSignature(candidateBoard, latestBoard);
  }

  if (
    (latestBoard.sourceRequestId || latestBoard.sourceProjectionId) &&
    !candidateBoard.sourceRequestId &&
    !candidateBoard.sourceProjectionId
  ) {
    return !hasSameBoardCutSignature(candidateBoard, latestBoard);
  }

  return false;
}

function parseFreshnessTime(value?: string | null) {
  if (!value) {
    return null;
  }

  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

function hasSameBoardCutSignature(
  candidateBoard: ShootBoardRecipe,
  latestBoard: ShootBoardRecipe,
) {
  return (
    getBoardCutSignature(candidateBoard) === getBoardCutSignature(latestBoard)
  );
}

function getBoardCutSignature(board: ShootBoardRecipe) {
  return board.cuts
    .map((cut) => `${cut.id}:${cut.projectionCutId ?? ""}:${cut.order}`)
    .join("|");
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
