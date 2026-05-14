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
  emptyStatus.statusLabel !== "No take yet" ||
  emptyStatus.statusTone !== "empty" ||
  emptyStatus.takeCountLabel !== "0 takes"
) {
  throw new Error(
    "Collapsed cut cards should expose a Film CTA and empty take status before recording.",
  );
}

const savedStatus = getCutCardActionStatus(board.cuts[1], "en");
if (
  savedStatus.ctaLabel !== "Reshoot" ||
  savedStatus.statusLabel !== "Take saved" ||
  savedStatus.statusTone !== "saved" ||
  savedStatus.takeCountLabel !== "2 takes"
) {
  throw new Error(
    "Collapsed cut cards should expose a reshoot CTA and saved take status after recording.",
  );
}

const finalCut: ShootBoardCut = {
  ...board.cuts[1],
  takeStatus: "final",
};
const finalStatus = getCutCardActionStatus(finalCut, "ko");
if (
  finalStatus.ctaLabel !== "다시 촬영" ||
  finalStatus.statusLabel !== "최종 테이크" ||
  finalStatus.statusTone !== "final" ||
  finalStatus.takeCountLabel !== "2개 테이크"
) {
  throw new Error(
    "Collapsed cut cards should localize the final take status in Korean.",
  );
}

const retakeStatus = getCutCardActionStatus(board.cuts[3], "ko");
if (
  retakeStatus.ctaLabel !== "재촬영" ||
  retakeStatus.statusLabel !== "재촬영 필요" ||
  retakeStatus.statusTone !== "needs_reshoot"
) {
  throw new Error(
    "Collapsed cut cards should call out cuts that need a retake.",
  );
}
