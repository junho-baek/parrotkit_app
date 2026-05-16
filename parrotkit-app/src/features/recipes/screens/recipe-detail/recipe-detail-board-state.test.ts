import Module from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const originalResolveFilename = (
  Module as unknown as {
    _resolveFilename: (
      request: string,
      parent: NodeModule | null,
      isMain: boolean,
      options?: unknown,
    ) => string;
  }
)._resolveFilename;

(
  Module as unknown as {
    _resolveFilename: (
      request: string,
      parent: NodeModule | null,
      isMain: boolean,
      options?: unknown,
    ) => string;
  }
)._resolveFilename = function resolveTsconfigAlias(
  request,
  parent,
  isMain,
  options,
) {
  if (request.startsWith("@/")) {
    return originalResolveFilename(
      resolve(process.cwd(), "src", request.slice(2)),
      parent,
      isMain,
      options,
    );
  }

  return originalResolveFilename(request, parent, isMain, options);
};

const {
  getBoardOverviewUiState,
  getExplicitSceneExpansionCutId,
  hydrateShootBoardReferenceMedia,
  hydrateShootBoardWithWorkspaceTakes,
} = require("./recipe-detail-board-state") as {
  getBoardOverviewUiState: typeof import("./recipe-detail-board-state").getBoardOverviewUiState;
  getExplicitSceneExpansionCutId: typeof import("./recipe-detail-board-state").getExplicitSceneExpansionCutId;
  hydrateShootBoardReferenceMedia: typeof import("./recipe-detail-board-state").hydrateShootBoardReferenceMedia;
  hydrateShootBoardWithWorkspaceTakes: typeof import("./recipe-detail-board-state").hydrateShootBoardWithWorkspaceTakes;
};

const emptyGetSavedRecipeTakes = () => [];

const emptyState = getBoardOverviewUiState({
  board: null,
  getSavedRecipeTakes: emptyGetSavedRecipeTakes,
  nativeRecipe: null,
  routeHighlightCutId: null,
});

if (emptyState.cameraEntryRequiresTap !== true) {
  throw new Error("Board overview must preserve cameraEntryRequiresTap=true.");
}

if (emptyState.highlightState !== "none") {
  throw new Error(
    `Empty board must not highlight a cut. Found: ${emptyState.highlightState}`,
  );
}

if (emptyState.highlightCutId !== null) {
  throw new Error(
    `Empty board must expose highlightCutId=null. Found: ${emptyState.highlightCutId}`,
  );
}

const recipe = {
  id: "recipe-1",
  scenes: [
    {
      id: "scene-1",
      sceneNumber: 1,
    },
    {
      id: "scene-2",
      sceneNumber: 2,
    },
  ],
};

const board = {
  id: "recipe-1",
  cuts: [
    createCut("cut-1", "scene-1", 1),
    createCut("cut-2", "scene-2", 2),
  ],
};

const nextRequiredState = getBoardOverviewUiState({
  board: board as Parameters<typeof getBoardOverviewUiState>[0]["board"],
  getSavedRecipeTakes: () => [
    {
      recipeId: "recipe-1",
      sceneId: "scene-1",
      cardIds: ["cut-1"],
    } as ReturnType<
      Parameters<typeof getBoardOverviewUiState>[0]["getSavedRecipeTakes"]
    >[number],
  ],
  nativeRecipe:
    recipe as Parameters<typeof getBoardOverviewUiState>[0]["nativeRecipe"],
  routeHighlightCutId: null,
});

if (nextRequiredState.nextRequiredCutId !== "cut-2") {
  throw new Error(
    `Expected nextRequiredCutId=cut-2. Found: ${nextRequiredState.nextRequiredCutId}`,
  );
}

if (nextRequiredState.highlightCutId !== "cut-2") {
  throw new Error(
    `Expected highlightCutId=cut-2. Found: ${nextRequiredState.highlightCutId}`,
  );
}

if (nextRequiredState.highlightState !== "next-required-missing-mytake") {
  throw new Error(
    `Expected next required highlight state. Found: ${nextRequiredState.highlightState}`,
  );
}

if ("autoExpandCutId" in nextRequiredState) {
  throw new Error("Board overview state must not expose autoExpandCutId.");
}

if (
  getExplicitSceneExpansionCutId({
    board:
      board as unknown as Parameters<
        typeof getExplicitSceneExpansionCutId
      >[0]["board"],
    sceneId: "scene-2",
  }) !== "cut-2"
) {
  throw new Error("Explicit scene deep links must resolve the matching cut id.");
}

if (
  getExplicitSceneExpansionCutId({
    board:
      board as unknown as Parameters<
        typeof getExplicitSceneExpansionCutId
      >[0]["board"],
    sceneId: "cut-1",
  }) !== "cut-1"
) {
  throw new Error("Explicit cut deep links must resolve the matching cut id.");
}

if (
  getExplicitSceneExpansionCutId({
    board:
      board as unknown as Parameters<
        typeof getExplicitSceneExpansionCutId
      >[0]["board"],
    sceneId: null,
  }) !== null
) {
  throw new Error("Missing explicit scene id must not expand any cut.");
}

const boardWithSavedTake = {
  id: "recipe-1",
  cuts: [
    {
      ...createCut("cut-1", "scene-1", 1),
      durationSeconds: 5,
      finalTakeId: undefined,
      isShot: false,
      requiredChecklist: [
        {
          checked: false,
          id: "check-1",
          label: "Frame is clean",
          labelKo: "프레임 정리",
        },
        {
          checked: false,
          id: "check-2",
          label: "Line is clear",
          labelKo: "문장 명확",
        },
      ],
      requiredChecks: [],
      requiredChecksKo: [],
      takeStatus: "none",
      takes: [],
    },
  ],
};
const getSavedTakeForCut = () => [
  {
    cardIds: ["cut-1"],
    durationSeconds: 5,
    isFinalTake: false,
    label: "Take 1",
    recipeId: "recipe-1",
    recordedAtLabel: "Just now",
    sceneId: "scene-1",
    takeId: "take-1",
  } as ReturnType<
    Parameters<typeof hydrateShootBoardWithWorkspaceTakes>[2]
  >[number],
];
const initiallyHydratedBoard = hydrateShootBoardWithWorkspaceTakes(
  boardWithSavedTake as unknown as Parameters<
    typeof hydrateShootBoardWithWorkspaceTakes
  >[0],
  "recipe-1",
  getSavedTakeForCut,
);
const initiallyHydratedCut = initiallyHydratedBoard.cuts[0];

if (!initiallyHydratedCut?.requiredChecklist.every((item) => item.checked)) {
  throw new Error(
    "Workspace take hydration should mark a fresh saved-take checklist complete.",
  );
}

const explicitlyUncheckedBoard = {
  ...initiallyHydratedBoard,
  cuts: initiallyHydratedBoard.cuts.map((cut) =>
    cut.id === "cut-1"
      ? {
          ...cut,
          isShot: false,
          requiredChecklist: cut.requiredChecklist.map((item) =>
            item.id === "check-1" ? { ...item, checked: false } : item,
          ),
        }
      : cut,
  ),
};
const rehydratedExplicitBoard = hydrateShootBoardWithWorkspaceTakes(
  explicitlyUncheckedBoard,
  "recipe-1",
  getSavedTakeForCut,
);
const rehydratedExplicitCut = rehydratedExplicitBoard.cuts[0];

if (rehydratedExplicitCut?.requiredChecklist[0]?.checked !== false) {
  throw new Error(
    "Workspace take hydration must preserve an explicitly unchecked checklist item.",
  );
}

if (rehydratedExplicitCut?.isShot !== false) {
  throw new Error(
    "Workspace take hydration must preserve explicit incomplete checklist state.",
  );
}

const sourceBoardWithReferenceMedia = {
  id: "recipe-1",
  cuts: [
    {
      ...createCut("cut-1", "scene-1", 1),
      referenceVideoUrl: "mock://reference-video",
      takeThumbnailSource: { uri: "mock://take-source" },
      takeThumbnailUrl: "mock://take-thumbnail",
      thumbnailSource: { uri: "mock://reference-source" },
      thumbnailUrl: "mock://reference-thumbnail",
    },
  ],
};
const staleBoardWithoutReferenceMedia = {
  id: "recipe-1",
  cuts: [
    {
      ...createCut("cut-1", "scene-1", 1),
      lineToSay: "Edited line should stay",
      referenceVideoUrl: undefined,
      takeThumbnailSource: undefined,
      takeThumbnailUrl: "",
      thumbnailSource: undefined,
      thumbnailUrl: "",
    },
  ],
};
const referenceMediaHydratedBoard = hydrateShootBoardReferenceMedia({
  board: staleBoardWithoutReferenceMedia as unknown as Parameters<
    typeof hydrateShootBoardReferenceMedia
  >[0]["board"],
  sourceBoard: sourceBoardWithReferenceMedia as unknown as Parameters<
    typeof hydrateShootBoardReferenceMedia
  >[0]["sourceBoard"],
});
const referenceMediaHydratedCut = referenceMediaHydratedBoard.cuts[0];

if (referenceMediaHydratedBoard === staleBoardWithoutReferenceMedia) {
  throw new Error(
    "Reference media hydration should return a new board when stale cuts are missing media.",
  );
}

if (referenceMediaHydratedCut?.thumbnailUrl !== "mock://reference-thumbnail") {
  throw new Error("Reference media hydration must restore missing thumbnailUrl.");
}

if (
  referenceMediaHydratedCut?.referenceVideoUrl !== "mock://reference-video"
) {
  throw new Error(
    "Reference media hydration must restore missing referenceVideoUrl.",
  );
}

if (referenceMediaHydratedCut?.lineToSay !== "Edited line should stay") {
  throw new Error("Reference media hydration must preserve edited cut copy.");
}

const screenSource = readFileSync(
  resolve(__dirname, "../recipe-detail-screen.tsx"),
  "utf8",
);

const highlightReferences =
  screenSource.match(/boardOverviewState\.highlightCutId/g) ?? [];

if (
  highlightReferences.length !== 1 ||
  !screenSource.includes(
    "highlightedCutId={boardOverviewState.highlightCutId ?? undefined}",
  )
) {
  throw new Error(
    "Recipe detail screen may pass boardOverviewState.highlightCutId as passive UI only.",
  );
}

[
  "shootBoard.cuts.find((cut) => !cut.isShot)",
  "updatedBoard.cuts.find((cut) => !cut.isShot)",
  "?? shootBoard.cuts[0]",
  "?? updatedBoard.cuts[0]",
  "return nextCut ? [nextCut.id] : []",
  "setExpandedCutIds([nextCut.id])",
].forEach((autoExpansionSource) => {
  if (screenSource.includes(autoExpansionSource)) {
    throw new Error(
      `Board overview must not auto-expand the next cut on load: ${autoExpansionSource}`,
    );
  }
});

if (!screenSource.includes("return current.filter((cutId) =>")) {
  throw new Error(
    "Recipe detail screen should only prune stale expanded cut ids on board changes.",
  );
}

if (!screenSource.includes("renderedShootBoard?.id === board.id")) {
  throw new Error(
    "Checklist toggles must persist against the hydrated board when workspace takes are visible.",
  );
}

if (!screenSource.includes("getExplicitSceneExpansionCutId")) {
  throw new Error(
    "Recipe detail screen must keep explicit scene expansion through a tested helper.",
  );
}

if (!screenSource.includes("handledExplicitSceneExpansionKeyRef")) {
  throw new Error(
    "Explicit scene expansion must be handled once per route key to preserve manual cut choice.",
  );
}

if (!screenSource.includes("`${renderedShootBoard.id}:${")) {
  throw new Error(
    "Explicit scene expansion key must include the board id to support reused screen instances.",
  );
}

const explicitSceneExpansionDependencies = screenSource.match(
  /\[\n\s+params\.sceneId,[\s\S]*?selectedSavedTakeRecord,\n\s+\]\);/,
)?.[0];

if (!explicitSceneExpansionDependencies) {
  throw new Error(
    "Explicit scene expansion effect dependencies must stay visible to the contract test.",
  );
}

if (explicitSceneExpansionDependencies.includes("    renderedShootBoard,\n")) {
  throw new Error(
    "Explicit scene expansion must not depend on the whole rendered board object.",
  );
}

function createCut(id: string, sceneId: string, order: number) {
  return {
    id,
    sceneId,
    order,
  };
}
