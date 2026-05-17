export type ReferenceAnalysisJobStatus =
  | 'queued'
  | 'preparing_media'
  | 'extracting_metadata'
  | 'extracting_audio'
  | 'transcribing'
  | 'analyzing_video'
  | 'segmenting_cuts'
  | 'generating_breakdown'
  | 'generating_projection'
  | 'ready'
  | 'partial_ready'
  | 'failed'
  | 'canceled'
  | 'expired';

export type ReferenceAnalysisClientStatus =
  | 'preparing'
  | 'analyzing'
  | 'ready'
  | 'partial'
  | 'failed';

export type ReferenceAnalysisRequestedOutput =
  | 'breakdown'
  | 'shooting_board_projection';

export type ReferenceAnalysisJobErrorCode =
  | 'media_not_found'
  | 'media_permission_denied'
  | 'unsupported_media'
  | 'media_decode_failed'
  | 'media_duration_unknown'
  | 'moderation_restricted'
  | 'provider_unavailable'
  | 'provider_timeout'
  | 'transcript_unavailable'
  | 'model_unavailable'
  | 'model_invalid_output'
  | 'low_confidence'
  | 'quota_exceeded'
  | 'storage_error'
  | 'transient_storage_error'
  | 'transient_worker_error'
  | 'internal_error';

export type ReferenceAnalysisJobError = {
  code: ReferenceAnalysisJobErrorCode;
  diagnostics?: Record<string, unknown>;
  messageUser: string;
};

export type ReferenceAnalysisStageState =
  | 'pending'
  | 'active'
  | 'done'
  | 'failed'
  | 'skipped';

export type ReferenceAnalysisStageKey = Exclude<
  ReferenceAnalysisJobStatus,
  'ready' | 'partial_ready' | 'failed' | 'canceled' | 'expired'
>;

export type ReferenceAnalysisStage = {
  key: ReferenceAnalysisStageKey;
  state: ReferenceAnalysisStageState;
};

export type ReferenceAnalysisJob = {
  analysisProfileVersion: string;
  attemptCount: number;
  breakdownId?: string;
  canceledAt?: string;
  createdAt: string;
  currentStage: ReferenceAnalysisJobStatus;
  error?: ReferenceAnalysisJobError;
  expiresAt?: string;
  finishedAt?: string;
  idempotencyKey: string;
  jobId: string;
  maxAttempts: number;
  mediaAssetId: string;
  mediaAssetVersion: string;
  missingArtifacts?: string[];
  progressPercent?: number;
  projectionId?: string;
  providerMetadata?: Record<string, unknown>;
  requestedOutputs: ReferenceAnalysisRequestedOutput[];
  requesterUserId: string;
  retryAfter?: string;
  startedAt?: string;
  status: ReferenceAnalysisJobStatus;
  traceId: string;
  updatedAt: string;
  workspaceId: string;
};

export type ReferenceAnalysisJobIdempotencyInput = {
  analysisProfileVersion: string;
  idempotencyKey: string;
  mediaAssetId: string;
  mediaAssetVersion: string;
  workspaceId: string;
};

export type ReferenceAnalysisJobReadModel = {
  artifacts?: {
    breakdownId?: string;
    projectionId?: string;
  };
  clientStatus: ReferenceAnalysisClientStatus;
  createdAt: string;
  error?: {
    code: ReferenceAnalysisJobErrorCode;
    messageUser: string;
  };
  jobId: string;
  missingArtifacts: string[];
  progressPercent?: number;
  progressStage: ReferenceAnalysisJobStatus;
  retryable: boolean;
  stageChecklist: ReferenceAnalysisStage[];
  traceId: string;
  updatedAt: string;
};

const stageOrder = [
  'queued',
  'preparing_media',
  'extracting_metadata',
  'extracting_audio',
  'transcribing',
  'analyzing_video',
  'segmenting_cuts',
  'generating_breakdown',
  'generating_projection',
] as const satisfies readonly ReferenceAnalysisStageKey[];

const terminalStatuses = new Set<ReferenceAnalysisJobStatus>([
  'ready',
  'partial_ready',
  'failed',
  'canceled',
  'expired',
]);

const retryableErrorCodes = new Set<ReferenceAnalysisJobErrorCode>([
  'provider_unavailable',
  'provider_timeout',
  'model_unavailable',
  'storage_error',
  'transient_storage_error',
  'transient_worker_error',
]);

export function createReferenceAnalysisIdempotencyKey(
  input: ReferenceAnalysisJobIdempotencyInput,
) {
  return [
    input.workspaceId,
    input.mediaAssetId,
    input.mediaAssetVersion,
    input.analysisProfileVersion,
    input.idempotencyKey,
  ].join(':');
}

export function getReferenceAnalysisClientStatus(
  status: ReferenceAnalysisJobStatus,
): ReferenceAnalysisClientStatus {
  switch (status) {
    case 'queued':
    case 'preparing_media':
    case 'extracting_metadata':
      return 'preparing';
    case 'extracting_audio':
    case 'transcribing':
    case 'analyzing_video':
    case 'segmenting_cuts':
    case 'generating_breakdown':
    case 'generating_projection':
      return 'analyzing';
    case 'ready':
      return 'ready';
    case 'partial_ready':
      return 'partial';
    case 'failed':
    case 'canceled':
    case 'expired':
      return 'failed';
  }
}

export function isReferenceAnalysisTerminalStatus(
  status: ReferenceAnalysisJobStatus,
) {
  return terminalStatuses.has(status);
}

export function isReferenceAnalysisRetryableError(
  code: ReferenceAnalysisJobErrorCode,
) {
  return retryableErrorCodes.has(code);
}

export function shouldRetryReferenceAnalysisJob(job: ReferenceAnalysisJob) {
  const error = job.error;

  if (job.status !== 'failed' || !error) return false;

  return (
    isReferenceAnalysisRetryableError(error.code) &&
    job.attemptCount < job.maxAttempts
  );
}

export function createReferenceAnalysisStageChecklist(
  currentStatus: ReferenceAnalysisJobStatus,
): ReferenceAnalysisStage[] {
  if (currentStatus === 'ready' || currentStatus === 'partial_ready') {
    return stageOrder.map((key) => ({ key, state: 'done' }));
  }

  if (currentStatus === 'failed') {
    return markTerminalStage('failed');
  }

  if (currentStatus === 'canceled' || currentStatus === 'expired') {
    return stageOrder.map((key) => ({ key, state: 'skipped' }));
  }

  const currentIndex = stageOrder.indexOf(currentStatus);

  return stageOrder.map((key, index) => {
    if (index < currentIndex) return { key, state: 'done' };
    if (index === currentIndex) return { key, state: 'active' };
    return { key, state: 'pending' };
  });
}

export function hasCoherentReferenceAnalysisTerminalArtifacts(
  job: ReferenceAnalysisJob,
) {
  if (job.status === 'ready') {
    return Boolean(job.breakdownId && job.projectionId);
  }

  if (job.status === 'partial_ready') {
    return Boolean(job.breakdownId || job.projectionId);
  }

  return true;
}

export function toReferenceAnalysisJobReadModel(
  job: ReferenceAnalysisJob,
): ReferenceAnalysisJobReadModel {
  return {
    artifacts:
      job.breakdownId || job.projectionId
        ? {
            breakdownId: job.breakdownId,
            projectionId: job.projectionId,
          }
        : undefined,
    clientStatus: getReferenceAnalysisClientStatus(job.status),
    createdAt: job.createdAt,
    error: job.error
      ? {
          code: job.error.code,
          messageUser: job.error.messageUser,
        }
      : undefined,
    jobId: job.jobId,
    missingArtifacts: job.missingArtifacts ?? [],
    progressPercent: job.progressPercent,
    progressStage: job.currentStage,
    retryable: shouldRetryReferenceAnalysisJob(job),
    stageChecklist: createReferenceAnalysisStageChecklist(job.currentStage),
    traceId: job.traceId,
    updatedAt: job.updatedAt,
  };
}

function markTerminalStage(state: Extract<ReferenceAnalysisStageState, 'failed'>) {
  return stageOrder.map((key) => ({ key, state }));
}
