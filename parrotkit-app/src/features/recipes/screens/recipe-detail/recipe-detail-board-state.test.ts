import { getBoardOverviewUiState } from "./recipe-detail-board-state";

const emptyGetSavedRecipeTakes = () => [];

const state = getBoardOverviewUiState({
  board: null,
  getSavedRecipeTakes: emptyGetSavedRecipeTakes,
  nativeRecipe: null,
  routeHighlightCutId: null,
});

if (state.cameraEntryRequiresTap !== true) {
  throw new Error("Board overview must preserve cameraEntryRequiresTap=true.");
}

if (state.highlightState !== "none") {
  throw new Error(
    `Empty board must not highlight a cut. Found: ${state.highlightState}`,
  );
}
