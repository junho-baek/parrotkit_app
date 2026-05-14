import type { MockRecipe, MockRecipeScene } from "@/core/mocks/parrotkit-data";
import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";

export type SavedTakeCardSnapshot = {
  id: string;
  sceneId?: string;
  order: number;
  role: string;
  title: string;
  hook: string;
  lineToSay: string;
  shotAction: string;
  note: string;
};

export type SavedTakeMetadata = {
  dataSource: "local_mock";
  durationSeconds?: number;
  exportStatus: "local";
  isFinalTake: boolean;
  recipeStatus?: string;
  takeStatus: "saved";
};

export type SavedTakePersistenceContract = {
  recordingUri: string;
  recipeId: string;
  recipeTitle: string;
  sceneId: string;
  sceneTitle: string;
  cardIds: string[];
  cards: SavedTakeCardSnapshot[];
  createdAtIso: string;
  recordedAtLabel: string;
  metadata: SavedTakeMetadata;
};

export type CreateSavedTakeContractInput = {
  card?: ShootBoardCut | null;
  createdAt?: Date;
  recordingUri: string;
  recipe: Pick<MockRecipe, "id" | "title" | "shootStatus">;
  scene: Pick<MockRecipeScene, "id" | "title">;
};

export function createSavedTakePersistenceContract({
  card,
  createdAt = new Date(),
  recordingUri,
  recipe,
  scene,
}: CreateSavedTakeContractInput): SavedTakePersistenceContract {
  const cardSnapshot = card ? [createCardSnapshot(card)] : [];
  const createdAtIso = createdAt.toISOString();

  return {
    cardIds: cardSnapshot.map((snapshot) => snapshot.id),
    cards: cardSnapshot,
    createdAtIso,
    metadata: {
      dataSource: "local_mock",
      durationSeconds: card?.durationSeconds,
      exportStatus: "local",
      isFinalTake: false,
      recipeStatus: recipe.shootStatus,
      takeStatus: "saved",
    },
    recordedAtLabel: formatSavedTakeTime(createdAt),
    recordingUri,
    recipeId: recipe.id,
    recipeTitle: recipe.title,
    sceneId: scene.id,
    sceneTitle: scene.title,
  };
}

function createCardSnapshot(card: ShootBoardCut): SavedTakeCardSnapshot {
  return {
    hook: card.hook,
    id: card.id,
    lineToSay: card.lineToSay,
    note: card.note,
    order: card.order,
    role: card.role,
    sceneId: card.sceneId,
    shotAction: card.shotAction,
    title: card.title,
  };
}

function formatSavedTakeTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
