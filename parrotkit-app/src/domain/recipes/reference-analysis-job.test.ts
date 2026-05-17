import {
  createReferenceAnalysisIdempotencyKey,
  createReferenceAnalysisStageChecklist,
  getReferenceAnalysisClientStatus,
  hasCoherentReferenceAnalysisTerminalArtifacts,
  isReferenceAnalysisRetryableError,
  isReferenceAnalysisTerminalStatus,
  shouldRetryReferenceAnalysisJob,
  toReferenceAnalysisJobReadModel,
  type ReferenceAnalysisJob,
} from './reference-analysis-job';

const baseJob: ReferenceAnalysisJob = {
  analysisProfileVersion: 'reference-analysis-v1',
  attemptCount: 0,
  createdAt: '2026-05-17T10:00:00.000Z',
  currentStage: 'queued',
  idempotencyKey: 'paste-flow-1',
  jobId: 'job_food_promo',
  maxAttempts: 3,
  mediaAssetId: 'media_food_promo',
  mediaAssetVersion: 'sha256:food-promo-v1',
  requestedOutputs: ['breakdown', 'shooting_board_projection'],
  requesterUserId: 'user_1',
  status: 'queued',
  traceId: 'trace_food_promo',
  updatedAt: '2026-05-17T10:00:00.000Z',
  workspaceId: 'workspace_1',
};

const idempotencyKey = createReferenceAnalysisIdempotencyKey({
  analysisProfileVersion: baseJob.analysisProfileVersion,
  idempotencyKey: baseJob.idempotencyKey,
  mediaAssetId: baseJob.mediaAssetId,
  mediaAssetVersion: baseJob.mediaAssetVersion,
  workspaceId: baseJob.workspaceId,
});

if (
  idempotencyKey !==
  'workspace_1:media_food_promo:sha256:food-promo-v1:reference-analysis-v1:paste-flow-1'
) {
  throw new Error(`Unexpected idempotency key: ${idempotencyKey}`);
}

if (getReferenceAnalysisClientStatus('queued') !== 'preparing') {
  throw new Error('queued should map to preparing for clients');
}

if (getReferenceAnalysisClientStatus('generating_projection') !== 'analyzing') {
  throw new Error('generating_projection should map to analyzing for clients');
}

if (getReferenceAnalysisClientStatus('partial_ready') !== 'partial') {
  throw new Error('partial_ready should map to partial for clients');
}

if (!isReferenceAnalysisTerminalStatus('ready')) {
  throw new Error('ready should be terminal');
}

if (isReferenceAnalysisTerminalStatus('transcribing')) {
  throw new Error('transcribing should not be terminal');
}

if (!isReferenceAnalysisRetryableError('provider_timeout')) {
  throw new Error('provider_timeout should be retryable');
}

if (isReferenceAnalysisRetryableError('media_decode_failed')) {
  throw new Error('media_decode_failed should not be retryable without new media');
}

const retryableFailedJob: ReferenceAnalysisJob = {
  ...baseJob,
  attemptCount: 1,
  error: {
    code: 'provider_timeout',
    diagnostics: { provider: 'future-provider' },
    messageUser: 'Analysis is taking longer than expected. Try again.',
  },
  status: 'failed',
};

if (!shouldRetryReferenceAnalysisJob(retryableFailedJob)) {
  throw new Error('Transient failed jobs below max attempts should be retryable');
}

const exhaustedJob: ReferenceAnalysisJob = {
  ...retryableFailedJob,
  attemptCount: 3,
};

if (shouldRetryReferenceAnalysisJob(exhaustedJob)) {
  throw new Error('Jobs at max attempts should not retry automatically');
}

const nonRetryableFailedJob: ReferenceAnalysisJob = {
  ...retryableFailedJob,
  error: {
    code: 'unsupported_media',
    messageUser: 'We could not read this video.',
  },
};

if (shouldRetryReferenceAnalysisJob(nonRetryableFailedJob)) {
  throw new Error('Unsupported media should not retry automatically');
}

const checklist = createReferenceAnalysisStageChecklist('segmenting_cuts');
const activeStage = checklist.find((stage) => stage.key === 'segmenting_cuts');
const previousStage = checklist.find((stage) => stage.key === 'transcribing');
const nextStage = checklist.find((stage) => stage.key === 'generating_breakdown');

if (activeStage?.state !== 'active') {
  throw new Error('Current stage should be active');
}

if (previousStage?.state !== 'done') {
  throw new Error('Previous stages should be done');
}

if (nextStage?.state !== 'pending') {
  throw new Error('Future stages should be pending');
}

const readyJob: ReferenceAnalysisJob = {
  ...baseJob,
  breakdownId: 'breakdown_food_promo_v1',
  currentStage: 'ready',
  projectionId: 'projection_food_promo_v1',
  status: 'ready',
};

if (!hasCoherentReferenceAnalysisTerminalArtifacts(readyJob)) {
  throw new Error('Ready jobs must be coherent with Breakdown and projection IDs');
}

const incoherentReadyJob: ReferenceAnalysisJob = {
  ...readyJob,
  projectionId: undefined,
};

if (hasCoherentReferenceAnalysisTerminalArtifacts(incoherentReadyJob)) {
  throw new Error('Ready jobs without projection IDs should be incoherent');
}

const partialJob: ReferenceAnalysisJob = {
  ...baseJob,
  breakdownId: 'breakdown_food_promo_v1',
  currentStage: 'partial_ready',
  error: {
    code: 'transcript_unavailable',
    messageUser: 'Transcript is unavailable, but visual guide is ready.',
  },
  missingArtifacts: ['transcript'],
  projectionId: 'projection_food_promo_v1',
  status: 'partial_ready',
};

const partialReadModel = toReferenceAnalysisJobReadModel(partialJob);

if (partialReadModel.clientStatus !== 'partial') {
  throw new Error('Partial jobs should project a partial client status');
}

if (partialReadModel.error?.code !== 'transcript_unavailable') {
  throw new Error('Partial read model should expose stable user-safe error code');
}

if ('diagnostics' in (partialReadModel.error ?? {})) {
  throw new Error('Client read model must not expose internal diagnostics');
}

if ('status' in partialReadModel) {
  throw new Error('Client read model must not expose internal job status');
}

if (!partialReadModel.artifacts?.breakdownId || !partialReadModel.artifacts.projectionId) {
  throw new Error('Partial read model should expose coherent artifact IDs');
}
