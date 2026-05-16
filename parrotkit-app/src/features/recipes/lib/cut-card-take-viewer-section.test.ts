import { recipesSeed } from "@/core/mocks/parrotkit-data";
import { normalizeNativeRecipe } from "@/features/recipes/lib/recipe-domain-normalizer";
import { getCutCardTakeViewerSection } from "@/features/recipes/lib/cut-card-take-viewer-section";
import {
  createShootBoardRecipe,
  selectShootBoardFinalTake,
} from "@/features/recipes/lib/shoot-board-model";

const sourceRecipe = normalizeNativeRecipe(
  recipesSeed.find((recipe) => recipe.id === "recipe-korean-diet-hook") ??
    recipesSeed[0],
);
const board = createShootBoardRecipe(sourceRecipe, {
  isSaved: true,
  shotCutIds: [],
});

const emptyTake = getCutCardTakeViewerSection(board.cuts[0], "ko");
if (
  emptyTake.state !== "empty" ||
  emptyTake.title !== "Take viewer" ||
  emptyTake.statusLabel !== "" ||
  emptyTake.primaryActionLabel !== "촬영하기" ||
  emptyTake.takeCountLabel !== "" ||
  emptyTake.thumbnailUrl !== undefined
) {
  throw new Error(
    "Expanded Take viewer should not expose redundant empty take labels before a cut has saved takes.",
  );
}

const loadingTake = getCutCardTakeViewerSection(board.cuts[0], "en", {
  loading: true,
});
if (
  loadingTake.state !== "loading" ||
  loadingTake.statusLabel !== "Loading take" ||
  loadingTake.primaryActionLabel !== "Loading..." ||
  loadingTake.thumbnailUrl !== undefined
) {
  throw new Error(
    "Expanded Take viewer should expose a loading state while take metadata is resolving.",
  );
}

const populatedTake = getCutCardTakeViewerSection(board.cuts[1], "en");
if (
  populatedTake.state !== "populated" ||
  populatedTake.statusLabel !== "" ||
  populatedTake.activeTake?.id !== board.cuts[1].takes[0]?.id ||
  populatedTake.takeCountLabel !== "2 takes" ||
  populatedTake.thumbnailUrl !== board.cuts[1].takeThumbnailUrl ||
  populatedTake.primaryActionLabel !== "Review takes" ||
  populatedTake.takeItems.length !== 2 ||
  populatedTake.takeItems[0]?.id !== board.cuts[1].takes[0]?.id ||
  populatedTake.takeItems[0]?.playbackLabel !== "Preview take" ||
  populatedTake.takeItems[0]?.metadataLabel !== "8s · Saved draft" ||
  populatedTake.takeItems[0]?.statusLabel !== "Saved" ||
  populatedTake.takeItems[0]?.selected !== true ||
  populatedTake.takeItems[1]?.selected !== false ||
  populatedTake.actionControls.retake.label !== "Retake" ||
  populatedTake.actionControls.retake.visible !== true ||
  populatedTake.actionControls.setFinal.label !== "Set as final" ||
  populatedTake.actionControls.setFinal.visible !== true ||
  populatedTake.actionControls.setFinal.disabled !== false
) {
  throw new Error(
    "Expanded Take viewer should expose saved take review items with preview entry, metadata, selection state, and Retake/Set as final controls.",
  );
}

const finalTake = getCutCardTakeViewerSection(
  {
    ...board.cuts[1],
    finalTakeId: board.cuts[1].takes[1]?.id,
    takeStatus: "final",
  },
  "ko",
);
if (
  finalTake.state !== "populated" ||
  finalTake.statusLabel !== "" ||
  finalTake.activeTake?.id !== board.cuts[1].takes[1]?.id ||
  finalTake.primaryActionLabel !== "테이크 보기" ||
  finalTake.actionControls.retake.label !== "재촬영" ||
  finalTake.actionControls.setFinal.label !== "최종으로 설정" ||
  finalTake.actionControls.setFinal.disabled !== true ||
  finalTake.takeItems[0]?.selected !== false ||
  finalTake.takeItems[1]?.selected !== true ||
  finalTake.takeItems[1]?.statusLabel !== "Final" ||
  finalTake.takeItems[1]?.playbackLabel !== "미리보기"
) {
  throw new Error(
    "Expanded Take viewer should prefer the final take and localize final review item copy.",
  );
}

const selectedFinalBoard = selectShootBoardFinalTake(
  board,
  board.cuts[1].id,
  board.cuts[1].takes[1]?.id ?? "",
);
const selectedFinalViewer = getCutCardTakeViewerSection(
  selectedFinalBoard.cuts[1],
  "ko",
);

if (
  selectedFinalViewer.statusLabel !== "" ||
  selectedFinalViewer.activeTake?.id !== board.cuts[1].takes[1]?.id ||
  selectedFinalViewer.takeItems[1]?.final !== true ||
  selectedFinalViewer.takeItems[1]?.selected !== true ||
  selectedFinalViewer.actionControls.setFinal.disabled !== true
) {
  throw new Error(
    "Set as final should update the expanded cut card UI to the selected final take state.",
  );
}
