import type {
  ShootingBoardProjection,
  ShootingBoardProjectionItem,
  UserRecipeBoardOverrides,
} from '@/domain/recipes/reference-analysis-contract';
import type { NativeRecipe } from '@/domain/recipes/native-recipe';
import type {
  ShootBoardChecklistItem,
  ShootBoardCut,
} from './shoot-board-model';

export const shootingBoardForbiddenProjectionLabels = [
  'Hook',
  'Proof',
  'Storytelling',
  'Storytelling Format',
  'Visual Layout',
  'Proof point',
  'Proof Point',
  'confidence',
  'model',
  'prompt',
] as const;

export function mapShootingBoardProjectionToCuts({
  projection,
  recipe,
  shotCutIds = new Set<string>(),
}: {
  projection: ShootingBoardProjection;
  recipe: NativeRecipe;
  shotCutIds?: Set<string>;
}): ShootBoardCut[] {
  return [...projection.items]
    .sort((first, second) => first.orderIndex - second.orderIndex)
    .map((item, index) =>
      mapProjectionItemToCut({
        item,
        order: index + 1,
        recipe,
        shotCutIds,
      }),
    );
}

export function applyUserBoardOverridesToProjection({
  overrides,
  projection,
}: {
  overrides?: UserRecipeBoardOverrides | null;
  projection: ShootingBoardProjection;
}): ShootingBoardProjection {
  if (!overrides?.cutOverrides.length && !overrides?.boardTitle) {
    return {
      ...projection,
      items: projection.items.map(cloneProjectionItem),
    };
  }

  const overridesByCutId = new Map(
    (overrides.cutOverrides ?? []).map((override) => [
      override.projectionCutId,
      override,
    ]),
  );

  return {
    ...projection,
    boardTitle: overrides.boardTitle ?? projection.boardTitle,
    items: projection.items
      .map((item) => {
        const override = overridesByCutId.get(item.projectionCutId);
        if (!override) return cloneProjectionItem(item);
        if (override.removed) return null;

        return cloneProjectionItem({
          ...item,
          executionTitle: override.executionTitle ?? item.executionTitle,
          lineToSay:
            override.lineToSay !== undefined
              ? override.lineToSay
              : item.lineToSay,
          orderIndex: override.orderIndex ?? item.orderIndex,
          shotGuide:
            override.shotGuide !== undefined
              ? override.shotGuide
              : item.shotGuide,
          successCriteria:
            override.successCriteria ?? [...item.successCriteria],
        });
      })
      .filter((item): item is ShootingBoardProjectionItem => item !== null)
      .sort((first, second) => first.orderIndex - second.orderIndex)
      .map((item, index) => ({
        ...item,
        orderIndex: index,
      })),
  };
}

function cloneProjectionItem(
  item: ShootingBoardProjectionItem,
): ShootingBoardProjectionItem {
  return {
    ...item,
    editableFields: [...item.editableFields],
    missingArtifacts: [...item.missingArtifacts],
    referenceMediaRef: { ...item.referenceMediaRef },
    sourceCutIds: [...item.sourceCutIds],
    sourceTimeRangeMs: { ...item.sourceTimeRangeMs },
    successCriteria: [...item.successCriteria],
  };
}

export function createProjectionCutTimeRangeLabel({
  endMs,
  startMs,
}: {
  endMs: number;
  startMs: number;
}) {
  return `${formatMilliseconds(startMs)}-${formatMilliseconds(endMs)}`;
}

export function getProjectionCutReferenceVideoSource({
  recipe,
}: {
  item: ShootingBoardProjectionItem;
  recipe: NativeRecipe;
}) {
  return recipe.referenceVideoSource ?? recipe.sourceUrl;
}

export function hasForbiddenBoardProjectionLabel(value?: string | null) {
  if (!value) return false;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;

  return shootingBoardForbiddenProjectionLabels.some((label) => {
    const forbidden = label.toLowerCase();
    return normalized === forbidden || normalized.startsWith(`${forbidden}:`);
  });
}

function mapProjectionItemToCut({
  item,
  order,
  recipe,
  shotCutIds,
}: {
  item: ShootingBoardProjectionItem;
  order: number;
  recipe: NativeRecipe;
  shotCutIds: Set<string>;
}): ShootBoardCut {
  const isShot = isProjectionCutShot(item, shotCutIds);
  const requiredChecklist = createProjectionChecklist(item, isShot);
  const lineToSay = item.lineToSay ?? '';
  const shotGuide = item.shotGuide ?? item.referenceUsage;
  const thumbnailUrl = item.referenceMediaRef.thumbnailUri ?? recipe.thumbnail;
  const thumbnailSource = item.referenceMediaRef.thumbnailUri
    ? { uri: item.referenceMediaRef.thumbnailUri }
    : recipe.thumbnailSource;

  return {
    durationSeconds: item.durationSeconds,
    finalTakeId: undefined,
    hook: item.referenceObservation,
    id: item.projectionCutId,
    instruction: item.referenceObservation,
    instructionKo: item.referenceObservation,
    isShot,
    lineToSay,
    myTakeRelationship: item.myTakeRelationship,
    note: item.myTakeRelationship,
    notes: item.myTakeRelationship,
    order,
    projectionCutId: item.projectionCutId,
    projectionTitle: item.executionTitle,
    prompterLine: lineToSay,
    purpose: item.myTakeRelationship,
    purposeKo: item.myTakeRelationship,
    referenceUsage: item.referenceUsage,
    referenceVideoUrl: getProjectionCutReferenceVideoSource({ item, recipe }),
    requiredChecklist,
    requiredChecks: requiredChecklist.map((check) => check.label),
    requiredChecksKo: requiredChecklist.map((check) => check.labelKo),
    role: 'custom',
    roleLabel: '',
    sceneId: item.sourceCutIds[0] ?? item.projectionCutId,
    shotAction: shotGuide,
    shootingDirections: [
      shotGuide,
      item.referenceUsage,
      item.myTakeRelationship,
    ].filter((value): value is string => Boolean(value)),
    shootingDirectionsKo: [
      shotGuide,
      item.referenceUsage,
      item.myTakeRelationship,
    ].filter((value): value is string => Boolean(value)),
    shootingGuideline: shotGuide,
    shootingGuidelineKo: shotGuide,
    sourceCutIds: [...item.sourceCutIds],
    speakingLine: lineToSay,
    speakingLineKo: lineToSay,
    takeStatus: 'none',
    takes: [],
    takeThumbnailSource: thumbnailSource,
    takeThumbnailUrl: thumbnailUrl,
    templateLine: lineToSay,
    templateLineKo: lineToSay,
    thumbnailSource,
    thumbnailUrl,
    timeRangeLabel: createProjectionCutTimeRangeLabel(item.sourceTimeRangeMs),
    title: item.executionTitle,
    titleKo: item.executionTitle,
  };
}

function createProjectionChecklist(
  item: ShootingBoardProjectionItem,
  checked: boolean,
): ShootBoardChecklistItem[] {
  return item.successCriteria.map((label, index) => ({
    checked,
    id: `${item.projectionCutId}-criteria-${index + 1}`,
    label,
    labelKo: label,
  }));
}

function isProjectionCutShot(
  item: ShootingBoardProjectionItem,
  shotCutIds: Set<string>,
) {
  return (
    shotCutIds.has(item.projectionCutId) ||
    item.sourceCutIds.some((sourceCutId) => shotCutIds.has(sourceCutId))
  );
}

function formatMilliseconds(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
