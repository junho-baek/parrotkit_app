import { createSavedTakePersistenceContract } from "@/features/recipes/lib/saved-take-contract";
import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";
import { createProjectTake } from "@/features/recipes/lib/take-projects";

const contract = createSavedTakePersistenceContract({
  card: {
    durationSeconds: 8,
    hook: "Show the finished plate first.",
    id: "cut-1",
    lineToSay: "This is the three-step dinner I repeat.",
    note: "Keep the pan in frame.",
    order: 1,
    role: "hook",
    sceneId: "scene-1",
    shotAction: "Push in on the plate.",
    title: "Payoff hook",
  } as ShootBoardCut,
  createdAt: new Date("2026-05-14T03:04:05.000Z"),
  recordingUri: "file:///tmp/take-1.mov",
  recipe: {
    id: "recipe-1",
    shootStatus: "continue",
    title: "Weeknight Dinner Recipe",
  },
  scene: {
    id: "scene-1",
    title: "Payoff hook",
  },
});

if (contract.recordingUri !== "file:///tmp/take-1.mov") {
  throw new Error("Saved take contract must preserve the native recording URI.");
}

if (contract.recipeId !== "recipe-1" || contract.recipeTitle !== "Weeknight Dinner Recipe") {
  throw new Error("Saved take contract must include recipe identity for Home/My listing.");
}

if (contract.cardIds[0] !== "cut-1" || contract.cards[0]?.lineToSay !== "This is the three-step dinner I repeat.") {
  throw new Error("Saved take contract must snapshot cut card ids and content.");
}

if (contract.createdAtIso !== "2026-05-14T03:04:05.000Z" || !contract.recordedAtLabel) {
  throw new Error("Saved take contract must include machine and display timestamps.");
}

if (
  contract.metadata.dataSource !== "local_mock" ||
  contract.metadata.takeStatus !== "saved" ||
  contract.metadata.isFinalTake !== false ||
  contract.metadata.durationSeconds !== 8
) {
  throw new Error("Saved take contract must include replay/listing metadata.");
}

const persistedTake = createProjectTake("file:///tmp/take-1.mov", 1, {
  savedTake: contract,
});

if (persistedTake.uri !== contract.recordingUri || persistedTake.savedTake?.recordingUri !== contract.recordingUri) {
  throw new Error("Project takes must preserve the URI alias and full saved-take persistence contract.");
}

if (persistedTake.savedTake?.recipeTitle !== "Weeknight Dinner Recipe") {
  throw new Error("Project takes must carry saved-take recipe metadata for later Home/My access.");
}
