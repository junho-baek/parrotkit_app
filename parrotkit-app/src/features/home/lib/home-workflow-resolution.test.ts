import type { MockRecipe } from "@/core/mocks/parrotkit-data";
import {
  getNextRequiredCutWithoutSavedMyTakeId,
  getHomePrimaryWorkflowRecipe,
  getHomeRecentWorkflowRecipe,
  getHomeWorkflowSelection,
  isRecipeBoardUnfinishedByRequiredMyTakes,
} from "./home-workflow-resolution";

const baseRecipe: MockRecipe = {
  creator: "@creator",
  downloadCount: 0,
  goal: "Shoot a creator workflow.",
  id: "recipe-base",
  niche: "Creator",
  notes: "",
  ownerHandle: "@parrotkitcodextest",
  ownerName: "You",
  ownership: "owned",
  platform: "TikTok",
  savedAt: "Saved just now",
  scenes: [],
  shootStatus: "ready",
  shotSceneCount: 0,
  sourceUrl: "",
  summary: "Local recipe",
  thumbnail: "mock://thumbnail",
  title: "Recipe",
  totalSceneCount: 3,
  verification: "community",
};

function recipe(overrides: Partial<MockRecipe>): MockRecipe {
  return {
    ...baseRecipe,
    ...overrides,
  };
}

function scene(id: string): MockRecipe["scenes"][number] {
  return {
    analysisLines: [],
    id,
    prompterLines: [],
    recipeLines: [],
    summary: "Required cut",
    title: "Required cut",
  };
}

function optionalScene(id: string): MockRecipe["scenes"][number] {
  return {
    ...scene(id),
    isOptional: true,
    summary: "Optional cut",
    title: "Optional cut",
  };
}

const oldReadyRecipe = recipe({
  id: "old-ready",
  downloadCount: 999,
  savedAt: "Saved yesterday",
  title: "Older ready recipe",
});

const recentReadyRecipe = recipe({
  id: "recent-ready",
  savedAt: "Saved just now",
  title: "Recent ready recipe",
});

const olderInProgressRecipe = recipe({
  id: "older-in-progress",
  lastShotAt: "Last shot yesterday",
  savedAt: "Saved yesterday",
  shootStatus: "continue",
  shotSceneCount: 1,
  title: "Older in-progress recipe",
});

const recentInProgressRecipe = recipe({
  id: "recent-in-progress",
  lastShotAt: "Last shot just now",
  savedAt: "Saved just now",
  shootStatus: "continue",
  shotSceneCount: 2,
  title: "Recent in-progress recipe",
});

const communityRecipe = recipe({
  id: "community-ready",
  downloadCount: 5000,
  ownership: "community",
  title: "Community catalog recipe",
});

const draftRecipe = recipe({
  id: "draft",
  shootStatus: "draft",
  title: "Source draft",
});

const boardWithRequiredCuts = recipe({
  id: "required-cut-board",
  scenes: [
    scene("required-hook"),
    scene("required-proof"),
    scene("required-cta"),
  ],
  shotSceneCount: 3,
  totalSceneCount: 3,
});

const completedInProgressBoard = recipe({
  id: "completed-in-progress-board",
  scenes: [
    scene("completed-hook"),
    scene("completed-proof"),
  ],
  shootStatus: "continue",
  shotSceneCount: 2,
  totalSceneCount: 2,
});

const unfinishedInProgressBoard = recipe({
  id: "unfinished-in-progress-board",
  scenes: [
    scene("unfinished-hook"),
    scene("unfinished-proof"),
  ],
  shootStatus: "continue",
  shotSceneCount: 1,
  totalSceneCount: 2,
});

const explicitlyCompletedInProgressBoard = recipe({
  explicitCompletion: true,
  id: "explicitly-completed-in-progress-board",
  scenes: [
    scene("explicit-complete-hook"),
    scene("explicit-complete-proof"),
  ],
  shootStatus: "continue",
  shotSceneCount: 1,
  totalSceneCount: 2,
});

const olderUnfinishedActivityBoard = recipe({
  ...( {
    lastMeaningfulActivityAt: "2026-05-15T01:00:00.000Z",
    updatedAt: "2026-05-15T01:00:00.000Z",
  } as Partial<MockRecipe> ),
  id: "older-unfinished-activity-board",
  scenes: [
    scene("older-activity-hook"),
    scene("older-activity-proof"),
  ],
  shootStatus: "continue",
  shotSceneCount: 1,
  totalSceneCount: 2,
});

const latestUnfinishedActivityBoard = recipe({
  ...( {
    lastMeaningfulActivityAt: "2026-05-15T03:00:00.000Z",
    updatedAt: "2026-05-15T02:00:00.000Z",
  } as Partial<MockRecipe> ),
  id: "latest-unfinished-activity-board",
  scenes: [
    scene("latest-activity-hook"),
    scene("latest-activity-proof"),
  ],
  shootStatus: "continue",
  shotSceneCount: 1,
  totalSceneCount: 2,
});

const primaryWorkflow = getHomePrimaryWorkflowRecipe([
  recentReadyRecipe,
  recentInProgressRecipe,
  olderInProgressRecipe,
]);

if (primaryWorkflow?.id !== "recent-in-progress") {
  throw new Error("Home must prefer the most recent in-progress workflow over ready recipes.");
}

const recentWorkflow = getHomeRecentWorkflowRecipe([
  communityRecipe,
  recentReadyRecipe,
  oldReadyRecipe,
]);

if (recentWorkflow?.id !== "recent-ready") {
  throw new Error("Home must fall back to the most recent local creator workflow, not catalog popularity.");
}

const emptyWorkflow = getHomePrimaryWorkflowRecipe([
  communityRecipe,
  draftRecipe,
]);

if (emptyWorkflow !== null) {
  throw new Error("Home must not treat community catalog recipes or source drafts as the primary workflow.");
}

const inProgressSelection = getHomeWorkflowSelection([
  recentReadyRecipe,
  recentInProgressRecipe,
]);

if (inProgressSelection.reason !== "inProgress" || inProgressSelection.recipe?.id !== "recent-in-progress") {
  throw new Error("Home workflow selection must explain that an in-progress local workflow was chosen.");
}

const recentSelection = getHomeWorkflowSelection([
  communityRecipe,
  recentReadyRecipe,
]);

if (recentSelection.reason !== "recent" || recentSelection.recipe?.id !== "recent-ready") {
  throw new Error("Home workflow selection must explain when it falls back to the recent local workflow.");
}

const emptySelection = getHomeWorkflowSelection([
  communityRecipe,
  draftRecipe,
]);

if (emptySelection.reason !== "none" || emptySelection.recipe !== null) {
  throw new Error("Home workflow selection must explicitly report no local workflow when only catalog/draft state exists.");
}

if (
  !isRecipeBoardUnfinishedByRequiredMyTakes({
    recipe: boardWithRequiredCuts,
    savedTakes: [
      {
        cardIds: ["required-hook"],
        recipeId: "required-cut-board",
        sceneId: "required-hook",
      },
      {
        cardIds: ["required-proof"],
        recipeId: "required-cut-board",
        sceneId: "required-proof",
      },
    ],
  })
) {
  throw new Error("A recipe board must remain unfinished when any required cut lacks a saved My Take.");
}

if (
  isRecipeBoardUnfinishedByRequiredMyTakes({
    recipe: boardWithRequiredCuts,
    savedTakes: [
      {
        cardIds: ["required-hook"],
        recipeId: "required-cut-board",
        sceneId: "required-hook",
      },
      {
        cardIds: ["required-proof"],
        recipeId: "required-cut-board",
        sceneId: "required-proof",
      },
      {
        cardIds: ["required-cta"],
        recipeId: "required-cut-board",
        sceneId: "required-cta",
      },
    ],
  })
) {
  throw new Error("A recipe board should not be unfinished once every required cut has a saved My Take.");
}

const unfinishedSelection = getHomeWorkflowSelection(
  [
    completedInProgressBoard,
    unfinishedInProgressBoard,
  ],
  {
    savedTakes: [
      {
        cardIds: ["completed-hook"],
        recipeId: "completed-in-progress-board",
        sceneId: "completed-hook",
      },
      {
        cardIds: ["completed-proof"],
        recipeId: "completed-in-progress-board",
        sceneId: "completed-proof",
      },
      {
        cardIds: ["unfinished-hook"],
        recipeId: "unfinished-in-progress-board",
        sceneId: "unfinished-hook",
      },
    ],
  },
);

if (
  unfinishedSelection.reason !== "inProgress" ||
  unfinishedSelection.recipe?.id !== "unfinished-in-progress-board"
) {
  throw new Error("Home Continue must skip boards whose required cuts all have saved My Takes.");
}

const latestUnfinishedSelection = getHomeWorkflowSelection(
  [
    olderUnfinishedActivityBoard,
    latestUnfinishedActivityBoard,
  ],
  {
    savedTakes: [
      {
        cardIds: ["older-activity-hook"],
        recipeId: "older-unfinished-activity-board",
        sceneId: "older-activity-hook",
      },
      {
        cardIds: ["latest-activity-hook"],
        recipeId: "latest-unfinished-activity-board",
        sceneId: "latest-activity-hook",
      },
    ],
  },
);

if (
  latestUnfinishedSelection.reason !== "inProgress" ||
  latestUnfinishedSelection.recipe?.id !== "latest-unfinished-activity-board"
) {
  throw new Error("Home Continue must open the latest unfinished recipe shooting board.");
}

const allCompletedSelection = getHomeWorkflowSelection(
  [
    completedInProgressBoard,
    boardWithRequiredCuts,
  ],
  {
    savedTakes: [
      {
        cardIds: ["completed-hook"],
        recipeId: "completed-in-progress-board",
        sceneId: "completed-hook",
      },
      {
        cardIds: ["completed-proof"],
        recipeId: "completed-in-progress-board",
        sceneId: "completed-proof",
      },
      {
        cardIds: ["required-hook"],
        recipeId: "required-cut-board",
        sceneId: "required-hook",
      },
      {
        cardIds: ["required-proof"],
        recipeId: "required-cut-board",
        sceneId: "required-proof",
      },
      {
        cardIds: ["required-cta"],
        recipeId: "required-cut-board",
        sceneId: "required-cta",
      },
    ],
  },
);

if (allCompletedSelection.reason !== "none" || allCompletedSelection.recipe !== null) {
  throw new Error("Home Continue must not select a board when every required cut already has a saved My Take.");
}

const oneMissingRequiredCutSelection = getHomeWorkflowSelection(
  [
    recipe({
      id: "one-missing-required-cut-board",
      scenes: [
        scene("one-missing-hook"),
        scene("one-missing-proof"),
        scene("one-missing-cta"),
      ],
      shootStatus: "continue",
      shotSceneCount: 3,
      title: "One missing required cut board",
      totalSceneCount: 3,
    }),
  ],
  {
    savedTakes: [
      {
        cardIds: ["one-missing-hook"],
        recipeId: "one-missing-required-cut-board",
        sceneId: "one-missing-hook",
      },
      {
        cardIds: ["one-missing-proof"],
        recipeId: "one-missing-required-cut-board",
        sceneId: "one-missing-proof",
      },
    ],
  },
);

if (
  oneMissingRequiredCutSelection.reason !== "inProgress" ||
  oneMissingRequiredCutSelection.recipe?.id !== "one-missing-required-cut-board"
) {
  throw new Error("Home Continue must keep a board eligible when exactly one required cut lacks a saved My Take.");
}

const fullChecklistButMissingRequiredMyTakeSelection = getHomeWorkflowSelection(
  [
    recipe({
      id: "full-checklist-missing-required-mytake-board",
      scenes: [
        scene("full-checklist-hook"),
        scene("full-checklist-proof"),
        scene("full-checklist-cta"),
      ],
      shootStatus: "continue",
      shotSceneCount: 3,
      title: "Full checklist missing required My Take board",
      totalSceneCount: 3,
    }),
  ],
  {
    savedTakes: [
      {
        cardIds: ["full-checklist-hook"],
        recipeId: "full-checklist-missing-required-mytake-board",
        sceneId: "full-checklist-hook",
      },
      {
        cardIds: ["full-checklist-proof"],
        recipeId: "full-checklist-missing-required-mytake-board",
        sceneId: "full-checklist-proof",
      },
    ],
  },
);

if (
  fullChecklistButMissingRequiredMyTakeSelection.reason !== "inProgress" ||
  fullChecklistButMissingRequiredMyTakeSelection.recipe?.id !== "full-checklist-missing-required-mytake-board"
) {
  throw new Error("Home Continue must treat checklist progress as supporting only when a required My Take is missing.");
}

const optionalOnlyMissingSelection = getHomeWorkflowSelection(
  [
    recipe({
      id: "optional-only-missing-board",
      scenes: [
        scene("optional-case-hook"),
        scene("optional-case-proof"),
        optionalScene("optional-case-b-roll"),
      ],
      shootStatus: "continue",
      shotSceneCount: 2,
      title: "Optional only missing board",
      totalSceneCount: 3,
    }),
  ],
  {
    savedTakes: [
      {
        cardIds: ["optional-case-hook"],
        recipeId: "optional-only-missing-board",
        sceneId: "optional-case-hook",
      },
      {
        cardIds: ["optional-case-proof"],
        recipeId: "optional-only-missing-board",
        sceneId: "optional-case-proof",
      },
    ],
  },
);

if (optionalOnlyMissingSelection.reason !== "none" || optionalOnlyMissingSelection.recipe !== null) {
  throw new Error("Home Continue must treat a board as complete when only optional cuts lack saved My Takes.");
}

const explicitCompletionSkippedSelection = getHomeWorkflowSelection(
  [
    explicitlyCompletedInProgressBoard,
    unfinishedInProgressBoard,
  ],
  {
    savedTakes: [
      {
        cardIds: ["explicit-complete-hook"],
        recipeId: "explicitly-completed-in-progress-board",
        sceneId: "explicit-complete-hook",
      },
      {
        cardIds: ["unfinished-hook"],
        recipeId: "unfinished-in-progress-board",
        sceneId: "unfinished-hook",
      },
    ],
  },
);

if (
  explicitCompletionSkippedSelection.reason !== "inProgress" ||
  explicitCompletionSkippedSelection.recipe?.id !== "unfinished-in-progress-board"
) {
  throw new Error("Home Continue must skip an explicitly completed board even when required My Takes are missing.");
}

const onlyExplicitlyCompletedSelection = getHomeWorkflowSelection(
  [
    explicitlyCompletedInProgressBoard,
  ],
  {
    savedTakes: [
      {
        cardIds: ["explicit-complete-hook"],
        recipeId: "explicitly-completed-in-progress-board",
        sceneId: "explicit-complete-hook",
      },
    ],
  },
);

if (onlyExplicitlyCompletedSelection.reason !== "none" || onlyExplicitlyCompletedSelection.recipe !== null) {
  throw new Error("Home Continue must not select a board after explicit publish or complete marks it complete.");
}

const nextMissingRequiredCutId = getNextRequiredCutWithoutSavedMyTakeId({
  recipe: recipe({
    id: "next-required-cut-board",
    scenes: [
      scene("next-hook"),
      optionalScene("next-optional-b-roll"),
      scene("next-proof"),
      scene("next-cta"),
    ],
  }),
  savedTakes: [
    {
      cardIds: ["next-hook"],
      recipeId: "next-required-cut-board",
      sceneId: "next-hook",
    },
    {
      cardIds: ["next-optional-b-roll"],
      recipeId: "next-required-cut-board",
      sceneId: "next-optional-b-roll",
    },
  ],
});

if (nextMissingRequiredCutId !== "next-proof") {
  throw new Error("Home Continue must identify the first required cut without a saved My Take as the overview highlight target.");
}
