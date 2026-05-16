import { recipesSeed } from "../../../core/mocks/parrotkit-data";
import { normalizeNativeRecipe } from "./recipe-domain-normalizer";
import {
  createAddedShootBoardCut,
  createShootBoardRecipe,
  appendShootBoardCut,
  getRecipePrompterHref,
  getRecipeRetakePrompterHref,
  getNextRequiredShootBoardCutWithoutSavedMyTake,
  getOrderedRequiredShootBoardCuts,
  getShootBoardCutCompletionState,
  getShootBoardFullScript,
  getShootBoardHref,
  moveShootBoardCut,
  replaceShootBoardCutOrder,
  reorderShootBoardCuts,
  resetShootBoardCut,
  selectShootBoardFinalTake,
  setShootBoardChecklistItem,
  setShootBoardCutCompletion,
  toggleShootBoardCutStatus,
  updateShootBoardCutText,
} from "./shoot-board-model";

const sourceRecipe = normalizeNativeRecipe(
  recipesSeed.find((recipe) => recipe.id === "recipe-korean-diet-hook") ??
    recipesSeed[0],
);

const board = createShootBoardRecipe(sourceRecipe, {
  isSaved: true,
  shotCutIds: [],
});

const emptyBoard = createShootBoardRecipe({
  ...sourceRecipe,
  id: "recipe-empty-manual-draft",
  scenes: [],
});

const orderedRequiredSourceRecipe = {
  ...sourceRecipe,
  id: "recipe-ordered-required-cuts",
  scenes: [
    {
      ...sourceRecipe.scenes[0],
      id: "required-hook-scene",
      isOptional: false,
    },
    {
      ...sourceRecipe.scenes[1],
      id: "optional-b-roll-scene",
      isOptional: true,
    },
    {
      ...sourceRecipe.scenes[2],
      id: "required-proof-scene",
      isOptional: false,
    },
  ],
};
const orderedRequiredBoard = createShootBoardRecipe(orderedRequiredSourceRecipe);
const reorderedRequiredBoard = replaceShootBoardCutOrder(orderedRequiredBoard, [
  orderedRequiredBoard.cuts[2],
  orderedRequiredBoard.cuts[1],
  orderedRequiredBoard.cuts[0],
]);
const requiredCuts = getOrderedRequiredShootBoardCuts({
  board: reorderedRequiredBoard,
  recipe: orderedRequiredSourceRecipe,
});

if (requiredCuts.map((cut) => cut.id).join(",") !== "required-proof-scene,required-hook-scene") {
  throw new Error("Board overview should resolve ordered required cuts from board order and scene optional metadata.");
}

const nextMissingRequiredCut = getNextRequiredShootBoardCutWithoutSavedMyTake({
  board: reorderedRequiredBoard,
  recipe: orderedRequiredSourceRecipe,
  savedTakes: [
    {
      cardIds: ["required-proof-scene"],
      recipeId: "recipe-ordered-required-cuts",
      sceneId: "required-proof-scene",
    },
    {
      cardIds: ["required-hook-scene"],
      recipeId: "other-board",
      sceneId: "required-hook-scene",
    },
    {
      cardIds: ["optional-b-roll-scene"],
      recipeId: "recipe-ordered-required-cuts",
      sceneId: "optional-b-roll-scene",
    },
  ],
});

if (nextMissingRequiredCut?.id !== "required-hook-scene") {
  throw new Error(
    "Board overview should select the earliest required cut in board order without a saved My Take.",
  );
}

const noMissingRequiredCut = getNextRequiredShootBoardCutWithoutSavedMyTake({
  board: reorderedRequiredBoard,
  recipe: orderedRequiredSourceRecipe,
  savedTakes: [
    {
      cardIds: ["required-proof-scene"],
      recipeId: "recipe-ordered-required-cuts",
      sceneId: "required-proof-scene",
    },
    {
      cardIds: ["required-hook-scene"],
      recipeId: "recipe-ordered-required-cuts",
      sceneId: "required-hook-scene",
    },
  ],
});

if (noMissingRequiredCut !== null) {
  throw new Error(
    "Board overview should not highlight a next required cut when every required cut has a saved My Take.",
  );
}

if (
  emptyBoard.cuts.length !== 0 ||
  emptyBoard.totalCuts !== 0 ||
  emptyBoard.totalDurationSeconds !== 0 ||
  emptyBoard.summary.totalScenes !== 0
) {
  throw new Error("Blank manual recipe drafts should open an empty shoot board.");
}

if (board.summary.recipeType !== "Payoff-first proof recipe") {
  throw new Error("Reusable board should expose a recipe type summary.");
}

if (
  board.summary.totalScenes !== 4 ||
  board.summary.estimatedLengthSeconds !== 40
) {
  throw new Error("Summary should expose total scenes and estimated length.");
}

if (
  board.totalCuts !== 4 ||
  board.totalDurationSeconds !== 40 ||
  board.shotCount !== 0
) {
  throw new Error(
    "Shoot Board should initialize 4 cuts, 40s total, and 0 completed shots for a fresh board.",
  );
}

if (!board.cuts[0]?.templateLine.includes("{payoff/result}")) {
  throw new Error(
    "Scene template lines must use placeholders, not product-specific copy.",
  );
}

if (
  board.cuts.some((cut) =>
    /avocado|protein|air fryer|serum|desk/i.test(cut.templateLine),
  )
) {
  throw new Error(
    "Reusable cut templates must not include product-specific examples.",
  );
}

if (board.cuts[0]?.title !== "Scene #1: Hook") {
  throw new Error(
    "Scene titles should use the required Scene #N: Role format.",
  );
}

if (
  board.cuts.some(
    (cut) =>
      typeof cut.hook !== "string" ||
      typeof cut.lineToSay !== "string" ||
      typeof cut.shotAction !== "string" ||
      typeof cut.note !== "string",
  )
) {
  throw new Error(
    "Every cut card should store Hook, Line to Say, Shot/Action, and Note fields.",
  );
}

if (
  board.cuts[0]?.hook !== board.cuts[0]?.instruction ||
  board.cuts[0]?.lineToSay !== board.cuts[0]?.speakingLine ||
  board.cuts[0]?.shotAction !== board.cuts[0]?.shootingGuideline ||
  board.cuts[0]?.note !== board.cuts[0]?.purpose
) {
  throw new Error(
    "Cut-card fields should map from the existing shoot-board copy.",
  );
}

const completedFirst = setShootBoardCutCompletion(
  board,
  board.cuts[0].id,
  true,
);
if (!completedFirst.cuts[0]?.requiredChecklist.every((item) => item.checked)) {
  throw new Error(
    "Checking the main scene circle should check every checklist item.",
  );
}

const uncheckedFirst = setShootBoardCutCompletion(
  completedFirst,
  board.cuts[0].id,
  false,
);
if (uncheckedFirst.cuts[0]?.requiredChecklist.some((item) => item.checked)) {
  throw new Error(
    "Unchecking the main scene circle should uncheck every checklist item.",
  );
}

const partialFirst = setShootBoardChecklistItem(
  board,
  board.cuts[0].id,
  board.cuts[0].requiredChecklist[0].id,
  true,
);
if (getShootBoardCutCompletionState(partialFirst.cuts[0]) !== "partial") {
  throw new Error(
    "Checking one checklist item should create a partial completion state.",
  );
}

const completeFirst = partialFirst.cuts[0].requiredChecklist.reduce(
  (nextBoard, item) =>
    setShootBoardChecklistItem(nextBoard, board.cuts[0].id, item.id, true),
  partialFirst,
);
if (getShootBoardCutCompletionState(completeFirst.cuts[0]) !== "partial") {
  throw new Error(
    "Checking every checklist item without a My Take should stay partial.",
  );
}

const secondCutId = board.cuts[1].id;
const finalProof = selectShootBoardFinalTake(
  board,
  secondCutId,
  "proof-take-2",
);
if (
  finalProof.cuts[1]?.takeStatus !== "final" ||
  finalProof.cuts[1]?.finalTakeId !== "proof-take-2"
) {
  throw new Error(
    "Selecting a saved proof take should mark it final on the scene.",
  );
}

if (getShootBoardCutCompletionState(finalProof.cuts[1]) !== "complete") {
  throw new Error("Selecting a final My Take should complete the cut.");
}

const fourthCutId = board.cuts[3].id;
const fourthCutTakes = board.cuts[3].takes;
const reorderedBoard = reorderShootBoardCuts(board, fourthCutId, 1);
if (reorderedBoard.cuts[0]?.id !== fourthCutId) {
  throw new Error(
    "Reordering the fourth scene to position 1 should move the scene identity.",
  );
}

if (reorderedBoard.cuts[0]?.title !== "Scene #1: CTA") {
  throw new Error("Reordering should recalculate scene titles.");
}

if (reorderedBoard.cuts[0]?.takes !== fourthCutTakes) {
  throw new Error(
    "Reordering should keep saved takes attached to the moved scene by reference.",
  );
}

const movedDownBoard = moveShootBoardCut(board, board.cuts[0].id, 1);
if (
  movedDownBoard.cuts[1]?.id !== board.cuts[0].id ||
  movedDownBoard.cuts[1]?.title !== "Scene #2: Hook"
) {
  throw new Error(
    "Moving a scene down should change its position and recalculate the scene number.",
  );
}

const movedBackUpBoard = moveShootBoardCut(
  movedDownBoard,
  board.cuts[0].id,
  -1,
);
if (
  movedBackUpBoard.cuts[0]?.id !== board.cuts[0].id ||
  movedBackUpBoard.cuts[0]?.title !== "Scene #1: Hook"
) {
  throw new Error(
    "Moving a scene up should change its position and recalculate the scene number.",
  );
}

const dragOrderedBoard = replaceShootBoardCutOrder(board, [
  board.cuts[2],
  board.cuts[0],
  board.cuts[1],
  board.cuts[3],
]);
if (
  dragOrderedBoard.cuts[0]?.id !== board.cuts[2].id ||
  dragOrderedBoard.cuts[0]?.title !== "Scene #1: Demonstration" ||
  dragOrderedBoard.cuts[0]?.requiredChecklist !==
    board.cuts[2].requiredChecklist
) {
  throw new Error(
    "Replacing cut order from drag data should renumber scenes while keeping scene state attached.",
  );
}

const fullScriptBoard = updateShootBoardCutText(
  replaceShootBoardCutOrder(board, [
    board.cuts[2],
    board.cuts[0],
    board.cuts[1],
    board.cuts[3],
  ]),
  board.cuts[1].id,
  {
    lineToSay: "   ",
  },
);
const fullScript = getShootBoardFullScript(fullScriptBoard);
if (
  fullScript !==
  [
    board.cuts[2].lineToSay,
    board.cuts[0].lineToSay,
    board.cuts[3].lineToSay,
  ].join("\n\n")
) {
  throw new Error(
    "Full script should concatenate non-empty cut-card lines in playback order.",
  );
}

const afterFirstShot = toggleShootBoardCutStatus(board, board.cuts[0].id);

if (afterFirstShot.shotCount !== 1 || afterFirstShot.cuts[0]?.isShot !== true) {
  throw new Error(
    "Toggling a cut should mark it shot and update the shot count.",
  );
}

const nextUnshot = afterFirstShot.cuts.find((cut) => !cut.isShot);

if (nextUnshot?.roleLabel !== "Proof") {
  throw new Error(
    "Next unshot cut should move to Proof after the Hook cut is completed.",
  );
}

const addedCut = createAddedShootBoardCut(board);

if (addedCut.order !== 5 || addedCut.role !== "custom" || !addedCut.sceneId) {
  throw new Error(
    "Added scenes should be appended as custom cuts after the existing board cuts.",
  );
}

if (
  addedCut.hook !== "" ||
  addedCut.instruction !== "" ||
  addedCut.instructionKo !== "" ||
  addedCut.lineToSay !== "" ||
  addedCut.note !== "" ||
  addedCut.roleLabel !== "" ||
  addedCut.shotAction !== "" ||
  addedCut.title !== "Scene #5" ||
  addedCut.speakingLine !== "" ||
  addedCut.speakingLineKo !== "" ||
  addedCut.shootingGuideline !== "" ||
  addedCut.shootingGuidelineKo !== "" ||
  addedCut.requiredChecklist.some(
    (item) => item.label !== "" || item.labelKo !== "",
  )
) {
  throw new Error(
    "Added scenes should start blank so the creator fills in the title and details.",
  );
}

const boardWithAddedCut = appendShootBoardCut(board, addedCut);
if (
  boardWithAddedCut.summary.estimatedLengthSeconds !==
  boardWithAddedCut.totalDurationSeconds
) {
  throw new Error(
    "Summary estimated length should stay in sync after adding scenes.",
  );
}

const editedBoard = updateShootBoardCutText(board, board.cuts[0].id, {
  instruction: "Edited instruction",
  instructionKo: "수정된 지시",
  roleLabel: "Edited Hook",
  requiredChecklist: [
    {
      id: board.cuts[0].requiredChecklist[0].id,
      label: "Edited checklist item",
      labelKo: "수정된 체크 항목",
    },
  ],
  shootingGuideline: "Edited shooting guideline",
  shootingGuidelineKo: "수정된 촬영 가이드",
  speakingLine: "Edited line to say",
  speakingLineKo: "수정된 말할 문장",
});

if (
  editedBoard.cuts[0]?.instruction !== "Edited instruction" ||
  editedBoard.cuts[0]?.hook !== "Edited instruction" ||
  editedBoard.cuts[0]?.title !== "Scene #1: Edited Hook" ||
  editedBoard.cuts[0]?.speakingLine !== "Edited line to say" ||
  editedBoard.cuts[0]?.lineToSay !== "Edited line to say" ||
  editedBoard.cuts[0]?.shootingGuideline !== "Edited shooting guideline" ||
  editedBoard.cuts[0]?.shotAction !== "Edited shooting guideline" ||
  editedBoard.cuts[0]?.requiredChecklist[0]?.label !== "Edited checklist item"
) {
  throw new Error("Editing a scene should update the detailed card text.");
}

const resetBoard = resetShootBoardCut(editedBoard, board.cuts[0]);
if (
  resetBoard.cuts[0]?.instruction !== board.cuts[0].instruction ||
  resetBoard.cuts[0]?.hook !== board.cuts[0].hook ||
  resetBoard.cuts[0]?.speakingLine !== board.cuts[0].speakingLine ||
  resetBoard.cuts[0]?.lineToSay !== board.cuts[0].lineToSay ||
  resetBoard.cuts[0]?.shootingGuideline !== board.cuts[0].shootingGuideline ||
  resetBoard.cuts[0]?.shotAction !== board.cuts[0].shotAction ||
  resetBoard.cuts[0]?.requiredChecklist[0]?.label !==
    board.cuts[0].requiredChecklist[0].label
) {
  throw new Error(
    "Resetting a scene should restore that card text from its original snapshot.",
  );
}

if (getShootBoardHref(board.id) !== "/recipe/recipe-korean-diet-hook") {
  throw new Error(
    "Start Shooting entry points should route to the Shoot Board, not directly to camera.",
  );
}

if (
  getRecipePrompterHref(board.id, board.cuts[0].sceneId) !==
  "/recipe/recipe-korean-diet-hook/prompter?sceneId=scene-1"
) {
  throw new Error(
    "Cut shooting actions should route to the prompter for the selected cut scene.",
  );
}

if (
  getRecipeRetakePrompterHref({
    cut: board.cuts[1],
    recipeId: board.id,
    take: board.cuts[1].takes[0],
  }) !==
  "/recipe/recipe-korean-diet-hook/prompter?sceneId=scene-2&cutId=scene-2-proof&retakeTakeId=take-proof-1"
) {
  throw new Error(
    "Retake actions should route to the relevant cut and saved take, not only the scene-level prompter.",
  );
}
