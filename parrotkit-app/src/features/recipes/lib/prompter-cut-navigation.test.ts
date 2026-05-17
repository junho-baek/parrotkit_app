import { getPrompterCutNavigation } from "./prompter-cut-navigation";

const board = {
  cuts: [
    { id: "cut-1", order: 1, sceneId: "scene-1" },
    { id: "cut-2", order: 2, sceneId: "scene-2" },
    { id: "cut-3", order: 3, sceneId: "scene-3" },
    { id: "cut-4", order: 4, sceneId: "scene-3" },
  ],
};

const selected = getPrompterCutNavigation({
  fallbackSceneId: "scene-3",
  selectedCutId: "cut-4",
  shootBoard: board,
});

if (selected.activeCut?.id !== "cut-4") {
  throw new Error("Prompter should honor the selected added cut.");
}

if (selected.currentIndex !== 4 || selected.totalCuts !== 4) {
  throw new Error("Prompter cut count should follow shoot-board cuts, including added cuts.");
}

if (selected.previousCut?.id !== "cut-3" || selected.nextCut !== null) {
  throw new Error("Prompter navigation should move by board cut order.");
}

const fallback = getPrompterCutNavigation({
  fallbackSceneId: "scene-2",
  selectedCutId: null,
  shootBoard: board,
});

if (fallback.activeCut?.id !== "cut-2" || fallback.currentIndex !== 2) {
  throw new Error("Prompter should fall back to the first matching scene cut.");
}

