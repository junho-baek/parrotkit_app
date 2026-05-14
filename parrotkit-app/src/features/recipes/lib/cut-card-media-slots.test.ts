import { recipesSeed } from "@/core/mocks/parrotkit-data";
import { normalizeNativeRecipe } from "@/features/recipes/lib/recipe-domain-normalizer";
import {
  createShootBoardRecipe,
  type ShootBoardCut,
} from "@/features/recipes/lib/shoot-board-model";
import { getCutCardMediaSlots } from "@/features/recipes/lib/cut-card-media-slots";

const sourceRecipe = normalizeNativeRecipe(
  recipesSeed.find((recipe) => recipe.id === "recipe-korean-diet-hook") ??
    recipesSeed[0],
);
const board = createShootBoardRecipe(sourceRecipe, {
  isSaved: true,
  shotCutIds: [],
});

const emptyTakeSlots = getCutCardMediaSlots(board.cuts[0]);
if (
  emptyTakeSlots[0]?.id !== "reference" ||
  emptyTakeSlots[0]?.label !== "Reference" ||
  emptyTakeSlots[0]?.status !== "saved" ||
  emptyTakeSlots[0]?.thumbnailUrl !== board.cuts[0].thumbnailUrl
) {
  throw new Error(
    "Collapsed cut cards should expose a saved Reference slot with the reference thumbnail.",
  );
}

if (
  emptyTakeSlots[1]?.id !== "myTake" ||
  emptyTakeSlots[1]?.label !== "My Take" ||
  emptyTakeSlots[1]?.status !== "empty" ||
  emptyTakeSlots[1]?.thumbnailUrl !== undefined
) {
  throw new Error(
    "Collapsed cut cards should expose an empty My Take slot when no take is saved.",
  );
}

const savedTakeSlots = getCutCardMediaSlots(board.cuts[1]);
if (
  savedTakeSlots[1]?.status !== "saved" ||
  savedTakeSlots[1]?.thumbnailUrl !== board.cuts[1].takeThumbnailUrl
) {
  throw new Error(
    "Collapsed My Take slot should show the take thumbnail when a take is saved.",
  );
}

const finalCut: ShootBoardCut = {
  ...board.cuts[1],
  takeStatus: "final",
};
if (getCutCardMediaSlots(finalCut)[1]?.status !== "final") {
  throw new Error("Collapsed My Take slot should preserve final take status.");
}

const retakeSlots = getCutCardMediaSlots(board.cuts[3]);
if (retakeSlots[1]?.status !== "needs_reshoot") {
  throw new Error(
    "Collapsed My Take slot should preserve needs-retake status.",
  );
}
