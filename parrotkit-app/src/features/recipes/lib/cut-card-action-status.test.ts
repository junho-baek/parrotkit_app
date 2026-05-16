import { recipesSeed } from "@/core/mocks/parrotkit-data";
import { normalizeNativeRecipe } from "@/features/recipes/lib/recipe-domain-normalizer";
import {
  createShootBoardRecipe,
  type ShootBoardCut,
} from "@/features/recipes/lib/shoot-board-model";
import { getCutCardActionStatus } from "@/features/recipes/lib/cut-card-action-status";

const sourceRecipe = normalizeNativeRecipe(
  recipesSeed.find((recipe) => recipe.id === "recipe-korean-diet-hook") ??
    recipesSeed[0],
);
const board = createShootBoardRecipe(sourceRecipe, {
  isSaved: true,
  shotCutIds: [],
});

const emptyStatus = getCutCardActionStatus(board.cuts[0], "en");
if (
  emptyStatus.ctaLabel !== "Film" ||
  emptyStatus.statusTone !== "empty" ||
  "statusLabel" in emptyStatus ||
  "takeCountLabel" in emptyStatus
) {
  throw new Error(
    "Collapsed cut cards should expose a Film CTA without redundant empty take labels before recording.",
  );
}

const savedStatus = getCutCardActionStatus(board.cuts[1], "en");
if (
  savedStatus.ctaLabel !== "Reshoot" ||
  savedStatus.statusTone !== "saved" ||
  "statusLabel" in savedStatus ||
  "takeCountLabel" in savedStatus
) {
  throw new Error(
    "Collapsed cut cards should expose a reshoot CTA without redundant saved take labels after recording.",
  );
}

const finalCut: ShootBoardCut = {
  ...board.cuts[1],
  takeStatus: "final",
};
const finalStatus = getCutCardActionStatus(finalCut, "ko");
if (
  finalStatus.ctaLabel !== "다시 촬영" ||
  finalStatus.statusTone !== "final" ||
  "statusLabel" in finalStatus ||
  "takeCountLabel" in finalStatus
) {
  throw new Error(
    "Collapsed cut cards should localize the final take CTA without extra status labels.",
  );
}

const retakeStatus = getCutCardActionStatus(board.cuts[3], "ko");
if (
  retakeStatus.ctaLabel !== "재촬영" ||
  retakeStatus.statusTone !== "needs_reshoot"
) {
  throw new Error(
    "Collapsed cut cards should call out cuts that need a retake.",
  );
}
