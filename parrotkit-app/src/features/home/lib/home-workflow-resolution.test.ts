import type { MockRecipe } from "@/core/mocks/parrotkit-data";
import {
  getHomePrimaryWorkflowRecipe,
  getHomeRecentWorkflowRecipe,
  getHomeWorkflowSelection,
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
