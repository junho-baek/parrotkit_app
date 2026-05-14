import type {
  MockRecipe,
  MockProjectTake,
  MockRecipeScene,
  MockRecipeTakeProject,
  MockSceneTakeCollection,
  MockTakeExportStatus,
} from "@/core/mocks/parrotkit-data";
import type {
  SavedTakeCardSnapshot,
  SavedTakePersistenceContract,
} from "@/features/recipes/lib/saved-take-contract";
import { createSavedTakePersistenceContract } from "@/features/recipes/lib/saved-take-contract";
import {
  addSceneTake,
  createProjectTake,
  getSceneTakeCollection,
  setSceneBestTake,
} from "@/features/recipes/lib/take-projects";
import type {
  ShootBoardCut,
  ShootBoardRecipe,
} from "@/features/recipes/lib/shoot-board-model";

export type SavedRecipeTakeStorage = Record<string, MockRecipeTakeProject>;

export type CreateSavedRecipeTakeInput = {
  recipeId: string;
  sceneId: string;
  recordingUri: string;
  savedTake?: SavedTakePersistenceContract;
};

export type CreateSavedRecipeTakeFromPrompterCompletionInput = {
  activeCutId?: string | null;
  board?: ShootBoardRecipe | Pick<ShootBoardRecipe, "cuts"> | null;
  recipe: Pick<MockRecipe, "id" | "title" | "shootStatus">;
  recordingUri: string;
  scene: Pick<MockRecipeScene, "id" | "title">;
};

export type CreateSavedRecipeTakeResult = {
  projects: SavedRecipeTakeStorage;
  take: MockProjectTake;
};

export type SavedRecipeTakeRecord = {
  takeId: string;
  label: string;
  uri: string;
  exportStatus: MockTakeExportStatus;
  recipeId: string;
  recipeTitle: string;
  sceneId: string;
  sceneTitle: string;
  cardIds: string[];
  cards: SavedTakeCardSnapshot[];
  createdAtIso: string;
  recordedAtLabel: string;
  dataSource: SavedTakePersistenceContract["metadata"]["dataSource"];
  takeStatus: "saved" | "final";
  isFinalTake: boolean;
  durationSeconds?: number;
};

export type ListSavedRecipeTakesOptions = {
  cutId?: string;
  recipeId?: string;
  sceneId?: string;
};

export type SelectSavedRecipeFinalTakeInput = {
  recipeId: string;
  sceneId: string;
  takeId: string;
};

export function createSavedRecipeTake(
  projects: SavedRecipeTakeStorage,
  input: CreateSavedRecipeTakeInput,
): CreateSavedRecipeTakeResult {
  const currentProject = projects[input.recipeId];
  const collection = getSceneTakeCollection(currentProject, input.sceneId);
  const take = createProjectTake(input.recordingUri, collection.takes.length + 1, {
    savedTake: input.savedTake,
  });

  return {
    projects: {
      ...projects,
      [input.recipeId]: addSceneTake(
        currentProject,
        input.recipeId,
        input.sceneId,
        take,
      ),
    },
    take,
  };
}

export function createSavedRecipeTakeFromPrompterCompletion(
  projects: SavedRecipeTakeStorage,
  input: CreateSavedRecipeTakeFromPrompterCompletionInput,
): CreateSavedRecipeTakeResult {
  const card = findPrompterCompletionCutCard({
    activeCutId: input.activeCutId,
    board: input.board,
    sceneId: input.scene.id,
  });
  const savedTake = createSavedTakePersistenceContract({
    card,
    recipe: input.recipe,
    recordingUri: input.recordingUri,
    scene: input.scene,
  });

  return createSavedRecipeTake(projects, {
    recipeId: input.recipe.id,
    recordingUri: input.recordingUri,
    savedTake,
    sceneId: input.scene.id,
  });
}

export function listSavedRecipeTakes(
  projects: SavedRecipeTakeStorage,
  options: ListSavedRecipeTakesOptions = {},
): SavedRecipeTakeRecord[] {
  return Object.values(projects)
    .filter((project) => !options.recipeId || project.recipeId === options.recipeId)
    .flatMap((project) => listProjectSavedTakes(project, options))
    .sort((first, second) => second.createdAtIso.localeCompare(first.createdAtIso));
}

export function selectSavedRecipeFinalTake(
  projects: SavedRecipeTakeStorage,
  input: SelectSavedRecipeFinalTakeInput,
): SavedRecipeTakeStorage {
  const project = projects[input.recipeId];
  const collection = getSceneTakeCollection(project, input.sceneId);

  if (!collection.takes.some((take) => take.id === input.takeId)) {
    return projects;
  }

  const nextProject = setSceneBestTake(project, input.sceneId, input.takeId);

  if (!nextProject) {
    return projects;
  }

  return {
    ...projects,
    [input.recipeId]: nextProject,
  };
}

function listProjectSavedTakes(
  project: MockRecipeTakeProject,
  options: ListSavedRecipeTakesOptions,
): SavedRecipeTakeRecord[] {
  return Object.values(project.scenes)
    .filter((collection) => !options.sceneId || collection.sceneId === options.sceneId)
    .flatMap((collection) => listCollectionSavedTakes(collection, options));
}

function listCollectionSavedTakes(
  collection: MockSceneTakeCollection,
  options: ListSavedRecipeTakesOptions,
): SavedRecipeTakeRecord[] {
  return collection.takes.flatMap((take) => {
    if (!take.savedTake) {
      return [];
    }

    if (
      options.cutId &&
      !take.savedTake.cardIds.includes(options.cutId)
    ) {
      return [];
    }

    return [mapSavedTakeRecord(take, collection.bestTakeId)];
  });
}

function findPrompterCompletionCutCard({
  activeCutId,
  board,
  sceneId,
}: {
  activeCutId?: string | null;
  board?: Pick<ShootBoardRecipe, "cuts"> | null;
  sceneId: string;
}): ShootBoardCut | undefined {
  if (!board?.cuts.length) {
    return undefined;
  }

  return (
    (activeCutId ? board.cuts.find((cut) => cut.id === activeCutId) : undefined)
    ?? board.cuts.find((cut) => cut.sceneId === sceneId)
  );
}

function mapSavedTakeRecord(
  take: MockProjectTake,
  bestTakeId?: string,
): SavedRecipeTakeRecord {
  const savedTake = take.savedTake;

  if (!savedTake) {
    throw new Error("Cannot map a project take without saved-take metadata.");
  }

  const isFinalTake = savedTake.metadata.isFinalTake || take.id === bestTakeId;

  return {
    cardIds: savedTake.cardIds,
    cards: savedTake.cards,
    createdAtIso: savedTake.createdAtIso,
    dataSource: savedTake.metadata.dataSource,
    durationSeconds: savedTake.metadata.durationSeconds,
    exportStatus: take.exportStatus,
    isFinalTake,
    label: take.label,
    recordedAtLabel: savedTake.recordedAtLabel,
    recipeId: savedTake.recipeId,
    recipeTitle: savedTake.recipeTitle,
    sceneId: savedTake.sceneId,
    sceneTitle: savedTake.sceneTitle,
    takeId: take.id,
    takeStatus: isFinalTake ? "final" : "saved",
    uri: take.uri,
  };
}
