import { recipesSeed } from "@/core/mocks/parrotkit-data";
import { normalizeNativeRecipe } from "@/features/recipes/lib/recipe-domain-normalizer";
import { getCutCardReferenceViewerSection } from "@/features/recipes/lib/cut-card-reference-viewer-section";
import { createShootBoardRecipe } from "@/features/recipes/lib/shoot-board-model";

const sourceRecipe = normalizeNativeRecipe(
  recipesSeed.find((recipe) => recipe.id === "recipe-korean-diet-hook") ??
    recipesSeed[0],
);
const board = createShootBoardRecipe(sourceRecipe, {
  isSaved: true,
  shotCutIds: [],
});

const linkedReference = getCutCardReferenceViewerSection(board.cuts[0], "ko");
if (
  linkedReference.title !== "Reference viewer" ||
  linkedReference.sourceKind !== "linked" ||
  linkedReference.thumbnailUrl !== board.cuts[0].thumbnailUrl ||
  linkedReference.mediaUrl !== board.cuts[0].referenceVideoUrl ||
  linkedReference.primaryActionLabel !== "레퍼런스 보기"
) {
  throw new Error(
    "Expanded Reference viewer should expose linked reference metadata and the existing thumbnail.",
  );
}

const attachedReference = getCutCardReferenceViewerSection(
  {
    ...board.cuts[0],
    referenceVideoUrl: undefined,
  },
  "en",
);
if (
  attachedReference.sourceKind !== "attached" ||
  attachedReference.statusLabel !== "Attached reference" ||
  attachedReference.primaryActionLabel !== "View reference"
) {
  throw new Error(
    "Expanded Reference viewer should treat thumbnail-only references as attached media.",
  );
}

const emptyReference = getCutCardReferenceViewerSection(
  {
    ...board.cuts[0],
    referenceVideoUrl: undefined,
    thumbnailUrl: "",
  },
  "ko",
);
if (
  emptyReference.sourceKind !== "empty" ||
  emptyReference.statusLabel !== "레퍼런스 없음" ||
  emptyReference.thumbnailUrl !== undefined
) {
  throw new Error(
    "Expanded Reference viewer should provide an empty state when no reference media is available.",
  );
}
