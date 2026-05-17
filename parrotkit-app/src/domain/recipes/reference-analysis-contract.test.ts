import {
  referenceProjectionTextLimits,
  type NormalizedReferenceMediaInput,
  type ReferenceAnalysisArtifactStatus,
  type ReferenceBreakdownArtifact,
  type ReferenceEvidenceRef,
  type ShootingBoardProjection,
  type UserRecipeBoardOverrides,
} from './reference-analysis-contract';
import type { ReferenceBreakdown } from './reference-breakdown';

const mediaInput: NormalizedReferenceMediaInput = {
  assetVersion: 'sha256:food-promo-v1',
  byteSize: 2400000,
  dimensions: { height: 1920, width: 1080 },
  durationMs: 25000,
  mediaAssetId: 'media_food_promo',
  mimeType: 'video/mp4',
  playable: true,
  source: { kind: 'upload' },
  uri: 'file://food-promo.mp4',
  workspaceId: 'workspace_1',
};

const timeEvidence: ReferenceEvidenceRef = {
  id: 'evidence_opening',
  kind: 'timestamp_range',
  startMs: 0,
  endMs: 5000,
};

const breakdown: ReferenceBreakdownArtifact = {
  analysisProfileVersion: 'reference-analysis-v1',
  breakdownId: 'breakdown_food_promo_v1',
  confidence: { overall: 0.86, notes: [] },
  createdAt: '2026-05-17T10:00:00.000Z',
  cutSegments: [
    {
      confidence: 0.83,
      cutId: 'cut_001',
      durationMs: 5000,
      endMs: 5000,
      evidenceRefs: [timeEvidence],
      executionTitle: 'Immediate promise',
      inferredPurpose: 'Open on the finished result before explanation.',
      lineToSay: 'I stopped overthinking diet food and this finally stuck.',
      missingArtifacts: [],
      myTakeRelationship: 'Your take should prove the payoff before setup.',
      orderIndex: 0,
      referenceObservation: 'Finished plate appears before process.',
      referenceUsage: 'Match the finished-result first frame.',
      shootingGuide: 'Start on the final plate, then cut to reaction.',
      sourceModalities: ['visual', 'transcript'],
      startMs: 0,
      successCriteria: ['Finished result visible immediately'],
      transcriptRefs: ['tr_001'],
      visualRefs: ['frame_001'],
    },
  ],
  hook: {
    adaptationRule: 'Swap in the painful habit and desired outcome.',
    category: 'problem',
    confidence: 0.81,
    evidenceRefs: [timeEvidence],
    formula: 'I stopped [painful habit] and this finally [desired outcome].',
    spokenHook: 'I stopped overthinking diet food and this finally stuck.',
    status: 'ready',
    visualHook: 'Finished plate first.',
    whyItWorks: 'Pain relief and result arrive together.',
  },
  ideaAnalysis: {
    commonBeliefToChallenge: 'Diet food needs ingredient explanation first.',
    confidence: 0.82,
    contrarianReality: 'The final plate can persuade first.',
    evidenceRefs: [timeEvidence],
    ideaSeed: 'Open on the finished result.',
    status: 'ready',
    supportingEvidence: ['The first frame shows the finished plate.'],
    topic: 'Food promo',
    uniqueAngle: 'Low mental-load meal system.',
    userApplication: 'Show your best final plate before process.',
  },
  mediaAssetId: mediaInput.mediaAssetId,
  mediaAssetVersion: mediaInput.assetVersion,
  missingArtifacts: [],
  schemaVersion: 'parrotkit.reference_breakdown.v1',
  shootingBoardProjectionRef: {
    projectionId: 'projection_food_promo_v1',
    projectionSchemaVersion: 'parrotkit.shooting_board_projection.v1',
  },
  status: 'ready',
  storytellingFormat: {
    beatOrder: ['Finished plate', 'Proof in motion', 'Repeatable finish'],
    category: 'demo',
    confidence: 0.84,
    description: 'Promise-first demo.',
    evidenceRefs: [timeEvidence],
    reuseWhen: 'Use when food needs to feel repeatable.',
    status: 'ready',
    whyItWorks: 'It moves from desire to proof to reuse.',
  },
  summary: {
    audience: 'Food creators',
    confidence: 0.9,
    evidenceRefs: [timeEvidence],
    oneLiner: 'A result-first food promo.',
    promise: 'Show payoff first.',
    status: 'ready',
    whyViewersKeepWatching: 'The reward is visible immediately.',
  },
  transcript: {
    cleanText: 'I stopped overthinking diet food and this finally stuck.',
    confidence: 0.88,
    detectedLanguage: 'en',
    evidenceRefs: [timeEvidence],
    notableLines: [
      {
        evidenceRefs: [timeEvidence],
        line: 'I stopped overthinking diet food.',
        whyItMatters: 'Names the pain before process.',
      },
    ],
    segments: [
      {
        endMs: 5000,
        id: 'tr_001',
        startMs: 0,
        text: 'I stopped overthinking diet food and this finally stuck.',
      },
    ],
    status: 'ready',
  },
  updatedAt: '2026-05-17T10:00:00.000Z',
  visualLayout: {
    cameraMotion: 'Quick close-up into stable reaction.',
    captionStrategy: 'Short promise caption first.',
    category: 'product_demo',
    confidence: 0.8,
    evidenceRefs: [timeEvidence],
    framing: 'Final plate fills frame.',
    status: 'ready',
    subCategory: 'Food result close-up',
    subjectProductRelationship: 'Food stays primary.',
    userApplication: 'Keep dish dominant in the first beat.',
  },
  workspaceId: mediaInput.workspaceId,
};

const projection: ShootingBoardProjection = {
  analysisProfileVersion: breakdown.analysisProfileVersion,
  boardTitle: 'Food Promo Shooting Guide',
  breakdownId: breakdown.breakdownId,
  confidence: { overall: 0.84, notes: [] },
  createdAt: breakdown.createdAt,
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
        mediaAssetId: mediaInput.mediaAssetId,
        startMs: 0,
      },
      referenceObservation: 'Finished plate appears before process.',
      referenceUsage: 'Match the finished-result first frame.',
      shotGuide: 'Start on the final plate, then cut to reaction.',
      sourceCutIds: ['cut_001'],
      sourceTimeRangeMs: { endMs: 5000, startMs: 0 },
      successCriteria: ['Finished result visible immediately'],
    },
  ],
  mediaAssetId: mediaInput.mediaAssetId,
  mediaAssetVersion: mediaInput.assetVersion,
  missingArtifacts: [],
  projectionId: 'projection_food_promo_v1',
  projectionSchemaVersion: 'parrotkit.shooting_board_projection.v1',
  sourceCutCount: 1,
  status: 'ready',
  updatedAt: breakdown.updatedAt,
  workspaceId: mediaInput.workspaceId,
};

const overrides: UserRecipeBoardOverrides = {
  cutOverrides: [
    {
      lineToSay: 'Here is the plate I repeat all week.',
      projectionCutId: 'projection_cut_001',
    },
  ],
  projectionId: projection.projectionId,
  recipeId: 'recipe_food_promo',
  updatedAt: '2026-05-17T10:10:00.000Z',
  userId: 'user_1',
};

const legacyBreakdownWithPipelineFields: ReferenceBreakdown = {
  schema_version: 'parrotkit.reference_breakdown.v1',
  reference: {
    source_url: 'mock://food-promo',
    platform: 'instagram',
    creator_handle: '@fit.frames',
    title: 'Food Promo',
    duration_seconds: 25,
    language: 'en',
    thumbnail_description: 'Finished plate in a vertical short.',
  },
  summary: {
    one_liner: 'A result-first food promo.',
    audience: 'Food creators',
    promise: 'Show payoff first.',
    why_viewers_keep_watching: 'The reward is visible immediately.',
  },
  transcript: {
    clean: 'I stopped overthinking diet food and this finally stuck.',
    notable_lines: [],
    raw: [],
  },
  idea_analysis: {
    common_belief_to_challenge: 'Diet food needs ingredient explanation first.',
    contrarian_reality: 'The final plate can persuade first.',
    idea_seed: 'Open on the finished result.',
    supporting_evidence: [],
    topic: 'Food promo',
    unique_angle: 'Low mental-load meal system.',
    user_application: 'Show your best final plate before process.',
  },
  hook: {
    adaptation_rule: 'Swap in the painful habit and desired outcome.',
    category: 'problem',
    formula: 'I stopped [painful habit] and this finally [desired outcome].',
    spoken_hook: 'I stopped overthinking diet food and this finally stuck.',
    visual_hook: 'Finished plate first.',
    why_it_works: 'Pain relief and result arrive together.',
  },
  storytelling_format: {
    beat_order: ['Finished plate', 'Proof in motion', 'Repeatable finish'],
    category: 'demo',
    description: 'Promise-first demo.',
    reuse_when: 'Use when food needs to feel repeatable.',
    why_it_works: 'It moves from desire to proof to reuse.',
  },
  visual_layout: {
    camera_motion: 'Quick close-up into stable reaction.',
    caption_strategy: 'Short promise caption first.',
    category: 'product_demo',
    framing: 'Final plate fills frame.',
    sub_category: 'Food result close-up',
    subject_product_relationship: 'Food stays primary.',
    user_application: 'Keep dish dominant in the first beat.',
  },
  proof_structure: {
    proof_points: [],
    risk_or_gap: '',
    trust_signals: [],
  },
  cuts: [],
  shooting_projection: {
    board_title: 'Food Promo Shooting Guide',
    cut_rows: [],
    video_level_breakdown: [],
  },
  vault_candidates: {
    channel: { creator_handle: '@fit.frames', why_follow: 'Good food promos.' },
    hook: { category: 'problem', formula: 'I stopped [painful habit].' },
    idea: { tags: ['food'], title: 'Result-first food promo' },
    story_format: { name: 'Promise-first demo', tags: ['demo'] },
    visual_layout: { name: 'Food result close-up', tags: ['food'] },
  },
  confidence: {
    cut_segmentation: 0.8,
    notes: [],
    overall: 0.86,
    transcript: 0.88,
    visual: 0.8,
  },
  artifact: {
    analysisProfileVersion: breakdown.analysisProfileVersion,
    breakdownId: breakdown.breakdownId,
    createdAt: breakdown.createdAt,
    mediaAssetId: breakdown.mediaAssetId,
    mediaAssetVersion: breakdown.mediaAssetVersion,
    status: breakdown.status,
    updatedAt: breakdown.updatedAt,
    workspaceId: breakdown.workspaceId,
  },
  cut_segments: breakdown.cutSegments,
  shooting_board_projection: projection,
  user_overrides: overrides,
};

const partialStatus: ReferenceAnalysisArtifactStatus = 'partial_ready';

if (!mediaInput.playable) {
  throw new Error('Media input fixture must be playable');
}

if (breakdown.cutSegments.length !== projection.items.length) {
  throw new Error('Projection fixture should preserve source cut lineage');
}

if (projection.items[0]?.sourceCutIds[0] !== breakdown.cutSegments[0]?.cutId) {
  throw new Error('Projection item must reference the source cut segment');
}

if (overrides.cutOverrides[0]?.lineToSay === breakdown.cutSegments[0]?.lineToSay) {
  throw new Error('User overrides must be separate from generated Breakdown values');
}

if (partialStatus !== 'partial_ready') {
  throw new Error('partial_ready must be a first-class artifact status');
}

if (referenceProjectionTextLimits.executionTitle !== 56) {
  throw new Error('Projection title text limit must match the v1 compact UI contract');
}

if (legacyBreakdownWithPipelineFields.artifact?.breakdownId !== breakdown.breakdownId) {
  throw new Error('ReferenceBreakdown must carry optional pipeline artifact metadata');
}
