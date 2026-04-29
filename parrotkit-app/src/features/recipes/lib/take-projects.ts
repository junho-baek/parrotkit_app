import type {
  MockProjectTake,
  MockQuickTakeProject,
  MockRecipeTakeProject,
  MockSceneTakeCollection,
} from '@/core/mocks/parrotkit-data';

type ExportKind = 'gallery' | 'share';

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function touch<T extends { updatedAt: string }>(project: T): T {
  return {
    ...project,
    updatedAt: 'Just now',
  };
}

export function createProjectTake(uri: string, index: number): MockProjectTake {
  return {
    createdAt: nowLabel(),
    exportStatus: 'local',
    id: `take-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    label: `Take ${index}`,
    uri,
  };
}

export function createQuickTakeProject(): MockQuickTakeProject {
  const now = 'Just now';

  return {
    createdAt: now,
    id: `quick-project-${Date.now().toString(36)}`,
    takes: [],
    title: 'Quick Shoot',
    updatedAt: now,
  };
}

export function getSceneTakeCollection(
  project: MockRecipeTakeProject | undefined,
  sceneId: string
): MockSceneTakeCollection {
  return project?.scenes[sceneId] ?? { sceneId, takes: [] };
}

export function getBestTake(collection: { bestTakeId?: string; takes: MockProjectTake[] }) {
  return collection.takes.find((take) => take.id === collection.bestTakeId) ?? collection.takes[0] ?? null;
}

export function addSceneTake(
  project: MockRecipeTakeProject | undefined,
  recipeId: string,
  sceneId: string,
  take: MockProjectTake
): MockRecipeTakeProject {
  const currentProject = project ?? {
    id: `take-project-${recipeId}`,
    recipeId,
    scenes: {},
    updatedAt: 'Just now',
  };
  const currentCollection = getSceneTakeCollection(currentProject, sceneId);
  const nextCollection = {
    ...currentCollection,
    bestTakeId: currentCollection.bestTakeId ?? take.id,
    takes: [...currentCollection.takes, take],
  };

  return touch({
    ...currentProject,
    scenes: {
      ...currentProject.scenes,
      [sceneId]: nextCollection,
    },
  });
}

export function removeSceneTake(
  project: MockRecipeTakeProject | undefined,
  sceneId: string,
  takeId: string
): MockRecipeTakeProject | undefined {
  if (!project?.scenes[sceneId]) return project;

  const currentCollection = project.scenes[sceneId];
  const nextTakes = currentCollection.takes.filter((take) => take.id !== takeId);
  const nextCollection: MockSceneTakeCollection = {
    ...currentCollection,
    bestTakeId: currentCollection.bestTakeId === takeId ? nextTakes[0]?.id : currentCollection.bestTakeId,
    takes: nextTakes,
  };

  if (nextTakes.length === 0) {
    const nextScenes = { ...project.scenes };
    delete nextScenes[sceneId];

    return touch({
      ...project,
      scenes: nextScenes,
    });
  }

  return touch({
    ...project,
    scenes: {
      ...project.scenes,
      [sceneId]: nextCollection,
    },
  });
}

export function setSceneBestTake(
  project: MockRecipeTakeProject | undefined,
  sceneId: string,
  takeId: string
): MockRecipeTakeProject | undefined {
  if (!project?.scenes[sceneId]) return project;

  return touch({
    ...project,
    scenes: {
      ...project.scenes,
      [sceneId]: {
        ...project.scenes[sceneId],
        bestTakeId: takeId,
      },
    },
  });
}

export function markSceneTakeExported(
  project: MockRecipeTakeProject | undefined,
  sceneId: string,
  takeId: string,
  kind: ExportKind
): MockRecipeTakeProject | undefined {
  if (!project?.scenes[sceneId]) return project;

  return touch({
    ...project,
    scenes: {
      ...project.scenes,
      [sceneId]: {
        ...project.scenes[sceneId],
        takes: project.scenes[sceneId].takes.map((take) => markTakeExported(take, takeId, kind)),
      },
    },
  });
}

export function addQuickTake(project: MockQuickTakeProject, take: MockProjectTake): MockQuickTakeProject {
  return touch({
    ...project,
    bestTakeId: project.bestTakeId ?? take.id,
    takes: [...project.takes, take],
  });
}

export function removeQuickTake(project: MockQuickTakeProject, takeId: string): MockQuickTakeProject {
  const nextTakes = project.takes.filter((take) => take.id !== takeId);

  return touch({
    ...project,
    bestTakeId: project.bestTakeId === takeId ? nextTakes[0]?.id : project.bestTakeId,
    takes: nextTakes,
  });
}

export function setQuickBestTake(project: MockQuickTakeProject, takeId: string): MockQuickTakeProject {
  return touch({
    ...project,
    bestTakeId: takeId,
  });
}

export function markQuickTakeExported(
  project: MockQuickTakeProject,
  takeId: string,
  kind: ExportKind
): MockQuickTakeProject {
  return touch({
    ...project,
    takes: project.takes.map((take) => markTakeExported(take, takeId, kind)),
  });
}

function markTakeExported(take: MockProjectTake, takeId: string, kind: ExportKind): MockProjectTake {
  if (take.id !== takeId) return take;

  if (kind === 'gallery') {
    return {
      ...take,
      exportStatus: 'gallery_saved',
      exportedToGalleryAt: 'Just now',
    };
  }

  return {
    ...take,
    exportStatus: 'shared',
    sharedAt: 'Just now',
  };
}
