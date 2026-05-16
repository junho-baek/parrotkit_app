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
  emptyTakeSlots.length !== 1 ||
  emptyTakeSlots[0]?.id !== "myTake" ||
  emptyTakeSlots[0]?.label !== "My Take" ||
  emptyTakeSlots[0]?.status !== "empty" ||
  emptyTakeSlots[0]?.thumbnailUrl !== undefined ||
  emptyTakeSlots[0]?.badgeLabel !== undefined
) {
  throw new Error(
    "Collapsed cut cards should expose only an empty My Take slot when no take is saved.",
  );
}

const savedTakeSlots = getCutCardMediaSlots(board.cuts[1]);
if (
  savedTakeSlots.length !== 1 ||
  savedTakeSlots[0]?.status !== "saved" ||
  savedTakeSlots[0]?.thumbnailUrl !== board.cuts[1].takeThumbnailUrl ||
  savedTakeSlots[0]?.badgeLabel !== "2"
) {
  throw new Error(
    "Collapsed My Take slot should show the take thumbnail and count badge when takes are saved.",
  );
}

const finalCut: ShootBoardCut = {
  ...board.cuts[1],
  takeStatus: "final",
};
if (getCutCardMediaSlots(finalCut)[0]?.status !== "final") {
  throw new Error("Collapsed My Take slot should preserve final take status.");
}

const retakeSlots = getCutCardMediaSlots(board.cuts[3]);
if (retakeSlots[0]?.status !== "needs_reshoot" || retakeSlots[0]?.badgeLabel !== "1") {
  throw new Error(
    "Collapsed My Take slot should preserve needs-retake status.",
  );
}
