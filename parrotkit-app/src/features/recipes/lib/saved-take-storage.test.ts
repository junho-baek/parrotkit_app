import {
  createSavedRecipeTake,
  createSavedRecipeTakeFromPrompterCompletion,
  listSavedRecipeTakes,
  selectSavedRecipeFinalTake,
} from "./saved-take-storage";
import { createSavedTakePersistenceContract } from "./saved-take-contract";
import type { ShootBoardCut, ShootBoardRecipe } from "./shoot-board-model";

const savedTake = createSavedTakePersistenceContract({
  card: {
    durationSeconds: 12,
    hook: "Show the finished latte first.",
    id: "cut-latte-hook",
    lineToSay: "This is the latte recipe I would shoot again.",
    note: "Keep the cup centered.",
    order: 1,
    role: "hook",
    sceneId: "scene-latte-hook",
    shotAction: "Push in on foam art.",
    title: "Latte payoff hook",
  } as ShootBoardCut,
  createdAt: new Date("2026-05-14T05:06:07.000Z"),
  recordingUri: "file:///tmp/latte-take.mov",
  recipe: {
    id: "recipe-latte",
    shootStatus: "continue",
    title: "Latte Recipe",
  },
  scene: {
    id: "scene-latte-hook",
    title: "Latte payoff hook",
  },
});

const { projects, take } = createSavedRecipeTake(
  {},
  {
    recipeId: "recipe-latte",
    recordingUri: savedTake.recordingUri,
    savedTake,
    sceneId: "scene-latte-hook",
  },
);

if (!projects["recipe-latte"]?.scenes["scene-latte-hook"]?.takes[0]) {
  throw new Error("Storage must create a recipe scene take collection when saving a take.");
}

const savedRecords = listSavedRecipeTakes(projects);

if (savedRecords.length !== 1) {
  throw new Error("Storage must read saved recipe takes from local projects.");
}

const record = savedRecords[0];

if (!record) {
  throw new Error("Saved take record should exist.");
}

if (
  record.takeId !== take.id ||
  record.uri !== "file:///tmp/latte-take.mov" ||
  record.recipeId !== "recipe-latte" ||
  record.recipeTitle !== "Latte Recipe" ||
  record.sceneId !== "scene-latte-hook" ||
  record.sceneTitle !== "Latte payoff hook"
) {
  throw new Error("Saved take records must preserve take, recipe, scene, and URI metadata.");
}

if (
  record.cardIds[0] !== "cut-latte-hook" ||
  record.cards[0]?.lineToSay !== "This is the latte recipe I would shoot again." ||
  record.cards[0]?.shotAction !== "Push in on foam art."
) {
  throw new Error("Saved take records must expose associated cut-card metadata.");
}

if (
  record.createdAtIso !== "2026-05-14T05:06:07.000Z" ||
  record.recordedAtLabel.length === 0 ||
  record.dataSource !== "local_mock" ||
  record.takeStatus !== "final" ||
  record.isFinalTake !== true
) {
  throw new Error("Saved take records must expose local timestamp and final take state metadata.");
}

const filteredRecords = listSavedRecipeTakes(projects, { recipeId: "other-recipe" });

if (filteredRecords.length !== 0) {
  throw new Error("Storage read helpers must support recipe-scoped saved-take access.");
}

const sharedSceneCutA = {
  durationSeconds: 7,
  hook: "First cut hook",
  id: "cut-shared-a",
  lineToSay: "Do not save this line.",
  note: "First shared scene card.",
  order: 1,
  role: "hook",
  sceneId: "scene-shared",
  shotAction: "Wide first shot.",
  title: "Shared scene first cut",
} as ShootBoardCut;
const sharedSceneCutB = {
  durationSeconds: 9,
  hook: "Selected cut hook",
  id: "cut-shared-b",
  lineToSay: "Save this selected card line.",
  note: "Selected shared scene card.",
  order: 2,
  role: "proof",
  sceneId: "scene-shared",
  shotAction: "Close-up selected shot.",
  title: "Shared scene selected cut",
} as ShootBoardCut;
const explicitCutSave = createSavedRecipeTakeFromPrompterCompletion(
  {},
  {
    activeCutId: "cut-shared-b",
    board: {
      cuts: [sharedSceneCutA, sharedSceneCutB],
      id: "recipe-shared",
      isSaved: true,
      shotCount: 0,
      summary: {} as ShootBoardRecipe["summary"],
      title: "Shared Scene Recipe",
      totalCuts: 2,
      totalDurationSeconds: 16,
    },
    recipe: {
      id: "recipe-shared",
      shootStatus: "continue",
      title: "Shared Scene Recipe",
    },
    recordingUri: "file:///tmp/selected-card.mov",
    scene: {
      id: "scene-shared",
      title: "Shared scene",
    },
  },
);
const explicitCutRecord = listSavedRecipeTakes(explicitCutSave.projects, {
  recipeId: "recipe-shared",
})[0];

if (explicitCutRecord?.cardIds[0] !== "cut-shared-b") {
  throw new Error("Prompter completion saves must prefer the explicit active cut id over scene fallback.");
}

if (explicitCutRecord.cards[0]?.lineToSay !== "Save this selected card line.") {
  throw new Error("Prompter completion saves must snapshot the selected cut card copy.");
}

const sharedSceneTwoTakeSave = createSavedRecipeTakeFromPrompterCompletion(
  explicitCutSave.projects,
  {
    activeCutId: "cut-shared-a",
    board: {
      cuts: [sharedSceneCutA, sharedSceneCutB],
      id: "recipe-shared",
      isSaved: true,
      shotCount: 0,
      summary: {} as ShootBoardRecipe["summary"],
      title: "Shared Scene Recipe",
      totalCuts: 2,
      totalDurationSeconds: 16,
    },
    recipe: {
      id: "recipe-shared",
      shootStatus: "continue",
      title: "Shared Scene Recipe",
    },
    recordingUri: "file:///tmp/unselected-card.mov",
    scene: {
      id: "scene-shared",
      title: "Shared scene",
    },
  },
);
const cutScopedRecords = listSavedRecipeTakes(sharedSceneTwoTakeSave.projects, {
  cutId: "cut-shared-b",
  recipeId: "recipe-shared",
});

if (
  cutScopedRecords.length !== 1 ||
  cutScopedRecords[0]?.cardIds[0] !== "cut-shared-b"
) {
  throw new Error("Expanded cut cards must only read saved takes associated with that cut card.");
}

const finalSelectionProjects = selectSavedRecipeFinalTake(
  sharedSceneTwoTakeSave.projects,
  {
    recipeId: "recipe-shared",
    sceneId: "scene-shared",
    takeId: sharedSceneTwoTakeSave.take.id,
  },
);
const finalSelectionRecords = listSavedRecipeTakes(finalSelectionProjects, {
  recipeId: "recipe-shared",
  sceneId: "scene-shared",
});
const selectedFinalRecord = finalSelectionRecords.find(
  (savedRecord) => savedRecord.takeId === sharedSceneTwoTakeSave.take.id,
);
const previousFinalRecord = finalSelectionRecords.find(
  (savedRecord) => savedRecord.takeId === explicitCutSave.take.id,
);

if (
  selectedFinalRecord?.takeStatus !== "final" ||
  selectedFinalRecord.isFinalTake !== true ||
  previousFinalRecord?.takeStatus !== "saved" ||
  previousFinalRecord.isFinalTake !== false
) {
  throw new Error("Set as final must update the local saved-take final state for the selected take only.");
}
