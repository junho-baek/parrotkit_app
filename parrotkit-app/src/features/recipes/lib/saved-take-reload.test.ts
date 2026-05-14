import {
  createSavedRecipeTakeFromPrompterCompletion,
  listSavedRecipeTakes,
} from "./saved-take-storage";
import { resolveSavedTakeReloadFlow } from "./saved-take-reload-flow";
import type {
  ShootBoardCut,
  ShootBoardRecipe,
} from "./shoot-board-model";

const savedCut = {
  durationSeconds: 11,
  hook: "Open on the finished toast.",
  id: "cut-toast-hook",
  lineToSay: "This is the breakfast recipe I would record again.",
  note: "Hold the plate just under the lens.",
  order: 1,
  role: "hook",
  sceneId: "scene-toast-hook",
  shotAction: "Slow push toward the plated toast.",
  title: "Toast payoff hook",
} as ShootBoardCut;

const recipeBoard = {
  cuts: [savedCut],
  id: "recipe-toast",
  isSaved: true,
  shotCount: 0,
  summary: {} as ShootBoardRecipe["summary"],
  title: "Toast Recipe",
  totalCuts: 1,
  totalDurationSeconds: 11,
} satisfies Pick<
  ShootBoardRecipe,
  | "cuts"
  | "id"
  | "isSaved"
  | "shotCount"
  | "summary"
  | "title"
  | "totalCuts"
  | "totalDurationSeconds"
>;

const saveResult = createSavedRecipeTakeFromPrompterCompletion(
  {},
  {
    activeCutId: savedCut.id,
    board: recipeBoard,
    recipe: {
      id: "recipe-toast",
      shootStatus: "continue",
      title: "Toast Recipe",
    },
    recordingUri: "file:///tmp/toast-take.mov",
    scene: {
      id: "scene-toast-hook",
      title: "Toast payoff hook",
    },
  },
);

savedCut.lineToSay = "This later board edit must not replace the saved take.";
savedCut.shotAction = "This later shot action must not replace the saved take.";
savedCut.note = "This later note must not replace the saved take.";

const reloadedByRecipe = listSavedRecipeTakes(saveResult.projects, {
  recipeId: "recipe-toast",
});

if (reloadedByRecipe.length !== 1) {
  throw new Error("Saved recipe takes must reload by recipe id.");
}

const reloadedTake = reloadedByRecipe[0];

if (!reloadedTake) {
  throw new Error("Saved recipe take should be available after reload.");
}

if (
  reloadedTake.uri !== "file:///tmp/toast-take.mov" ||
  reloadedTake.recipeId !== "recipe-toast" ||
  reloadedTake.recipeTitle !== "Toast Recipe" ||
  reloadedTake.sceneId !== "scene-toast-hook" ||
  reloadedTake.sceneTitle !== "Toast payoff hook"
) {
  throw new Error("Reloaded saved takes must preserve take, recipe, and scene metadata.");
}

if (
  reloadedTake.cardIds[0] !== "cut-toast-hook" ||
  reloadedTake.cards[0]?.hook !== "Open on the finished toast." ||
  reloadedTake.cards[0]?.lineToSay !== "This is the breakfast recipe I would record again." ||
  reloadedTake.cards[0]?.shotAction !== "Slow push toward the plated toast." ||
  reloadedTake.cards[0]?.note !== "Hold the plate just under the lens."
) {
  throw new Error("Reloaded saved takes must preserve the saved cut-card snapshot.");
}

const reloadedByScene = listSavedRecipeTakes(saveResult.projects, {
  recipeId: "recipe-toast",
  sceneId: "scene-toast-hook",
});

if (reloadedByScene[0]?.takeId !== saveResult.take.id) {
  throw new Error("Saved recipe takes must reload by the original recipe and scene context.");
}

const unrelatedSceneReload = listSavedRecipeTakes(saveResult.projects, {
  recipeId: "recipe-toast",
  sceneId: "scene-other",
});

if (unrelatedSceneReload.length !== 0) {
  throw new Error("Scene-scoped reload must not return takes from another cut card context.");
}

const hydratedBoard = {
  ...recipeBoard,
  cuts: [
    {
      ...savedCut,
      finalTakeId: "take-final",
      takeStatus: "final",
      takes: [
        {
          durationSeconds: 11,
          id: "take-final",
          label: "Take 1",
          recordedAtLabel: "Saved earlier",
          status: "final",
        },
        {
          durationSeconds: 11,
          id: reloadedTake.takeId,
          label: reloadedTake.label,
          recordedAtLabel: reloadedTake.recordedAtLabel,
          status: "saved",
        },
      ],
    },
  ],
} satisfies Pick<ShootBoardRecipe, "cuts" | "id" | "title">;

const reloadFlow = resolveSavedTakeReloadFlow({
  board: hydratedBoard,
  take: reloadedTake,
});

if (!reloadFlow) {
  throw new Error("Selecting a saved take must resolve into the recipe editing/playback flow.");
}

if (
  reloadFlow.recipeId !== "recipe-toast" ||
  reloadFlow.recipeTitle !== "Toast Recipe" ||
  reloadFlow.cutId !== "cut-toast-hook" ||
  reloadFlow.sceneId !== "scene-toast-hook" ||
  reloadFlow.takeId !== reloadedTake.takeId
) {
  throw new Error("Saved take selection must preserve recipe, cut, scene, and selected take metadata.");
}

if (
  reloadFlow.cut.hook !== "Open on the finished toast." ||
  reloadFlow.cut.lineToSay !== "This later board edit must not replace the saved take." ||
  reloadFlow.selectedTake.label !== reloadedTake.label ||
  reloadFlow.selectedTake.status !== "saved"
) {
  throw new Error("Saved take selection must reload the hydrated cut card and selected take for playback.");
}
