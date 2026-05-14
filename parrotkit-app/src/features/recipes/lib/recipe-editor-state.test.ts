import {
  copyRecipeEditorBoard,
  createRecipeEditorBoardState,
  getRecipeEditorBoard,
  setRecipeEditorBoard,
  updateRecipeEditorBoard,
} from "@/features/recipes/lib/recipe-editor-state";
import {
  updateShootBoardCutText,
  type ShootBoardRecipe,
} from "@/features/recipes/lib/shoot-board-model";

const board = {
  id: "recipe-local-session",
  cuts: [
    {
      hook: "Original hook",
      id: "cut-1",
      instruction: "Original hook",
      lineToSay: "Original line",
      note: "Original note",
      notes: "Original note",
      order: 1,
      requiredChecklist: [],
      shotAction: "Original action",
      shootingGuideline: "Original action",
      speakingLine: "Original line",
    },
  ],
  isSaved: true,
  shotCount: 0,
  summary: {
    bestUseCases: [],
    bestUseCasesKo: [],
    estimatedLengthSeconds: 5,
    hookType: "Blank",
    hookTypeKo: "빈 레시피",
    recipeType: "Blank recipe",
    recipeTypeKo: "빈 레시피",
    totalScenes: 1,
    visualStyle: "Simple",
    visualStyleKo: "단순",
    whenToUse: "Use for local editing.",
    whenToUseKo: "로컬 편집에 사용합니다.",
  },
  title: "Local session recipe",
  totalCuts: 1,
  totalDurationSeconds: 5,
} as unknown as ShootBoardRecipe;

const initialState = createRecipeEditorBoardState();
const stateWithBoard = setRecipeEditorBoard(initialState, board);
const stateWithEditedBoard = updateRecipeEditorBoard(
  stateWithBoard,
  board.id,
  (currentBoard) =>
    updateShootBoardCutText(currentBoard, "cut-1", {
      hook: "Edited hook",
      lineToSay: "Edited line",
      note: "Edited note",
      shotAction: "Edited action",
    }),
);
const persistedBoard = getRecipeEditorBoard(stateWithEditedBoard, board.id);

if (!persistedBoard) {
  throw new Error("Recipe editor state should return a stored board by id.");
}

if (
  persistedBoard.cuts[0]?.hook !== "Edited hook" ||
  persistedBoard.cuts[0]?.lineToSay !== "Edited line" ||
  persistedBoard.cuts[0]?.shotAction !== "Edited action" ||
  persistedBoard.cuts[0]?.note !== "Edited note"
) {
  throw new Error(
    "Cut-card field edits should persist in recipe editor board state.",
  );
}

if (getRecipeEditorBoard(stateWithEditedBoard, "missing-recipe") !== null) {
  throw new Error("Missing recipe editor boards should resolve to null.");
}

const stateWithSavedBoard = copyRecipeEditorBoard(
  stateWithEditedBoard,
  board.id,
  "downloaded-recipe-local-session",
);
const savedBoard = getRecipeEditorBoard(
  stateWithSavedBoard,
  "downloaded-recipe-local-session",
);

if (!savedBoard) {
  throw new Error("Saving a recipe should copy the editor board to the saved recipe id.");
}

if (
  savedBoard.id !== "downloaded-recipe-local-session" ||
  savedBoard.cuts[0]?.hook !== "Edited hook" ||
  savedBoard.cuts[0]?.lineToSay !== "Edited line" ||
  savedBoard.cuts[0]?.shotAction !== "Edited action" ||
  savedBoard.cuts[0]?.note !== "Edited note"
) {
  throw new Error(
    "Saved recipe board copies should preserve Hook, Line to Say, Shot/Action, and Note fields.",
  );
}
