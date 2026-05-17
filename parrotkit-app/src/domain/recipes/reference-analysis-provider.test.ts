import type {
  NormalizedReferenceMediaInput,
  ReferenceBreakdownArtifact,
  ReferenceEvidenceRef,
  ShootingBoardProjection,
} from './reference-analysis-contract';
import {
  createReferenceAnalysisProviderFailure,
  createReferenceAnalysisProviderResult,
  mapReferenceAnalysisProviderError,
  referenceAnalysisProviderRuntimeConfig,
  stripReferenceAnalysisProviderInternalTrace,
  type ReferenceAnalysisModelAdapter,
} from './reference-analysis-provider';
import { createReferenceAnalysisPrompt } from './reference-analysis-prompt';

const media: NormalizedReferenceMediaInput = {
  assetVersion: 'sha256:food-reference-v1',
  byteSize: 2400000,
  dimensions: { height: 1920, width: 1080 },
  durationMs: 25000,
  mediaAssetId: 'media_food_reference',
  mimeType: 'video/mp4',
  playable: true,
  source: {
    creatorHandle: '@fit.frames',
    kind: 'provider_normalized',
    platform: 'youtube',
    provider: 'supadata',
    sourceUrl: 'https://youtube.com/shorts/example',
  },
  uri: 'https://cdn.example.com/food-reference.mp4',
  workspaceId: 'workspace_1',
};

const evidence: ReferenceEvidenceRef = {
  endMs: 5000,
  id: 'evidence_001',
  kind: 'timestamp_range',
  startMs: 0,
};

const artifact: ReferenceBreakdownArtifact = {
  analysisProfileVersion: 'reference-analysis-v1',
  breakdownId: 'breakdown_food_reference_v1',
  confidence: { notes: [], overall: 0.86 },
  createdAt: '2026-05-17T11:00:00.000Z',
  cutSegments: [
    {
      confidence: 0.84,
      cutId: 'cut_001',
      durationMs: 5000,
      endMs: 5000,
      evidenceRefs: [evidence],
      executionTitle: 'Open on the finished plate',
      inferredPurpose: 'Show the payoff before explaining the process.',
      lineToSay: 'This is the plate I repeat all week.',
      missingArtifacts: [],
      myTakeRelationship: 'Your take should show your finished result first.',
      orderIndex: 0,
      referenceObservation: 'The reference opens on a finished meal.',
      referenceUsage: 'Borrow the result-first framing.',
      shootingGuide: 'Start on a vertical close-up of the finished plate.',
      sourceModalities: ['visual', 'transcript'],
      startMs: 0,
      successCriteria: ['Finished result is visible immediately'],
      transcriptRefs: ['tr_001'],
      visualRefs: ['frame_001'],
    },
  ],
  hook: {
    adaptationRule: 'Swap in the user result and routine.',
    category: 'problem',
    confidence: 0.82,
    evidenceRefs: [evidence],
    formula: 'This is the [result] I repeat all [time period].',
    spokenHook: 'This is the plate I repeat all week.',
    status: 'ready',
    visualHook: 'Finished plate first.',
    whyItWorks: 'The payoff arrives before process details.',
  },
  ideaAnalysis: {
    commonBeliefToChallenge: 'Meal prep needs setup before payoff.',
    confidence: 0.84,
    contrarianReality: 'The payoff can lead the whole video.',
    evidenceRefs: [evidence],
    ideaSeed: 'Result-first meal repeat.',
    status: 'ready',
    supportingEvidence: ['The opening frame is already the final plate.'],
    topic: 'Food promo',
    uniqueAngle: 'Low-friction routine proof.',
    userApplication: 'Show your final result before explaining.',
  },
  mediaAssetId: media.mediaAssetId,
  mediaAssetVersion: media.assetVersion,
  missingArtifacts: [],
  schemaVersion: 'parrotkit.reference_breakdown.v1',
  shootingBoardProjectionRef: {
    projectionId: 'projection_food_reference_v1',
    projectionSchemaVersion: 'parrotkit.shooting_board_projection.v1',
  },
  status: 'ready',
  storytellingFormat: {
    beatOrder: ['Finished result', 'Proof in motion'],
    category: 'demo',
    confidence: 0.8,
    description: 'Promise-first demo.',
    evidenceRefs: [evidence],
    reuseWhen: 'Use when the result is visually persuasive.',
    status: 'ready',
    whyItWorks: 'The viewer understands the reward immediately.',
  },
  summary: {
    audience: 'Food creators',
    confidence: 0.9,
    evidenceRefs: [evidence],
    oneLiner: 'A result-first food short.',
    promise: 'Make the outcome obvious before the method.',
    status: 'ready',
    whyViewersKeepWatching: 'The final plate creates immediate curiosity.',
  },
  transcript: {
    cleanText: 'This is the plate I repeat all week.',
    confidence: 0.86,
    detectedLanguage: 'en',
    evidenceRefs: [evidence],
    notableLines: [
      {
        evidenceRefs: [evidence],
        line: 'This is the plate I repeat all week.',
        whyItMatters: 'It names the repeatable result.',
      },
    ],
    segments: [
      {
        endMs: 5000,
        id: 'tr_001',
        startMs: 0,
        text: 'This is the plate I repeat all week.',
      },
    ],
    status: 'ready',
  },
  updatedAt: '2026-05-17T11:00:00.000Z',
  visualLayout: {
    cameraMotion: 'Stable close-up.',
    captionStrategy: 'Short result caption.',
    category: 'product_demo',
    confidence: 0.78,
    evidenceRefs: [evidence],
    framing: 'Vertical close-up of the finished plate.',
    status: 'ready',
    subCategory: 'Food result close-up',
    subjectProductRelationship: 'Dish dominates the frame.',
    userApplication: 'Keep your result centered.',
  },
  workspaceId: media.workspaceId,
};

const projection: ShootingBoardProjection = {
  analysisProfileVersion: artifact.analysisProfileVersion,
  boardTitle: 'Food Promo Shooting Guide',
  breakdownId: artifact.breakdownId,
  confidence: { notes: [], overall: 0.84 },
  createdAt: artifact.createdAt,
  estimatedDurationSeconds: 25,
  items: [
    {
      durationSeconds: 5,
      editableFields: ['executionTitle', 'lineToSay', 'shotGuide', 'successCriteria'],
      executionTitle: 'Open on the finished plate',
      lineToSay: 'This is the plate I repeat all week.',
      missingArtifacts: [],
      myTakeRelationship: 'Your take should show your finished result first.',
      orderIndex: 0,
      projectionCutId: 'projection_cut_001',
      referenceMediaRef: {
        endMs: 5000,
        mediaAssetId: media.mediaAssetId,
        startMs: 0,
      },
      referenceObservation: 'The reference opens on a finished meal.',
      referenceUsage: 'Borrow the result-first framing.',
      shotGuide: 'Start on a vertical close-up of the finished plate.',
      sourceCutIds: ['cut_001'],
      sourceTimeRangeMs: { endMs: 5000, startMs: 0 },
      successCriteria: ['Finished result is visible immediately'],
    },
  ],
  mediaAssetId: media.mediaAssetId,
  mediaAssetVersion: media.assetVersion,
  missingArtifacts: [],
  projectionId: 'projection_food_reference_v1',
  projectionSchemaVersion: 'parrotkit.shooting_board_projection.v1',
  sourceCutCount: 1,
  status: 'ready',
  updatedAt: artifact.updatedAt,
  workspaceId: media.workspaceId,
};

const completeResult = createReferenceAnalysisProviderResult({
  artifact,
  internalTrace: {
    model: 'replicate/google/gemini',
    provider: 'replicate',
    providerRequestId: 'pred_123',
    rawOutputPreview: { debug: 'internal only' },
  },
  projection,
});

if (!completeResult.ok) {
  throw new Error(`Complete fixture should pass: ${completeResult.error.code}`);
}

if (completeResult.status !== 'ready') {
  throw new Error('Complete output should be ready.');
}

const clientSafeResult = stripReferenceAnalysisProviderInternalTrace(completeResult);

if ('internalTrace' in clientSafeResult) {
  throw new Error('Provider traces must stay internal.');
}

const visualOnlyArtifact: ReferenceBreakdownArtifact = {
  ...artifact,
  missingArtifacts: ['transcript'],
  status: 'partial_ready',
  transcript: {
    ...artifact.transcript,
    cleanText: null,
    confidence: 0,
    detectedLanguage: null,
    missingArtifacts: ['transcript'],
    notableLines: [],
    rawText: [],
    segments: [],
    status: 'missing',
  },
  cutSegments: artifact.cutSegments.map((cut) => ({
    ...cut,
    missingArtifacts: ['transcript'],
    sourceModalities: ['visual'],
    transcriptRefs: [],
  })),
};

const partialResult = createReferenceAnalysisProviderResult({
  artifact: visualOnlyArtifact,
  projection: {
    ...projection,
    missingArtifacts: ['transcript'],
    status: 'partial',
  },
});

if (!partialResult.ok || partialResult.status !== 'partial_ready') {
  throw new Error('Transcript-missing visual output should become partial_ready.');
}

if (!partialResult.missingArtifacts.includes('transcript')) {
  throw new Error('Partial result should preserve transcript as a missing artifact.');
}

const invalidResult = createReferenceAnalysisProviderResult({
  artifact: {
    ...artifact,
    schemaVersion: 'invalid.schema' as ReferenceBreakdownArtifact['schemaVersion'],
  },
  projection,
});

if (invalidResult.ok || invalidResult.error.code !== 'model_invalid_output') {
  throw new Error('Invalid model output should map to model_invalid_output.');
}

const transcriptHardFailure = createReferenceAnalysisProviderResult({
  allowTranscriptMissing: false,
  artifact: visualOnlyArtifact,
  projection,
});

if (
  transcriptHardFailure.ok ||
  transcriptHardFailure.error.code !== 'transcript_unavailable'
) {
  throw new Error('Disallowed missing transcript should map to transcript_unavailable.');
}

const timeoutError = mapReferenceAnalysisProviderError({ kind: 'timeout' });

if (timeoutError.code !== 'provider_timeout' || !timeoutError.retryable) {
  throw new Error('Timeout should map to retryable provider_timeout.');
}

const failure = createReferenceAnalysisProviderFailure({
  internalTrace: {
    provider: 'supadata',
    providerRequestId: 'extract_123',
    rawError: { status: 429 },
  },
  kind: 'quota',
});
const clientSafeFailure = stripReferenceAnalysisProviderInternalTrace(failure);

if ('internalTrace' in clientSafeFailure) {
  throw new Error('Provider traces must be stripped from failures too.');
}

if (referenceAnalysisProviderRuntimeConfig.supadataApiKeyEnv !== 'SUPADATA_API_KEY') {
  throw new Error('Supadata API key env name should be documented in code.');
}

if (referenceAnalysisProviderRuntimeConfig.replicateApiTokenEnv !== 'REPLICATE_API_TOKEN') {
  throw new Error('Replicate API token env name should be documented in code.');
}

const prompt = createReferenceAnalysisPrompt({
  media,
  transcriptSegments: artifact.transcript.segments,
});

let adapterReceivedMediaId = '';
const adapter: ReferenceAnalysisModelAdapter = {
  provider: 'replicate',
  analyze: (input) => {
    adapterReceivedMediaId = input.media.mediaAssetId;
    return Promise.resolve(createReferenceAnalysisProviderResult({
      artifact,
      projection,
      internalTrace: {
        model: input.prompt.outputSchemaName,
        provider: 'replicate',
      },
    }));
  },
};

adapter.analyze({
  media,
  prompt,
  transcriptSegments: artifact.transcript.segments,
});

if (adapterReceivedMediaId !== media.mediaAssetId) {
  throw new Error('Model adapter should accept normalized media.');
}
