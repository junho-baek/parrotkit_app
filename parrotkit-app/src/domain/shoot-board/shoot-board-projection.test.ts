import type {
  ShootingBoardProjection,
  UserRecipeBoardOverrides,
} from '@/domain/recipes/reference-analysis-contract';
import type { NativeRecipe } from '@/domain/recipes/native-recipe';
import {
  applyUserBoardOverridesToProjection,
  createProjectionCutTimeRangeLabel,
  hasForbiddenBoardProjectionLabel,
  mapShootingBoardProjectionToCuts,
} from './shoot-board-projection';

const recipe: NativeRecipe = {
  creator: '@fit.frames',
  goal: 'Conversion',
  id: 'recipe_food_promo',
  niche: 'Food',
  notes: 'Keep the board execution-first.',
  platform: 'Instagram Reels',
  savedAt: '2026-05-17T10:00:00.000Z',
  scenes: [],
  sourceUrl: 'mock://source-video',
  summary: 'A compact food promo board.',
  thumbnail: 'mock://recipe-thumbnail',
  title: 'Food Promo Shooting Guide',
};

const projection: ShootingBoardProjection = {
  analysisProfileVersion: 'reference-analysis-v1',
  boardTitle: 'Food Promo Shooting Guide',
  breakdownId: 'breakdown_food_promo_v1',
  confidence: { overall: 0.84, notes: [] },
  createdAt: '2026-05-17T10:00:00.000Z',
  estimatedDurationSeconds: 25,
  items: [
    {
      durationSeconds: 5,
      editableFields: ['executionTitle', 'lineToSay', 'shotGuide', 'successCriteria'],
      executionTitle: 'Immediate promise',
      lineToSay: 'I stopped overthinking diet food and this finally stuck.',
      missingArtifacts: [],
      myTakeRelationship: 'Your take should prove the payoff before setup.',
      orderIndex: 0,
      projectionCutId: 'projection_cut_001',
      referenceMediaRef: {
        endMs: 5000,
        mediaAssetId: 'media_food_promo',
        startMs: 0,
      },
      referenceObservation: 'Finished plate appears before process.',
      referenceUsage: 'Match the finished-result first frame.',
      shotGuide: 'Start on the final plate, then cut to reaction.',
      sourceCutIds: ['cut_001'],
      sourceTimeRangeMs: { endMs: 5000, startMs: 0 },
      successCriteria: ['Finished result visible immediately'],
    },
    {
      durationSeconds: 8,
      editableFields: ['lineToSay', 'shotGuide'],
      executionTitle: 'Proof in motion',
      lineToSay: 'Here is the prep proof.',
      missingArtifacts: [],
      myTakeRelationship: 'Your take should answer one uncertainty.',
      orderIndex: 1,
      projectionCutId: 'projection_cut_002',
      referenceMediaRef: {
        endMs: 13000,
        mediaAssetId: 'media_food_promo',
        startMs: 5000,
      },
      referenceObservation: 'Fast prep cuts show texture and speed.',
      referenceUsage: 'Borrow the proof rhythm, not the exact food.',
      shotGuide: 'Stack prep, drizzle, and final bite.',
      sourceCutIds: ['cut_002'],
      sourceTimeRangeMs: { endMs: 13000, startMs: 5000 },
      successCriteria: ['One visual proof per cut'],
    },
  ],
  mediaAssetId: 'media_food_promo',
  mediaAssetVersion: 'sha256:food-promo-v1',
  missingArtifacts: [],
  projectionId: 'projection_food_promo_v1',
  projectionSchemaVersion: 'parrotkit.shooting_board_projection.v1',
  sourceCutCount: 2,
  status: 'ready',
  updatedAt: '2026-05-17T10:00:00.000Z',
  workspaceId: 'workspace_1',
};

const cuts = mapShootingBoardProjectionToCuts({
  projection,
  recipe,
  shotCutIds: new Set(['projection_cut_002']),
});

if (cuts.length !== 2) {
  throw new Error('Projection mapper should return one board cut per projection item.');
}

if (cuts[0]?.id !== 'projection_cut_001' || cuts[1]?.id !== 'projection_cut_002') {
  throw new Error('Projection mapper should order cuts by projection orderIndex.');
}

if (cuts[0]?.title !== 'Immediate promise') {
  throw new Error('Projection execution title should become the board cut title.');
}

if (cuts[0]?.roleLabel !== '') {
  throw new Error('Projection board cuts should not expose Hook/Proof role labels.');
}

if (cuts[0]?.lineToSay !== projection.items[0]?.lineToSay) {
  throw new Error('Projection lineToSay should become board lineToSay.');
}

if (cuts[0]?.shotAction !== projection.items[0]?.shotGuide) {
  throw new Error('Projection shotGuide should become board shotAction.');
}

if (cuts[0]?.referenceUsage !== projection.items[0]?.referenceUsage) {
  throw new Error('Projection referenceUsage should be preserved on the board cut.');
}

if (cuts[0]?.myTakeRelationship !== projection.items[0]?.myTakeRelationship) {
  throw new Error('Projection myTakeRelationship should be preserved on the board cut.');
}

if (cuts[0]?.requiredChecklist[0]?.label !== 'Finished result visible immediately') {
  throw new Error('Projection success criteria should become board checklist items.');
}

if (cuts[0]?.referenceVideoUrl !== recipe.sourceUrl) {
  throw new Error('Projection board cuts should use the recipe reference media source.');
}

if (cuts[0]?.timeRangeLabel !== '0:00-0:05') {
  throw new Error(`Unexpected projection time range: ${cuts[0]?.timeRangeLabel}`);
}

if (cuts[0]?.projectionCutId !== 'projection_cut_001') {
  throw new Error('Board cut should preserve projectionCutId lineage.');
}

if (cuts[0]?.sourceCutIds?.join(',') !== 'cut_001') {
  throw new Error('Board cut should preserve sourceCutIds lineage.');
}

if (cuts[1]?.isShot !== true || cuts[1]?.requiredChecklist[0]?.checked !== true) {
  throw new Error('Projection mapper should respect shotCutIds.');
}

if (createProjectionCutTimeRangeLabel({ endMs: 65000, startMs: 61000 }) !== '1:01-1:05') {
  throw new Error('Projection time formatter should support minute offsets.');
}

for (const cut of cuts) {
  for (const value of [
    cut.title,
    cut.roleLabel,
    cut.hook,
    cut.note,
    cut.lineToSay,
    cut.shotAction,
  ]) {
    if (hasForbiddenBoardProjectionLabel(value)) {
      throw new Error(`Projection board cut leaked analysis label: ${value}`);
    }
  }
}

const overrides: UserRecipeBoardOverrides = {
  cutOverrides: [
    {
      lineToSay: 'Edited line survives regeneration.',
      projectionCutId: 'projection_cut_001',
      shotGuide: 'Edited guide survives regeneration.',
      successCriteria: ['Edited criterion survives regeneration.'],
    },
    {
      lineToSay: 'This unmatched edit should not apply.',
      projectionCutId: 'missing_cut',
    },
  ],
  projectionId: 'old_projection',
  recipeId: recipe.id,
  updatedAt: '2026-05-17T10:10:00.000Z',
  userId: 'user_1',
};

const projectionWithOverrides = applyUserBoardOverridesToProjection({
  overrides,
  projection,
});

if (projectionWithOverrides === projection) {
  throw new Error('Override application should return a new projection object.');
}

if (projection.items[0]?.lineToSay === 'Edited line survives regeneration.') {
  throw new Error('Override application must not mutate the generated projection.');
}

if (
  projectionWithOverrides.items[0]?.lineToSay !== 'Edited line survives regeneration.' ||
  projectionWithOverrides.items[0]?.shotGuide !== 'Edited guide survives regeneration.' ||
  projectionWithOverrides.items[0]?.successCriteria[0] !==
    'Edited criterion survives regeneration.'
) {
  throw new Error('Matching projectionCutId overrides should win.');
}

if (projectionWithOverrides.items[1]?.lineToSay !== projection.items[1]?.lineToSay) {
  throw new Error('Unmatched overrides should be ignored.');
}
