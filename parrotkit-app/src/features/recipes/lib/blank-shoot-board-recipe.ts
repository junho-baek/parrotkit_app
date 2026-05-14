import type { MockRecipe, MockRecipeScene } from "@/core/mocks/parrotkit-data";

type CreateBlankShootBoardRecipeDraftInput = {
  id: string;
  title?: string;
};

type BlankShootBoardRecipeDraft = {
  destination: string;
  recipe: MockRecipe;
};

const blankRecipeThumbnail =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80";

export function createBlankShootBoardRecipeDraft({
  id,
  title,
}: CreateBlankShootBoardRecipeDraftInput): BlankShootBoardRecipeDraft {
  const resolvedTitle = title?.trim() || "Untitled shooting recipe";
  const scenes = createBlankShootBoardScenes(id);
  const recipe: MockRecipe = {
    creator: "@parrotkit",
    downloadCount: 0,
    goal: "Plan and shoot a card-based recipe from a blank board.",
    id,
    lastShotAt: "Created just now",
    niche: "Creator",
    notes: "Created from a blank shoot-board.",
    ownerHandle: "@parrotkitcodextest",
    ownerName: "You",
    ownership: "owned",
    platform: "TikTok",
    savedAt: "Saved just now",
    scenes,
    shootStatus: "continue",
    shotSceneCount: 0,
    sourceUrl: "",
    summary: "A local blank recipe with editable cut cards for shooting.",
    thumbnail: blankRecipeThumbnail,
    title: resolvedTitle,
    totalSceneCount: scenes.length,
    verification: "community",
  };

  return {
    destination: `/recipe/${recipe.id}`,
    recipe,
  };
}

function createBlankShootBoardScenes(recipeId: string): MockRecipeScene[] {
  return [
    createBlankScene({
      action: "Frame the result clearly, then hold for one beat.",
      id: `${recipeId}-cut-1`,
      line: "Start with the result this video will deliver.",
      number: 1,
      summary: "Open with the payoff before any explanation.",
      title: "Hook",
    }),
    createBlankScene({
      action: "Show the most believable proof close enough to inspect.",
      id: `${recipeId}-cut-2`,
      line: "Here is the proof that makes the claim feel real.",
      number: 2,
      summary: "Add a proof beat that supports the hook.",
      title: "Proof",
    }),
    createBlankScene({
      action: "End on a clean frame with the next action visible.",
      id: `${recipeId}-cut-3`,
      line: "Save this when you want to repeat the same result.",
      number: 3,
      summary: "Close with a simple CTA or reusable takeaway.",
      title: "CTA",
    }),
  ];
}

function createBlankScene({
  action,
  id,
  line,
  number,
  summary,
  title,
}: {
  action: string;
  id: string;
  line: string;
  number: number;
  summary: string;
  title: string;
}): MockRecipeScene {
  return {
    analysisLines: [],
    id,
    prompterLines: [line],
    recipe: {
      cta: number === 3 ? line : "",
      keyAction: action,
      keyLine: line,
      objective: summary,
      scriptLines: [line],
    },
    recipeLines: [line, action],
    sceneNumber: number,
    summary,
    title,
  };
}
